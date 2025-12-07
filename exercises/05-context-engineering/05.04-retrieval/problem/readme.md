In this exercise, we're exploring how to handle retrieved external data in prompt templates. Retrieving external data and putting it into the context is a powerful technique to reduce hallucinations in LLMs.

We have a few test cases to try:

- What did Guillermo Rauch say about Matt Pocock?
- What is Matt Pocock's open source background?
- Why is learning TypeScript important?

The code uses [Tavily](https://www.tavily.com/), a third-party service that can handle search-related tasks. We're using its scraping capability by calling `extract` on our Tavily client with a URL to get the raw content of a webpage.

Let's look at the main code:

```typescript
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
```

The code sets up test cases with questions and corresponding URLs to scrape for information.

```typescript
// Change this to try a different test case
const TEST_CASE_TO_TRY = 0;

const { input, url } = testCases[TEST_CASE_TO_TRY];
```

We can select which test case to try by changing the `TEST_CASE_TO_TRY` value.

```typescript
const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const scrapeResult = await tavilyClient.extract([url]);

const rawContent = scrapeResult.results[0]?.rawContent;

if (!rawContent) {
  throw new Error('Could not scrape the URL');
}
```

This code initializes the Tavily client, scrapes the URL, and extracts the raw content from the results.

Now, we need to complete three TODO items in the prompt template:

```typescript
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
```

These TODOs guide us through enhancing our prompt template:

1. Format the content with XML tags and add the conversation history
2. Add rules for the model's output format (paragraphs, quotes)
3. Specify the output format (summary only)

The order of these elements in the prompt is crucial for effectiveness - background data, conversation history, and output format should be arranged in a specific way.

```typescript
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

Finally, this code streams the response from the model to the console.

## Steps To Complete

- [ ] Format the scraped content with XML tags
  - Add the raw content inside appropriate XML tags like `<content>` or `<background-data>`
  - This provides context for the model to work with

- [ ] Add the conversation history
  - Include the user's question from the selected test case
  - Format it appropriately, possibly using `<conversation-history>` tags

- [ ] Add rules for the model's output
  - Instruct the model to use paragraphs in its output
  - Tell the model to use quotes from the website content
  - Consider adding these under a section like `<rules>` or similar

- [ ] Specify the output format
  - Add instructions for the model to return only the summary
  - Specify that it should not include any other text
  - Consider using `<output-format>` tags

- [ ] Test your implementation
  - Run the exercise using `pnpm run exercise`
  - Try different test cases by changing the `TEST_CASE_TO_TRY` value
  - Verify that the output follows your formatting rules and answers the question accurately
