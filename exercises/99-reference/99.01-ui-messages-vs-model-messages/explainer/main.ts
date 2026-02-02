import {
  convertToModelMessages,
  type ModelMessage,
  type UIMessage,
} from 'ai';

const messages: UIMessage[] = [
  {
    role: 'user',
    id: '1',
    parts: [
      {
        type: 'text',
        text: 'What is the capital of France?',
      },
    ],
  },
  {
    role: 'assistant',
    id: '2',
    parts: [
      {
        type: 'text',
        text: 'The capital of France is Paris.',
      },
    ],
  },
];

const main = async () => {
  const modelMessages = await convertToModelMessages(messages);
  console.dir(modelMessages, { depth: null });
};

main();
