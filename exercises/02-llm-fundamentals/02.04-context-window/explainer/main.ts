import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

const tokenizer = new Tiktoken(
  // NOTE: o200k_base is the tokenizer for GPT-4o
  o200k_base,
);

const tokenize = (text: string) => {
  return tokenizer.encode(text);
};

let text = '';

const NUMBER_OF_TOKENS = 10_000_000;

for (let i = 0; i < NUMBER_OF_TOKENS; i++) {
  text += 'foo ';
}

const tokens = tokenize(text);

console.log(`Tokens length: ${tokens.length}`);

await generateText({
  model: google('gemini-2.5-flash-lite'),
  prompt: text,
  // NOTE: by default, the AI SDK retries the request 3 times
  // if it fails. We can prevent this by setting maxRetries to 0.
  maxRetries: 0,
});
