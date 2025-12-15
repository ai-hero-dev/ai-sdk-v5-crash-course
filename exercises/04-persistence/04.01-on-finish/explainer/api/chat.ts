import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    onFinish: ({ response }) => {
      // 'response.messages' is an array of ToolModelMessage and AssistantModelMessage,
      // which are the model messages that were generated during the stream.
      // This is useful if you don't need UIMessages - for simpler applications.
      console.log('streamText.onFinish');
      console.log('  response.messages');
      console.dir(response.messages, { depth: null });
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages, responseMessage }) => {
      // 'messages' is the full message history, including the original messages
      // you pass in to originalMessages.
      console.log('toUIMessageStreamResponse.onFinish');
      console.log('  messages');
      console.dir(messages, { depth: null });

      // 'responseMessage' is the last message in the message history.
      console.log('toUIMessageStreamResponse.onFinish');
      console.log('  responseMessage');
      console.dir(responseMessage, { depth: null });
    },
  });
};
