import { google } from '@ai-sdk/google';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
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

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyMessage[] } = await req.json();
  const { messages } = body;

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      writer.write({
        type: 'start',
      });

      let step = 0;
      let mostRecentDraft = '';
      let mostRecentFeedback = '';

      while (step < 2) {
        // Write Slack message
        const writeSlackResult = streamText({
          model: google('gemini-2.0-flash-001'),
          system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM,
          prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          Previous draft (if any):
          ${mostRecentDraft}

          Previous feedback (if any):
          ${mostRecentFeedback}
        `,
        });

        const draftId = crypto.randomUUID();

        let draft = '';

        for await (const part of writeSlackResult.textStream) {
          draft += part;

          writer.write({
            type: 'data-slack-message',
            data: draft,
            id: draftId,
          });
        }

        mostRecentDraft = draft;

        // TODO: change this to streamObject, and get it to return
        // the feedback as a string, as well as whether we should
        // break the loop early (that the message is good enough)
        const evaluateSlackResult = streamText({
          model: google('gemini-2.0-flash-001'),
          system: EVALUATE_SLACK_MESSAGE_SYSTEM,
          prompt: `
            Conversation history:
            ${formatMessageHistory(messages)}

            Most recent draft:
            ${mostRecentDraft}

            Previous feedback (if any):
            ${mostRecentFeedback}
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

        mostRecentFeedback = feedback;

        step++;
      }

      const textPartId = crypto.randomUUID();

      writer.write({
        type: 'text-start',
        id: textPartId,
      });

      writer.write({
        type: 'text-delta',
        delta: mostRecentDraft,
        id: textPartId,
      });

      writer.write({
        type: 'text-end',
        id: textPartId,
      });

      writer.write({
        type: 'finish',
      });
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
