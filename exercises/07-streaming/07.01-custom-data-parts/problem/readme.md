The AI SDK allows you to take full control of the stream and actually stream your own custom data parts to the front end.

This is useful in all sorts of situations, especially advanced use cases. But for now, we're going to do something pretty simple with it.

## Generating Suggestions

A common pattern when you're using LLM-powered apps is that the system will provide you suggestions for what to ask next. We're going to build that in our application.

The way it's going to work is we'll use `streamText` as normal and just generate an output.

But once that `streamText` call has completed, we'll begin another `streamText` call. In that second call, we're going to append a suggestion to the message as a custom data part.

The first thing we need to do is define a type for the suggestion data part inside `chat.ts`. We are declaring a custom type here of `MyMessage`, which is a custom UI message:

```ts
export type MyMessage = UIMessage<
  never,
  {
    // TODO: Define the type for the suggestion data part
    TODO: TODO;
  }
>;
```

The base `UIMessage` type has support for various different message parts like:

- text
- reasoning
- files
- sources
- tool calls and results

But here, our plan is to extend it and create a new data part called `data-suggestion`, which will have a single suggestion for what the user should ask next. Check the [reference material](/exercises/99-reference/99.04-custom-data-parts-streaming/explainer/readme.md) for more information.

## Creating a Custom Message Stream

You'll notice there's more infrastructure below that's been added. Specifically, `createUIMessageStream` is new to us. It allows us to create a custom message stream instead of just relying on a single `streamText` call.

The `writer` variable, a `UIMessageStreamWriter`, has two really important methods for us.

1. `merge` - which allows us to take the stream text result UI message stream and merge it with the parent UI message stream.
2. `write` - which we'll use to write custom data parts.

```ts
const stream = createUIMessageStream<MyMessage>({
  execute: async ({ writer }) => {
    const streamTextResult = streamText({
      model: google('gemini-2.5-flash'),
      messages: modelMessages,
    });

    writer.merge(streamTextResult.toUIMessageStream());

    await streamTextResult.consumeStream();

    // More code here for the suggestion...
  },
});
```

`consumeStream` allows us to consume the stream until it's fully read, which is useful for ensuring that the stream finishes. Check out the [reference material](/exercises/99-reference/99.03-consume-stream/explainer.1/readme.md) for more information.

## Streaming a Suggestion

After consuming the first stream, we call `streamText` again to get a follow-up suggestion:

```ts
const followupSuggestionsResult = streamText({
  model: google('gemini-2.5-flash'),
  messages: [
    ...modelMessages,
    {
      role: 'assistant',
      content: await streamTextResult.text,
    },
    {
      role: 'user',
      content:
        'What question should I ask next? Return only the question text.',
    },
  ],
});
```

What we can't do is just call `writer.merge` again with this result, because then the text from this second stream would just be appended to our existing text, which would look wrong. Instead, we need to stream in a custom data part.

## Streaming Our Custom Data Part

Here's what the code looks like:

```ts
// NOTE: Create an id for the data part
const dataPartId = crypto.randomUUID();

// NOTE: Create a variable to store the full suggestion,
// since we need to store the full suggestion each time
let fullSuggestion = TODO;

for await (const chunk of followupSuggestionsResult.textStream) {
  // TODO: Append the chunk to the full suggestion
  fullSuggestion += TODO;

  // TODO: Call writer.write and write the data part
  // to the stream
  TODO;
}
```

First, we create an ID for the data part: `dataPartId`.

Then we create a variable to store the full suggestion, since we need to accumulate the full suggestion text as it streams in.

We iterate over the text stream (`followupSuggestionsResult.textStream`), append each chunk to our full suggestion, and call `writer.write` to write the data part to the stream.

At this point, we'll be streaming our suggestion down once the initial response has completed.

Check these two reference materials for more information:

- [Streaming Custom Data Parts To The Frontend](/exercises/99-reference/99.05-custom-data-parts-stream-to-frontend/explainer/readme.md)
- [Why IDs Are Needed For Custom Data Parts](/exercises/99-reference/99.06-custom-data-parts-id-reconciliation/explainer/readme.md)

## Showing the Suggestion in the Frontend

Our next job is to show it in the frontend. Here's how the code looks now:

```tsx
const App = () => {
  const { messages, sendMessage } = useChat<MyMessage>({});

  const [input, setInput] = useState(``);

  // TODO: Get the data-suggestion part from the last message
  const latestSuggestion: string | undefined = TODO;

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          parts={message.parts}
        />
      ))}
      <ChatInput
        // NOTE: We are passing the suggestion to the ChatInput component
        // where we will display it as a button
        suggestion={
          messages.length === 0
            ? 'What is the capital of France?'
            : latestSuggestion
        }
        input={input}
        onChange={(text) => setInput(text)}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({
            text: input,
          });
          setInput('');
        }}
      />
    </Wrapper>
  );
};
```

In `latestSuggestion`, we need to get the suggestion from the last message by finding a part with a type of `data-suggestion`. This will give us a `string` or `undefined` (since the data suggestion might not have streamed yet or we might not have any messages yet).

We then take that latest suggestion and put it inside the `ChatInput` component, where it will display as a button.

Once all of this is done, you should be able to ask a question and it will give you a follow-up suggestion that you can click to ask next. Notice how the follow-up streams in beautifully, not all in one chunk.

You should also check out the network tab to see the custom data part streaming in - that's always fun!

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Define the type for the suggestion data part in the `MyMessage` type in [`chat.ts`](./api/chat.ts). Check the [reference material](/exercises/99-reference/99.04-custom-data-parts-streaming/explainer/readme.md) for more information.

- [ ] Complete the implementation of the suggestion streaming by:
  - Initializing the `fullSuggestion` variable as an empty string
  - Appending each chunk to `fullSuggestion` in the loop
  - Using `writer.write` to write the data part with the accumulated suggestion
  - Use the reference material if needed:
    - [Streaming Custom Data Parts To The Frontend](/exercises/99-reference/99.05-custom-data-parts-stream-to-frontend/explainer/readme.md)
    - [Why IDs Are Needed For Custom Data Parts](/exercises/99-reference/99.06-custom-data-parts-id-reconciliation/explainer/readme.md)

- [ ] In the [`root.tsx`](./client/root.tsx) file, implement the `latestSuggestion` by extracting it from the last message:

- [ ] Test your implementation by:
  - Running the local dev server
  - Asking a question
  - Watching how the suggestion streams in after the main response
  - Checking the network tab to see the custom data part being streamed
  - Clicking on the suggestion button to ask the follow-up question
