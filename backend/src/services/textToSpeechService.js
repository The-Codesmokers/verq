const { textToSpeech: deepgramTTS } = require('./deepgramTTSService');

/**
 * Converts text to speech using Deepgram Text-to-Speech
 * 
 * @param {string} text - The text to convert to speech
 * @param {string} outputPath - Where to save the audio file
 * @param {string} [voice='en'] - The voice to use (default: 'en')
 * @returns {Promise<string>} - Path to the generated audio file
 */
async function textToSpeech(text, outputPath, voice = 'en') {
    try {
        // Map voice parameter to Deepgram model_id
        const modelId = voice === 'en' ? 'aura-asteria-en' : 'aura-asteria-en';
        
        // Call Deepgram TTS service
        return await deepgramTTS(text, outputPath, {
            model_id: modelId
        });
    } catch (error) {
        console.error('Error in text-to-speech:', error.message);
        throw error;
    }
}

module.exports = {
    textToSpeech
}; 