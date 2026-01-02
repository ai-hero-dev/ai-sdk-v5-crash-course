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
import { GUARDRAIL_SYSTEM } from './guardrail-prompt.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    await convertToModelMessages(messages);

  const stream = createUIMessageStream<UIMessage>({
    execute: async ({ writer }) => {
      console.time('Guardrail Time');
      // TODO: Use generateText to call a model, passing in the modelMessages
      // and the GUARDRAIL_SYSTEM prompt.
      //
      const guardrailResult = TODO;

      console.timeEnd('Guardrail Time');

      console.log(
        'guardrailResult',
        guardrailResult.text.trim(),
      );

      // TODO: If the guardrailResult is '0', write a standard reply
      // to the frontend using text-start, text-delta, and text-end
      // parts. Then, do an early return to prevent the rest of the
      // stream from running.
      // (make sure you trim the guardrailResult.text before checking it)
      if (TODO) {
      }

      const streamTextResult = streamText({
        model: google('gemini-2.5-flash'),
        messages: modelMessages,
      });

      writer.merge(streamTextResult.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
