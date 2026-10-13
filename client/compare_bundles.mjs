import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baselineJsonPath = path.resolve(__dirname, "../perf-baseline/top10_chunks_breakdown.json");
const baselineData = JSON.parse(fs.readFileSync(baselineJsonPath, "utf8"));

// Inspect current dist/assets
const assetsDir = path.resolve(__dirname, "./dist/assets");
const files = fs.readdirSync(assetsDir);
const jsFiles = files.filter(f => f.endsWith(".js")).map(f => {
  const full = path.join(assetsDir, f);
  const sz = fs.statSync(full).size;
  return { name: f, sizeBytes: sz, sizeKb: (sz / 1024).toFixed(2) };
}).sort((a, b) => b.sizeBytes - a.sizeBytes);

console.log("=== BUNDLE SIZE COMPARISON ===");
console.log(`Baseline largest chunk: ${baselineData[0].chunkName} (${baselineData[0].renderedLengthKb} kB rendered)`);

// Find entry index chunk in current dist
const indexChunk = jsFiles.find(f => f.name.startsWith("index-"));
console.log(`Optimized entry chunk: ${indexChunk?.name} (${indexChunk?.sizeKb} kB minified)`);

const top10Current = jsFiles.slice(0, 10);
console.log("\nTop 10 Chunks Now (Minified):");
top10Current.forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.name}: ${c.sizeKb} kB`);
});

// Compare total payload for first viewport
// First viewport loads: index-*.js, vendor-react-*.js, vendor-motion-*.js, vendor-lucide-*.js
const heroChunks = jsFiles.filter(f => 
  f.name.startsWith("index-") || 
  f.name.startsWith("vendor-react-") || 
  f.name.startsWith("vendor-motion-") || 
  f.name.startsWith("vendor-lucide-")
);
const heroJsBytes = heroChunks.reduce((acc, c) => acc + c.sizeBytes, 0);
console.log(`\nCritical First-Viewport JS Payload: ${(heroJsBytes / 1024).toFixed(2)} kB`);

fs.writeFileSync(
  path.resolve(__dirname, "../perf-baseline/verification/bundle_comparison.json"),
  JSON.stringify({
    baselineEntryRenderedKb: baselineData[0].renderedLengthKb,
    optimizedEntryMinifiedKb: indexChunk?.sizeKb,
    top10Optimized: top10Current,
    criticalHeroPayloadKb: (heroJsBytes / 1024).toFixed(2),
  }, null, 2)
);
