// app/lib/pdf-parser.ts
// Custom wrapper for pdf-parse that bypasses the problematic index.js file
// which tries to access test files in debug mode

// Import the PDF function directly from the pdf-parse.js file
// Import directly from pdf-parse.js to avoid debug mode ENOENT error
// @ts-expect-error - No type definitions available for pdf-parse module
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

/**
 * Parse a PDF buffer and extract its text content
 * @param buffer The PDF file as a Buffer
 * @returns Promise with the parsed PDF data including text content
 */
export async function parsePdf(buffer: Buffer) {
  try {
    const result = await pdfParse(buffer);
    return result;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}