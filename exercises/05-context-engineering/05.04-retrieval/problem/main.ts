import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tavily } from '@tavily/core';

const testCases = [
  {
    input: 'What did Guillermo Rauch say about Matt Pocock?',
    url: 'https://www.aihero.dev/',
  },

  {
    input: "What is Matt Pocock's open source background?",
    url: 'https://www.aihero.dev/',
  },

  {
    input: 'Why is learning TypeScript important?',
    url: 'https://totaltypescript.com/',
  },
] as const;

// Change this to try a different test case
const TEST_CASE_TO_TRY = 0;

const { input, url } = testCases[TEST_CASE_TO_TRY];

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const scrapeResult = await tavilyClient.extract([url]);

const rawContent = scrapeResult.results[0]?.rawContent;

if (!rawContent) {
  throw new Error('Could not scrape the URL');
}

// TODO: Add the background data and the conversation history
// TODO: Add some rules telling the model to use paragraphs in its output, and to use quotes from the content of the website to answer the question.
// TODO: Add the output format telling the model to return only the summary, not any other text.
const result = await streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    <task-context>
    You are a helpful assistant that summarizes the content of a URL.
    </task-context>

    <the-ask>
    Summarize the content of the website based on the conversation history.
    </the-ask>
  `,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
