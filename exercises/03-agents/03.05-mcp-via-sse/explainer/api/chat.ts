import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';

import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN is not set');
}

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const mcpClient = await createMCPClient({
    transport: {
      type: 'sse',
      url: 'https://api.githubcopilot.com/mcp',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    },
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
