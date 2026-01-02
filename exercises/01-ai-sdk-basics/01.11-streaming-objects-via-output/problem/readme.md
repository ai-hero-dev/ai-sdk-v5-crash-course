It's nice being able to stream text from an LLM, but sometimes you want that output to be more structured. For instance, you may want it to provide multiple queries that you search Google with.

In other words, sometimes we want text back from the LLM, but sometimes we want _objects_. We want to define the shapes of those objects, pass that shape to the LLM, and then get that shape back.

## The Problem

Our starting code calls `streamText` to generate a story about an imaginary planet:

```typescript
const stream = streamText({
  model,
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});
```

We then write that to `stdout` and await the final text:

```typescript
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;
```

## The Challenge: Stream a Structured Object

Our first to-do is to call `streamObject` from the AI SDK, passing in:

1. The model (Gemini 2.5 Flash)
2. A prompt asking for facts about the imaginary planet
3. A Zod schema defining the structure we want back

Here's where we need to add our code:

```ts
// TODO: Replace this with a call to streamObject, passing:
// - The model, same as above
// - The prompt, asking for facts about the imaginary planet,
//   passing in the finalText as the story
// - The schema, which should be an object with a facts property
//   that is an array of strings
const factsResult = TODO;
```

The schema we need to define should be an object with a `facts` property that's an array of strings. LLMs are very good at working with Zod schemas, so autocomplete should help you define this properly.

## Handling the Stream

After we get our structured data stream, we'll log each chunk of the partial object stream:

```typescript
for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}
```

This will show the object as it's being constructed by the LLM in real-time.

When you run this exercise, you should see:

1. The text of the story streaming in first
2. A series of object logs showing the current shape of the facts object as it's being generated

The final result should be an array of facts about the imaginary planet described in the paragraph that was generated.

## Steps To Complete

- [ ] Call the `streamObject` function and store the result in `factsResult`
  - Import `streamObject` from 'ai' if not already imported

- [ ] Pass the `model` parameter to `streamObject` (same as used with `streamText`)

- [ ] Create a prompt that asks for facts about the imaginary planet
  - Include the `finalText` in your prompt so the LLM knows what story to reference

- [ ] Define a Zod schema for an object with a `facts` property that is an array of strings
  - Import `z` from 'zod' if not already imported
  - Use the `z.array` and `z.string` functions to define the schema
  - Use the `z.describe` function to describe the schema, if you like

- [ ] Run the exercise with `pnpm run dev` to see both the streaming text and the structured object being built
