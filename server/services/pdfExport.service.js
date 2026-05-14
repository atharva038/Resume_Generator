import puppeteer from "puppeteer";

const getClientBaseUrl = (baseUrl) =>
  (
    baseUrl ||
    process.env.PDF_RENDER_BASE_URL ||
    process.env.CLIENT_URL ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:5173"
  ).replace(/\/$/, "");

export const renderResumePdf = async (token, baseUrl) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({width: 794, height: 1123, deviceScaleFactor: 1});

    const renderUrl = `${getClientBaseUrl(baseUrl)}/pdf-render/${token}`;
    await page.goto(renderUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.waitForSelector("#pdf-render-ready", {timeout: 30000});
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

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {top: "0", right: "0", bottom: "0", left: "0"},
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
};
