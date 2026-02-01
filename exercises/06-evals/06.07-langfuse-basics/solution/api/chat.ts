import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';
import { langfuse } from './langfuse.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    convertToModelMessages(messages);

  const trace = langfuse.trace({
    sessionId: body.id,
  });

  const mostRecentMessage = messages[messages.length - 1];

  if (!mostRecentMessage) {
    return new Response('No messages provided', { status: 400 });
  }

  const mostRecentMessageText = mostRecentMessage.parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text;
      }
      return '';
    })
    .join('');

  const titleResult = generateText({
    model: google('gemini-2.5-flash-lite'),
    prompt: `
      You are a helpful assistant that can generate titles for conversations.

      <conversation-history>
      ${mostRecentMessageText}
      </conversation-history>
      
      Find the most concise title that captures the essence of the conversation.
      Titles should be at most 30 characters.
      Titles should be formatted in sentence case, with capital letters at the start of each word. Do not provide a period at the end.
      Use no punctuation or emojis.
      If there are acronyms used in the conversation, use them in the title.
      Use formal language in the title, like 'troubleshooting', 'discussion', 'support', 'options', 'research', etc.
      Since all items in the list are conversations, do not use the word 'chat', 'conversation' or 'discussion' in the title - it's implied by the UI.
      The title will be used for organizing conversations in a chat application.

      Generate a title for the conversation.
      Return only the title.
    `,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'title-generation',
      metadata: {
        langfuseTraceId: trace.id,
      },
    },
  });

  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
    messages: modelMessages,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'chat',
      metadata: {
        langfuseTraceId: trace.id,
      },
    },
  });

  const stream = streamTextResult.toUIMessageStream({
    onFinish: async () => {
      const title = await titleResult;

      console.log('title: ', title.text);

      await langfuse.flushAsync();
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
