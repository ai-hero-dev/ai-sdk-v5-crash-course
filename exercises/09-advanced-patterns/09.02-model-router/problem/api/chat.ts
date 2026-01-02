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
      // TODO: Use generateText to call a model, passing in the modelMessages
      // and writing your own system prompt.
      const modelRouterResult = TODO;

      console.timeEnd('Model Calculation Time');
      console.log(
        'modelRouterResult',
        modelRouterResult.text.trim(),
      );

      // TODO: Use the modelRouterResult to determine which model to use.
      // If we can't determine which model to use, use the basic model.
      const modelSelected: 'advanced' | 'basic' = TODO;

      const streamTextResult = streamText({
        model:
          modelSelected === 'advanced'
            ? ADVANCED_MODEL
            : BASIC_MODEL,
        messages: modelMessages,
      });

      writer.merge(
        streamTextResult.toUIMessageStream({
          // TODO: Add the model to the message metadata, so that
          // the frontend can display it.
          messageMetadata: TODO,
        }),
      );
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
