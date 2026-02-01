import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const output = streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `Which country makes the best sausages? Answer in a single paragraph.`,
});

for await (const chunk of output.textStream) {
  process.stdout.write(chunk);
}

console.log(); // Empty log to separate the output from the usage
console.log(await output.usage);
