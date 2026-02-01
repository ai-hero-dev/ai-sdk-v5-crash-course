import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const model = google('gemini-2.5-flash');

const prompt =
  'Give me the first paragraph of a story about an imaginary planet.';

const stream = streamText({ model, prompt }); // TODO - stream some text with the model above.

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
