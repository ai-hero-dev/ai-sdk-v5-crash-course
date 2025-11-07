# AI SDK V5 Quick Reference

Fast lookup for common operations and patterns.

## Installation

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google zod
```

## Basic Imports

```typescript
// Core functions
import { generateText, streamText, streamObject, tool } from 'ai';

// Providers
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// Types
import type { UIMessage, ModelMessage } from 'ai';

// Utilities
import { convertToModelMessages, stepCountIs } from 'ai';

// Schema validation
import { z } from 'zod';
```

## Generate Text (Non-Streaming)

```typescript
const result = await generateText({
  model: google('gemini-2.0-flash'),
  prompt: 'Hello, world!',
});

console.log(result.text);
console.log(result.usage); // Token usage
```

## Stream Text

```typescript
const stream = streamText({
  model: google('gemini-2.0-flash'),
  prompt: 'Write a story',
});

// Stream to terminal
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

// Or get final text
const text = await stream.text;
```

## Stream Object (Structured Data)

```typescript
const result = streamObject({
  model: google('gemini-2.0-flash'),
  prompt: 'Generate user data',
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  }),
});

// Stream partial objects
for await (const obj of result.partialObjectStream) {
  console.log(obj);
}

// Get final object
const final = await result.object;
```

## Models Quick Reference

```typescript
// OpenAI
openai('gpt-4o')           // Most capable
openai('gpt-3.5-turbo')    // Fast and cheap

// Anthropic
anthropic('claude-sonnet-4-5-20250929')  // Best overall
anthropic('claude-3-5-haiku-20241022')   // Fast

// Google
google('gemini-2.5-flash')      // Most capable Gemini
google('gemini-2.0-flash')      // Balanced
google('gemini-2.0-flash-lite') // Fastest
```

## System Prompts

```typescript
const result = await generateText({
  model,
  system: 'You are a helpful assistant.',
  prompt: 'User question here',
});
```

## Messages Format

```typescript
const result = await generateText({
  model,
  messages: [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
    { role: 'user', content: 'How are you?' },
  ],
});
```

## Define a Tool

```typescript
const myTool = tool({
  description: 'Description for the LLM',
  inputSchema: z.object({
    param: z.string().describe('Parameter description'),
  }),
  execute: async ({ param }) => {
    // Your code here
    return { result: 'success' };
  },
});
```

## Use Tools

```typescript
const result = streamText({
  model,
  messages,
  tools: {
    getTodo: tool({
      description: 'Get a todo item',
      inputSchema: z.object({
        id: z.number(),
      }),
      execute: async ({ id }) => {
        return await fetchTodo(id);
      },
    }),
    createTodo: tool({
      description: 'Create a todo',
      inputSchema: z.object({
        title: z.string(),
        done: z.boolean(),
      }),
      execute: async ({ title, done }) => {
        return await createTodo({ title, done });
      },
    }),
  },
  stopWhen: [stepCountIs(10)], // Limit agent steps
});
```

## API Route (Backend)

```typescript
// api/chat.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};
```

## React Frontend

```tsx
import { useChat } from '@ai-sdk/react';

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
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

## Persistence (onFinish)

```typescript
return result.toUIMessageStreamResponse({
  onFinish: async ({ messages, responseMessage }) => {
    // messages: full conversation
    // responseMessage: just the new assistant message
    await saveToDatabase(messages);
  },
});
```

## Persistence Pattern

```typescript
export const POST = async (req: Request) => {
  const { messages, chatId } = await req.json();

  // Load existing chat
  let chat = await getChat(chatId);

  // Create if new
  if (!chat) {
    chat = await createChat(chatId, messages);
  } else {
    // Append user message
    const lastMessage = messages[messages.length - 1];
    await appendMessages(chatId, [lastMessage]);
  }

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      // Save assistant message
      await appendMessages(chatId, [responseMessage]);
    },
  });
};
```

## Send Images

```typescript
// Frontend
const fileToDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const dataURL = await fileToDataURL(imageFile);

sendMessage({
  parts: [
    { type: 'text', text: 'Describe this image' },
    { type: 'file', data: dataURL, mimeType: imageFile.type },
  ],
});
```

## Custom Workflow

```typescript
// Step 1
const step1 = await generateText({
  model,
  prompt: 'Generate outline',
});

// Step 2
const step2 = await generateText({
  model,
  prompt: `Write draft based on: ${step1.text}`,
});

// Step 3 (stream final)
const final = streamText({
  model,
  prompt: `Refine this: ${step2.text}`,
});

return final.toUIMessageStreamResponse();
```

## Custom Stream

```typescript
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    writer.write({ type: 'start' });

    // Your custom logic
    const result = streamText({ model, prompt: '...' });

    // Merge LLM stream
    writer.merge(result.toUIMessageStream());
  },
});

return createUIMessageStreamResponse({ stream });
```

## Error Handling

```typescript
try {
  const result = await generateText({ model, prompt });
  return result.text;
} catch (error) {
  console.error('LLM error:', error);
  return 'Sorry, an error occurred.';
}
```

## Track Usage

```typescript
const result = await generateText({ model, prompt });

console.log(result.usage);
// {
//   promptTokens: 10,
//   completionTokens: 50,
//   totalTokens: 60
// }

// Calculate cost
const cost =
  (result.usage.promptTokens / 1000) * INPUT_COST_PER_1K +
  (result.usage.completionTokens / 1000) * OUTPUT_COST_PER_1K;
```

## Evals with Evalite

```typescript
import { evalite } from 'evalite';
import { generateText } from 'ai';

evalite('Test Name', {
  data: () => [
    { input: 'Question 1', expected: 'Answer 1' },
    { input: 'Question 2', expected: 'Answer 2' },
  ],
  task: async (input) => {
    const result = await generateText({ model, prompt: input });
    return result.text;
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

## Guardrails Pattern

```typescript
// 1. Check safety
const guardrail = await generateText({
  model: google('gemini-2.0-flash-lite'),
  system: 'Return 0 for unsafe, 1 for safe',
  messages: modelMessages,
  maxTokens: 1,
});

// 2. Block if unsafe
if (guardrail.text.trim() === '0') {
  return new Response("I can't assist with that.");
}

// 3. Process if safe
const result = streamText({ model, messages });
return result.toUIMessageStreamResponse();
```

## Model Router Pattern

```typescript
// 1. Determine complexity
const router = await generateText({
  model: google('gemini-2.0-flash-lite'),
  system: 'Return 0 for simple, 1 for complex',
  messages: modelMessages,
  maxTokens: 1,
});

// 2. Select model
const model =
  router.text.trim() === '1'
    ? google('gemini-2.5-flash') // Complex
    : google('gemini-2.0-flash-lite'); // Simple

// 3. Generate response
const result = streamText({ model, messages });
```

## Common Parameters

```typescript
streamText({
  model,
  messages,
  system: 'System prompt',
  temperature: 0.7,        // 0-2, higher = more random
  maxTokens: 1000,         // Max output tokens
  topP: 0.9,               // Nucleus sampling
  frequencyPenalty: 0,     // -2 to 2
  presencePenalty: 0,      // -2 to 2
  stopWhen: [stepCountIs(10)], // For tool calling
  tools: { /* ... */ },
  metadata: { /* ... */ },
});
```

## Message Parts Types

```typescript
// Text part
{ type: 'text', text: 'Hello' }

// Tool call part
{
  type: 'tool-writeFile',
  toolCallId: 'abc',
  state: 'output-available',
  input: { path: 'file.txt', content: 'Hello' },
  output: { success: true }
}

// Step marker
{ type: 'step-start' }

// File/Image part
{
  type: 'file',
  data: 'data:image/png;base64,...',
  mimeType: 'image/png'
}
```

## Prompt Template

```typescript
const buildPrompt = (context: string, question: string) => `
<task-context>
  High-level task description
</task-context>

<background-data>
  ${context}
</background-data>

<rules>
  - Rule 1
  - Rule 2
</rules>

<the-ask>
  ${question}
</the-ask>

<output-format>
  Specify format here
</output-format>
`;
```

## Environment Variables

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true
  }
}
```

## Debugging

```typescript
// Log full response
const result = await generateText({ model, prompt });
console.log('Full result:', result);

// Log usage
console.log('Tokens used:', result.usage);

// Time operations
console.time('LLM call');
const result = await generateText({ model, prompt });
console.timeEnd('LLM call');

// Log stream events
for await (const event of stream.toUIMessageStream()) {
  console.log('Event:', event.type, event);
}
```

## Common Errors

```typescript
// Rate limit - retry with backoff
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}

// Context too large - truncate messages
function truncateMessages(messages: UIMessage[], maxTokens: number) {
  // Keep system + last N messages that fit
  // ... implementation
}

// Invalid API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}
```

---

## Quick Patterns

### Simple Chat
```typescript
streamText({ model, messages: convertToModelMessages(messages) })
  .toUIMessageStreamResponse()
```

### Chat + Tools
```typescript
streamText({
  model,
  messages: convertToModelMessages(messages),
  tools: { myTool },
  stopWhen: [stepCountIs(10)],
}).toUIMessageStreamResponse()
```

### Chat + Persistence
```typescript
streamText({ model, messages })
  .toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      await save(responseMessage);
    },
  })
```

### Workflow (Sequential)
```typescript
const step1 = await generateText({ model, prompt: '...' });
const step2 = await generateText({ model, prompt: step1.text });
streamText({ model, prompt: step2.text }).toUIMessageStreamResponse()
```

### Workflow (Parallel)
```typescript
const [r1, r2, r3] = await Promise.all([
  generateText({ model, prompt: '1' }),
  generateText({ model, prompt: '2' }),
  generateText({ model, prompt: '3' }),
]);
```

---

For detailed explanations, see:
- [AI SDK V5 Complete Guide](./AI-SDK-V5-Complete-Guide.md)
- [Advanced Patterns](./Advanced-Patterns.md)
