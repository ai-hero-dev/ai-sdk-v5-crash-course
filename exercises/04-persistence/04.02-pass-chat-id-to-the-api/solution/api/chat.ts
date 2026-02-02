import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import { google } from '@ai-sdk/google';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[]; id: string } =
    await req.json();
  const { messages, id } = body;

  console.log('id', id);

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};
