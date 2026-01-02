AI SDK v6 introduces DevTools for debugging AI applications with full visibility into LLM calls.

> **Note:** DevTools is experimental and may change. It won't appear throughout the rest of this repo, but is included here because it's new in v6.

## Setup

First, install the DevTools package:

```bash
pnpm add @ai-sdk/devtools
```

## Wrapping the Model

In [`api/chat.ts`](./api/chat.ts), we use `wrapLanguageModel` to wrap the model with the DevTools middleware:

```ts
import { wrapLanguageModel } from 'ai';
import { devToolsMiddleware } from '@ai-sdk/devtools';

const model = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: devToolsMiddleware(),
});
```

This wrapped model can be used with any AI SDK Core function like `streamText`, `generateText`, or `generateObject`.

## Launching DevTools

In a separate terminal, run:

```bash
npx @ai-sdk/devtools
```

Then open `http://localhost:4983` in your browser.

## What Gets Captured

DevTools intercepts all LLM calls and logs:

- Input parameters and complete prompts
- Generated text and tool invocations
- Token usage metrics and timing data
- Raw provider request/response payloads

## Storage & Security

DevTools stores data locally in `.devtools/generations.json`. The middleware automatically adds `.devtools` to `.gitignore`.

**Warning:** Only use DevTools in local development. Prompts and responses are stored in plain text.

## Steps To Complete

- [ ] Run `npx @ai-sdk/devtools` in a separate terminal

- [ ] Run the exercise with `pnpm run dev` and send a message

- [ ] Open `http://localhost:4983` to see the request/response details

- [ ] Try sending multiple messages and observe how DevTools groups them
