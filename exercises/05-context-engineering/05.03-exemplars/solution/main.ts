import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const INPUT = `Do some research on induction hobs and how I can replace a 100cm wide AGA cooker with an induction range cooker. Which is the cheapest, which is the best?`;

const exemplars = [
  {
    input: `What's the difference between TypeScript and JavaScript? Should I learn TypeScript first or JavaScript?`,
    expected: 'TypeScript vs JavaScript Comparison',
  },
  {
    input: `I want to start investing but I'm a complete beginner. What are the safest options for someone with $5000 to invest?`,
    expected: 'Beginner Investment Options',
  },
];

const result = await streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    <examples>
      ${exemplars
        .map(
          (e) =>
            `
          <example>
            <input>${e.input}</input>
            <expected>${e.expected}</expected>
          </example>
          `,
        )
        .join('\n')}
    </examples>
    
    <conversation-history>
    ${INPUT}
    </conversation-history>

    <the-ask>
    Generate a title for the conversation.
    </the-ask>
  `,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
