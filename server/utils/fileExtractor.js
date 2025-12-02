import mammoth from "mammoth";
import fs from "fs/promises";
import path from "path";
import {PDFExtract} from "pdf.js-extract";

const pdfExtract = new PDFExtract();

/**
 * Extract text from PDF file using pdf.js-extract
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromPDF(filePath) {
  try {
    const data = await pdfExtract.extract(filePath, {});

    // Extract text from all pages
    let text = "";
    for (const page of data.pages) {
      const pageText = page.content.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }

    // Clean up extracted text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s+/g, " ")
      .trim();

    console.log(
      `✅ PDF extraction successful: ${text.length} characters extracted`
    );
    return text;
  } catch (error) {
    console.error("❌ PDF extraction error:", error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOCX file using mammoth
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({path: filePath});

    // Clean up extracted text
    const text = result.value
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log(
      `✅ DOCX extraction successful: ${text.length} characters extracted`
    );

    if (result.messages && result.messages.length > 0) {
      console.warn("⚠️ DOCX extraction warnings:", result.messages);
    }

    return text;
  } catch (error) {
    console.error("❌ DOCX extraction error:", error.message);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

/**
 * Extract text from uploaded file based on file extension
 * @param {string} filePath - Path to the uploaded file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".pdf":
      return await extractTextFromPDF(filePath);
    case ".docx":
    case ".doc":
      return await extractTextFromDOCX(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

/**
 * Delete temporary uploaded file after processing
 * @param {string} filePath - Path to the file to delete
 */
export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`🧹 Cleaned up temporary file: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(
      `⚠️ Failed to delete temporary file ${path.basename(filePath)}:`,
      error.message
    );
  }
}
