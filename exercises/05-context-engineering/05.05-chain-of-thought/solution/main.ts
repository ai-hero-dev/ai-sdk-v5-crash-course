import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const COMPLEX_TS_CODE = readFileSync(
  path.join(import.meta.dirname, 'complex-ts-code.ts'),
  'utf-8',
);

const IIMT_ARTICLE = readFileSync(
  path.join(import.meta.dirname, 'iimt-article.md'),
  'utf-8',
);

const result = streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    <task-context>
    You are a helpful TypeScript expert that can explain complex TypeScript code for beginner TypeScript developers. You will be given a complex TypeScript code and you will need to explain it in a way that is easy to understand.
    </task-context>

    <background-data>
    Here is the complex TypeScript code:
    <code>
    ${COMPLEX_TS_CODE}
    </code>

    And here is an article about the IIMT pattern:
    <article>
    ${IIMT_ARTICLE}
    </article>
    </background-data>

    <rules>
    - Do not let the user know that you are using the article as a reference. Refer to the concepts as if you are an expert.
    - Use section headers to organize the explanation.
    </rules>

    <the-ask>
    Explain the code, using the article as a reference.
    </the-ask>

    <thinking-instructions>
      Think about your answer first before you respond. Consider the optimal path for the user to understand the code. Consider all of the knowledge dependencies - the pieces of knowledge that rely on other pieces of knowledge. Assume the user knows very little about TypeScript. Create a list of the pieces of knowledge that the user needs to know, in order of dependency.
    </thinking-instructions>

    <output-format>
    Return two sections - a <thinking> block and an answer.
    - The <thinking> block should contain your thought process, and be wrapped in a <thinking> tag.
    - The answer should be unwrapped.
    - The answer should be in markdown format, using code blocks for the TypeScript code.
    </output-format>
  `,
});

console.log('Generating answer');

for await (const chunk of result.textStream) {
  process.stdout.write('.');
}

const output = await result.text;

const outputPath = path.join(import.meta.dirname, 'output.md');

writeFileSync(outputPath, output);

console.log(`\nAnswer written to ${outputPath}!`);
