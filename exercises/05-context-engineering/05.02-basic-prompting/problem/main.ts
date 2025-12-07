import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const INPUT = `Do some research on induction hobs and how I can replace a 100cm wide AGA cooker with an induction range cooker. Which is the cheapest, which is the best?`;

// NOTE: A good output would be: "Induction hobs vs AGA cookers"

const result = await streamText({
  model: google('gemini-2.5-flash-lite'),
  // TODO: Rewrite this prompt using the Anthropic template from
  // the previous exercise.
  // You will NOT need all of the sections from the template.
  prompt: `
    Generate me a title:
    ${INPUT}
  `,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
