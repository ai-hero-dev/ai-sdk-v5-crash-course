import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type InferUITools,
  type UIMessage,
} from 'ai';
import { z } from 'zod';

const tools = {
  sendEmail: tool({
    description: 'Send an email to a recipient',
    inputSchema: z.object({
      to: z.string().describe('The email address of the recipient'),
      subject: z.string().describe('The subject of the email'),
      body: z.string().describe('The body of the email'),
    }),
    needsApproval: true,
    execute: async ({ to, subject, body }) => {
      // In a real app, this would send an email
      console.log(`Sending email to ${to}: ${subject}`);
      return { sent: true, to, subject };
    },
  }),
};

export type MyUIMessage = UIMessage<
  never,
  never,
  InferUITools<typeof tools>
>;

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
    system: `
      You are a helpful email assistant. You can send emails on behalf of the user.

      When the user asks you to send an email, use the sendEmail tool.
      Always confirm the email details before sending.
    `,
    tools,
    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse();
};
