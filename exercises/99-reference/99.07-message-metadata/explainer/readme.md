Sometimes you want to attach some information about the message to the message itself. In cases like these, you can use message metadata from the AI SDK.

Whereas message `parts` comprise the actual contents of the message, message `metadata` is information about the message.

## Tracking Message Length

In this case, we're going to have some metadata about the length of the message generated. The way we're doing this is by declaring a `MyMetadata` type and then creating a custom message type here by passing in `MyMetadata` to `UIMessage`:

```ts
type MyMetadata = {
  // The length of the message generated
  length: number;
};

type MyMessage = UIMessage<MyMetadata>;
```

We then have a standard `streamText` result here:

```ts
const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Hello, world!',
});
```

And below, we turn the `streamTextResult` into a `UIMessage` stream, passing `MyMessage` as the type argument to the `UIMessageStream`:

```ts
let totalLength = 0;

const stream = streamTextResult.toUIMessageStream<MyMessage>({
  messageMetadata: ({ part }) => {
    if (part.type === 'text-delta') {
      totalLength += part.text.length;
    }

    if (part.type === 'finish') {
      return {
        length: totalLength,
      };
    }
  },
});
```

Since `toUIMessageStream` is a function, we are passing an object to that function containing a callback called `messageMetadata`. `messageMetadata` is called on every part of the `UIMessage` stream, and you can return some metadata to update the metadata of the message.

Thanks to TypeScript's clever inference, this is type safe. So if we misspell `length` in the `messageMetadata` callback, we'll get an error.

Our logic here is that we have a total length of the messages, then every time we see a text delta part, we measure the length of that text part and add it to the total length. Finally, when we see a part type of `finish`, we just return our message metadata type.

## Testing the Output

Below, we are logging each chunk of the stream, so we should be able to see what happens:

```ts
for await (const chunk of stream) {
  console.log(chunk);
}
```

We can see that we begin with a start and then a start step chunk. Then, our text delta begins, so we start with a delta of "hello", then another delta of "there, can I help you today?":

```txt
{ type: 'start' }
{ type: 'start-step' }
{ type: 'text-start', id: '0' }
{ type: 'text-delta', id: '0', delta: 'Hello' }
{
  type: 'text-delta',
  id: '0',
  delta: ' there! How can I help you today?\n'
}
{ type: 'text-end', id: '0' }
{ type: 'finish-step' }
{ type: 'finish', messageMetadata: { length: 39 } }
```

Finally, we go down to the finish, where some `messageMetadata` has been attached of length `39`.

You can use message metadata for all sorts of stuff, tracking the model that was used for each message, and of course, you can persist it in your database too.

I recommend you mess about for a bit, try declaring your own message metadata types and see how that affects the chunks that come out from the stream.

Good luck, and I'll see you in the next one.

## Steps To Complete

- [ ] Review the [`MyMetadata` type definition](./main.ts) and how it's used to create a custom message type with `UIMessage`
  - This defines what kind of metadata we'll attach to messages.

- [ ] Examine how the `streamTextResult` is converted to a `UIMessageStream` with `toUIMessageStream`
  - Note how we pass the generic type parameter `<MyMessage>`.

- [ ] Study the `messageMetadata` callback implementation
  - See how it tracks the total length of the message
  - Note how it returns the metadata object on the `finish` part

- [ ] Run the example code to see the output in the console
  - Observe how the metadata gets attached to the message chunks

- [ ] Try creating your own metadata types and implementations
  - Experiment with different properties in your metadata
  - See how they appear in the output stream
