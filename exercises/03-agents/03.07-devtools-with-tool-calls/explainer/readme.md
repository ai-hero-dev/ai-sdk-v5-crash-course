DevTools becomes especially powerful when working with tool-calling agents. It provides a visual breakdown of each tool invocation, including inputs and outputs.

> **Note:** DevTools is experimental and may change. It won't appear throughout the rest of this repo, but is included here because it's new in v6.

## Combining DevTools with ToolLoopAgent

In [`api/chat.ts`](./api/chat.ts), we wrap the model with DevTools middleware and pass it to a `ToolLoopAgent`:

```ts
import { wrapLanguageModel, ToolLoopAgent } from 'ai';
import { devToolsMiddleware } from '@ai-sdk/devtools';

const model = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: devToolsMiddleware(),
});

const agent = new ToolLoopAgent({
  model,
  instructions: '...',
  tools,
});
```

The wrapped model logs all LLM calls to DevTools, including each iteration of the tool loop.

## What DevTools Shows for Tool Calls

When the agent uses tools, DevTools displays:

- **Each LLM call** in the tool loop as a separate entry
- **Tool invocations** with the tool name and input parameters
- **Tool results** returned to the model
- **Token usage** for each iteration
- **Timing data** for the full loop

This makes it easy to debug multi-step agent interactions and understand exactly what the model is doing at each step.

## Running This Example

1. Start DevTools in a separate terminal:

```bash
npx @ai-sdk/devtools
```

2. Run the exercise:

```bash
pnpm run dev
```

3. Open `http://localhost:4983` in your browser

4. Send a message like "Create a todo.md file with three items"

5. Watch DevTools update with each tool call in the loop

## Steps To Complete

- [ ] Run `npx @ai-sdk/devtools` in a separate terminal

- [ ] Run the exercise with `pnpm run dev` and send a message

- [ ] Open `http://localhost:4983` to see each tool invocation

- [ ] Try asking the agent to perform multi-step tasks and observe the tool loop
