The AI SDK provides functionality to monitor how many tokens you're using through a concept called "usage". This helps you track and understand your token consumption when working with AI models.

## The Problem Setup

In this exercise, we'll be working with a model to generate a response about sausages, and then examine the usage information.

Let's look at the code we're working with:

```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const output = streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `Which country makes the best sausages? Answer in a single paragraph.`,
});

for await (const chunk of output.textStream) {
  process.stdout.write(chunk);
}

console.log(); // Empty log to separate the output from the usage

// TODO: Print the usage to the console
TODO;
```

## `await output.usage`

The usage information is available as a property on the `output` object. However, it's important to note that you may need to await this property since it might be a promise.

Once you've printed the usage information, you'll see several properties on it. These properties provide details about your token consumption for the current AI request.

Take some time to examine these properties and understand what each one represents.

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Access the usage property from the output object
  - This will contain information about token consumption

- [ ] Make sure to properly await the usage if it's a promise
  - Remember that many properties returned from `streamText` are wrapped in promises

- [ ] Print the usage information to the console
  - Use `console.log()` to display the full usage object

- [ ] Run the code with `pnpm run dev` to see the output
  - Examine the properties on the usage object
  - Try to understand what each property represents
