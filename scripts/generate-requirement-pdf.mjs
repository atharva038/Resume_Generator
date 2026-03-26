import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const rootDir = process.cwd();
const inputPath = path.join(rootDir, "docs", "research", "REQUIREMENT_ANALYSIS.md");
const outputPath = path.join(
  rootDir,
  "docs",
  "research",
  "REQUIREMENT_ANALYSIS_PREMIUM.pdf"
);

if (!fs.existsSync(inputPath)) {
  console.error("Input file not found:", inputPath);
  process.exit(1);
}

const md = fs.readFileSync(inputPath, "utf8");
const lines = md.split(/\r?\n/);

const headingItems = lines
  .map((line) => line.trim())
  .filter((line) => /^#{1,3}\s+/.test(line))
  .map((line) => {
    const level = line.match(/^#+/)[0].length;
    const title = line.replace(/^#{1,3}\s+/, "").trim();
    return {level, title};
  });

const doc = new PDFDocument({
  size: "A4",
  margins: {top: 56, bottom: 56, left: 56, right: 56},
  bufferPages: true,
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const pageWidth = doc.page.width;
const pageHeight = doc.page.height;
const contentWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;

const colors = {
  bg: "#F7FAFF",
  accent: "#1D4ED8",
  accentSoft: "#DBEAFE",
  heading: "#0F172A",
  text: "#1E293B",
  muted: "#64748B",
  box: "#EFF6FF",
  border: "#93C5FD",
};

function ensureSpace(requiredHeight = 24) {
  if (doc.y + requiredHeight > pageHeight - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function writeParagraph(text, options = {}) {
  const size = options.size || 11;
  const color = options.color || colors.text;
  const gap = options.gap || 8;

  ensureSpace(24);
  doc
    .font("Helvetica")
    .fontSize(size)
    .fillColor(color)
    .text(text, {
      width: contentWidth,
      align: options.align || "left",
      lineGap: options.lineGap || 2,
    });
  doc.moveDown(gap / 10);
}

function writeHeading(level, text) {
  if (level === 1) {
    ensureSpace(42);
    doc.moveDown(0.4);
    doc
      .font("Helvetica-Bold")
      .fontSize(21)
      .fillColor(colors.heading)
      .text(text, {width: contentWidth});
    doc
      .moveTo(doc.page.margins.left, doc.y + 4)
      .lineTo(doc.page.margins.left + 120, doc.y + 4)
      .lineWidth(2)
      .strokeColor(colors.accent)
      .stroke();
    doc.moveDown(1.1);
    return;
  }

  if (level === 2) {
    ensureSpace(34);
    const y = doc.y;
    doc
      .rect(doc.page.margins.left, y + 2, 4, 18)
      .fill(colors.accent);
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(colors.heading)
      .text(text, doc.page.margins.left + 12, y, {
        width: contentWidth - 12,
      });
    doc.moveDown(0.6);
    return;
  }

  ensureSpace(28);
  doc
    .font("Helvetica-Bold")
    .fontSize(12.5)
    .fillColor(colors.heading)
    .text(text, {width: contentWidth});
  doc.moveDown(0.3);
}

function writeBullet(text) {
  ensureSpace(24);
  const y = doc.y + 5;
  doc.circle(doc.page.margins.left + 3, y, 2).fill(colors.accent);
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(colors.text)
    .text(text, doc.page.margins.left + 12, doc.y, {
      width: contentWidth - 12,
      lineGap: 2,
    });
  doc.moveDown(0.5);
}

function writeRequirementLine(text) {
  ensureSpace(34);
  const x = doc.page.margins.left;
  const y = doc.y;
  const h = 22;

  doc
    .roundedRect(x, y, contentWidth, h, 4)
    .fillAndStroke(colors.box, colors.border);

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(colors.text)
    .text(text, x + 8, y + 6, {
      width: contentWidth - 16,
      lineGap: 1,
    });

  doc.y = y + h + 5;
}

function addCoverPage() {
  doc.rect(0, 0, pageWidth, pageHeight).fill(colors.bg);

  doc
    .save()
    .polygon(
      [0, 0],
      [pageWidth * 0.55, 0],
      [pageWidth * 0.35, pageHeight * 0.28],
      [0, pageHeight * 0.18]
    )
    .fill(colors.accentSoft)
    .restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(36)
    .fillColor(colors.heading)
    .text("Requirement", 56, 180)
    .text("Analysis", 56, 220);

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor(colors.muted)
    .text("SmartNShine ATS Resume Generator", 56, 290)
    .text("AI Resume + ATS + Interview Platform", 56, 312);

  doc
    .roundedRect(56, 390, 260, 64, 8)
    .fillAndStroke("#FFFFFF", colors.border);

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(colors.muted)
    .text("Prepared On", 72, 408)
    .font("Helvetica")
    .fontSize(13)
    .fillColor(colors.heading)
    .text(new Date().toLocaleDateString("en-IN", {dateStyle: "long"}), 72, 424);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.muted)
    .text("Generated automatically from project documentation and source code.", 56, pageHeight - 90, {
      width: contentWidth,
    });
}

function addTocPage() {
  doc.addPage();
  writeHeading(1, "Table of Contents");

  let index = 1;
  for (const item of headingItems) {
    if (item.level > 2) continue;
    ensureSpace(18);

    const indent = item.level === 1 ? 0 : 14;
    const label = `${index}. ${item.title}`;

    doc
      .font(item.level === 1 ? "Helvetica-Bold" : "Helvetica")
      .fontSize(item.level === 1 ? 11.5 : 10.5)
      .fillColor(item.level === 1 ? colors.heading : colors.text)
      .text(label, doc.page.margins.left + indent, doc.y, {
        width: contentWidth - indent,
      });

    index += item.level === 1 ? 1 : 0;
    doc.moveDown(0.35);
  }

  doc.moveDown(0.8);
  writeParagraph(
    "This report includes functional requirements, non-functional requirements, constraints, risks, and implementation scope as currently reflected in the project.",
    {size: 10.5, color: colors.muted}
  );
}

function renderBody() {
  doc.addPage();

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      doc.moveDown(0.35);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      writeHeading(headingMatch[1].length, headingMatch[2]);
      continue;
    }

    if (/^FR-\d+\./.test(line)) {
      writeRequirementLine(line);
      continue;
    }

    if (/^-\s+/.test(line)) {
      writeBullet(line.replace(/^-\s+/, ""));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      writeParagraph(line, {size: 11});
      continue;
    }

    writeParagraph(line, {size: 11});
  }
}

function addFooters() {
  const range = doc.bufferedPageRange();

  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(i);

    if (i > 0) {
      doc
        .moveTo(doc.page.margins.left, 42)
        .lineTo(pageWidth - doc.page.margins.right, 42)
        .lineWidth(0.7)
        .strokeColor(colors.accentSoft)
        .stroke();
    }

    const footerY = pageHeight - 34;

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(colors.muted)
      .text("SmartNShine Requirement Analysis", doc.page.margins.left, footerY, {
        width: contentWidth / 2,
        align: "left",
      });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(colors.muted)
      .text(`Page ${i + 1} of ${range.count}`, doc.page.margins.left, footerY, {
        width: contentWidth,
        align: "right",
      });
  }
}

addCoverPage();
addTocPage();
renderBody();
addFooters();

doc.end();

stream.on("finish", () => {
  console.log("PDF generated:", outputPath);
});
