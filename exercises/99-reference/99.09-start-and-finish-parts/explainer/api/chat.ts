import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
  type UIMessageStreamWriter,
} from 'ai';

const writeTextPart = (
  writer: UIMessageStreamWriter,
  text: string,
) => {
  const textPartId = crypto.randomUUID();
  writer.write({
    type: 'text-start',
    id: textPartId,
  });
  writer.write({
    type: 'text-delta',
    id: textPartId,
    delta: text,
  });
  writer.write({
    type: 'text-end',
    id: textPartId,
  });
};

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    convertToModelMessages(messages);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      // TODO: Try uncommenting this and see what happens
      // writer.write({
      //   type: 'start',
      // });

      writeTextPart(writer, 'Paragraph 1: ');

      const firstParagraphResult = streamText({
        model: google('gemini-2.5-flash-lite'),
        messages: [
          ...modelMessages,
          {
            role: 'user',
            content:
              'Given the conversation history above, write the first paragraph of a story. Make it short.',
          },
        ],
      });

      writer.merge(
        firstParagraphResult.toUIMessageStream({
          // TODO: Try uncommenting these and see what happens
          // sendStart: false,
          // sendFinish: false,
        }),
      );

      const firstParagraph = await firstParagraphResult.text;

      writeTextPart(writer, 'Paragraph 2: ');

      const secondParagraphResult = streamText({
        model: google('gemini-2.5-flash-lite'),
        messages: [
          ...modelMessages,
          {
            role: 'user',
            content: `Given the conversation history above, write the second paragraph of a story. Make it short.
              Here's the first paragraph:
              ${firstParagraph}`,
          },
        ],
      });

      writer.merge(
        secondParagraphResult.toUIMessageStream({
          // TODO: Try uncommenting these and see what happens
          // sendStart: false,
          // sendFinish: false,
        }),
      );

      const secondParagraph = await secondParagraphResult.text;

      writeTextPart(writer, 'Paragraph 3: ');

      const thirdParagraphResult = streamText({
        model: google('gemini-2.5-flash-lite'),
        messages: [
          ...modelMessages,
          {
            role: 'user',
            content: `Given the conversation history above, write the third paragraph of a story. Make it short.
              Here's the first paragraph:
              ${firstParagraph}
              Here's the second paragraph:
              ${secondParagraph}`,
          },
        ],
      });

      writer.merge(
        thirdParagraphResult.toUIMessageStream({
          // TODO: Try uncommenting this and see what happens
          // sendStart: false,
        }),
      );
    },
    onFinish: ({ messages }) => {
      console.dir(messages, { depth: null });
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
