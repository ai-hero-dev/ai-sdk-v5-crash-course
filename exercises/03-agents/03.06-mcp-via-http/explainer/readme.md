Right now, if you want to use an MCP server with the AI SDK, you need to run it locally on your machine. That means executing code from someone else's library with `npx` - which can feel risky.

But MCP servers are being deployed all over the world. So how do you contact them without running code locally?

The answer is [HTTP transport](/PLACEHOLDER/http-transport). Instead of using [standard IO transport](/PLACEHOLDER/standard-io-transport) to run an MCP server locally, you can point your AI SDK client at an external API endpoint.

## How Transport Types Work

The AI SDK supports three different [transport](/PLACEHOLDER/mcp-transport) types for connecting to MCP servers:

| Transport                | Use Case                 | Trade-offs                                               |
| ------------------------ | ------------------------ | -------------------------------------------------------- |
| Standard IO              | Local MCP servers        | Simpler setup, but executes code on your machine         |
| HTTP                     | Remote MCP servers       | No local code execution, but depends on external service |
| Server-Sent Events (SSE) | Real-time remote servers | Lower latency, but less widely supported                 |

## Steps To Complete

- [ ] Review the current setup in `api/chat.ts`

The current code uses [standard IO transport](/PLACEHOLDER/standard-io-transport) to run an MCP server locally. You'll need to understand what [`createMCPClient`](/PLACEHOLDER/create-mcp-client) does and how it currently works.

- [ ] Replace the transport configuration with HTTP transport

Change the `transport` property in the [`createMCPClient`](/PLACEHOLDER/create-mcp-client) call to use HTTP instead. You'll need to:

- Set `type` to `'http'`
- Provide a `url` pointing to the remote MCP server
- Add any necessary `headers` for authentication

```ts
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://api.githubcopilot.com/mcp',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  },
});
```

- [ ] Test your implementation

Run `pnpm run dev` and test the same request: "Give me the latest issues on the mattpocock/ts-reset repo."

The agent should fetch data from the remote MCP server through HTTP instead of running code locally.

- [ ] Observe the differences

Notice how the HTTP transport:

- Makes the setup simpler (no local process to manage)
- Demands less from your server
- Still gets the same results as the local setup

- [ ] Consider the trade-offs

Think about what happens if the external service goes down. With HTTP transport, your entire agent depends on that external API being available. This is the main caveat of using remote MCP servers.
