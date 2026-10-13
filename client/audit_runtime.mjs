import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runtimeAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
  });
  const page = await context.newPage();

  const networkRequests = [];
  page.on("request", (req) => {
    networkRequests.push({
      url: req.url(),
      resourceType: req.resourceType(),
    });
  });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  const imagesAudit = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs.map((img) => ({
      src: img.src || img.getAttribute("src"),
      alt: img.alt || "(none)",
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: Math.round(img.getBoundingClientRect().width),
      displayHeight: Math.round(img.getBoundingClientRect().height),
      loading: img.getAttribute("loading") || "eager",
      decoding: img.getAttribute("decoding") || "sync",
      fetchpriority: img.getAttribute("fetchpriority") || "auto",
      hasExplicitWidthHeight: img.hasAttribute("width") && img.hasAttribute("height"),
      widthAttr: img.getAttribute("width"),
      heightAttr: img.getAttribute("height"),
    }));
  });

  const domNodeCount = await page.evaluate(() => document.querySelectorAll("*").length);

  const scriptAudit = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll("script"));
    return scripts.map((s) => ({
      src: s.src,
      defer: s.defer,
      async: s.async,
      type: s.type,
      inline: !s.src,
    }));
  });

  // Check animations active on page
  const animationsAudit = await page.evaluate(() => {
    const animElements = [];
    const all = document.querySelectorAll("*");
    for (const el of all) {
      const style = window.getComputedStyle(el);
      const animName = style.animationName;
      const transitionProp = style.transitionProperty;

      const hasAnimation = animName && animName !== "none";
      const hasTransition = transitionProp && transitionProp !== "none" && transitionProp !== "all";

      if (hasAnimation || hasTransition) {
        animElements.push({
          tagName: el.tagName.toLowerCase(),
          className: el.className?.toString?.()?.slice(0, 100),
          id: el.id,
          animationName: animName,
          animationDuration: style.animationDuration,
          transitionProperty: transitionProp,
          transitionDuration: style.transitionDuration,
          willChange: style.willChange,
        });
      }
    }
    return animElements;
  });

  await browser.close();

  const report = {
    domNodeCount,
    images: imagesAudit,
    scripts: scriptAudit,
    networkRequests,
    activeAnimations: animationsAudit,
  };

  fs.writeFileSync(
    path.resolve(__dirname, "../perf-baseline/runtime_audit.json"),
    JSON.stringify(report, null, 2)
  );

  console.log("Runtime Audit Complete:");
  console.log(`- DOM Node Count: ${domNodeCount}`);
  console.log(`- Total Rendered Images: ${imagesAudit.length}`);
  console.log(`- Scripts detected: ${scriptAudit.length}`);
  console.log(`- Active animation / transition elements: ${animationsAudit.length}`);
  console.log(`- Total initial network requests: ${networkRequests.length}`);
}

runtimeAudit().catch((err) => {
  console.error("Runtime audit error:", err);
  process.exit(1);
});
