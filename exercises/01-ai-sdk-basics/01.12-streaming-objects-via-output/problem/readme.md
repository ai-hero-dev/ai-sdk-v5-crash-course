Generating objects is useful, but we can do better. When working with LLMs, we should always consider streaming - since LLMs generate tokens one at a time, waiting for the entire response can feel slow to users.

Instead of waiting for the complete object to be generated, we can stream the partial results as they arrive. This gives users immediate feedback and a more satisfying experience.

The good news? Making this change requires minimal modifications to your existing code.

## Steps To Complete

- [ ] Replace `generateText` with [`streamText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) in your facts generation code

Keep the same [`Output.object()`](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data) configuration with your facts schema.

```ts
// Change from generateText to streamText
const factsResult = streamText({
  model,
  prompt: `Give me some facts about the imaginary planet. Here's the story: ${finalText}`,
  output: Output.object({
    schema: z.object({
      facts: z
        .array(z.string())
        .describe(
          'The facts about the imaginary planet. Write as if you are a scientist.',
        ),
    }),
  }),
});
```

- [ ] Replace the console.log with a [`for await...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loop over [`partialObjectStream`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text)

Instead of logging the final output once, iterate over the streaming chunks as they arrive.

```ts
// TODO: Replace this with a for-await loop over factsResult.partialObjectStream
// Log each partial object as it arrives
console.log(factsResult.output);
```

Each iteration will log a partial object that's been built up so far. You might see an empty facts array initially, then a few facts, then more facts - all arriving progressively.

<Spoiler>

```ts
for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}
```

</Spoiler>

- [ ] Run the file and observe the streaming behavior

Execute your code with `pnpm run dev` and watch as the facts array is built up over time instead of appearing all at once at the end.
