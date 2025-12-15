In this section, we're going to investigate how to persist messages to a database. The way this works is we'll wait for our stream to finish and then take the created messages and upload them to a database.

However, waiting for messages to finish is slightly non-trivial in the AI SDK. There are several properties that look similar but do subtly different things. Let's demystify them.

Our setup is that inside our POST route, we're doing some [`streamText`](./api/chat.ts) processing:

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    onFinish: ({ response }) => {
      console.log('streamText.onFinish');
      console.log('  response.messages');
      console.dir(response.messages, { depth: null });
    },
  });

  // More code...
};
```

We're taking the UI messages from the request body and passing them to the `streamText` function by converting them to model messages.

Then we have multiple [`onFinish`](./api/chat.ts) callbacks:

1. One inside [`streamText`](./api/chat.ts), which logs the `response.messages`
2. Another inside [`toUIMessageStreamResponse`](./api/chat.ts), which logs both `messages` and `responseMessage`

```ts
return result.toUIMessageStreamResponse({
  originalMessages: messages,
  onFinish: ({ messages, responseMessage }) => {
    console.log('toUIMessageStreamResponse.onFinish');
    console.log('  messages');
    console.dir(messages, { depth: null });

    console.log('toUIMessageStreamResponse.onFinish');
    console.log('  responseMessage');
    console.dir(responseMessage, { depth: null });
  },
});
```

When we interact with our UI and ask "Write me a poem about a fish called Grant", we get several logs in the terminal.

Let's examine the differences between the three types of responses:

| Response Type                                            | Description                                                | Content                                                                | Suitability for Persistence                  |
| -------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| `streamText > onFinish > response.messages`              | Model messages (AssistantModelMessage or ToolModelMessage) | Minimal information, no UI data                                        | Not suitable for UI applications             |
| `toUIMessageStreamResponse > onFinish > messages`        | Full message history                                       | Includes original user message and assistant's response with all parts | Ideal for persisting entire conversations    |
| `toUIMessageStreamResponse > onFinish > responseMessage` | Single message                                             | Just the newly generated assistant message                             | Good for persisting only the latest response |

Depending on how you want to manage persistence, you might use either the entire message history or just the final generated message.

The full message history in `toUIMessageStreamResponse.onFinish.messages` contains all parts, including state information (start, done), making it suitable for persisting the entire conversation.

To summarize:

- `streamText.onFinish` has `response.messages` (model messages) - not suitable for persisting UI data
- `toUIMessageStreamResponse.onFinish` has the full `messages` history (especially if you pass in originalMessages)
- `toUIMessageStreamResponse.onFinish` also has `responseMessage` which is just the newly generated message

## Steps To Complete

- [ ] Review the code and understand the difference between the three different message formats available in the callbacks

- [ ] Test your implementation by running the local dev server and checking that messages are properly logged

- [ ] Try having a longer conversation to see how the different message formats change with multiple exchanges
