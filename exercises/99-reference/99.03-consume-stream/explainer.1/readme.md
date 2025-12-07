The AI SDK, by default, does not always wait for a stream to be completed. This is surprising - and can trip you up when you're relying on the `onFinish` callback to be called.

## The Problem

In this code here, we're calling `streamText`, passing "Hello, world!" to Gemini 2.5 Flash, and we have an `onFinish` on the `streamTextResult`.

```ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

console.log('Process starting...');

const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Hello, world!',
  onFinish: () => {
    console.log('Stream finished!');
  },
});

// No consumption of the stream here

console.log('Process exiting...');
```

Our expectation here is that the stream is going to complete its work, and then it's going to say "Stream finished", and log that to the terminal.

In theory, we should get three logs:

- "Process starting..."
- "Stream finished!"
- "Process exiting..."

However, when we run this, we actually don't get that. We get:

- "Process starting..."
- "Process exiting..."

So `onFinish` here is never actually called. "Stream finished!" never actually appears.

## Processing the Stream

That's because even though we're getting streaming data coming from the LLM, we're not actually processing the parts of that stream.

If we do process them, for instance, using a for-await loop, our code would look like this:

```ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

console.log('Process starting...');

const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Hello, world!',
  onFinish: () => {
    console.log('Stream finished!');
  },
});

// Process each chunk of the stream
for await (const chunk of streamTextResult.textStream) {
  process.stdout.write(chunk);
}

console.log('Process exiting...');
```

Then we'll see that we get:

- "Process starting..."
- "Hello there, how can I help you today?"
- "Stream finished!"
- "Process exiting..."

So, processing the stream's parts is a way to make sure that the stream finishes.

## Consuming the Stream

However, there are some situations where we want to consume the entire stream and make sure that the stream finishes without necessarily processing all of the parts. Or we might want to await the result of a stream without necessarily processing all the bits as well.

For that, we can use the `consumeStream()` method on the `streamTextResult` as shown in explainer.1:

```ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

console.log('Process starting...');

const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Hello, world!',
  onFinish: () => {
    console.log('Stream finished!');
  },
});

// This ensures the stream is fully consumed
await streamTextResult.consumeStream();

console.log('Process exiting...');
```

This will wait for the stream to complete and consume all of the parts, and then trigger the `onFinish`.

The most common use case for this is when you have persistence logic inside your `onFinish`, because if there's a network connection issue, then your stream will interrupt, and your stream won't be fully consumed, so your `onFinish` won't be hit.

If we run this with `consumeStream()`, we'll see that we get:

- "Process starting..."
- "Stream finished!"
- "Process exiting..."

as we expect.

## The Top-Level `consumeStream` Function

Now this is not just available on the return type of `streamTextResult` too. There's also a top level function called `consumeStream`, which can consume a readable stream until it's fully read, as shown in [explainer.2](../explainer.2/main.ts):

```ts
import { google } from '@ai-sdk/google';
import { consumeStream, streamText } from 'ai';

console.log('Process starting...');

const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Hello, world!',
  onFinish: () => {
    console.log('Stream finished!');
  },
});

// Using the top-level consumeStream function
await consumeStream({
  stream: streamTextResult.toUIMessageStream(),
});

console.log('Process exiting...');
```

We're calling `consumeStream` with a `streamTextResult` and creating a UI message stream out of the `streamTextResult`. So functionally, this is doing the same thing as before. We're just doing an extra step where we turn it into a UI message stream instead.

Let's run it and see if it works, and we can see we have:

- "Process starting..."
- "Stream finished!"
- "Process exiting..."

So if you have a situation where your `onFinish` callbacks are not being called, it's likely that some variety of `consumeStream` will help make sure that your streams finish.

I recommend checking out these two explainers, running them a few times, trying commenting them in and out, trying to break it if you can.

Good luck and I will see you in the next one.

## Steps To Complete

- [ ] Understand the problem: When using `streamText`, the `onFinish` callback doesn't execute unless the stream is consumed.

- [ ] Examine the [`explainer.1`](./main.ts) example that uses `streamTextResult.consumeStream()` to ensure the stream completes and triggers the `onFinish` callback.

- [ ] Study the [`explainer.2`](../explainer.2/main.ts) example that uses the top-level `consumeStream()` function with `toUIMessageStream()` to accomplish the same goal.

- [ ] Try running both examples by running `pnpm run dev`

- [ ] Experiment by commenting out the `consumeStream` lines in both examples to observe how the `onFinish` callback doesn't execute.

- [ ] In `explainer.1`, implement a for-await loop to process stream chunks and see how that also ensures the `onFinish` callback executes:
  - `for await (const chunk of streamTextResult.textStream) { process.stdout.write(chunk); }`

- [ ] Try different combinations of stream consumption methods to understand their behavior.
