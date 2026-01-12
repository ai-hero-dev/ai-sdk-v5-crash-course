Most of the time, you don't just want text back from an LLM—you want that text in a structured format. Imagine generating a story about an imaginary planet, then extracting facts from it as a clean array of strings.

The [AI SDK](https://ai-sdk.dev/docs/introduction) makes this incredibly easy. Instead of asking the model for text and then parsing it yourself (or validating it with a library like [Zod](https://zod.dev)), you can use structured output support built right into the framework.

There are actually two ways to do this in the AI SDK. One approach is more aligned with version 5, the other with version 6—but both work in version 6. Your task is to implement the structured output generation.

## Steps To Complete

- [ ] Stream text to the terminal using [`streamText()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text)

Start by streaming a paragraph of a story about an imaginary planet to the terminal.

```ts
const stream = streamText({
  model,
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;
```

- [ ] Call [`generateText()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text) with structured output support

After the text finishes streaming, call `generateText()` with a prompt asking for facts about the planet. Pass in the `finalText` from the previous step.

```ts
// TODO: Replace this with a call to generateText, passing:
// - The model, same as above
// - The prompt, asking for facts about the imaginary planet,
//   passing in the finalText as the story
// - The output, which should be Output.object({}), passing
//   the schema: z.object({
//     facts: z.array(z.string()).describe('The facts about the imaginary planet. Write as if you are a scientist.'),
//   })
const factsResult = TODO;
```

You'll need to import [`Output`](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data) from the AI SDK alongside `generateText`.

- [ ] Use the [`Output.object()`](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data) method to define structured output

Pass an object with a `schema` property. The schema should be a [Zod](https://zod.dev) object with a `facts` field containing an array of strings.

<Spoiler>

```ts
output: Output.object({
  schema: z.object({
    facts: z
      .array(z.string())
      .describe(
        'The facts about the imaginary planet. Write as if you are a scientist.',
      ),
  }),
});
```

</Spoiler>

Remember to use [`.describe()`](https://zod.dev/metadata) on your fields to guide the model toward better outputs.

- [ ] Log the structured result

Access the output from your result object and log it to the terminal.

```ts
console.log(factsResult.output);
```

- [ ] Run your solution

Execute your code with `pnpm run dev` and verify that:

1. The planet story streams to the terminal
2. The facts are returned as a structured object with an array of strings
3. The facts sound like they're written by a scientist

- [ ] (Optional) Try the alternative approach

Once you've completed the exercise, check if you can implement the version 6 solution using [`generateObject()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-object) instead of `generateText()` with `Output.object()`. Both approaches work, but one is the newer pattern.
