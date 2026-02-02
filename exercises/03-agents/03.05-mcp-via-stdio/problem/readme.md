One way that you can provide tool sets to your agent is via MCP.

MCP, or the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro), is a protocol you can use to connect your client (which in our case is the application that we're building) to an MCP server.

MCP servers can expose tool sets, in other words, functions that you can call as the client, to do things in the real world.

For instance, the [GitHub MCP server](https://github.com/github/github-mcp-server), which is what we're going to be using, lets you create repositories, find text files, close issues, open pull requests, and all sorts of other useful GitHub actions.

By taking these pre-built tools and plugging them into our system, we're going to be on the fast track to making something really useful.

Luckily, the AI SDK has a few functions that help you do that.

## The Exercise

In this exercise, we'll be working in the [`POST`](./api/chat.ts) route only.

We're first going to look at a couple of imported functions from [`@ai-sdk/mcp`](./api/chat.ts). These are experimental, of course, because everything in MCP is experimental, and we're going to use them just below in our code.

Before we start streaming, we need to initiate an MCP client. This will use the [`StdioMCPTransport`](./api/chat.ts) from `@ai-sdk/mcp/mcp-stdio`.

```ts
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
```

What this is going to do is run a process locally and monitor its `stdin` and `stdout` in order to communicate with it.

You'll need to run the GitHub MCP server in a Docker container. That's how they recommend you do it.

To save you the pain I went through integrating this, here's the code for how to set it up:

```ts
const myTransport = new StdioMCPTransport({
  command: 'docker',
  args: [
    'run',
    '-i',
    '--rm',
    '-e',
    'GITHUB_PERSONAL_ACCESS_TOKEN',
    'ghcr.io/github/github-mcp-server',
  ],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN:
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  },
});
```

For those who don't have Docker yet, you'll need to download [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you don't already have it installed. You'll also need to acquire a GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

Give your token some basic access and put that in your `.env` file in the root of the repository:

```
GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
```

Once the MCP client has been set up, you then need to acquire its tools and pass those tools into [`streamText`](./api/chat.ts). The MCP client will have a `tools` method that you can call to get them.

## Closing the MCP Client

Finally, because we're running the MCP server ourselves (that's what the `StdioMCPTransport` does - it kicks off the MCP server), we will need to manually close it when we're done.

So in the [`onFinish`](./api/chat.ts) callback, we're going to close the stream by calling `mcpClient.close()`.

For us, this means we're going to kick off the GitHub MCP server when our request is made. And when our request finishes, we're going to close it down. This might not be the most desirable approach, but for now it's going to work.

Once that's all set up and working, you should be able to communicate with your own GitHub account via a tool that you've built yourself.

Why not get it to list some issues on a repository that you know, or even ask it to investigate a repository that you don't know well. Good luck!

## Steps To Complete

- [ ] Get a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and add it to your `.env` file

- [ ] Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you don't have it already

- [ ] Create an MCP client using the `createMCPClient` function and the `StdioMCPTransport` class to connect to the GitHub MCP server. As a reminder, here's how to set up the transport. Check [these docs](https://ai-sdk.dev/docs/reference/ai-sdk-core/create-mcp-client) for more information.

```ts
const myTransport = new StdioMCPTransport({
  command: 'docker',
  args: [
    'run',
    '-i',
    '--rm',
    '-e',
    'GITHUB_PERSONAL_ACCESS_TOKEN',
    'ghcr.io/github/github-mcp-server',
  ],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN:
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  },
});
```

- [ ] Use the `mcpClient.tools()` method to get the tools and pass them to the `streamText` function.

- [ ] Implement the `onFinish` callback to close the MCP client when the stream is finished

```ts
onFinish: async () => {
  // Close the MCP client
},
```

- [ ] Test your implementation by running the local dev server and asking the agent to interact with GitHub, such as fetching issues from a repository
