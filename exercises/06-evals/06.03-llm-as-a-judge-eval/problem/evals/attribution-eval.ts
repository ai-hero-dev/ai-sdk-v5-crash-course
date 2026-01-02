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

const ATTRIBUTION_PROMPT = `
You are a helpful assistant that can answer questions about the chain of thought prompting paper.

Your job is to work out if the answer has been properly attributed to the paper.

Reply with a score of A, B, C or D.

A: The answer is backed up by the contents of the paper, and cites sources accurately.
B: The answer is somewhat backed up by the contents of the paper, or sources are misattributed or inaccurate.
C: The answer misconstrues the intention of the paper.
D: The answer does not provide sources from the paper.
`;

export const attributionToChainOfThoughtPaper = createScorer<
  string,
  string,
  undefined
>({
  name: 'Attribution',
  scorer: async ({ input, output }) => {
    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      system: ATTRIBUTION_PROMPT,
      messages: TODO, // TODO: Pass the chain of thought paper, the question and the answer given
      schema: TODO, // TODO: Define the schema for the response
    });

    // NOTE: it's important to use a string-based score for the
    // LLM, since LLM's are notorious for being biased towards
    // different numbers.

    // So, we get the LLM to return a string score, and then
    // we map it to a number.
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
