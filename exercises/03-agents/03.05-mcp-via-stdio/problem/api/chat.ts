import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { createMCPClient } from '@ai-sdk/mcp';

if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN is not set');
}

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  // TODO - create an MCP client that uses the StdioMCPTransport
  // to connect to the GitHub MCP server
  const mcpClient = TODO;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
    system: `
      You are a helpful assistant that can use the GitHub API to interact with the user's GitHub account.
    `,
    // TODO - use the mcpClient.tools() method to get the tools
    tools: TODO,
    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse({
    // TODO - use the mcpClient.close() method to close the MCP client
    // when the stream is finished. This will also close the process
    // running the GitHub MCP server.
    onFinish: TODO,
  });
};
