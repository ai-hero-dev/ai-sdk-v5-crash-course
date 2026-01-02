AI SDK v6 introduces `ToolLoopAgent`, a class for building agents that loop through tool calls autonomously. In previous lessons, you used `streamText` with `stopWhen` conditions - `ToolLoopAgent` encapsulates this pattern into a reusable class.

Let's look at the key differences in the [`api/chat.ts`](./api/chat.ts) file.

## Creating the Agent

Instead of configuring `streamText` directly, you create a `ToolLoopAgent` instance:

```ts
import { ToolLoopAgent } from 'ai';

const agent = new ToolLoopAgent({
  model: google('gemini-2.5-flash'),
  instructions: `
    You are a helpful assistant that can use a sandboxed file system...
  `,
  tools,
});
```

Notice we're using `instructions` instead of `system`. This aligns with OpenAI's naming convention for agents. Note that `streamText`/`generateText` still use `system`.

## Default Step Limit

`ToolLoopAgent` defaults to 20 steps maximum. You don't need to specify a `stopWhen` condition unless you want a different limit - it's built in.

## createAgentUIStreamResponse

Instead of calling `result.toUIMessageStreamResponse()`, you use `createAgentUIStreamResponse`:

```ts
import { createAgentUIStreamResponse } from 'ai';

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
};
```

This handles streaming the agent's responses back to the frontend.

## InferAgentUIMessage

Use `InferAgentUIMessage` to infer the UI message type from your agent. This gives you type-safe tool parts in your frontend:

```ts
import { InferAgentUIMessage } from 'ai';

export type MyAgentUIMessage = InferAgentUIMessage<typeof agent>;
```

Then in your React component in [`client/root.tsx`](./client/root.tsx):

```tsx
const { messages, sendMessage } = useChat<MyAgentUIMessage>({});
```

This gives you autocomplete for `part.type` like `'tool-writeFile'`, `'tool-readFile'`, etc. Check the [`client/components.tsx`](./client/components.tsx) file to see how we're using these types to render tool-specific UI.

## Steps To Complete

- [ ] Review the [`api/chat.ts`](./api/chat.ts) file to see how `ToolLoopAgent` and `createAgentUIStreamResponse` are used together

- [ ] Check the [`client/components.tsx`](./client/components.tsx) file to see how `MyAgentUIMessage` gives us type-safe tool parts

- [ ] Run the exercise and test the file system tools

- [ ] Try modifying the agent's `instructions` to change its behavior
