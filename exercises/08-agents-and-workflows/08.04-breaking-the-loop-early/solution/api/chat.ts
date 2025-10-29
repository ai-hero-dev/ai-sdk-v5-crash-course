import { google } from '@ai-sdk/google';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamObject,
  streamText,
  type UIMessage,
} from 'ai';
import z from 'zod';

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

        mostRecentDraft = firstDraft;

        // Evaluate Slack message
        const evaluateSlackResult = streamObject({
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
          schema: z.object({
            feedback: z
              .string()
              .optional()
              .describe(
                'The feedback about the most recent draft. Only return this if the draft is not good enough.',
              ),
            isGoodEnough: z
              .boolean()
              .describe(
                'Whether the most recent draft is good enough to stop the loop.',
              ),
          }),
        });

        const feedbackId = crypto.randomUUID();

        for await (const part of evaluateSlackResult.partialObjectStream) {
          if (part.feedback) {
            writer.write({
              type: 'data-slack-message-feedback',
              data: part.feedback,
              id: feedbackId,
            });
          }
        }

        const finalEvaluationObject =
          await evaluateSlackResult.object;

        // If the draft is good enough, break the loop
        if (finalEvaluationObject.isGoodEnough) {
          break;
        }

        if (!finalEvaluationObject.feedback) {
          throw new Error('No feedback provided by the LLM.');
        }

        mostRecentFeedback = finalEvaluationObject.feedback;

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
