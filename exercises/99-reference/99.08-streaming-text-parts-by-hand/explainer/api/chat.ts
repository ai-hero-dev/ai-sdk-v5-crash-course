import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';

export type MyMessage = UIMessage<unknown, {}>;

const text = `Hello, friend! How are you? My name's Matthew. It's a pleasure to meet you today. I hope you're having a wonderful day so far. I wanted to introduce myself and let you know that I'm here to help with anything you might need. Whether you have questions, need assistance with a project, or just want to chat, feel free to reach out. I enjoy learning new things, meeting new people, and working together to solve interesting problems. So, tell me a bit about yourself! What brings you here today, and how can I assist you?`;

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      const textPartId = crypto.randomUUID();

      writer.write({
        type: 'text-start',
        id: textPartId,
      });

      const splitText = text.split(' ');

      for (const word of splitText) {
        writer.write({
          type: 'text-delta',
          delta: word + ' ',
          id: textPartId,
        });

        await new Promise((resolve) => setTimeout(resolve, 50));
      }

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
