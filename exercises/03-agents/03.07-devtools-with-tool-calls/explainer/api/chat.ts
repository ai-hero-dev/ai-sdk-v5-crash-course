import { google } from '@ai-sdk/google';
import { devToolsMiddleware } from '@ai-sdk/devtools';
import {
  createAgentUIStreamResponse,
  type InferAgentUIMessage,
  tool,
  ToolLoopAgent,
  wrapLanguageModel,
} from 'ai';
import { z } from 'zod';
import * as fsTools from './file-system-functionality.ts';

// Wrap the model with DevTools middleware
// Run `npx @ai-sdk/devtools` in a separate terminal
// Then open http://localhost:4983 to see LLM calls with tool invocations
const model = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: devToolsMiddleware(),
});

const tools = {
  writeFile: tool({
    description: 'Write to a file',
    inputSchema: z.object({
      path: z.string().describe('The path to the file to create'),
      content: z.string().describe('The content of the file to create'),
    }),
    execute: async ({ path, content }) => {
      return fsTools.writeFile(path, content);
    },
  }),
  readFile: tool({
    description: 'Read a file',
    inputSchema: z.object({
      path: z.string().describe('The path to the file to read'),
    }),
    execute: async ({ path }) => {
      return fsTools.readFile(path);
    },
  }),
  deletePath: tool({
    description: 'Delete a file or directory',
    inputSchema: z.object({
      path: z
        .string()
        .describe('The path to the file or directory to delete'),
    }),
    execute: async ({ path }) => {
      return fsTools.deletePath(path);
    },
  }),
  listDirectory: tool({
    description: 'List a directory',
    inputSchema: z.object({
      path: z.string().describe('The path to the directory to list'),
    }),
    execute: async ({ path }) => {
      return fsTools.listDirectory(path);
    },
  }),
};

const agent = new ToolLoopAgent({
  model,
  instructions: `
    You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

    You have access to the following tools:
    - writeFile
    - readFile
    - deletePath
    - listDirectory

    Use these tools to record notes, create todo lists, and edit documents for the user.

    Use markdown files to store information.
  `,
  tools,
});

export type MyAgentUIMessage = InferAgentUIMessage<typeof agent>;

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyAgentUIMessage[] } = await req.json();
  const { messages } = body;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
};
