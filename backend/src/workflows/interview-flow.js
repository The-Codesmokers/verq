const fs = require('fs');
const path = require('path');
const { processPDF } = require('../services/pdfService');
const { generateInterviewQuestion } = require('../services/geminiService');
const { textToSpeech } = require('../services/textToSpeechService');
const { speechToText } = require('../services/deepgramService');
const { validateConfig } = require('../config/config');

// Validate environment variables
validateConfig();

/**
 * Main interview flow function
 * @param {string} pdfPath - Path to the PDF resume file
 * @param {string} [audioPath] - Optional path to the audio response file
 * @returns {Promise<Object>} - The interview results
 */
async function runInterviewFlow(pdfPath, audioPath = "C:\\Users\\amana\\Repos\\verq\\audio-sample.mp3") {
  try {
    // Validate PDF path
    if (!pdfPath) {
      throw new Error('Please provide a PDF file path as an argument');
    }
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`File not found: ${pdfPath}`);
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate timestamp for unique filenames
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalFileName = path.basename(pdfPath, '.pdf');

    // Step 1: Extract text from PDF
    console.log(`\nProcessing PDF: ${pdfPath}`);
    const pdfBuffer = fs.readFileSync(pdfPath);
    const resumeText = await processPDF(pdfBuffer);
    
    // Save the extracted text
    const textOutputPath = path.join(outputDir, `${originalFileName}_${timestamp}.txt`);
    fs.writeFileSync(textOutputPath, resumeText);
    console.log(`\nExtracted text saved to: ${textOutputPath}`);

    // Step 2: Generate interview question using Gemini
    console.log('\nGenerating interview question...');
    const question = await generateInterviewQuestion(resumeText);
    console.log('\nGenerated Question:');
    console.log('----------------------------------------');
    console.log(question);
    console.log('----------------------------------------');

    // Step 3: Convert question to speech
    console.log('\nConverting question to speech...');
    const questionAudioPath = path.join(outputDir, `${originalFileName}_question_${timestamp}.mp3`);
    await textToSpeech(question, questionAudioPath, 'en-us');
    console.log(`\nQuestion audio saved to: ${questionAudioPath}`);

    // Step 4: Process the audio response
    console.log('\nProcessing audio response...');
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    // Step 5: Convert response to text using Deepgram
    console.log('\nConverting response to text...');
    const responseBuffer = fs.readFileSync(audioPath);
    const transcript = await speechToText(responseBuffer);
    console.log('\nTranscribed Response:');
    console.log('----------------------------------------');
    console.log(transcript);
    console.log('----------------------------------------');

    // Save the transcript
    const transcriptPath = path.join(outputDir, `${originalFileName}_transcript_${timestamp}.txt`);
    fs.writeFileSync(transcriptPath, transcript);
    console.log(`\nTranscript saved to: ${transcriptPath}`);

    return {
      resumeText,
      textOutputPath,
      question,
      questionAudioPath,
      responseAudioPath: audioPath,
      transcript,
      transcriptPath
    };
  } catch (error) {
    console.error('Error in interview flow:', error.message);
    throw error;
  }
}

/**
 * Process an audio response using Deepgram
 * @param {string} audioPath - Path to the audio file
 * @returns {Promise<Object>} - The transcription results
 */
async function processAudioResponse(audioPath) {
  try {
    // Validate audio path
    if (!audioPath) {
      throw new Error('Please provide an audio file path');
    }
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate timestamp for unique filenames
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalFileName = path.basename(audioPath, path.extname(audioPath));

    // Convert response to text using Deepgram
    console.log('\nConverting response to text...');
    const responseBuffer = fs.readFileSync(audioPath);
    const transcript = await speechToText(responseBuffer);
    console.log('\nTranscribed Response:');
    console.log('----------------------------------------');
    console.log(transcript);
    console.log('----------------------------------------');

    // Save the transcript
    const transcriptPath = path.join(outputDir, `${originalFileName}_transcript_${timestamp}.txt`);
    fs.writeFileSync(transcriptPath, transcript);
    console.log(`\nTranscript saved to: ${transcriptPath}`);

    return {
      transcript,
      transcriptPath
    };
  } catch (error) {
    console.error('Error processing audio:', error.message);
    throw error;
  }
}

// If this file is run directly, execute the flow
if (require.main === module) {
  const pdfPath = process.argv[2];
  const audioPath = process.argv[3] || "C:\\Users\\amana\\Repos\\verq\\audio-sample.mp3";
  runInterviewFlow(pdfPath, audioPath)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  runInterviewFlow,
  processAudioResponse
}; 