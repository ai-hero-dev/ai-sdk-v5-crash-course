import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { evalite } from 'evalite';
import { readFileSync } from 'fs';
import Papa from 'papaparse';
import path from 'path';

const csvFile = readFileSync(
  path.join(import.meta.dirname, '../../titles-dataset.csv'),
  'utf-8',
);

const data = Papa.parse<{ Input: string; Output: string }>(
  csvFile,
  {
    header: true,
    skipEmptyLines: true,
  },
);

const EVAL_DATA_SIZE = 10;

const dataForEvalite = data.data
  .slice(0, 0 + EVAL_DATA_SIZE)
  .map((row) => ({
    input: row.Input,
    expected: row.Output,
  }));

evalite('Chat Title Generation', {
  data: () => dataForEvalite,
  task: async (input) => {
    const result = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: `
        You are a helpful assistant that can generate titles for conversations. The title will be used for organizing conversations in a chat application.

        <conversation-history>
        ${input}
        </conversation-history>
        
        Find the most concise title that captures the essence of the conversation.
        Titles should be at most 30 characters.
        Titles should be formatted in sentence case, with capital letters at the start of each word. Do not provide a period at the end.
        Use no punctuation or emojis.
        If there are acronyms used in the conversation, use them in the title.
        Use formal language in the title, like 'troubleshooting', 'discussion', 'support', 'options', 'research', etc.
        Since all items in the list are conversations, do not use the word 'chat', 'conversation' or 'discussion' in the title - it's implied by the UI.
        
        Generate a title for the conversation.
        Return only the title.
      `,
    });

    return result.text;
  },
  scorers: [],
});
