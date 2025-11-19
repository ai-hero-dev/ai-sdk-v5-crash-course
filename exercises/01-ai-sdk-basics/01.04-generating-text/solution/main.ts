import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const model = groq('gpt-oss-safeguard-20b');

const prompt = 'whats the latest version of next.js? and what is your cut off knowledge date';

const result = await generateText({
  model,
  prompt,
});

console.log(result.text);
