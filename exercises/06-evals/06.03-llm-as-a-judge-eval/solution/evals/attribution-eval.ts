import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { createScorer } from 'evalite';
import { readFileSync } from 'fs';
import path from 'path';
import z from 'zod';

const chainOfThoughtPaper = readFileSync(
  path.join(
    import.meta.dirname,
    'chain-of-thought-prompting.pdf',
  ),
);

export const attributionToChainOfThoughtPaper = createScorer<
  string,
  string,
  undefined
>({
  name: 'Attribution',
  scorer: async ({ input, output, expected }) => {
    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      system: `
        You are a helpful assistant that can answer questions about the chain of thought prompting paper.

        Your job is to work out if the answer has been properly attributed to the paper.

        Reply with a score of A, B, C or D.

        A: The answer is backed up by the contents of the paper, and cites sources accurately.
        B: The answer is somewhat backed up by the contents of the paper, or sources are misattributed or inaccurate.
        C: The answer misconstrues the intention of the paper.
        D: The answer does not provide sources from the paper.
      `,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: chainOfThoughtPaper,
              mediaType: 'application/pdf',
            },
            {
              type: 'text',
              text: `The answer you are evaluating is:

            ${output}

            The original question posed was:

            ${input}`,
            },
          ],
        },
      ],
      schema: z.object({
        feedback: z
          .string()
          .describe(
            'A short feedback message about the answer.',
          ),
        score: z.enum(['A', 'B', 'C', 'D']),
      }),
    });

    const scoreMap = {
      A: 1,
      B: 0.5,
      C: 0,
      D: 0,
    };

    return {
      score: scoreMap[result.object.score],
      metadata: result.object.feedback,
    };
  },
});
