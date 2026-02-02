So far we've seen how you can stream text from an LLM response, but LLMs can return more than just text parts.

They can return reasoning tokens, they can return sources, they can return tool calls and tool results - and much more.

The stream is the thing that connects your front end to your back end. And all of these different parts can't just be represented by a single text stream. We need something a bit more complex.

In the AI SDK, this is a `UIMessageStream`. A `UIMessage` is a really important type in the AI SDK. It represents the messages as they appear in your UI. And so a [`UIMessageStream`](./main.ts) is your back end constructing one of these `UIMessage`s in real time.

In this example, we're passing a Google model into [`streamText`](./main.ts) with a prompt saying, "Give me a sonnet about a cat called Steven." And instead of referring to `textStream` here, we are calling `toUIMessageStream` and streaming down the chunks.

```ts
const stream = streamText({
  model,
  prompt: 'Give me a sonnet about a cat called Steven.',
});

for await (const chunk of stream.toUIMessageStream()) {
  console.log(chunk);
}
```

If we run this exercise, we'll see that we get a whole list of objects being streamed out here, starting with a start, then a start step, then text start, text delta, and all sorts of stuff, all the way to the finish and finish step.

The output looks like this:

```txt
{ type: 'start' }
{ type: 'start-step' }
{ type: 'text-start', id: '0' }
{ type: 'text-delta', id: '0', delta: 'A' }
{ type: 'text-delta', id: '0', delta: ' feline friend,' }
// ... more deltas ...
{ type: 'text-end', id: '0' }
{ type: 'finish-step' }
{ type: 'finish' }
```

These objects represent the [`UIMessageStream`](./main.ts) and all their various parts. Streaming to a terminal, which we saw before is relatively simple, but streaming to a UI means you need a little bit more complexity. And that's what the `UIMessageStream` gives you.

We're going to see it more and more in the next few exercises, especially when we look in the network tab to see what streaming from our back end to our front end. And so I hope this little intro gives you an idea for what it looks like.

Try messing about with this prompt here, see if you can get some different outputs and run the exercise a few times with different inputs to see what the outputs look like. Get used to the shape of the `UIMessageStream`. We're going to be seeing it a lot. Good luck, and I'll see you in the next one.

## Steps To Complete

- [ ] Examine the code that uses `toUIMessageStream()` instead of directly working with `textStream`

- [ ] Run the exercise to see the different object types in the `UIMessageStream` output

- [ ] Try changing the prompt in the `streamText` function to see how different inputs affect the output format

- [ ] Look at the structure of the response objects with their various types: 'start', 'start-step', 'text-start', 'text-delta', etc.

- [ ] Get familiar with this format as it will be used extensively in future exercises

- [ ] Try to understand how these structured messages could be used to build a more complex UI
