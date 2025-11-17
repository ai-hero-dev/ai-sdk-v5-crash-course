import { google } from "@ai-sdk/google";
import {
	writeFile,
	writeFileSchema,
	readFile,
	readFileSchema,
	deletePath,
	deletePathSchema,
	listDirectory,
	listDirectorySchema,
	createDirectory,
	createDirectorySchema,
	exists,
	existsSchema,
	searchFiles,
	searchFilesSchema,
} from "./file-system-functionality.ts";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	tool,
	type UIMessage,
} from "ai";

export const POST = async (req: Request): Promise<Response> => {
	const body: { messages: UIMessage[] } = await req.json();
	const { messages } = body;

	const result = streamText({
		model: google("gemini-2.5-flash"),
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
				description: "Write content to file",
				inputSchema: writeFileSchema,
				execute: ({ content, filePath }) => {
					return writeFile(filePath, content);
				},
			}),
			readFile: tool({
				description: "Read content from a file",
				inputSchema: readFileSchema,
				execute: ({ filePath }) => {
					return readFile(filePath);
				},
			}),
			deletePath: tool({
				description: "Delete a file or directory",
				inputSchema: deletePathSchema,
				execute: ({ pathToDelete }) => {
					return deletePath(pathToDelete);
				},
			}),
			listDirectory: tool({
				description: "List contents of a directory",
				inputSchema: listDirectorySchema,
				execute: ({ dirPath }) => {
					return listDirectory(dirPath);
				},
			}),
			createDirectory: tool({
				description: "Create a new directory",
				inputSchema: createDirectorySchema,
				execute: ({ dirPath }) => {
					return createDirectory(dirPath);
				},
			}),
			exists: tool({
				description: "Check if a file or directory exists",
				inputSchema: existsSchema,
				execute: ({ pathToCheck }) => {
					return exists(pathToCheck);
				},
			}),
			searchFiles: tool({
				description: "Search for files by pattern (supports * wildcard)",
				inputSchema: searchFilesSchema,
				execute: ({ pattern, searchDir }) => {
					return searchFiles(pattern, searchDir);
				},
			}),
		},
		// TODO: add a custom stop condition to the streamText call
		// to force the agent to stop after 10 steps have been taken
		stopWhen: stepCountIs(5),
	});

	return result.toUIMessageStreamResponse();
};
