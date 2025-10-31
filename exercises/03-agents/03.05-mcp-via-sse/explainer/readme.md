I wanted to provide you an example of using SSE as a transport for an MCP client. In fact, this is my preferred way of teaching this because it means less setup for you.

However, I simply could not get it working on my machine. So I've provided this example for you. Hopefully you can get it working, but I couldn't.

The important difference is inside this [`createMCPClient`](./api/chat.ts) function, we no longer need to instantiate a `StdioMCPTransport`. We're now just passing in the information needed to contact the GitHub API via SSE.

Let's look at the code:

```ts
const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://api.githubcopilot.com/mcp',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  },
});
```

Instead of using the `StdioMCPTransport`, we're configuring an SSE (Server-Sent Events) transport that connects directly to GitHub's API.

I would suggest that you run this code, see if you can get it working. I think it was something to do with my strange WSL setup that was just making this balk. Good luck and I will see you in the next one.

__Note. To make MCP Client work with Remote GitHub MCP Server__

When the `mcpClient` is created with configuration `transport: { type: 'sse',...}`
the following error is shown in the terminal:  
`MCPClientError: MCP SSE Transport Error: 405 Method Not Allowed`.

The error indicates that `github-mcp-server` does not support the SSE transport.

The replacement of `transport: { type: 'sse',...}` with `transport: { type: 'http',...}`
produces  
`MCPClientError: Unsupported or invalid transport configuration. If you are using a custom transport, make sure it implements the MCPTransport interface.`  
indicating that Vercel `ai-sdk` does not support `transport: { type: 'http',...}`.

Thus, we have a mismatch between the `ai-sdk` and `github-mcp-server`:

- on one hand `ai-sdk` tries to establish SSE Transport that `github-mcp-server` does not support
- on the other hand `ai-sdk` does not support HTTP (Streamable HTTP) Transport that `github-mcp-server` requires.

To address this mismatch, the HTTP (Streamable HTTP) Transport is implemented, see `http-transport-lite.ts`

## Steps To Complete

- [ ] Make sure you have a GitHub [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) set in your environment variables

- [ ] Try running the code as-is to see if the SSE transport works on your system

- [ ] Test the implementation by running your local dev server and seeing if GitHub API interactions work properly

- [ ] Check for any error messages in your terminal that might indicate connection issues with the SSE transport
