const fs = require('fs');
const path = require('path');
const { processPDF } = require('./services/pdfService');

// Get the PDF file path from command line arguments
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error('Please provide a PDF file path as an argument');
  console.error('Usage: node extract-pdf.js <path-to-pdf>');
  process.exit(1);
}

if (!fs.existsSync(pdfPath)) {
  console.error(`File not found: ${pdfPath}`);
  process.exit(1);
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function extractAndSavePDF() {
  try {
    console.log(`Processing PDF: ${pdfPath}`);
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    // Extract text from the PDF
    const extractedText = await processPDF(pdfBuffer);
    
    // Generate output filename using timestamp and original filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalFileName = path.basename(pdfPath, '.pdf');
    const outputPath = path.join(outputDir, `${originalFileName}_${timestamp}.txt`);
    
    // Save the extracted text
    fs.writeFileSync(outputPath, extractedText);
    
    console.log('\nExtracted Text:');
    console.log('----------------------------------------');
    console.log(extractedText);
    console.log('----------------------------------------');
    console.log(`\nText has been saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing PDF:', error.message);
    process.exit(1);
  }
}

extractAndSavePDF(); 