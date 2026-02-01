I want to help you diagnose an issue that comes up when you stream multiple things one after the other. Here we are streaming one paragraph of a story at a time. And before each paragraph, we're writing paragraph 1, paragraph 2, and paragraph 3.

## Understanding the Code

In the [code](./api/chat.ts), we're inside a `UIMessageStream`. We have a `writeTextPart` function that essentially just writes a single text part.

```typescript
const writeTextPart = (
  writer: UIMessageStreamWriter,
  text: string,
) => {
  const textPartId = crypto.randomUUID();
  writer.write({
    type: 'text-start',
    id: textPartId,
  });
  writer.write({
    type: 'text-delta',
    id: textPartId,
    delta: text,
  });
  writer.write({
    type: 'text-end',
    id: textPartId,
  });
};
```

If you don't know what this code does, then there's [other reference material](/exercises/99-reference/99.08-streaming-text-parts-by-hand/explainer/readme.md) that explains it.

## The Issue with Multiple Streams

In our main stream execution, we:

1. Write "Paragraph 1:" text
2. Stream the first paragraph result
3. Merge that stream into the parent stream
4. Wait for the first paragraph text and pass that to the second paragraph stream
5. Write a title for the second paragraph
6. Stream the text
7. Merge it in

We do this three times until we have three paragraphs. Here's the code for the first paragraph:

```ts
writeTextPart(writer, 'Paragraph 1: ');

const firstParagraphResult = streamText({
  model: google('gemini-2.5-flash-lite'),
  messages: [
    ...modelMessages,
    {
      role: 'user',
      content:
        'Given the conversation history above, write the first paragraph of a story. Make it short.',
    },
  ],
});

writer.merge(firstParagraphResult.toUIMessageStream());
```

## The Weird Error

The issue we're getting is a really weird one. At the top of our UI, we end up with two separate messages where one message only has paragraph one, but the second message also has paragraph one. Check the video above for a visual.

## The Problem with Start and Finish Parts

The issue is that there are multiple start and finish chunks being streamed in:

1. A start and finish for the first paragraph
2. A start and finish for the next paragraph
3. A start part and finish part for paragraph three

I thought this was sort of okay to have multiple finish and start parts like this. But I chatted to the lead maintainer of the AI SDK, Lars, and he said, "Oh no, we do not support that."

You should be very, very careful about your start and finish part, otherwise you're going to get really weird errors like double messages in the frontend.

## The Correct Approach

The way this code should work is we should only have:

- A single `start` part at the very start of the stream
- A `finish` part right at the end

We can fix this by uncommenting the commented TODO in our code and manually writing the start part:

```ts
// TODO: Try uncommenting this and see what happens
// writer.write({
//   type: 'start',
// });
```

Just this change, by the way, is enough to fix the weird error that we were getting. The issue was that this text part was being streamed before the stream had started, and so it was being counted as a separate message.

Whereas if we try it again now, then we only get a single message because it's been started.

## Further Improvements

We can clean this up a lot more even by going into the `toUIMessageStream` function and saying whether we want it to send a start part or send a finish part.

For the first paragraph, we don't need it to send a start part because we've already started it, and we don't need to send a finish part either because there's a lot more to go.

```ts
writer.merge(
  firstParagraphResult.toUIMessageStream({
    // TODO: Try uncommenting these and see what happens
    // sendStart: false,
    // sendFinish: false,
  }),
);
```

Same is true in the second paragraph too. We can uncomment both of these parameters:

```ts
writer.merge(
  secondParagraphResult.toUIMessageStream({
    // TODO: Try uncommenting these and see what happens
    // sendStart: false,
    // sendFinish: false,
  }),
);
```

And then in the third paragraph down here, we only need to say `sendStart: false` because we do want it to add a finish part:

```ts
writer.merge(
  thirdParagraphResult.toUIMessageStream({
    // TODO: Try uncommenting these and see what happens
    // sendStart: false,
  }),
);
```

Now when we run this, we can see we get a type start here and there's no type finish until all the way at the end. And so this behavior, even though it's pretty annoying to have to manually do it yourself, more closely matches what the AI SDK actually expects.

So if you ever have any bugs where you have multiple different messages being streamed in, then it's probably something to do with your start and finish parts.

Nice work, and I will see you in the next one.

## Steps To Complete

- [ ] Uncomment the initial `writer.write({ type: 'start' })` block to manually write the start part

- [ ] Uncomment the `sendStart: false` and `sendFinish: false` parameters in the first paragraph's `toUIMessageStream` call

- [ ] Uncomment the `sendStart: false` and `sendFinish: false` parameters in the second paragraph's `toUIMessageStream` call

- [ ] Uncomment the `sendStart: false` parameter in the third paragraph's `toUIMessageStream` call
  - Note that we don't set `sendFinish: false` here because we want it to add a finish part

- [ ] Test your changes by running the exercise and observing if you get only a single message in the UI instead of multiple messages
