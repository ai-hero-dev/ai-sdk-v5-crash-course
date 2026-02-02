import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';

export type MyUIMessage = UIMessage<{
  duration: number;
}>;

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyUIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
  });

  const startTime = Date.now();

  return result.toUIMessageStreamResponse<MyUIMessage>({
    messageMetadata({ part }) {
      if (part.type === 'finish') {
        return {
          duration: Date.now() - startTime,
        };
      }

      return undefined;
    },
  });
};
