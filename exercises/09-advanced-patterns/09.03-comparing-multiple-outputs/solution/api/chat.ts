import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type AsyncIterableStream,
  type ModelMessage,
  type StreamTextResult,
  type UIMessage,
  type UIMessageStreamWriter,
} from 'ai';

export type MyMessage = UIMessage<
  never,
  {
    output: {
      model: string;
      text: string;
    };
  }
>;

const streamModelText = async (opts: {
  textStream: AsyncIterableStream<string>;
  model: string;
  writer: UIMessageStreamWriter<MyMessage>;
}) => {
  const partId = crypto.randomUUID();

  let fullText = '';

  for await (const text of opts.textStream) {
    fullText += text;

    opts.writer.write({
      type: 'data-output',
      data: {
        model: opts.model,
        text: fullText,
      },
      id: partId,
    });
  }
};

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: MyMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    await convertToModelMessages(messages);

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      const firstStreamResult = streamText({
        model: google('gemini-2.5-flash-lite'),
        messages: modelMessages,
      });

      const secondStreamResult = streamText({
        model: google('gemini-2.5-flash'),
        messages: modelMessages,
      });

      await Promise.all([
        streamModelText({
          textStream: firstStreamResult.textStream,
          model: 'Gemini 2.5 Flash Lite',
          writer,
        }),
        streamModelText({
          textStream: secondStreamResult.textStream,
          model: 'Gemini 2.5 Flash',
          writer,
        }),
      ]);
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
