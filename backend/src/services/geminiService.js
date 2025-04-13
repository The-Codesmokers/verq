const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('../config/config');

/**
 * Generate an interview question based on the resume text using Google's Gemini AI
 * @param {string} resumeText - Extracted text from the resume
 * @returns {Promise<string>} - Generated interview question
 */
async function generateInterviewQuestion(resumeText) {
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  const prompt = `Based on the following resume text, generate a single technical interview question. 
  The question should be moderate to high difficulty and should focus on:
  1. The projects mentioned in the resume
  2. The technical skills listed
  3. The technologies used in their projects
  
  The question should test their deep understanding of the technologies and concepts they claim to know.
  Make the question specific and detailed, requiring them to demonstrate practical knowledge.
  
  Resume Text:
  ${resumeText}
  
  Generate only the question, without any additional explanation or context.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating interview question with Gemini:', error);
    
    if (error.message.includes('API key')) {
      throw new Error(
        'Invalid Gemini API key. Please check your .env file and ensure GEMINI_API_KEY is set correctly.'
      );
    } else if (error.message.includes('quota')) {
      throw new Error(
        'Gemini API quota exceeded. Please check your Google Cloud Console for quota limits.'
      );
    } else {
      throw new Error(`Failed to generate interview question: ${error.message}`);
    }
  }
}

module.exports = {
  generateInterviewQuestion
}; 