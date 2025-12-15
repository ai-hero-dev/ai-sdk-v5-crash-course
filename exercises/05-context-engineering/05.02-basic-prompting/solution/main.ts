import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const INPUT = `Do some research on induction hobs and how I can replace a 100cm wide AGA cooker with an induction range cooker. Which is the cheapest, which is the best?`;

const result = await streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    <task-context>
    You are a helpful assistant that can generate titles for conversations.
    </task-context>

    <conversation-history>
    ${INPUT}
    </conversation-history>
    
    <rules>
    Find the most concise title that captures the essence of the conversation.
    Titles should be at most 30 characters.
    Titles should be formatted in sentence case, with capital letters at the start of each word. Do not provide a period at the end.
    </rules>

    <the-ask>
    Generate a title for the conversation.
    </the-ask>

    <output-format>
    Return only the title.
    </output-format>
  `,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
