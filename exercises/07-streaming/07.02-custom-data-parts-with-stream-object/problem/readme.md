Our single suggestion setup is working quite well, but a single suggestion is pretty lame. Ideally, we want to provide multiple suggestions to give users more options to choose from.

To achieve this, we need to make several changes to our current implementation. Let's examine what needs to be updated.

## `data-suggestion` -> `data-suggestions`

First, we need to modify our `MyMessage` type definition to support multiple suggestions instead of just one. This means changing the data type from a single string to an array of strings.

Looking at our code in `problem/api/chat.ts`, we can see the current type definition:

```ts
export type MyMessage = UIMessage<
  never,
  {
    // TODO: Change the type to 'suggestions' and
    // make it an array of strings
    suggestion: string;
  }
>;
```

## `streamText` -> `streamObject`

Next, we need to update our approach to generating suggestions. Currently, we're using `streamText`, which isn't ideal for returning structured data like arrays. A more reliable approach would be to use structured outputs with `streamObject` instead.

We also need to define a schema using Zod to ensure we get the correct data structure:

```ts
// TODO: Change the streamText call to streamObject,
// since we'll need to use structured outputs to reliably
// generate multiple suggestions
const followupSuggestionsResult = streamText({
  model: google('gemini-2.5-flash'),
  // TODO: Define the schema for the suggestions
  // using zod
  schema: TODO,
  messages: [
    ...modelMessages,
    {
      role: 'assistant',
      content: await streamTextResult.text,
    },
    {
      role: 'user',
      content:
        // TODO: Change the prompt to tell the LLM
        // to return an array of suggestions
        'What question should I ask next? Return only the question text.',
    },
  ],
});
```

## Streaming the Suggestions

When we get to handling the response, we'll need to update our streaming logic. Instead of following the `textStream`, we'll iterate over the `partialObjectStream`. This gives us access to the partial object as it's streaming, including the array of suggestions:

```ts
// TODO: Update this to iterate over the partialObjectStream
for await (const chunk of followupSuggestionsResult.textStream) {
  fullSuggestion += chunk;

  // TODO: Update this to write the data part
  // with the suggestions array. You might need
  // to filter out undefined suggestions.
  writer.write({
    id: dataPartId,
    type: 'data-suggestion',
    data: fullSuggestion,
  });
}
```

Return to the [exercise on streamObject](/exercises/01-ai-sdk-basics/01.12-streaming-objects-via-output/problem/readme.md) for a reminder.

## Showing the Suggestions in the Frontend

Finally, we need to update our frontend code to display multiple suggestions. The `ChatInput` component has already been updated to handle an array of suggestions, but we still need to modify the `latestSuggestion` variable in our `root.tsx` file:

```tsx
// TODO: Update this to handle the new
// data-suggestions part
const latestSuggestion = messages[
  messages.length - 1
]?.parts.find((part) => part.type === 'data-suggestion')?.data;
```

This needs to be changed to properly extract the array of suggestions from the message parts.

The goal is to create a user interface where after asking a question, the user will see multiple follow-up suggestion options, making the chat experience more dynamic and helpful.

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Update the `MyMessage` type in `problem/api/chat.ts` to support an array of strings
  - Change `suggestion: string` to `suggestions: string[]`

- [ ] Change the `streamText` call to `streamObject` for generating suggestions
  - Import the required functions: `streamObject` from 'ai'
  - Update the function call from `streamText` to `streamObject`

- [ ] Define a schema for the suggestions using Zod
  - Import zod: `import { z } from 'zod'`
  - Create a schema defining an array of strings

- [ ] Update the prompt to tell the LLM to return an array of suggestions
  - Modify the prompt to specifically request multiple follow-up questions

- [ ] Update the streaming logic to use the `partialObjectStream`
  - Change `followupSuggestionsResult.textStream` to `followupSuggestionsResult.partialObjectStream`
  - Remove the `fullSuggestion` variable as it's no longer needed
  - Return to the [exercise on streamObject](/exercises/01-ai-sdk-basics/01.12-streaming-objects-via-output/problem/readme.md) for a reminder.

- [ ] Update the `writer.write` call to handle the array of suggestions
  - Change the data field to use the chunks from the partial object stream
  - Filter out any undefined suggestions

- [ ] Update the `latestSuggestion` variable in [`client/root.tsx`](./client/root.tsx)
  - Rename to `latestSuggestions` to reflect the plural nature
  - Update the variable to correctly extract the array of suggestions

- [ ] Update the `ChatInput` component usage in [`client/root.tsx`](./client/root.tsx)
  - Change from passing `suggestion` to `suggestions`
  - Handle the case when there are no messages by providing a default array

- [ ] Test your implementation
  - Run the exercise with `pnpm run exercise`
  - Check the local dev server at localhost:3000
  - Ask a question and verify that multiple suggestions appear
