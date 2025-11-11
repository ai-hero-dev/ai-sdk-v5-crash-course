import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';

import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';

if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN is not set');
}

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const mcpClient = await createMCPClient({
    transport: new StdioMCPTransport({
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
    }),
  });

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: `
      You are a helpful assistant that can use the GitHub API to interact with the user's GitHub account.
    `,
    tools: await mcpClient.tools(),
    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse({
    onFinish: async () => {
      await mcpClient.close();
    },
  });
};
