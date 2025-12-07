In this exercise, we're building on our prompt engineering skills by adding exemplars to our prompt. Exemplars, or examples, are input-output pairs that show the model what kind of responses we want.

The existing prompt already has several components: task context, rules, conversation history, the ask, and output format. Now we need to add exemplars to make it even more effective.

Let's look at the current code where we need to make changes:

```typescript
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
    <task-context>
    You are a helpful assistant that can generate titles for conversations.
    </task-context>

    <rules>
    Find the most concise title that captures the essence of the conversation.
    Titles should be at most 30 characters.
    Titles should be formatted in sentence case, with capital letters at the start of each word. Do not provide a period at the end.
    </rules>

    ${TODO /* TODO: Add the exemplars here, formatted with XML */}
    
    <conversation-history>
    ${INPUT}
    </conversation-history>

    <the-ask>
    Generate a title for the conversation.
    </the-ask>

    <output-format>
    Return only the title.
    </output-format>
  `,
});
```

The task is to insert the exemplars into the prompt using XML tags. We need to replace the `TODO` with properly formatted exemplars.

We should format each example with an `<example>` tag, and within that, use tags for the input and expected output.

Once we've added them, we might even be able to remove some other parts of the prompt because the examples alone can convey much of what we want. You may find you don't need to specify the rules or output format so explicitly.

## Steps To Complete

- [ ] Replace the TODO comment with XML-formatted exemplars
  - Use `<example>` tags to wrap each example
  - Use `<input>` and `<expected>` tags inside each example
  - Use the exemplars from the `exemplars` array

- [ ] Test the implementation by running the exercise
  - Use `pnpm run exercise` to run the code
  - Check if the output matches the expected format (a concise title for the conversation about induction hobs)

- [ ] Try removing other parts of the prompt
  - After adding exemplars, experiment with removing other sections
  - See if the model still produces good results with fewer explicit instructions
