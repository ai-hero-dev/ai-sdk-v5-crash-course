# AI SDK V5 Complete Guide

The definitive guide for building agents and LLM applications using AI SDK V5.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Core Concepts](#core-concepts)
4. [Providers & Models](#providers--models)
5. [Basic Text Generation](#basic-text-generation)
6. [Streaming](#streaming)
7. [Structured Output with streamObject](#structured-output-with-streamobject)
8. [Tool Calling & Agents](#tool-calling--agents)
9. [Message System](#message-system)
10. [Working with Images and Files](#working-with-images-and-files)
11. [Persistence](#persistence)
12. [Advanced Workflows](#advanced-workflows)
13. [Context Engineering (Prompting)](#context-engineering-prompting)
14. [Custom Data Streaming](#custom-data-streaming)
15. [Error Handling](#error-handling)
16. [Evals & Testing](#evals--testing)
17. [LLM Fundamentals](#llm-fundamentals)
18. [Best Practices](#best-practices)
19. [Complete Examples](#complete-examples)

---

## Introduction

**AI SDK V5** is a TypeScript library from Vercel that provides a unified interface for working with multiple AI providers (OpenAI, Anthropic, Google, etc.). It's designed to be the standard toolkit for building production-ready AI applications and agents.

### Why AI SDK V5?

- **Multi-Provider Support**: Switch between OpenAI, Anthropic, Google, and others seamlessly
- **Type-Safe**: Fully typed TypeScript API
- **Streaming First**: Built-in support for streaming responses
- **Tool Calling**: First-class support for function/tool calling
- **React Integration**: Hooks like `useChat` for frontend integration
- **Production Ready**: Built-in support for persistence, error handling, and monitoring

### Key Features in V5

- **Agentic Loop Control**: `stopWhen`, `prepareStep`, and lightweight Agent class
- **SSE-based Streaming**: Server-Sent Events for stable real-time responses
- **Dynamic Tooling**: Runtime-defined tools with `inputSchema` and `outputSchema`
- **Global Provider**: Specify models using plain model ID strings
- **Zod 4 Support**: Works with both Zod 3 and Zod 4

---

## Installation & Setup

### Prerequisites

- Node.js (version 22 or higher)
- pnpm/npm/yarn/bun
- API keys for your chosen providers

### Install Dependencies

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
# or
pnpm add ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
```

### Environment Setup

Create a `.env` file:

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
```

### Package.json Configuration

```json
{
  "type": "module",
  "dependencies": {
    "ai": "5.0.76",
    "@ai-sdk/openai": "^2.0.52",
    "@ai-sdk/anthropic": "^2.0.32",
    "@ai-sdk/google": "^2.0.23",
    "zod": "^4.0.8"
  }
}
```

---

## Core Concepts

### The Three Main Functions

AI SDK V5 provides three core functions for different use cases:

1. **`generateText`**: Generate text in one shot (non-streaming)
2. **`streamText`**: Stream text responses in real-time
3. **`streamObject`**: Stream structured data that conforms to a schema

### Model vs UI Messages

AI SDK distinguishes between two message types:

- **ModelMessage**: Internal representation used by the LLM
- **UIMessage**: Representation optimized for UI rendering and persistence

### The Parts System

Messages are composed of "parts" that can represent different types of content:
- `text`: Text content
- `tool-*`: Tool calls and results
- `step-start`: Beginning of a reasoning step
- `image`: Image content
- `file`: File content
- Custom data parts

---

## Providers & Models

### Importing Providers

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
```

### Choosing a Model

```typescript
// OpenAI
const model = openai('gpt-4o');
const model = openai('gpt-3.5-turbo');

// Anthropic Claude
const model = anthropic('claude-sonnet-4-5-20250929');
const model = anthropic('claude-3-5-haiku-20241022');

// Google Gemini
const model = google('gemini-2.0-flash');
const model = google('gemini-2.5-flash');
const model = google('gemini-2.0-flash-lite');
```

### Model Selection Guidelines

- **GPT-4o**: Best for complex reasoning, expensive
- **GPT-3.5-turbo**: Fast and cheap, good for simple tasks
- **Claude Sonnet**: Excellent balance of capability and speed
- **Claude Haiku**: Very fast, cost-effective
- **Gemini Flash**: Fast, good for real-time applications
- **Gemini Flash Lite**: Ultra-fast, minimal latency

---

## Basic Text Generation

### Using generateText

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const model = google('gemini-2.0-flash');

const result = await generateText({
  model,
  prompt: 'What is the capital of France?',
});

console.log(result.text);
// Output: "The capital of France is Paris."
```

### With System Prompts

```typescript
const result = await generateText({
  model,
  system: 'You are a helpful assistant that provides concise answers.',
  prompt: 'What is the capital of France?',
});
```

### With Message History

```typescript
const result = await generateText({
  model,
  messages: [
    { role: 'user', content: 'What is 2+2?' },
    { role: 'assistant', content: '4' },
    { role: 'user', content: 'What is 3+3?' },
  ],
});
```

---

## Streaming

### Basic Text Streaming to Terminal

```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const model = google('gemini-2.0-flash');

const stream = streamText({
  model,
  prompt: 'Give me a story about an imaginary planet.',
});

// Stream to terminal
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

// Or get the final text
const finalText = await stream.text;
console.log(finalText);
```

### UI Message Stream

The `UIMessageStream` is a more complex stream that includes not just text, but all the parts that make up a message (tool calls, steps, etc.):

```typescript
const stream = streamText({
  model,
  prompt: 'Give me a sonnet about a cat called Steven.',
});

for await (const chunk of stream.toUIMessageStream()) {
  console.log(chunk);
}

// Output:
// { type: 'start' }
// { type: 'start-step' }
// { type: 'text-start', id: '0' }
// { type: 'text-delta', id: '0', delta: 'A' }
// { type: 'text-delta', id: '0', delta: ' feline friend,' }
// ...
// { type: 'text-end', id: '0' }
// { type: 'finish-step' }
// { type: 'finish' }
```

### Streaming to UI (Frontend)

In an API route:

```typescript
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};
```

Frontend usage with React:

```typescript
import { useChat } from '@ai-sdk/react';

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

---

## Structured Output with streamObject

Use `streamObject` when you need structured data that conforms to a schema:

```typescript
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import z from 'zod';

const model = google('gemini-2.0-flash');

const factsResult = streamObject({
  model,
  prompt: 'Give me some facts about Mars',
  schema: z.object({
    facts: z
      .array(z.string())
      .describe('Scientific facts about Mars'),
  }),
});

// Stream partial objects as they arrive
for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
  // { facts: ['Mars is the fourth planet...'] }
  // { facts: ['Mars is the fourth planet...', 'Mars has two moons...'] }
}

// Get the final complete object
const object = await factsResult.object;
console.log(object.facts);
```

### Combining streamText and streamObject

```typescript
// First, stream a story
const storyStream = streamText({
  model,
  prompt: 'Give me a story about an imaginary planet.',
});

for await (const chunk of storyStream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await storyStream.text;

// Then, generate structured facts
const factsResult = streamObject({
  model,
  prompt: `Give me facts about this planet: ${finalText}`,
  schema: z.object({
    facts: z.array(z.string()),
  }),
});

const facts = await factsResult.object;
console.log(facts);
```

---

## Tool Calling & Agents

Tool calling allows the LLM to use external functions and APIs, enabling it to perform actions and retrieve information.

### Defining a Simple Tool

```typescript
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: google('gemini-2.0-flash'),
  prompt: 'Log the message "Hello, world!" to the console',
  tools: {
    logToConsole: tool({
      description: 'Log a message to the console',
      inputSchema: z.object({
        message: z
          .string()
          .describe('The message to log to the console'),
      }),
      execute: async ({ message }) => {
        console.log(message);
        return 'Message logged to console';
      },
    }),
  },
});
```

### Multiple Tools Example

```typescript
import * as fsTools from './file-system-functionality';

const result = streamText({
  model: google('gemini-2.5-flash'),
  messages: convertToModelMessages(messages),
  system: `
    You are a helpful assistant with access to file system tools.
    Use these tools to help users manage files and directories.
  `,
  tools: {
    writeFile: tool({
      description: 'Write to a file',
      inputSchema: z.object({
        path: z.string().describe('The path to the file'),
        content: z.string().describe('The content to write'),
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
    listDirectory: tool({
      description: 'List a directory',
      inputSchema: z.object({
        path: z.string().describe('The path to the directory'),
      }),
      execute: async ({ path }) => {
        return fsTools.listDirectory(path);
      },
    }),
  },
});
```

### Controlling Agent Loops with stopWhen

```typescript
import { stepCountIs } from 'ai';

const result = streamText({
  model,
  messages,
  tools: { /* ... */ },
  stopWhen: [stepCountIs(10)], // Stop after 10 steps
});
```

### Tool Streaming Events

When tools are used, the stream emits specific events:

```typescript
// { type: 'tool-input-start', toolCallId: '...', toolName: 'writeFile' }
// { type: 'tool-input-delta', toolCallId: '...', inputTextDelta: '...' }
// { type: 'tool-input-available', toolCallId: '...', input: {...} }
// { type: 'tool-output-available', toolCallId: '...', output: {...} }
```

### Best Practices for Tools

1. **Clear Descriptions**: The description is crucial for the LLM to understand when to use the tool
2. **Detailed Input Schemas**: Use `.describe()` on each field to guide the LLM
3. **Return Useful Information**: What you return goes back to the LLM as context
4. **Error Handling**: Always handle errors gracefully in execute functions
5. **Validation**: Zod schemas validate inputs automatically

---

## Message System

### UIMessage Structure

A `UIMessage` is the representation of messages in your UI:

```typescript
type UIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: Record<string, unknown>;
  parts: MessagePart[];
};
```

### Message Parts

Messages are composed of parts. After a tool call completes, the message might look like:

```typescript
{
  id: '',
  role: 'assistant',
  parts: [
    { type: 'step-start' },
    {
      type: 'tool-writeFile',
      toolCallId: 'abc123',
      state: 'output-available',
      input: { path: 'file.txt', content: 'Hello' },
      output: { success: true, message: 'File written' },
    },
    { type: 'step-start' },
    {
      type: 'text',
      text: "I've written the file successfully.",
      state: 'done',
    },
  ],
}
```

### Converting Between Message Types

```typescript
import { convertToModelMessages } from 'ai';

// Convert UI messages to model messages
const modelMessages = convertToModelMessages(uiMessages);

// Use in streamText
const result = streamText({
  model,
  messages: modelMessages,
});
```

### Accessing Final Messages

Use the `onFinish` callback to access completed messages:

```typescript
const stream = streamText({
  model,
  prompt: 'Hello',
  onFinish: ({ response }) => {
    console.log(response.messages);
  },
});

const uiStream = stream.toUIMessageStream({
  onFinish: ({ messages }) => {
    console.log(messages); // All messages including original + response
  },
});
```

---

## Working with Images and Files

### Sending Images from Frontend

```typescript
// In your React component
import { useChat } from '@ai-sdk/react';

function ChatComponent() {
  const { sendMessage, messages } = useChat({
    api: '/api/chat',
  });

  const fileToDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get('file') as File;
    const text = formData.get('message') as string;

    if (file) {
      const dataURL = await fileToDataURL(file);
      sendMessage({
        parts: [
          { type: 'text', text },
          { type: 'file', data: dataURL, mimeType: file.type },
        ],
      });
    } else {
      sendMessage({ text });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="message" />
      <input type="file" name="file" />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Processing Images in Backend

```typescript
export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();
  const messages: UIMessage[] = body.messages;

  // Convert to model messages (handles image parts automatically)
  const modelMessages = convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: google('gemini-2.0-flash'), // Must be a vision-capable model
    messages: modelMessages,
  });

  return streamTextResult.toUIMessageStreamResponse();
};
```

### Important Notes on Files and Images

- Not all models support images (check provider documentation)
- Vision-capable models: GPT-4o, Claude Sonnet, Gemini Flash
- Files must be converted to data URLs for transmission
- The AI SDK handles the conversion from UIMessage parts to model-specific formats

---

## Persistence

### Understanding onFinish Callbacks

There are two places you can use `onFinish`:

1. **In streamText**: Access to `response.messages` (ModelMessage format)
2. **In toUIMessageStreamResponse**: Access to `messages` and `responseMessage` (UIMessage format)

```typescript
const result = streamText({
  model,
  messages: convertToModelMessages(messages),
  onFinish: ({ response }) => {
    // response.messages are ModelMessage[]
    // Not ideal for UI persistence
    console.log(response.messages);
  },
});

return result.toUIMessageStreamResponse({
  originalMessages: messages, // Include original messages
  onFinish: async ({ messages, responseMessage }) => {
    // messages: full conversation including original + response
    // responseMessage: just the new assistant message

    // Best for persistence
    await saveToDatabas(messages);
  },
});
```

### Basic Persistence Pattern

```typescript
import {
  createChat,
  getChat,
  appendToChatMessages,
} from './persistence-layer';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[]; id: string } = await req.json();
  const { messages, id } = body;

  let chat = await getChat(id);
  const mostRecentMessage = messages[messages.length - 1];

  if (!mostRecentMessage || mostRecentMessage.role !== 'user') {
    return new Response('Invalid message', { status: 400 });
  }

  // Create chat if it doesn't exist
  if (!chat) {
    chat = await createChat(id, messages);
  } else {
    // Append only the new user message
    await appendToChatMessages(id, [mostRecentMessage]);
  }

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      // Save the assistant's response
      await appendToChatMessages(id, [responseMessage]);
    },
  });
};
```

### Retrieving Chat History

```typescript
export const GET = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const chatId = url.searchParams.get('chatId');

  if (!chatId) {
    return new Response('No chatId provided', { status: 400 });
  }

  const chat = await getChat(chatId);

  return new Response(JSON.stringify(chat), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Persistence Best Practices

1. **Store UIMessages**: They contain all the parts needed for rendering
2. **Validate Messages**: Check role and content before saving
3. **Use onFinish**: Don't try to save while streaming
4. **Separate User and Assistant**: Save user messages immediately, assistant messages in onFinish
5. **Include Metadata**: Store creation timestamps, user IDs, etc.

---

## Advanced Workflows

### Simple Workflow: Multiple Steps

A workflow executes multiple LLM calls in sequence:

```typescript
const formatMessageHistory = (messages: UIMessage[]) => {
  return messages
    .map((message) => {
      return `${message.role}: ${message.parts
        .map((part) => part.type === 'text' ? part.text : '')
        .join('')}`;
    })
    .join('\n');
};

export const POST = async (req: Request): Promise<Response> => {
  const { messages } = await req.json();

  // Step 1: Write first draft
  const firstDraft = await generateText({
    model: google('gemini-2.0-flash'),
    system: 'You are writing a Slack message. Only return the message.',
    prompt: `Conversation history:\n${formatMessageHistory(messages)}`,
  });

  // Step 2: Evaluate the draft
  const evaluation = await generateText({
    model: google('gemini-2.0-flash'),
    system: 'You are evaluating a Slack message for clarity and professionalism.',
    prompt: `
      Conversation history: ${formatMessageHistory(messages)}
      Slack message: ${firstDraft.text}
    `,
  });

  // Step 3: Write final version with feedback
  const finalVersion = streamText({
    model: google('gemini-2.0-flash'),
    system: 'Write the final Slack message based on the draft and feedback.',
    prompt: `
      Conversation history: ${formatMessageHistory(messages)}
      First draft: ${firstDraft.text}
      Feedback: ${evaluation.text}
    `,
  });

  return finalVersion.toUIMessageStreamResponse();
};
```

### Custom Loops with createUIMessageStream

For more control over the workflow, create your own message stream:

```typescript
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export type MyMessage = UIMessage<
  unknown,
  {
    'slack-message': string;
    'slack-message-feedback': string;
  }
>;

export const POST = async (req: Request): Promise<Response> => {
  const { messages } = await req.json();

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      writer.write({ type: 'start' });

      let step = 0;
      let mostRecentDraft = '';
      let mostRecentFeedback = '';

      while (step < 2) {
        // Generate draft
        const writeSlackResult = streamText({
          model: google('gemini-2.0-flash'),
          system: 'Write a Slack message.',
          prompt: `
            Conversation: ${formatMessageHistory(messages)}
            Previous draft: ${mostRecentDraft}
            Previous feedback: ${mostRecentFeedback}
          `,
        });

        const draftId = crypto.randomUUID();
        let draft = '';

        for await (const part of writeSlackResult.textStream) {
          draft += part;
          writer.write({
            type: 'data-slack-message',
            data: draft,
            id: draftId,
          });
        }

        mostRecentDraft = draft;

        // Generate feedback
        const evaluateSlackResult = streamText({
          model: google('gemini-2.0-flash'),
          system: 'Evaluate the Slack message.',
          prompt: `
            Conversation: ${formatMessageHistory(messages)}
            Draft: ${mostRecentDraft}
          `,
        });

        const feedbackId = crypto.randomUUID();
        let feedback = '';

        for await (const part of evaluateSlackResult.textStream) {
          feedback += part;
          writer.write({
            type: 'data-slack-message-feedback',
            data: feedback,
            id: feedbackId,
          });
        }

        mostRecentFeedback = feedback;
        step++;
      }

      // Write final text part
      const textPartId = crypto.randomUUID();
      writer.write({ type: 'text-start', id: textPartId });
      writer.write({ type: 'text-delta', delta: mostRecentDraft, id: textPartId });
      writer.write({ type: 'text-end', id: textPartId });
    },
  });

  return createUIMessageStreamResponse({ stream });
};
```

### Research Workflow with Web Search

```typescript
import { tavily } from '@tavily/core';

export const POST = async (req: Request): Promise<Response> => {
  const { messages } = await req.json();
  const modelMessages = convertToModelMessages(messages);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      // Generate search queries
      const queriesResult = streamObject({
        model: google('gemini-2.0-flash'),
        system: 'Generate 3-5 search queries to answer the question.',
        schema: z.object({
          plan: z.string(),
          queries: z.array(z.string()),
        }),
        messages: modelMessages,
      });

      // Stream queries to frontend
      for await (const part of queriesResult.partialObjectStream) {
        if (part.queries) {
          writer.write({
            type: 'data-queries',
            data: part.queries,
            id: crypto.randomUUID(),
          });
        }
        if (part.plan) {
          writer.write({
            type: 'data-plan',
            data: part.plan,
            id: crypto.randomUUID(),
          });
        }
      }

      // Execute searches
      const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
      const queries = (await queriesResult.object).queries;

      const searchResults = await Promise.all(
        queries.map(async (query) => {
          const response = await tavilyClient.search(query, {
            maxResults: 5,
          });
          return { query, response };
        })
      );

      // Generate final answer
      const formattedSources = searchResults
        .map(({ response, query }, i) => {
          return `<search-query index="${i + 1}" query="${query}">
            ${response.results.map((res, j) => `
              <result index="${j + 1}">
                <title>${res.title}</title>
                <url>${res.url ?? '#'}</url>
                <content>${res.content ?? ''}</content>
              </result>
            `).join('\n')}
          </search-query>`;
        })
        .join('\n');

      const answerResult = streamText({
        model: google('gemini-2.0-flash'),
        system: `Answer the question using the search results.
          Cite sources as markdown links.

          <sources>${formattedSources}</sources>
        `,
        messages: modelMessages,
      });

      // Merge the answer stream into our custom stream
      writer.merge(answerResult.toUIMessageStream({ sendStart: false }));
    },
  });

  return createUIMessageStreamResponse({ stream });
};
```

---

## Context Engineering (Prompting)

### The Anthropic Prompt Template

A proven template for structuring prompts effectively:

```typescript
const buildPrompt = (opts: {
  careerGuidanceDocument: string;
  conversationHistory: string;
  latestQuestion: string;
}) => `
<task-context>
  You will be acting as an AI career coach named Joe.
  Your goal is to give career advice to users.
</task-context>

<tone-context>
  Maintain a friendly, professional tone.
</tone-context>

<background-data>
  Here is the career guidance document:
  <guide>
  ${opts.careerGuidanceDocument}
  </guide>
</background-data>

<rules>
  - Always stay in character as Joe
  - If unsure, ask for clarification
  - If question is irrelevant, politely redirect to career topics
</rules>

<examples>
  <example>
    User: Hi, how were you created?
    Joe: Hello! My name is Joe, and I was created by AdAstra Careers
    to give career advice. What can I help you with today?
  </example>
</examples>

<conversation-history>
  <history>
  ${opts.conversationHistory}
  </history>
</conversation-history>

<the-ask>
  Here is the user's question:
  <question>
  ${opts.latestQuestion}
  </question>

  How do you respond to the user's question?
</the-ask>

<thinking-instructions>
  Think about your answer before you respond.
</thinking-instructions>

<output-formatting>
  Put your response in <response></response> tags.
</output-formatting>
`;
```

### Why This Template Works

1. **Beginning**: High-level context (task, tone)
2. **Middle**: Background data and rules
3. **End**: Critical elements (the ask, thinking, output format)

LLMs are biased toward content at the beginning and end of prompts, so structure accordingly.

### Prompting Best Practices

1. **Be Specific**: Clear, detailed instructions work better than vague ones
2. **Use Examples**: Few-shot prompting dramatically improves results
3. **XML Tags**: Help LLMs understand structure (especially Claude)
4. **Chain of Thought**: Ask the LLM to "think step by step"
5. **Output Format**: Explicitly specify the desired format
6. **Exemplars**: Show examples of good and bad outputs

### Chain of Thought Prompting

```typescript
const result = await generateText({
  model,
  prompt: `
    Question: What is 15% of 240?

    Think step by step:
    1. First, convert the percentage to a decimal
    2. Then, multiply by the number
    3. Finally, give the answer
  `,
});
```

### Retrieval-Augmented Generation (RAG)

```typescript
// 1. Retrieve relevant documents
const relevantDocs = await searchDocuments(userQuery);

// 2. Format documents
const context = relevantDocs
  .map((doc, i) => `<document index="${i + 1}">${doc.content}</document>`)
  .join('\n');

// 3. Include in prompt
const result = await generateText({
  model,
  system: `You are a helpful assistant.

    Use the following documents to answer the question:
    ${context}

    If the documents don't contain the answer, say so.
  `,
  prompt: userQuery,
});
```

---

## Custom Data Streaming

### Streaming Custom Data Parts

You can stream custom data alongside text:

```typescript
import { createUIMessageStream } from 'ai';

type MyMessage = UIMessage<unknown, {
  'progress': number;
  'status': string;
}>;

const stream = createUIMessageStream<MyMessage>({
  execute: async ({ writer }) => {
    // Stream custom progress data
    writer.write({
      type: 'data-progress',
      data: 0,
      id: crypto.randomUUID(),
    });

    // Do some work
    await doSomeWork();

    writer.write({
      type: 'data-progress',
      data: 50,
      id: crypto.randomUUID(),
    });

    // More work
    await doMoreWork();

    writer.write({
      type: 'data-progress',
      data: 100,
      id: crypto.randomUUID(),
    });

    // Stream status
    writer.write({
      type: 'data-status',
      data: 'Complete',
      id: crypto.randomUUID(),
    });
  },
});
```

### Message Metadata

Add metadata to messages for tracking:

```typescript
const result = streamText({
  model,
  messages,
  metadata: {
    userId: 'user123',
    sessionId: 'session456',
    timestamp: new Date().toISOString(),
  },
});

return result.toUIMessageStreamResponse({
  onFinish: async ({ responseMessage }) => {
    // Access metadata
    console.log(responseMessage.metadata);
  },
});
```

---

## Error Handling

### Basic Error Handling

```typescript
const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    try {
      const result = streamText({
        model,
        prompt: 'Hello',
      });

      writer.merge(result.toUIMessageStream());
    } catch (error) {
      writer.write({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
});
```

### Handling Errors in toUIMessageStreamResponse

```typescript
return result.toUIMessageStreamResponse({
  onError: (error) => {
    console.error('Stream error:', error);
    // Log to monitoring service
  },
  onFinish: async ({ responseMessage }) => {
    // This won't be called if an error occurs
    await saveMessage(responseMessage);
  },
});
```

### Retry Logic

```typescript
async function generateWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateText({ model, prompt });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## Evals & Testing

### What are Evals?

Evals (evaluations) are the AI equivalent of unit tests. They give you a score (0-100) on how well your AI performs on specific tasks.

### Using Evalite

Install Evalite:

```bash
npm install evalite
```

Basic eval:

```typescript
import { evalite } from 'evalite';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

evalite('Capitals', {
  data: () => [
    { input: 'What is the capital of France?', expected: 'Paris' },
    { input: 'What is the capital of Germany?', expected: 'Berlin' },
    { input: 'What is the capital of Italy?', expected: 'Rome' },
  ],
  task: async (input) => {
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: input,
    });
    return result.text;
  },
  scorers: [
    {
      name: 'includes',
      scorer: ({ output, expected }) => {
        return output.includes(expected!) ? 1 : 0;
      },
    },
  ],
});
```

Run the eval:

```bash
npx evalite run
```

### Deterministic Evals

Use exact matching for deterministic tasks:

```typescript
evalite('Math Problems', {
  data: () => [
    { input: 'What is 2+2?', expected: '4' },
    { input: 'What is 10*5?', expected: '50' },
  ],
  task: async (input) => {
    const result = await generateText({
      model,
      system: 'You are a calculator. Return only the number, no explanation.',
      prompt: input,
    });
    return result.text.trim();
  },
  scorers: [
    {
      name: 'exact-match',
      scorer: ({ output, expected }) => {
        return output === expected ? 1 : 0;
      },
    },
  ],
});
```

### LLM-as-a-Judge Eval

Use an LLM to evaluate outputs:

```typescript
evalite('Creative Writing', {
  data: () => [
    { input: 'Write a haiku about technology', expected: null },
  ],
  task: async (input) => {
    const result = await generateText({ model, prompt: input });
    return result.text;
  },
  scorers: [
    {
      name: 'llm-judge',
      scorer: async ({ output }) => {
        const evaluation = await generateText({
          model,
          system: 'You are evaluating a haiku. Score it 0-1 based on: correct structure (5-7-5), relevance to topic, creativity.',
          prompt: `Haiku to evaluate:\n${output}\n\nProvide only a number between 0 and 1.`,
        });

        return parseFloat(evaluation.text);
      },
    },
  ],
});
```

### Dataset Management

Store test cases in separate files:

```typescript
// datasets/capitals.ts
export const capitalsDataset = [
  { input: 'What is the capital of France?', expected: 'Paris' },
  { input: 'What is the capital of Germany?', expected: 'Berlin' },
  // ... more cases
];

// evals/capitals.eval.ts
import { capitalsDataset } from '../datasets/capitals';

evalite('Capitals', {
  data: () => capitalsDataset,
  // ... rest of config
});
```

### Observability with Langfuse

Langfuse provides observability and analytics for LLM applications:

```bash
npm install langfuse
```

```typescript
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
});

const trace = langfuse.trace({ name: 'chat-completion' });

const result = await generateText({
  model,
  prompt: 'Hello',
});

trace.update({
  output: result.text,
  metadata: {
    tokens: result.usage?.totalTokens,
  },
});

await langfuse.shutdownAsync();
```

---

## LLM Fundamentals

### Tokens

Tokens are the fundamental unit of LLMs - not words or characters. You're billed by tokens.

```typescript
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

// o200k_base is the tokenizer for GPT-4o
const tokenizer = new Tiktoken(o200k_base);

const tokenize = (text: string) => {
  return tokenizer.encode(text);
};

const input = 'Hello, how are you today?';
const tokens = tokenize(input);

console.log('Text length:', input.length); // characters
console.log('Token count:', tokens.length); // tokens
console.log('Tokens:', tokens); // array of numbers
```

### Usage Tracking

Track token usage for cost monitoring:

```typescript
const result = await generateText({
  model,
  prompt: 'Write a story about a robot',
});

console.log('Usage:', result.usage);
// {
//   promptTokens: 10,
//   completionTokens: 150,
//   totalTokens: 160
// }

// Calculate cost (example for GPT-4o)
const inputCost = (result.usage.promptTokens / 1000) * 0.005;
const outputCost = (result.usage.completionTokens / 1000) * 0.015;
const totalCost = inputCost + outputCost;
```

### Context Window

The context window is the maximum amount of tokens an LLM can process at once:

- **GPT-3.5-turbo**: 16K tokens
- **GPT-4o**: 128K tokens
- **Claude Sonnet**: 200K tokens
- **Gemini Flash**: 1M tokens

```typescript
// Check if your prompt fits in context
const promptTokens = tokenize(prompt).length;
const contextWindow = 128000; // GPT-4o

if (promptTokens > contextWindow) {
  console.error('Prompt exceeds context window!');
}
```

### Prompt Caching

Some providers (like Anthropic) support prompt caching to reduce costs:

```typescript
const result = await generateText({
  model: anthropic('claude-sonnet-4-5-20250929'),
  messages: [
    {
      role: 'system',
      content: largeSystemPrompt, // This can be cached
    },
    {
      role: 'user',
      content: userQuestion,
    },
  ],
});

// Subsequent calls with the same system prompt use cache
```

---

## Best Practices

### 1. Model Selection

- **Development**: Use fast, cheap models (GPT-3.5, Gemini Flash Lite)
- **Production**: Use capable models (GPT-4o, Claude Sonnet)
- **Tool Calling**: Prefer models with good tool calling support
- **Vision**: Use vision-capable models only when needed

### 2. Streaming

- **Always stream** for user-facing applications (better UX)
- Use `generateText` only for server-side batch processing
- Stream custom data parts for progress indicators

### 3. Error Handling

- Always wrap LLM calls in try-catch
- Implement retry logic with exponential backoff
- Validate inputs before sending to LLM
- Handle rate limits gracefully

### 4. Cost Optimization

- Monitor token usage in production
- Use prompt caching where available
- Choose appropriate models for task complexity
- Implement response length limits with `maxTokens`

### 5. Security

- Never send sensitive data to LLMs without encryption
- Validate and sanitize all user inputs
- Implement rate limiting on API endpoints
- Use environment variables for API keys
- Be cautious with tool calling (can execute arbitrary code)

### 6. Prompt Engineering

- Be specific and detailed in instructions
- Use examples (few-shot prompting)
- Structure prompts with XML tags
- Put critical instructions at the end
- Test prompts with multiple examples

### 7. Testing

- Write evals for all critical functionality
- Test with edge cases and adversarial inputs
- Use LLM-as-a-judge for subjective tasks
- Monitor eval scores over time

### 8. Persistence

- Store UIMessages (not ModelMessages) for UI applications
- Validate messages before persisting
- Use `onFinish` callbacks for persistence
- Include metadata (timestamps, user IDs)

### 9. Tool Calling

- Provide clear, detailed tool descriptions
- Use Zod schemas for type safety
- Return useful information from execute functions
- Limit agent loops with `stopWhen`
- Test tools thoroughly

### 10. Performance

- Use parallel LLM calls where possible (Promise.all)
- Implement caching for repeated queries
- Minimize context window usage
- Consider using smaller models for simple tasks

---

## Complete Examples

### Example 1: Simple Chat API

```typescript
// api/chat.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
    system: 'You are a helpful assistant.',
  });

  return result.toUIMessageStreamResponse();
};
```

### Example 2: Chat with File System Tools

```typescript
// api/chat.ts
import { google } from '@ai-sdk/google';
import {
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import * as fs from 'fs/promises';

export const POST = async (req: Request): Promise<Response> => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: 'You are a helpful assistant with file system access.',
    tools: {
      writeFile: tool({
        description: 'Write content to a file',
        inputSchema: z.object({
          path: z.string(),
          content: z.string(),
        }),
        execute: async ({ path, content }) => {
          await fs.writeFile(path, content, 'utf-8');
          return { success: true, message: `Wrote to ${path}` };
        },
      }),
      readFile: tool({
        description: 'Read a file',
        inputSchema: z.object({
          path: z.string(),
        }),
        execute: async ({ path }) => {
          const content = await fs.readFile(path, 'utf-8');
          return { content };
        },
      }),
    },
    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse();
};
```

### Example 3: Chat with Persistence

```typescript
// api/chat.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { getChat, createChat, appendMessages } from './db';

export const POST = async (req: Request): Promise<Response> => {
  const { messages, chatId }: {
    messages: UIMessage[];
    chatId: string;
  } = await req.json();

  // Validate
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user') {
    return new Response('Invalid message', { status: 400 });
  }

  // Load or create chat
  let chat = await getChat(chatId);
  if (!chat) {
    chat = await createChat(chatId, messages);
  } else {
    await appendMessages(chatId, [lastMessage]);
  }

  // Generate response
  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
  });

  // Return stream with persistence
  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      await appendMessages(chatId, [responseMessage]);
    },
  });
};
```

### Example 4: Research Agent with Web Search

```typescript
// api/research.ts
import { google } from '@ai-sdk/google';
import {
  streamText,
  streamObject,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';
import { tavily } from '@tavily/core';
import { z } from 'zod';

export const POST = async (req: Request): Promise<Response> => {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = convertToModelMessages(messages);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      // Step 1: Generate search queries
      const queriesResult = streamObject({
        model: google('gemini-2.0-flash'),
        system: 'Generate search queries to answer the question.',
        schema: z.object({
          queries: z.array(z.string()),
        }),
        messages: modelMessages,
      });

      const queries = (await queriesResult.object).queries;

      // Step 2: Execute searches
      const tavilyClient = tavily({
        apiKey: process.env.TAVILY_API_KEY,
      });

      const results = await Promise.all(
        queries.map(q => tavilyClient.search(q, { maxResults: 3 }))
      );

      // Step 3: Generate answer with sources
      const sources = results
        .flatMap(r => r.results)
        .map((r, i) => `<source index="${i}">${r.content}</source>`)
        .join('\n');

      const answerResult = streamText({
        model: google('gemini-2.0-flash'),
        system: `Answer using these sources:\n${sources}`,
        messages: modelMessages,
      });

      writer.merge(answerResult.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
};
```

### Example 5: Multi-Step Workflow

```typescript
// api/workflow.ts
import { google } from '@ai-sdk/google';
import { generateText, streamText, type UIMessage } from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const context = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  // Step 1: Generate outline
  const outline = await generateText({
    model: google('gemini-2.0-flash'),
    system: 'Create a brief outline for the response.',
    prompt: context,
  });

  // Step 2: Generate draft
  const draft = await generateText({
    model: google('gemini-2.0-flash'),
    system: 'Write a draft response following this outline.',
    prompt: `Outline: ${outline.text}\n\nContext: ${context}`,
  });

  // Step 3: Refine and stream final version
  const final = streamText({
    model: google('gemini-2.0-flash'),
    system: 'Refine and improve this draft.',
    prompt: `Draft: ${draft.text}\n\nContext: ${context}`,
  });

  return final.toUIMessageStreamResponse();
};
```

---

## Conclusion

This guide covers the essential concepts and patterns for building AI applications with AI SDK V5. The key to success is:

1. **Start Simple**: Begin with basic `generateText` or `streamText`
2. **Add Tools**: Enable agents to perform actions
3. **Structure Data**: Use `streamObject` for type-safe outputs
4. **Build Workflows**: Chain multiple LLM calls for complex tasks
5. **Test Everything**: Write evals for critical functionality
6. **Monitor Production**: Track usage, costs, and errors

For more information, visit:
- Official docs: https://ai-sdk.dev
- GitHub: https://github.com/vercel/ai
- Course: https://aihero.dev

Happy building!
