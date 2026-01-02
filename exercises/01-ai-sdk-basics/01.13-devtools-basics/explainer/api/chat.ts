import { google } from '@ai-sdk/google';
import { devToolsMiddleware } from '@ai-sdk/devtools';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  wrapLanguageModel,
  type ModelMessage,
  type UIMessage,
} from 'ai';

// Wrap the model with DevTools middleware
// Run `npx @ai-sdk/devtools` in a separate terminal
// Then open http://localhost:4983 to see LLM calls
const model = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: devToolsMiddleware(),
});

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    await convertToModelMessages(messages);

  const result = streamText({
    model,
    messages: modelMessages,
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
};
