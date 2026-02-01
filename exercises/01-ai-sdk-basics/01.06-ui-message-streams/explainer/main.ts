import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const model = google('gemini-2.5-flash');

const stream = streamText({
  model,
  prompt: '',
});

for await (const chunk of stream.toUIMessageStream()) {
  console.log(chunk);
}
