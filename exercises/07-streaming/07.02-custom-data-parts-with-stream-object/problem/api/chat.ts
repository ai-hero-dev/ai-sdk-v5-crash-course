import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

export type MyMessage = UIMessage<
  never,
  {
    // TODO: Change the type to 'suggestions' and
    // make it an array of strings
    suggestion: string;
  }
>;

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    await convertToModelMessages(messages);

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      const streamTextResult = streamText({
        model: google('gemini-2.5-flash'),
        messages: modelMessages,
      });

      writer.merge(streamTextResult.toUIMessageStream());

      await streamTextResult.consumeStream();

      // TODO: Change the streamText call to streamObject,
      // since we'll need to use structured outputs to reliably
      // generate multiple suggestions
      const followupSuggestionsResult = streamText({
        model: google('gemini-2.5-flash'),
        // TODO: Define the schema for the suggestions
        // using zod
        schema: TODO,
        messages: [
          ...modelMessages,
          {
            role: 'assistant',
            content: await streamTextResult.text,
          },
          {
            role: 'user',
            content:
              // TODO: Change the prompt to tell the LLM
              // to return an array of suggestions
              'What question should I ask next? Return only the question text.',
          },
        ],
      });

      const dataPartId = crypto.randomUUID();

      let fullSuggestion = '';

      // TODO: Update this to iterate over the partialObjectStream
      for await (const chunk of followupSuggestionsResult.textStream) {
        fullSuggestion += chunk;

        // TODO: Update this to write the data part
        // with the suggestions array. You might need
        // to filter out undefined suggestions.
        writer.write({
          id: dataPartId,
          type: 'data-suggestion',
          data: fullSuggestion,
        });
      }
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
