import { build } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function analyze() {
  console.log("Building with rollup-plugin-visualizer...");
  await build({
    plugins: [
      react(),
      visualizer({
        filename: path.resolve(__dirname, "../perf-baseline/bundle-analysis.html"),
        json: true,
        filenameJson: path.resolve(__dirname, "../perf-baseline/bundle-analysis.json"),
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/hooks": path.resolve(__dirname, "./src/hooks"),
        "@/utils": path.resolve(__dirname, "./src/utils"),
        "@/api": path.resolve(__dirname, "./src/api"),
        "@/context": path.resolve(__dirname, "./src/context"),
        "@/pages": path.resolve(__dirname, "./src/pages"),
        "@/assets": path.resolve(__dirname, "./src/assets"),
        "@/services": path.resolve(__dirname, "./src/services"),
      },
    },
  });

  console.log("Analyzing output JSON...");
  const raw = fs.readFileSync(path.resolve(__dirname, "../perf-baseline/bundle-analysis.json"), "utf8");
  const stats = JSON.parse(raw);

  // Group by output chunk and calculate total sizes and module breakdown
  const chunks = [];
  if (Array.isArray(stats)) {
    // Stats array format
    for (const tree of stats) {
      // Collect chunks
    }
  }

  // Also read files in dist/assets directly
  const assetsDir = path.resolve(__dirname, "./dist/assets");
  const files = fs.readdirSync(assetsDir);
  const jsFiles = files.filter(f => f.endsWith(".js")).map(f => {
    const full = path.join(assetsDir, f);
    const sz = fs.statSync(full).size;
    return { name: f, sizeBytes: sz, sizeKb: (sz / 1024).toFixed(2) };
  });

  jsFiles.sort((a, b) => b.sizeBytes - a.sizeBytes);
  console.log("\n=== TOP 10 LARGEST JS CHUNKS ===");
  jsFiles.slice(0, 10).forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.name}: ${chunk.sizeKb} KiB (${chunk.sizeBytes} bytes)`);
  });

  // Write top 10 chunks summary
  fs.writeFileSync(
    path.resolve(__dirname, "../perf-baseline/top10_chunks.json"),
    JSON.stringify(jsFiles.slice(0, 10), null, 2)
  );
}

analyze().catch(err => {
  console.error("Bundle analysis error:", err);
  process.exit(1);
});
