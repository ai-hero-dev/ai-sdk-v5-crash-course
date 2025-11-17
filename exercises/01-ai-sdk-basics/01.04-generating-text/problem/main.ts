import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// TODO: Choose a model. I recommend using the Google Gemini model:
// gemini-2.0-flash-lite
const model = google("gemini-2.0-flash");

const prompt = 'What is the capital of France?';

const result = await generateText({ model, prompt }); // TODO: Use generateText to get the result

console.log(result.text);
