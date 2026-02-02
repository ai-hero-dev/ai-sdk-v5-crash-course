When you're working in the AI SDK, it's really important to know the difference between `UIMessage` messages and `ModelMessage` messages.

- `UIMessage` messages are the ones that display in your UI - and are also the ones you persist in your database.
- `ModelMessage` messages are the ones that are sent to the LLM.

In a typical application, you're going to send an array of `UIMessage` to your `POST` route, usually at `api/chat`, and then you'll need to convert them to model messages before you can pass them to any of the AI SDK's calls.

## `UIMessage`

`UIMessage` messages look like this. They have a `role`, they have an `id`, and they have a `parts` array. These parts can contain many, many different things, but for now, these ones in the example just contain text.

```ts
const messages: UIMessage[] = [
  {
    role: 'user',
    id: '1',
    parts: [
      {
        type: 'text',
        text: 'What is the capital of France?',
      },
    ],
  },
  // ...
```

This example has two messages. We have one message with a role of `user`, another one with a role of `assistant`.

## `ModelMessage`

`ModelMessage` messages are the ones that are sent to the LLM. They get rid of the IDs for each message, since the LLM doesn't care about that, and instead of parts, we just have an array of content.

We can convert `UIMessage` messages to `ModelMessage` messages using the `convertToModelMessages` function.

```ts
const modelMessages = await convertToModelMessages(messages);
```

The output looks like this:

```ts
[
  {
    role: 'user',
    content: [
      { type: 'text', text: 'What is the capital of France?' },
    ],
  },
  {
    role: 'assistant',
    content: [
      { type: 'text', text: 'The capital of France is Paris.' },
    ],
  },
];
```

What I suggest you do is try exploring with the types inside the `UIMessage`. Try adding some different parts here and run the exercise a few times to see what that gets transformed to after `convertToModelMessages` has been run on it.

## Steps To Complete

- [ ] Open our [`main.ts`](./main.ts) file to explore the code

- [ ] Try modifying the `UIMessage` parts array to include different types of content

- [ ] For example, add an image URL, a tool call, or other content types

- [ ] Run the code to see how `convertToModelMessages` transforms your modified UI messages into model messages

- [ ] Experiment with different combinations of content types in the parts array

- [ ] Observe the output in the terminal to understand how the transformation works

- [ ] Try to predict what the transformation will look like before running the code
