import puppeteer from "puppeteer";
import {existsSync} from "fs";

const isRunningInDocker = () =>
  Boolean(process.env.RUNNING_IN_DOCKER) || existsSync("/.dockerenv");

const normalizeClientBaseUrl = (baseUrl) => {
  const configuredUrl =
    process.env.PDF_RENDER_BASE_URL ||
    process.env.CLIENT_URL ||
    process.env.CLIENT_ORIGIN ||
    baseUrl ||
    "http://localhost:5173";
  const trimmedUrl = configuredUrl.replace(/\/$/, "");

  if (isRunningInDocker()) {
    return trimmedUrl.replace(
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i,
      "http://host.docker.internal$2"
    );
  }

  return trimmedUrl;
};

export const renderResumePdf = async (token, baseUrl) => {
  let browser;
  const wsEndpoint = process.env.BROWSER_WS_ENDPOINT || 
    (process.env.BROWSERLESS_TOKEN ? `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}` : null);

  if (wsEndpoint) {
    console.info("[pdf-export] connecting to remote browser at", wsEndpoint.split("?")[0]);
    browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  } else {
    console.info("[pdf-export] launching local puppeteer browser");
    const launchOptions = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    // Use environment-configured path first if set, otherwise try to auto-detect system browsers
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      console.info("[pdf-export] using environment-defined PUPPETEER_EXECUTABLE_PATH:", launchOptions.executablePath);
    } else if (process.platform === "darwin" && existsSync("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")) {
      launchOptions.executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      console.info("[pdf-export] using system Google Chrome on macOS");
    } else if (process.platform === "win32") {
      const winPaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
      ];
      const winPath = winPaths.find(p => existsSync(p));
      if (winPath) {
        launchOptions.executablePath = winPath;
        console.info("[pdf-export] using system Google Chrome on Windows");
      }
    } else if (process.platform === "linux") {
      const linuxPaths = [
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser"
      ];
      const linuxPath = linuxPaths.find(p => existsSync(p));
      if (linuxPath) {
        launchOptions.executablePath = linuxPath;
        console.info("[pdf-export] using system Chrome/Chromium on Linux");
      }
    }

    browser = await puppeteer.launch(launchOptions);
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({width: 794, height: 1123, deviceScaleFactor: 1});

    const renderUrl = `${normalizeClientBaseUrl(baseUrl)}/pdf-render/${token}`;
    const pageLogs = [];
    const failedRequests = [];

    console.info("[pdf-export] opening render page", {
      renderUrl,
      requestBaseUrl: baseUrl || null,
      configuredBaseUrl:
        process.env.PDF_RENDER_BASE_URL ||
        process.env.CLIENT_URL ||
        process.env.CLIENT_ORIGIN ||
        null,
      runningInDocker: isRunningInDocker(),
    });

    page.on("console", (message) => {
      pageLogs.push(`${message.type()}: ${message.text()}`.slice(0, 500));
    });
    page.on("requestfailed", (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()?.errorText || "unknown",
      });
    });

    await page.goto(renderUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    try {
      await page.waitForSelector("#pdf-render-ready", {timeout: 30000});
    } catch (error) {
      const bodyText = await page.evaluate(() => document.body?.innerText || "");
      console.error("[pdf-export] render page did not become ready", {
        renderUrl,
        bodyText: bodyText.slice(0, 1000),
        pageLogs,
        failedRequests,
      });
      throw error;
    }

    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              })
          )
      );
    });

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {top: "0", right: "0", bottom: "0", left: "0"},
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBytes);
  } finally {
    await browser.close();
  }
};
