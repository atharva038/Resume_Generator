import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, "../perf-baseline");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Find chrome binary
const chromeCandidates = [
  "C:\\Users\\Rameshawar\\.cache\\puppeteer\\chrome\\win64-146.0.7680.153\\chrome-win64\\chrome.exe",
  "C:\\Users\\Rameshawar\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win\\chrome.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
];

let chromePath = chromeCandidates.find(p => fs.existsSync(p));
console.log("Using Chrome binary:", chromePath);

process.env.CHROME_PATH = chromePath;

const reports = [];

for (let run = 1; run <= 3; run++) {
  console.log(`Starting Lighthouse Mobile Run ${run}/3...`);
  const reportPath = path.join(outDir, `lighthouse_baseline_run${run}.json`);
  const htmlPath = path.join(outDir, `lighthouse_baseline_run${run}.html`);
  
  const cmd = `npx lighthouse http://127.0.0.1:4173/ --output=json,html --output-path="${path.join(outDir, `lighthouse_baseline_run${run}`)}" --only-categories=performance --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet`;
  
  console.log(`Executing run ${run}...`);
  try {
    execSync(cmd, { stdio: "inherit", env: { ...process.env, CHROME_PATH: chromePath } });
    
    // Read the generated JSON report
    const jsonPath = path.join(outDir, `lighthouse_baseline_run${run}.report.json`);
    const raw = fs.readFileSync(jsonPath, "utf8");
    const parsed = JSON.parse(raw);
    
    const perfScore = Math.round((parsed.categories.performance.score || 0) * 100);
    const fcp = parsed.audits["first-contentful-paint"]?.numericValue;
    const lcp = parsed.audits["largest-contentful-paint"]?.numericValue;
    const tbt = parsed.audits["total-blocking-time"]?.numericValue;
    const cls = parsed.audits["cumulative-layout-shift"]?.numericValue;
    const speedIndex = parsed.audits["speed-index"]?.numericValue;
    
    console.log(`Run ${run} Results: Score: ${perfScore}/100, FCP: ${Math.round(fcp)}ms, LCP: ${Math.round(lcp)}ms, TBT: ${Math.round(tbt)}ms, CLS: ${cls?.toFixed(3)}, SpeedIndex: ${Math.round(speedIndex)}ms`);
    
    reports.push({
      run,
      perfScore,
      fcp,
      lcp,
      tbt,
      cls,
      speedIndex,
      jsonPath
    });
  } catch (err) {
    console.error(`Run ${run} failed:`, err.message);
  }
}

// Select median run based on performance score / TBT
if (reports.length > 0) {
  reports.sort((a, b) => a.perfScore - b.perfScore);
  const medianReport = reports[Math.floor(reports.length / 2)];
  console.log("\n=== MEDIAN BASELINE RUN ===");
  console.log(`Run ${medianReport.run}: Score: ${medianReport.perfScore}/100, FCP: ${Math.round(medianReport.fcp)}ms, LCP: ${Math.round(medianReport.lcp)}ms, TBT: ${Math.round(medianReport.tbt)}ms, CLS: ${medianReport.cls?.toFixed(3)}, SpeedIndex: ${Math.round(medianReport.speedIndex)}ms`);
  
  // Save median report copy
  const medianContent = fs.readFileSync(medianReport.jsonPath, "utf8");
  fs.writeFileSync(path.join(outDir, "lighthouse_baseline_median.json"), medianContent);
  console.log("Saved median report to", path.join(outDir, "lighthouse_baseline_median.json"));
}
