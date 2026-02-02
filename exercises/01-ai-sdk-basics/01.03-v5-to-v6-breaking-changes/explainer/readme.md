# V5 to V6 Breaking Changes

This course uses AI SDK v6. If you're coming from v5, here are the key breaking changes to be aware of.

## `convertToModelMessages` is now async

In v5, `convertToModelMessages` was synchronous:

```ts
// v5
const modelMessages = convertToModelMessages(messages);
```

In v6, it's async and must be awaited:

```ts
// v6
const modelMessages = await convertToModelMessages(messages);
```

## MCP imports moved to `@ai-sdk/mcp`

MCP-related imports have moved to a dedicated package:

```ts
// v5
import { createMCPClient } from 'ai';
import { StdioMCPTransport } from 'ai/mcp-stdio';

// v6
import { createMCPClient } from '@ai-sdk/mcp';
import { StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
```

## `Output.object` for structured generation

v6 introduces `Output.object` as the new way to generate structured objects with `generateText` and `streamText`:

```ts
import { Output } from 'ai';

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Generate a recipe',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    }),
  }),
});

console.log(result.object); // typed object
```

`generateObject` and `streamObject` still work in v6.

## `ToolLoopAgent` for agentic workflows

v6 adds `ToolLoopAgent` for multi-step tool calling:

```ts
import { ToolLoopAgent } from 'ai';

const agent = new ToolLoopAgent({
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant',
  tools: { myTool },
});
```

This replaces manual `while` loops with `maxSteps`.

---

This isn't exhaustive—check the [AI SDK changelog](https://ai-sdk.dev/changelog) for full details.
