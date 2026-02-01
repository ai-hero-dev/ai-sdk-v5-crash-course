import { google } from '@ai-sdk/google';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type UIMessage,
} from 'ai';

export type MyMessage = UIMessage<
  unknown,
  {
    'slack-message': string;
    'slack-message-feedback': string;
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
  const body: { messages: MyMessage[] } = await req.json();
  const { messages } = body;

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      writer.write({
        type: 'start',
      });

      // Write Slack message
      const writeSlackResult = streamText({
        model: google('gemini-2.5-flash'),
        system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}
        `,
      });

      const firstDraftId = crypto.randomUUID();

      let firstDraft = '';

      for await (const part of writeSlackResult.textStream) {
        firstDraft += part;

        writer.write({
          type: 'data-slack-message',
          data: firstDraft,
          id: firstDraftId,
        });
      }

      // Evaluate Slack message
      const evaluateSlackResult = streamText({
        model: google('gemini-2.5-flash'),
        system: EVALUATE_SLACK_MESSAGE_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          Slack message:
          ${firstDraft}
        `,
      });

      const feedbackId = crypto.randomUUID();

      let feedback = '';

      for await (const part of evaluateSlackResult.textStream) {
        feedback += part;

        writer.write({
          type: 'data-slack-message-feedback',
          data: feedback,
          id: feedbackId,
        });
      }

      // Write final Slack message
      const finalSlackAttempt = streamText({
        model: google('gemini-2.5-flash'),
        system: WRITE_SLACK_MESSAGE_FINAL_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          First draft:
          ${firstDraft}

          Previous feedback:
          ${feedback}
        `,
      });

      writer.merge(
        finalSlackAttempt.toUIMessageStream({
          sendStart: false,
        }),
      );
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
