const { processPDF } = require('./services/pdfService');
const fs = require('fs');
const path = require('path');

// Get the PDF file path from command line arguments
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error('Please provide a PDF file path as an argument');
  console.error('Usage: node test-pdf.js <path-to-pdf>');
  process.exit(1);
}

if (!fs.existsSync(pdfPath)) {
  console.error(`File not found: ${pdfPath}`);
  process.exit(1);
}

async function testPDFProcessing() {
  try {
    console.log(`Processing PDF: ${pdfPath}`);
    const extractedText = await processPDF(pdfPath);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(path.dirname(pdfPath), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Generate output filename
    const pdfFileName = path.basename(pdfPath, '.pdf');
    const outputPath = path.join(outputDir, `${pdfFileName}.txt`);

    // Save to text file
    fs.writeFileSync(outputPath, extractedText);

    console.log('\nExtracted Text:');
    console.log('----------------------------------------');
    console.log(extractedText);
    console.log('----------------------------------------');
    console.log(`\nText has also been saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing PDF:', error.message);
    process.exit(1);
  }
}

testPDFProcessing(); 