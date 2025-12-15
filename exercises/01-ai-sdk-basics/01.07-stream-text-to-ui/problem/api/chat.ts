import { google } from '@ai-sdk/google';
import {
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  // TODO: get the UIMessage[] from the body
  const messages: UIMessage[] = TODO;

  // TODO: convert the UIMessage[] to ModelMessage[]
  const modelMessages: ModelMessage[] = TODO;

  // TODO: pass the modelMessages to streamText
  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
  });

  // TODO: create a UIMessageStream from the streamTextResult
  const stream = TODO;

  return createUIMessageStreamResponse({
    stream,
  });
};
