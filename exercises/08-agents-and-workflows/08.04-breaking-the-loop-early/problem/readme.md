Okay, now we've got our loop set up, it's time to reveal my trump card. The whole point of having agentic behavior is to hand control of the control flow to the LLM. Our current setup is _too_ deterministic.

## The Problem

Our [current flow](./api/chat.ts) _always_ goes through the loop. We're going to give the LLM the ability to break out of the loop early. Here's the current loop:

```ts
while (step < 2) {
  // Write Slack message
  const writeSlackResult = streamText({
    model: google('gemini-2.5-flash'),
    system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM,
    prompt: `/* prompt content */`,
  });

  // Stream the message to the user
  const draftId = crypto.randomUUID();
  let draft = '';
  for await (const part of writeSlackResult.textStream) {
    draft += part;
    writer.write({
      type: 'data-slack-message',
      data: draft,
      id: draftId,
    });
  }
  mostRecentDraft = draft;

  // Evaluate the message
  const evaluateSlackResult = streamText({
    /* evaluation setup */
  });
  // Process feedback...

  step++;
}
```

Whatever happens, we're always going to go back to the top of the loop. There's no way to break out of it here. We're going to force the LLM to essentially choose whether it should break out or not.

In other words, it doesn't just need to return the reasoning and the feedback, it also needs to return an "is this good enough" Boolean. We're not going to be able to scrape that out of a lowly `streamText` call:

Instead we should use [`streamObject`](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data#stream-object). `streamObject` is going to give us the best of both worlds:

1. It's going to allow us to stream the feedback as it appears in the object stream, so the user is still seeing something while the feedback is being generated
2. It's also going to lock down the output of the evaluation so that we get the feedback in one bit and the Boolean that we really do need for our program in another.

## The Steps

We need to:

- Replace the [`streamText`](./api/chat.ts) call with a `streamObject` call
- Define a schema for the output
- If the `streamObject` call says we should break out of the loop, we should do so
- Stream the feedback to the frontend as it appears

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Replace the `streamText` call in the evaluation section with a [`streamObject`](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data#stream-object) call

- [ ] Import the `streamObject` function from the 'ai' package

- [ ] Import the [`zod`](https://zod.dev/) package for schema definition

- [ ] Define a schema for the output that includes:
  - A feedback string
  - A boolean indicating if the draft is good enough

- [ ] Update the code to stream the feedback to the frontend as it appears in the `partialObjectStream`. Return to the [exercise on streamObject](/exercises/01-ai-sdk-basics/01.09-streaming-objects/problem/readme.md) for a reminder.

- [ ] Modify the loop to break early if the LLM indicates the draft is good enough

- [ ] Test your implementation by running the local dev server and observing if the loop breaks early when appropriate
