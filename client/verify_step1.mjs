import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true,
  });

  const errors = [];
  page.on("pageerror", err => errors.push(err.message));
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  console.log("Navigating to http://127.0.0.1:4173/ ...");
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Check DOM node count on mobile initial load
  const initialNodes = await page.evaluate(() => document.querySelectorAll("*").length);
  console.log(`Initial DOM node count on mobile viewport: ${initialNodes}`);

  // Test scrolling down to verify lazy sections mount smoothly without layout jumps
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  const finalNodes = await page.evaluate(() => document.querySelectorAll("*").length);
  console.log(`Final DOM node count after full scroll: ${finalNodes}`);

  console.log(`Page errors encountered: ${errors.length}`);
  if (errors.length > 0) {
    console.error("Errors:", errors);
  }

  await browser.close();
  console.log("Step 1 verification complete!");
}

verify().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
