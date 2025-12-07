Now that we understand tokens at a deeper level, let's talk about one of the biggest constraints on LLM applications today, which is the LLM's context window.

Every LLM out there will have some kind of hard-coded context window - the limit of the number of tokens it can see at any one time. The context window represents the input tokens and the output tokens - in other words, the total number of tokens that the LLM can see.

In this exercise, I'm going to show you what happens when you overflow the context window.

## Demonstrating Context Window Limits

In our exercise, we're going to create an enormous input text of 10 million tokens. Each one is simply going to be "foo".

```typescript
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
```

We're going to log out the number of those tokens, just to check their length. Then, we'll call an LLM with them.

```typescript
const tokens = tokenize(text);

console.log(`Tokens length: ${tokens.length}`);
```

## A Note On `maxRetries`

By default, `generateText` and `streamText` retry the LLM call three times if it fails. This is useful in a production setting, since it helps make the apps more resilient to failures.

However, we're expecting it to fail, so we're going to set it to zero:

```typescript
await generateText({
  model: google('gemini-2.5-flash-lite'),
  prompt: text,
  maxRetries: 0,
});
```

When I run this with Gemini, I end up with an error: "You have exceeded your current quota."

Different model providers throw different errors. For instance, Anthropic will simply validate it and say the request is too large. But the concept here is the same: we have passed too much information to the LLM.

## Understanding Context Window Limitations

So that is what a context window is: the total number of input and output tokens that the LLM can see at any one time.

Different models have different sizes of context windows which make them better at different things. Some models are relatively simple, but have large context windows. Some models are much smarter, but can see relatively less.

I recommend you try this out with one of your favorite models. BEAR IN MIND that if you get this wrong, if you, let's say, just add in just under the maximum number of tokens, then you will be billed for all of those tokens.

Good luck, and I will see you in the next one.

## Steps To Complete

- [ ] Examine the code to understand how we're creating a very large text to test context window limits

- [ ] Run the code using `pnpm run dev` to see what happens when the context window is exceeded
  - Observe the error message that appears in the terminal

- [ ] Try using a different model by changing the `model` parameter in the `generateText` call
  - Different models have different context window sizes

- [ ] Notice how different model providers return different types of errors for context window overflows
