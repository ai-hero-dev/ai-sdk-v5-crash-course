import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamObject,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';
import { z } from 'zod';

export type MyMessage = UIMessage<
  never,
  {
    suggestions: string[];
  }
>;

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    convertToModelMessages(messages);

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      const streamTextResult = streamText({
        model: google('gemini-2.5-flash'),
        messages: modelMessages,
      });

      writer.merge(streamTextResult.toUIMessageStream());

      await streamTextResult.consumeStream();

      const followupSuggestionsResult = streamObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
          suggestions: z.array(z.string()),
        }),
        messages: [
          ...modelMessages,
          {
            role: 'assistant',
            content: await streamTextResult.text,
          },
          {
            role: 'user',
            content:
              'What question should I ask next? Return an array of suggested questions.',
          },
        ],
      });

      const dataPartId = crypto.randomUUID();

      for await (const chunk of followupSuggestionsResult.partialObjectStream) {
        writer.write({
          id: dataPartId,
          type: 'data-suggestions',
          data:
            chunk.suggestions?.filter(
              (suggestion) => suggestion !== undefined,
            ) ?? [],
        });
      }
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
