const fs = require('fs');
const path = require('path');
const { processPDF } = require('../services/pdfService');
const { generateInterviewQuestion, evaluateAnswer, generateFollowUpQuestion } = require('../services/geminiService');
const { textToSpeech } = require('../services/textToSpeechService');
const { speechToText } = require('../services/deepgramService');
const { validateConfig } = require('../config/config');

// Set environment variables
// process.env.GEMINI_API_KEY = 'AIzaSyDQekyR-NW55U8gWW_9Rzu_PojkivR0UA0';
// process.env.DEEPGRAM_API_KEY = '11a2141f6e93fc20f32d03b2932c32aefb1c6eeb';

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

    const interviewResults = {
      resumeText,
      textOutputPath,
      questions: [],
      responses: [],
      evaluations: []
    };

    // Generate initial question
    console.log('\nGenerating initial interview question...');
    let currentQuestion = await generateInterviewQuestion(resumeText);
    interviewResults.questions.push(currentQuestion);

    // Process 5 questions
    for (let i = 0; i < 5; i++) {
      console.log(`\nQuestion ${i + 1}:`);
      console.log('----------------------------------------');
      console.log(currentQuestion);
      console.log('----------------------------------------');

      // Convert question to speech
      console.log('\nConverting question to speech...');
      const questionAudioPath = path.join(outputDir, `${originalFileName}_question_${i + 1}_${timestamp}.mp3`);
      await textToSpeech(currentQuestion, questionAudioPath, 'en-us');
      console.log(`\nQuestion audio saved to: ${questionAudioPath}`);

      // Process the audio response
      console.log('\nProcessing audio response...');
      if (!fs.existsSync(audioPath)) {
        throw new Error(`Audio file not found: ${audioPath}`);
      }

      // Convert response to text
      console.log('\nConverting response to text...');
      const responseBuffer = fs.readFileSync(audioPath);
      const transcript = await speechToText(responseBuffer);
      console.log('\nTranscribed Response:');
      console.log('----------------------------------------');
      console.log(transcript);
      console.log('----------------------------------------');

      // Save the transcript
      const transcriptPath = path.join(outputDir, `${originalFileName}_transcript_${i + 1}_${timestamp}.txt`);
      fs.writeFileSync(transcriptPath, transcript);
      console.log(`\nTranscript saved to: ${transcriptPath}`);

      // Evaluate the answer
      console.log('\nEvaluating answer...');
      const evaluation = await evaluateAnswer(currentQuestion, transcript);
      console.log('\nEvaluation Results:');
      console.log('----------------------------------------');
      console.log(JSON.stringify(evaluation, null, 2));
      console.log('----------------------------------------');

      // Save the evaluation
      const evaluationPath = path.join(outputDir, `${originalFileName}_evaluation_${i + 1}_${timestamp}.json`);
      fs.writeFileSync(evaluationPath, JSON.stringify(evaluation, null, 2));
      console.log(`\nEvaluation saved to: ${evaluationPath}`);

      // Store results
      interviewResults.responses.push({
        transcript,
        transcriptPath,
        audioPath
      });
      interviewResults.evaluations.push({
        evaluation,
        evaluationPath
      });

      // Generate follow-up question if not the last question
      if (i < 4) {
        console.log('\nGenerating follow-up question...');
        currentQuestion = await generateFollowUpQuestion(
          resumeText,
          currentQuestion,
          transcript,
          evaluation
        );
        interviewResults.questions.push(currentQuestion);
      }
    }

    return interviewResults;
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