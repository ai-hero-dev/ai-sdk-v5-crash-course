import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import { deletePath, fileSystemTools, readFile, writeFile } from './file-system-functionality.ts';
import z from 'zod';


export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: `
      You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

      You have access to the following tools:
      - writeFile
      - readFile
      - deletePath
      - listDirectory
      - createDirectory
      - exists
      - searchFiles

      Use these tools to record notes, create todo lists, and edit documents for the user.

      Use markdown files to store information.
    `,
    // TODO: add the tools to the streamText call,
    tools: {
      writeFile: tool({
        name: 'writeFile',
        inputSchema: z.object({
          path: z.string(),
          content: z.string(),
        }),
        execute: async ({ path, content }) => {
          return fileSystemTools.writeFile(path, content);
      }  })
      ,

      readFile: tool({
        name: 'readFile',
        inputSchema: z.object({
          path: z.string(),
        }),
        execute: async ({ path }) => {
          return fileSystemTools.readFile(path);
        },
      }),
      deletePath: tool({
        name: 'deletePath',
        inputSchema: z.object({
          path: z.string(),
        }),
        execute: async ({ path }) => {
          return fileSystemTools.deletePath(path);
        },
      }),
    },

    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
};
