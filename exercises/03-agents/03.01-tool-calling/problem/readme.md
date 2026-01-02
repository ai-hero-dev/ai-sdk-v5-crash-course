It's all very well talking to an LLM. That's useful enough. You can use it for rubber ducking, for talking things through, but your system can't do anything in the world.

One easy way to connect LLMs with the real world is to provide them with a set of tools that they can call. That's what we're going to do in this exercise.

All the work we're going to do is inside our POST request. We have here a [`streamText`](./api/chat.ts) call, which tells the LLM that it is a helpful assistant that can use a sandboxed file system to create, edit, and delete files.

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
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
    tools: TODO,
    // TODO: add a custom stop condition to the streamText call
    // to force the agent to stop after 10 steps have been taken
    stopWhen: TODO,
  });

  return result.toUIMessageStreamResponse();
};
```

It's telling the LLM that it has access to the following tools: write file, read file, delete path, list directory, create directory, etc. It's going to use these to record notes, create to-do lists, and edit documents for the user.

Here's the thing though, we haven't actually provided the tools to the agent. So we need to add the tools to this [`streamText`](./api/chat.ts) call.

As a generous teacher, I've provided you the [`file-system-functionality.ts`](./api/file-system-functionality.ts) file, which contains a bunch of functions that you can use to create, read, and delete files.

```ts
export function writeFile(
  filePath: string,
  content: string,
): { success: boolean; message: string; path: string } {
  try {
    // Implementation details...
    return {
      success: true,
      message: `File written successfully: ${getRelativePath(fullPath)}`,
      path: getRelativePath(fullPath),
    };
  } catch (error) {
    // Error handling...
  }
}

export function readFile(filePath: string): {
  success: boolean;
  content?: string;
  message: string;
  path: string;
} {
  try {
    // Implementation details...
    return {
      success: true,
      content,
      message: `File read successfully: ${getRelativePath(fullPath)}`,
      path: getRelativePath(fullPath),
    };
  } catch (error) {
    // Error handling...
  }
}
```

Your job is to investigate this file system functionality file and hook up all of those functions into tools that the LLM can call. To create a tool, you'll need to use the [`tool`](./api/chat.ts) function from the AI SDK.

```ts
// Example of creating a tool
import { tool } from 'ai';
import { z } from 'zod';

// This is just an example of the tool structure
const exampleTool = tool({
  description: 'Description of what the tool does',
  inputSchema: z.object({
    param1: z.string().describe('Description of parameter 1'),
    param2: z.number().describe('Description of parameter 2'),
  }),
  execute: async ({ param1, param2 }) => {
    // Implementation that uses the parameters
    return { result: 'some result' };
  },
});
```

But your job doesn't end there. When an LLM calls a tool, it has to call the tool, then wait for the response, then read the response. That means we're actually going to have to call the LLM multiple times.

1. First to figure out which tool to call
2. And then how does it want to respond to the result that it just got?

The AI SDK is already set up to do that. You just need to provide it a custom stop condition via `stopWhen`. There's a bunch of custom stop conditions you can use, but I reckon you should force the agent to stop after about 10 steps have been taken.

You'll find the [`stepCountIs`](./api/chat.ts) function in the `ai` package quite useful for this:

```ts
import { stepCountIs } from 'ai';
```

The agent _might_ stop itself before that. But specifying a maximum number of steps means that the agent won't run on forever.

Once you've specified the tools and the `stopWhen` condition, try running the exercise and test the UI to see if you can get it creating and deleting some files. It is sandboxed to that particular directory, so you don't need to worry about it deleting your entire system.

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Import the required dependencies in `chat.ts`:

```ts
import { tool, stepCountIs } from 'ai';
import { z } from 'zod';
import * as fsTools from './file-system-functionality.ts';
```

- [ ] Create tool definitions for each file system function using the `tool()` function. Look at the parameters and return types of each function in the `file-system-functionality.ts` file to determine the correct input schema. Check the [reference](/exercises/99-reference/99.02-defining-tools/explainer/readme.md) for more information on how to use the `tool()` function.

- [ ] Create a `tools` object containing all the tool definitions

- [ ] Add a `stopWhen` condition to limit the number of steps the agent can take. Check out the [docs](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls-using-stopwhen) for more information.

- [ ] Run the local dev server and test if the LLM can create and manage files through the UI by asking it to create a todo list or other file-related tasks.
