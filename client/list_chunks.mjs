import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, "../perf-baseline/bundle-analysis.html");
const raw = fs.readFileSync(jsonPath, "utf8");
const data = JSON.parse(raw);

const nodeParts = data.nodeParts || {};
const nodeMetas = data.nodeMetas || {};

function getNodeRenderedSize(node) {
  if (node.uid && nodeParts[node.uid]) {
    return nodeParts[node.uid].renderedLength || 0;
  }
  if (!node.children) return 0;
  return node.children.reduce((acc, child) => acc + getNodeRenderedSize(child), 0);
}

function collectModules(node, list = []) {
  if (node.uid && nodeParts[node.uid]) {
    const part = nodeParts[node.uid];
    const meta = nodeMetas[part.metaUid] || {};
    list.push({
      name: meta.id || node.name,
      size: part.renderedLength || 0,
      gzip: part.gzipLength || 0,
    });
    return list;
  }
  if (node.children) {
    for (const child of node.children) {
      collectModules(child, list);
    }
  }
  return list;
}

const chunks = data.tree.children;

const chunkSummaries = chunks.map(chunk => {
  const totalSize = getNodeRenderedSize(chunk);
  const modules = collectModules(chunk);
  modules.sort((a, b) => b.size - a.size);

  const packageSizes = {};
  for (const m of modules) {
    let pkg = "app-src";
    const nmMatch = m.name?.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
    if (nmMatch) {
      pkg = nmMatch[1];
    } else if (m.name?.includes("src/")) {
      const srcMatch = m.name.match(/src\/([^/]+)/);
      pkg = srcMatch ? `src/${srcMatch[1]}` : "src";
    }
    packageSizes[pkg] = (packageSizes[pkg] || 0) + m.size;
  }

  const topPackages = Object.entries(packageSizes)
    .sort((a, b) => b[1] - a[1])
    .map(([name, size]) => ({ name, sizeKb: (size / 1024).toFixed(2), size }));

  return {
    name: chunk.name,
    totalSizeBytes: totalSize,
    totalSizeKb: (totalSize / 1024).toFixed(2),
    topPackages: topPackages.slice(0, 8),
    topModules: modules.slice(0, 10).map(m => ({
      name: m.name.replace(/.*\/node_modules\//, "node_modules/").replace(/.*\/src\//, "src/"),
      sizeKb: (m.size / 1024).toFixed(2),
      size: m.size
    }))
  };
});

chunkSummaries.sort((a, b) => b.totalSizeBytes - a.totalSizeBytes);

console.log("=== TOP 10 LARGEST CHUNKS AND THEIR CONTENTS ===");
chunkSummaries.slice(0, 10).forEach((c, idx) => {
  console.log(`\n${idx + 1}. CHUNK: ${c.name} (${c.totalSizeKb} KiB rendered)`);
  console.log("   Top Packages / Subsystems:");
  c.topPackages.forEach(p => console.log(`     - ${p.name}: ${p.sizeKb} KiB`));
  console.log("   Top Individual Modules:");
  c.topModules.slice(0, 6).forEach(m => console.log(`     * ${m.name}: ${m.sizeKb} KiB`));
});

fs.writeFileSync(
  path.resolve(__dirname, "../perf-baseline/top10_chunks_breakdown.json"),
  JSON.stringify(chunkSummaries.slice(0, 10), null, 2)
);
console.log("\nSaved breakdown to perf-baseline/top10_chunks_breakdown.json");
