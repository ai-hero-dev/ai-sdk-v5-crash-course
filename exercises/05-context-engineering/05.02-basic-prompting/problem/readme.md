In this lesson, we're taking what we've learned to improve a terrible prompt.

We're building something most chat applications need: a way to generate titles for threads. The idea is to take a conversation history and create a short, snappy title that helps people understand what the thread contains.

Looking at our current code:

```typescript
const result = await streamText({
  model: google('gemini-2.5-flash-lite'),
  // TODO: Rewrite this prompt using the Anthropic template from
  // the previous exercise.
  // You will NOT need all of the sections from the template.
  prompt: `
    Generate me a title:
    ${INPUT}
  `,
});
```

The issue with our current prompt is obvious - we're just saying "generate me a title" and passing in the conversation history (`INPUT`). But instead of getting a single title, we're getting back a very long piece of text with multiple title options and explanations:

```
Here are a few title options, ranging from informative to more click-baity:

**Informative & Direct:**

*   Replacing an AGA with Induction: A Guide to 100cm Range Cookers
*   AGA to Induction: Comparing Range Cookers for Size and Performance
...
```

A good output would simply be: "Induction Hobs versus Aga Cookers."

The challenge is to improve this output using the prompt template discussed earlier. You won't need every section of the prompt template - probably just:

- High-level context
- The conversation history
- The ask
- Output formatting (to ensure it only returns the title)

We'll have multiple attempts at this over the next few exercises, so don't worry about getting it perfect. The goal is to apply the template, try it out, and see if we can get a better output.

## Steps To Complete

- [ ] Modify the prompt by adding high-level context about what we're trying to do
  - Explain that we need a short, concise title for a conversation

- [ ] Include a clear "ask" section in the prompt
  - Specify exactly what kind of title we want (short, descriptive, etc.)

- [ ] Add output formatting instructions
  - Ensure the model only returns the title itself with no additional text

- [ ] Test your improved prompt by running the exercise with `pnpm run exercise`
  - Check if the output is now just a single title like "Induction Hobs versus Aga Cookers"
