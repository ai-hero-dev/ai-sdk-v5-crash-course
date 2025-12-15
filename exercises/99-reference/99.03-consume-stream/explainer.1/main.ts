import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

console.log('Process starting...');

const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Hello, world!',
  onFinish: () => {
    console.log('Stream finished!');
  },
});

// Try commenting this out and see what happens!
await streamTextResult.consumeStream();

console.log('Process exiting...');
