In 01.10, we used `generateText` with `Output.object` to get structured data from an LLM. But what if we want to stream that structured data as it's being generated?

Just like we can use `streamText` instead of `generateText` for streaming text, we can use `streamText` with `Output.object` to stream structured objects.

## The Problem

Our starting code uses `generateText` with `Output.object` to get facts about an imaginary planet:

```typescript
const factsResult = await generateText({
  model,
  prompt: `Give me some facts about the imaginary planet...`,
  output: Output.object({
    schema: z.object({
      facts: z.array(z.string()).describe('...'),
    }),
  }),
});

console.log(factsResult.output);
```

This works, but we have to wait for the entire response before we see any output.

## The Challenge: Stream the Structured Object

Your task is to convert the `generateText` call to `streamText`, keeping the same `Output.object` configuration.

Then, instead of logging `factsResult.output`, iterate over `factsResult.partialObjectStream` to see partial objects as they arrive:

```typescript
for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}
```

When you run this exercise, you should see:

1. The text of the story streaming in first
2. A series of object logs showing the current shape of the facts object as it's being generated

The partial objects will show incremental updates like:
- `{ facts: [] }`
- `{ facts: ['The planet...'] }`
- `{ facts: ['The planet...', 'Its atmosphere...'] }`

## Steps To Complete

- [ ] Replace `generateText` with `streamText` (no `await` needed)

- [ ] Keep the `Output.object` configuration exactly the same

- [ ] Replace `console.log(factsResult.output)` with a for-await loop over `factsResult.partialObjectStream`

- [ ] Run the exercise with `pnpm run dev` to see both the streaming text and the structured object being built incrementally
