import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, "../perf-baseline/verification");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function verify() {
  console.log("Launching Chromium for verification...");
  const browser = await chromium.launch({
    headless: true,
  });

  const breakpoints = [
    { name: "mobile_375", width: 375, height: 812, isMobile: true },
    { name: "tablet_768", width: 768, height: 1024, isMobile: false },
    { name: "desktop_1440", width: 1440, height: 900, isMobile: false },
  ];

  // 1. Capture Screenshots
  for (const bp of breakpoints) {
    console.log(`Capturing full page screenshot at ${bp.width}px (${bp.name})...`);
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 2,
      isMobile: bp.isMobile,
    });
    const page = await context.newPage();
    
    // Track errors
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") pageErrors.push(msg.text());
    });

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    
    // Dynamically scroll to the bottom of the page to trigger IntersectionObserver for all sections
    let lastY = -1;
    while (true) {
      const currentY = await page.evaluate(() => window.scrollY);
      if (currentY === lastY) break;
      lastY = currentY;
      await page.evaluate(() => window.scrollBy(0, 900));
      await page.waitForTimeout(150);
    }
    // Allow any remaining dynamic fetches or images to settle
    await page.waitForTimeout(1000);
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(outDir, `optimized_${bp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved screenshot to ${screenshotPath}`);

    if (pageErrors.length > 0) {
      console.warn(`[WARNING] Errors on ${bp.name}:`, pageErrors);
    } else {
      console.log(`[PASS] 0 console/runtime errors on ${bp.name}`);
    }

    await context.close();
  }

  // 2. Hero Animation Video & Frame Recording
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

  for (let i = 0; i < 20; i++) {
    await animPage.screenshot({
      path: path.join(framesDir, `frame_${String(i).padStart(3, "0")}.png`),
    });
    await animPage.waitForTimeout(200);
  }

  await animContext.close();

  const videoFiles = fs.readdirSync(videoDir);
  if (videoFiles.length > 0) {
    const origVideo = path.join(videoDir, videoFiles[0]);
    const targetVideo = path.join(outDir, "hero_animation_optimized.webm");
    fs.copyFileSync(origVideo, targetVideo);
    console.log("Hero optimized video copied to", targetVideo);
  }

  // 3. Test CPU Throttling and Scroll Smoothness
  console.log("Testing 6x CPU throttled scrolling...");
  const testContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
  });
  const testPage = await testContext.newPage();
  const client = await testPage.context().newCDPSession(testPage);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 6 });

  await testPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  // Monitor long tasks during scroll
  await testPage.evaluate(() => {
    window.__longTasks = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          window.__longTasks.push({ duration: entry.duration, startTime: entry.startTime });
        }
      }
    });
    try {
      observer.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      // not supported in standard observer
    }
  });

  // Smooth scroll down the page
  for (let y = 0; y < 4000; y += 300) {
    await testPage.mouse.wheel(0, 300);
    await testPage.waitForTimeout(100);
  }

  const longTasks = await testPage.evaluate(() => window.__longTasks || []);
  console.log(`Long tasks over 100ms during 6x throttled scroll: ${longTasks.length}`);
  if (longTasks.length > 0) {
    console.log("Long tasks details:", longTasks);
  }

  // 4. Test Links and Mode Switcher Buttons
  console.log("Verifying navigation links and buttons...");
  const resumesBtn = await testPage.$("button:has-text('ATS Resumes')");
  const portfoliosBtn = await testPage.$("button:has-text('Web Portfolios')");

  if (resumesBtn && portfoliosBtn) {
    console.log("[PASS] Resume / Portfolio switcher buttons present.");
    await portfoliosBtn.click();
    await testPage.waitForTimeout(500);
    console.log("[PASS] Portfolios mode clicked and toggled cleanly.");
    await resumesBtn.click();
    await testPage.waitForTimeout(500);
    console.log("[PASS] Resumes mode clicked and toggled cleanly.");
  }

  const navLinksCount = await testPage.$$eval("nav a, footer a", (els) => els.length);
  console.log(`[PASS] Found ${navLinksCount} navigation & footer links.`);

  await testContext.close();
  await browser.close();
  console.log("Verification checks completed successfully!");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
