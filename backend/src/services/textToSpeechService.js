const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

/**
 * Converts text to speech using Google Text-to-Speech
 * 
 * @param {string} text - The text to convert to speech
 * @param {string} outputPath - Where to save the audio file
 * @param {string} [voice='en'] - The voice to use (default: 'en')
 * @returns {Promise<string>} - Path to the generated audio file
 */
async function textToSpeech(text, outputPath, voice = 'en') {
    try {
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Create a new gTTS instance with specified voice
        const gtts = new gTTS(text, voice);

        // Save the audio file
        await new Promise((resolve, reject) => {
            gtts.save(outputPath, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return outputPath;
    } catch (error) {
        console.error('Error in text-to-speech:', error.message);
        throw error;
    }
}

module.exports = {
    textToSpeech
}; 