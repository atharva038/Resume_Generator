const puppeteer = require('puppeteer');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'SmartNShine_Final_Report.md');
const OUTPUT = path.join(__dirname, 'SmartNShine_Final_Report.pdf');

// ── Marked configuration ────────────────────────────────────────────────────
marked.setOptions({ breaks: true, gfm: true });

// ── Read and convert markdown ───────────────────────────────────────────────
const markdown = fs.readFileSync(INPUT, 'utf8');
const body = marked.parse(markdown);

// ── Full HTML document with report CSS ─────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SmartNShine — Final Report</title>
<style>
  /* ── Google Fonts ── */
  @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');

  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Base Typography ── */
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.8;
    color: #111;
    background: #fff;
  }

  /* ── Page Layout ── */
  .page-wrapper {
    width: 210mm;
    margin: 0 auto;
    padding: 25mm 25mm 25mm 30mm; /* Top Right Bottom Left — standard margin */
  }

  /* ── Page Breaks ── */
  div[style*="page-break-before: always"],
  div[style*="page-break-after: always"] {
    page-break-before: always;
    display: block;
  }

  /* ── Headings ── */
  h1 {
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 12pt;
    margin-top: 24pt;
    page-break-after: avoid;
    border-bottom: 2px solid #111;
    padding-bottom: 6pt;
  }
  h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 8pt;
    page-break-after: avoid;
    color: #111;
  }
  h3 {
    font-size: 12.5pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
    color: #222;
  }
  h4 {
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    margin-top: 10pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
  }

  /* Chapter heading special style */
  h1:first-of-type { margin-top: 0; }

  /* ── Paragraphs ── */
  p {
    margin-bottom: 10pt;
    text-align: justify;
    orphans: 3;
    widows: 3;
  }

  /* ── Lists ── */
  ul, ol {
    margin: 8pt 0 8pt 24pt;
    padding: 0;
  }
  li {
    margin-bottom: 4pt;
    text-align: justify;
  }
  li > ul, li > ol { margin-top: 2pt; }

  /* ── Code Blocks ── */
  pre {
    background: #f4f4f4;
    border: 1px solid #ccc;
    border-left: 4px solid #444;
    border-radius: 3px;
    padding: 10pt 12pt;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    line-height: 1.5;
    overflow-x: auto;
    margin: 10pt 0;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
  }
  code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    background: #f0f0f0;
    padding: 1pt 4pt;
    border-radius: 2px;
  }
  pre code {
    background: none;
    padding: 0;
    font-size: 9pt;
  }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 10.5pt;
    page-break-inside: avoid;
  }
  th {
    background: #222;
    color: #fff;
    padding: 6pt 10pt;
    text-align: left;
    font-weight: bold;
    font-size: 10pt;
  }
  td {
    padding: 5pt 10pt;
    border: 1px solid #bbb;
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #f8f8f8; }
  tr:nth-child(odd) td  { background: #fff; }

  /* ── Horizontal Rules ── */
  hr {
    border: none;
    border-top: 1px solid #999;
    margin: 16pt 0;
  }

  /* ── Block Quotes ── */
  blockquote {
    border-left: 4px solid #555;
    margin: 12pt 0 12pt 0;
    padding: 8pt 16pt;
    background: #f9f9f9;
    font-style: italic;
    color: #333;
  }

  /* ── Strong / Em ── */
  strong { font-weight: bold; }
  em { font-style: italic; }

  /* ── Links ── */
  a { color: #000; text-decoration: underline; }

  /* ── Title Page specific ── */
  div[align="center"] {
    text-align: center;
  }
  div[align="center"] h1 {
    font-size: 22pt;
    border: none;
    margin-bottom: 4pt;
  }
  div[align="center"] h2 {
    font-size: 16pt;
    text-align: center;
    border: none;
    margin-top: 4pt;
  }
  div[align="center"] h3 {
    font-size: 13pt;
    text-align: center;
    margin-top: 8pt;
    font-style: italic;
    font-weight: normal;
  }

  /* ── Italics at bottom ── */
  em:last-child { color: #555; }

  /* ── Print Media ── */
  @media print {
    body { font-size: 12pt; }
    pre  { font-size: 8.5pt; }
    h1   { font-size: 16pt; }
    h2   { font-size: 13pt; }
    h3   { font-size: 12pt; }
    pre, table { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page-wrapper">
${body}
</div>
</body>
</html>`;

// ── Write HTML for inspection ───────────────────────────────────────────────
const htmlOut = path.join(__dirname, 'SmartNShine_Final_Report.html');
fs.writeFileSync(htmlOut, html, 'utf8');
console.log('✅ HTML written:', htmlOut);

// ── Launch Puppeteer and print PDF ─────────────────────────────────────────
(async () => {
  console.log('🚀 Launching Chromium...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Load from file
  await page.goto(`file://${htmlOut}`, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for fonts
  await page.evaluateHandle('document.fonts.ready');

  console.log('📄 Generating PDF...');
  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: {
      top:    '25mm',
      right:  '25mm',
      bottom: '25mm',
      left:   '30mm'    // extra left margin for binding
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size:8pt; font-family:Times New Roman,serif;
                  width:100%; padding: 0 30mm 0 30mm;
                  display:flex; justify-content:space-between; color:#555;">
        <span>SmartNShine — ATS Resume Generator</span>
        <span>Internship Project Report</span>
      </div>`,
    footerTemplate: `
      <div style="font-size:8pt; font-family:Times New Roman,serif;
                  width:100%; padding: 0 30mm 0 30mm;
                  display:flex; justify-content:space-between; color:#555;">
        <span>Department of [Department] | [Institute Name]</span>
        <span style="margin-left:auto;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`,
  });

  await browser.close();

  const stats = fs.statSync(OUTPUT);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`✅ PDF generated: ${OUTPUT}`);
  console.log(`   Size: ${sizeMB} MB`);
  console.log('\n🎉 Done! Open SmartNShine_Final_Report.pdf to view your report.');
})();
