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
      const guardrailResult = await generateText({
        model: google('gemini-2.5-flash-lite'),
        system: GUARDRAIL_SYSTEM,
        messages: modelMessages,
      });

      console.timeEnd('Guardrail Time');

      console.log(
        'guardrailResult',
        guardrailResult.text.trim(),
      );

      if (guardrailResult.text.trim() === '0') {
        const textPartId = crypto.randomUUID();

        writer.write({
          type: 'text-start',
          id: textPartId,
        });

        writer.write({
          type: 'text-delta',
          id: textPartId,
          delta: `We're sorry, but we can't process your request.`,
        });

        writer.write({
          type: 'text-end',
          id: textPartId,
        });

        return;
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
