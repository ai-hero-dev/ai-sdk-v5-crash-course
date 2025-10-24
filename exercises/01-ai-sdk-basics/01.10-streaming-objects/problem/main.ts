import { google } from '@ai-sdk/google';
import { streamObject, streamText } from 'ai';
import z from 'zod';

const model = google('gemini-2.0-flash');

const stream = streamText({
  model,
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;
``
const factsResult = await streamObject({
  model,
  prompt: `List five interesting facts about the imaginary planet described in the following story:\n\n${finalText}`,
   schema: z.object({
      facts: z
        .array(z.string())
        .describe(
          'The facts about the imaginary planet. Write as if you are a scientist.',
        ),
    }),
});

for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}
