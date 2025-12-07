import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import { google } from '@ai-sdk/google';
import {
  createChat,
  getChat,
  appendToChatMessages,
} from './persistence-layer.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[]; id: string } =
    await req.json();
  const { messages, id } = body;

  const mostRecentMessage = messages[messages.length - 1];

  if (!mostRecentMessage) {
    return new Response('No messages provided', { status: 400 });
  }

  if (mostRecentMessage.role !== 'user') {
    return new Response('Last message must be from the user', {
      status: 400,
    });
  }

  const chat = TODO; // TODO: Get the existing chat

  if (!chat) {
    // TODO: If the chat doesn't exist, create it with the id
  } else {
    // TODO: Otherwise, append the most recent message to the chat
  }

  // TODO: wait for the stream to finish and append the
  // last message to the chat
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};

// http://localhost:3000/api/chat?chatId=123
export const GET = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const chatId = url.searchParams.get('chatId');

  if (!chatId) {
    return new Response('No chatId provided', { status: 400 });
  }

  const chat = await getChat(chatId);

  return new Response(JSON.stringify(chat), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
