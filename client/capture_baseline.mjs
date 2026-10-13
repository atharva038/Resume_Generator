import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, "../perf-baseline");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({
    headless: true,
  });

  const breakpoints = [
    { name: "mobile_375", width: 375, height: 812, isMobile: true },
    { name: "tablet_768", width: 768, height: 1024, isMobile: false },
    { name: "desktop_1440", width: 1440, height: 900, isMobile: false },
  ];

  for (const bp of breakpoints) {
    console.log(`Capturing full page screenshot at ${bp.width}px (${bp.name})...`);
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 2,
      isMobile: bp.isMobile,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    // Allow any CSS transitions / initial renders to settle
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(outDir, `baseline_${bp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved screenshot to ${screenshotPath}`);
    await context.close();
  }

  // Hero Animation Video Recording and frame sequence
  console.log("Recording hero animation video and frames...");
  const videoDir = path.join(outDir, "hero_video");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const animContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
  });
  const animPage = await animContext.newPage();
  await animPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  const framesDir = path.join(outDir, "hero_frames");
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  // Capture frames for 4 seconds of hero animation (every 200ms)
  for (let i = 0; i < 20; i++) {
    await animPage.screenshot({
      path: path.join(framesDir, `frame_${String(i).padStart(3, "0")}.png`),
    });
    await animPage.waitForTimeout(200);
  }

  await animContext.close();
  console.log("Video saved to", videoDir);

  // Rename recorded video file to hero_animation.webm
  const videoFiles = fs.readdirSync(videoDir);
  if (videoFiles.length > 0) {
    const origVideo = path.join(videoDir, videoFiles[0]);
    const targetVideo = path.join(outDir, "hero_animation_baseline.webm");
    fs.copyFileSync(origVideo, targetVideo);
    console.log("Hero baseline video copied to", targetVideo);
  }

  await browser.close();
  console.log("Baseline visual capture complete!");
}

capture().catch((err) => {
  console.error("Error capturing baseline:", err);
  process.exit(1);
});
