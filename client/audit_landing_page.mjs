import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const landingFiles = [
  "src/pages/LandingPage.jsx",
  "src/components/landing-v2/LandingNavbar.jsx",
  "src/components/landing-v2/EvilChartsLandingMatrix.jsx",
  "src/components/landing-v2/GlidingMotionCanvas.jsx",
  "src/components/landing-v2/PainPointsBentoSection.jsx",
  "src/components/landing-v2/PlayfulColorfulBento.jsx",
  "src/components/landing-v2/ScrollablePortfoliosSection.jsx",
  "src/components/landing-v2/HowItWorksSection.jsx",
  "src/components/landing-v2/ScrollSplitCardsSection.jsx",
  "src/components/home/index.js",
  "src/components/home/TestimonialsHomeSection.jsx",
  "src/components/ui/testimonials-3.jsx",
  "src/components/landing-v2/PricingSection.jsx",
  "src/components/landing-v2/FAQSection.jsx",
  "src/components/landing-v2/FinalCTABanner.jsx",
  "src/components/layout/Footer.jsx",
  "src/index.css",
  "index.html",
];

const results = {
  layoutReads: [],
  eventListeners: [],
  animations: [],
  images: [],
  thirdPartyScripts: [],
  dependencies: [],
};

const layoutReadPatterns = [
  /getBoundingClientRect/g,
  /offsetHeight/g,
  /offsetWidth/g,
  /offsetTop/g,
  /offsetLeft/g,
  /clientWidth/g,
  /clientHeight/g,
  /scrollHeight/g,
  /scrollWidth/g,
  /scrollY/g,
  /scrollX/g,
  /scrollTop/g,
  /getComputedStyle/g,
  /innerHeight/g,
  /innerWidth/g,
];

const listenerPatterns = [
  /addEventListener\s*\(\s*["'](scroll|resize|mousemove|pointermove|wheel)["']/g,
  /onMouseMove/g,
  /onScroll/g,
  /useScroll/g,
];

for (const relFile of landingFiles) {
  const fullPath = path.resolve(__dirname, relFile);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    for (const pat of layoutReadPatterns) {
      if (pat.test(line)) {
        results.layoutReads.push({
          file: relFile,
          line: lineNum,
          code: line.trim(),
        });
      }
    }

    for (const pat of listenerPatterns) {
      if (pat.test(line)) {
        results.eventListeners.push({
          file: relFile,
          line: lineNum,
          code: line.trim(),
        });
      }
    }

    // Images
    const imgMatch = line.match(/<img[^>]*>/g);
    if (imgMatch) {
      imgMatch.forEach(img => {
        results.images.push({
          file: relFile,
          line: lineNum,
          code: img,
        });
      });
    }

    // Framer motion animate / CSS keyframes
    if (line.includes("animate=") || line.includes("whileHover=") || line.includes("whileInView=") || line.includes("@keyframes") || line.includes("animation:") || line.includes("animate-")) {
      results.animations.push({
        file: relFile,
        line: lineNum,
        code: line.trim(),
      });
    }
  });
}

fs.writeFileSync(
  path.resolve(__dirname, "../perf-baseline/audit_raw_data.json"),
  JSON.stringify(results, null, 2)
);

console.log("Raw audit completed:");
console.log(`- Layout reads found: ${results.layoutReads.length}`);
console.log(`- Event listeners found: ${results.eventListeners.length}`);
console.log(`- Images found: ${results.images.length}`);
console.log(`- Animation references found: ${results.animations.length}`);
