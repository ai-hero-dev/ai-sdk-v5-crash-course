import { google } from '@ai-sdk/google';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type UIMessage,
} from 'ai';

// TODO: replace all instances of UIMessage with MyMessage
export type MyMessage = UIMessage<
  unknown,
  {
    // TODO: declare custom data parts here
  }
>;

const formatMessageHistory = (messages: UIMessage[]) => {
  return messages
    .map((message) => {
      return `${message.role}: ${message.parts
        .map((part) => {
          if (part.type === 'text') {
            return part.text;
          }

          return '';
        })
        .join('')}`;
    })
    .join('\n');
};

const WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM = `You are writing a Slack message for a user based on the conversation history. Only return the Slack message, no other text.`;
const EVALUATE_SLACK_MESSAGE_SYSTEM = `You are evaluating the Slack message produced by the user.

  Evaluation criteria:
  - The Slack message should be written in a way that is easy to understand.
  - It should be appropriate for a professional Slack conversation.
`;
const WRITE_SLACK_MESSAGE_FINAL_SYSTEM = `You are writing a Slack message based on the conversation history, a first draft, and some feedback given about that draft.

  Return only the final Slack message, no other text.
`;

export const POST = async (req: Request): Promise<Response> => {
  // TODO: change to MyMessage[]
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      // TODO: write a { type: 'start' } message via writer.write
      TODO;

      // TODO - change to streamText and write to the stream as custom data parts
      const writeSlackResult = await generateText({
        model: google('gemini-2.5-flash'),
        system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}
        `,
      });

      // TODO - change to streamText and write to the stream as custom data parts
      const evaluateSlackResult = await generateText({
        model: google('gemini-2.5-flash'),
        system: EVALUATE_SLACK_MESSAGE_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          Slack message:
          ${writeSlackResult.text}
        `,
      });

      const finalSlackAttempt = streamText({
        model: google('gemini-2.5-flash'),
        system: WRITE_SLACK_MESSAGE_FINAL_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          First draft:
          ${writeSlackResult.text}

          Previous feedback:
          ${evaluateSlackResult.text}
        `,
      });

      // TODO: merge the final slack attempt into the stream,
      // sending sendStart: false
      writer.TODO;
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
