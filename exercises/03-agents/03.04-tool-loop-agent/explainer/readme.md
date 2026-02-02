The AI SDK v6 introduced a new way to construct agents - the [`ToolLoopAgent`](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent) class. This approach separates agent definition from agent invocation, making your code more modular and easier to distribute.

Instead of calling [`streamText()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) directly with tools, you create an agent instance first, then use [`createAgentUIStreamResponse()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/create-agent-ui-stream-response) to invoke it. This might seem like extra steps, but it opens up possibilities for sharing agents across your codebase or even publishing them as packages.

Let's explore how this new syntax works and compare it to the traditional approach.

## Key Differences from `streamText()`

### System Prompt Changes

The `system` parameter has been renamed to `instructions`. This aligns better with OpenAI's terminology.

Additionally, `instructions` can accept an array of message parts, allowing you to structure your system prompt with different roles:

```ts
instructions: [
  {
    role: 'system',
    content: 'You are a helpful assistant...',
  },
],
```

### Default Step Count

The default stopping condition has changed significantly.

| Approach        | Default `stepCount` |
| --------------- | ------------------- |
| `streamText()`  | 1                   |
| `ToolLoopAgent` | 20                  |

By default, `ToolLoopAgent` acts more like a true agent, running up to 20 steps before stopping. You can customize this with the [`stopWhen`](https://ai-sdk.dev/docs/agents/loop-control) parameter.

## Steps To Complete

- [ ] Observe how the agent is constructed at the top of `api/chat.ts`

Notice the [`ToolLoopAgent`](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent) instance that creates the agent once, passing in the model, `instructions`, and `tools`.

- [ ] See how the new type helper works

The [`InferAgentUIMessage`](https://ai-sdk.dev/docs/agents/building-agents) type extracts message types directly from the agent instance, so you don't need to manually build the type from your tools.

```ts
export type MyAgentUIMessage = InferAgentUIMessage<typeof agent>;
```

- [ ] Observe the agent being invoked in the POST handler

The agent is passed to [`createAgentUIStreamResponse()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/create-agent-ui-stream-response), which handles streaming the agent's responses back to the client.

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyAgentUIMessage[] } =
    await req.json();
  const { messages } = body;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
};
```

- [ ] Notice how the component uses the inferred type

In `client/root.tsx`, the `useChat` hook is typed with the inferred `MyAgentUIMessage` type, maintaining the same ergonomics as the traditional approach.

```ts
const { messages, sendMessage } = useChat<MyAgentUIMessage>({});
```

- [ ] See the agent being called programmatically

If you wanted to invoke the agent outside of a POST request, you could use [`agent.generate()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent) for one-shot text generation or [`agent.stream()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent) for streaming responses.

- [ ] Test the agent locally by running `pnpm run dev`

Open your browser to `localhost:3000` and try interacting with the agent. Try requesting something like "Create a todo.md file with three items for today" and watch as the agent uses its file system tools to fulfill the request. You'll see the tool calls displayed in the UI, showing exactly which tools the agent is using.
