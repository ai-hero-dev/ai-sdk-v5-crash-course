import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { styleText } from 'node:util';
import z from 'zod';

const result = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Log the message "Hello, world!" to the console',
  tools: {
    logToConsole: tool({
      description: 'Log a message to the console',
      inputSchema: z.object({
        message: z
          .string()
          .describe('The message to log to the console'),
      }),
      execute: async ({ message }) => {
        console.log(styleText(['green', 'bold'], message));

        return 'Message logged to console';
      },
    }),
  },
});

for await (const chunk of result.toUIMessageStream()) {
  console.log(chunk);
}
