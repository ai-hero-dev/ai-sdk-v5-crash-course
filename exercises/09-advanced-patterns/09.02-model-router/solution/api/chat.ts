import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

const ADVANCED_MODEL = google('gemini-2.5-flash');
const BASIC_MODEL = google('gemini-2.5-flash-lite');

export type MyMessage = UIMessage<{
  model: 'advanced' | 'basic';
}>;

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: MyMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    await convertToModelMessages(messages);

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      console.time('Model Calculation Time');
      const modelRouterResult = await generateText({
        model: BASIC_MODEL,
        system: `
          You are a model router. Your job is to figure out whether to use an advanced model or a basic model.

          You will be given a conversation history. You will need to determine whether to use an advanced model or a basic model, based on the question being asked.

          <rules>
            - If the question is about something trivial, use the basic model.
            - If the question involves any kind of counting or math, use the advanced model.
          </rules>

          <output-format>
            Return a single number: 0 or 1.
            Return 0 to choose the basic model.
            Return 1 to choose the advanced model.
          </output-format>
        `,
        messages: modelMessages,
      });

      console.timeEnd('Model Calculation Time');
      console.log(
        'modelRouterResult',
        modelRouterResult.text.trim(),
      );

      const modelSelected =
        modelRouterResult.text.trim() === '1'
          ? 'advanced'
          : // Note that the fallback is the basic model
            'basic';

      const streamTextResult = streamText({
        model:
          modelSelected === 'advanced'
            ? ADVANCED_MODEL
            : BASIC_MODEL,
        messages: modelMessages,
      });

      writer.merge(
        streamTextResult.toUIMessageStream({
          messageMetadata: ({ part }) => {
            if (part.type === 'start') {
              return {
                model: modelSelected,
              };
            }
          },
        }),
      );
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
