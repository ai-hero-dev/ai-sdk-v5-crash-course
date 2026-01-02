Now, we understand the importance of streaming text and how to convert that text stream from the LLM into a `UIMessageStream` for the frontend. Let's look at how to implement this in our app.

We have a small Vite app with a root component in [`client/root.tsx`](./client/root.tsx). Our first task is to use the `useChat` hook to get the messages and sendMessage function, which will connect to pre-built components for message rendering and chat input.

We need to implement the `TODO` in our App component in [`client/root.tsx`](./client/root.tsx):

```tsx
import { useChat } from '@ai-sdk/react';

const App = () => {
  // TODO: use the useChat hook to get the messages and sendMessage function
  const { messages, sendMessage } = TODO;

  const [input, setInput] = useState(
    `What's the capital of France?`,
  );

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
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: send the message
        }}
      />
    </Wrapper>
  );
};
```

After setting up the frontend, we need to work on the API route in [`api/chat.ts`](./api/chat.ts). This `POST` route will be called when the user sends a message, sending the entire history of all messages collected so far.

The API route has several TODOs to complete:

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  // TODO: get the UIMessage[] from the body
  const messages: UIMessage[] = TODO;

  // TODO: convert the UIMessage[] to ModelMessage[]
  const modelMessages: ModelMessage[] = TODO;

  // TODO: pass the modelMessages to streamText
  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
  });

  // TODO: create a UIMessageStream from the streamTextResult
  const stream = TODO;

  return createUIMessageStreamResponse({
    stream,
  });
};
```

When examining the request in the network tab, you'll find that `body.messages` contains an array of `UIMessage`s. To send these to `streamText`, we first need to convert them from `UIMessage`s to `ModelMessage`s using a function from the `ai` package. Check the [reference material](/exercises/99-reference/99.01-ui-messages-vs-model-messages/explainer/readme.md) for more information.

Once all these steps are complete, you'll be able to have a full conversation with the Gemini model, not just a single call and response, but an evolving conversation where the LLM maintains context over all previous messages.

## Steps To Complete

- [ ] Import the `useChat` hook from `@ai-sdk/react` in `client/root.tsx`

- [ ] Replace the `TODO` in the App component with the appropriate `useChat({})` call

- [ ] Complete the `onSubmit` handler in `ChatInput` to use `sendMessage` with the input text

- [ ] In `api/chat.ts`, extract the `UIMessage`s from the request body (replace the first `TODO`)

- [ ] Import and use a function to convert `UIMessage`s to `ModelMessage`s (replace the second `TODO`)

- [ ] Pass the `ModelMessage`s to the `streamText` function by adding them to the existing configuration

- [ ] Create a `UIMessageStream` from the `streamText` result (replace the fourth `TODO`)

- [ ] Test your implementation by running the dev server and having a conversation with the AI

- [ ] Check the network tab to ensure messages are being sent and streamed correctly. Notice how the `UIMessageStream` is being sent to the frontend.
