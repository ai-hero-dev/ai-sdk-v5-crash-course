Our workflow is working pretty nicely. We're getting some decent outputs, but the user is not seeing anything on the screen for a considerable length of time. That's because we are using `generateText` instead of `streamText`.

We're going to change this to use `streamText`, and we're also going to get some practice in doing some custom data parts.

We want to:

1. Stream the first draft to the front end
2. Stream the evaluation separately
3. Display these distinct from each other in the front end

## The Setup

I've added some necessary scaffolding inside [./api/chat](./api/chat.ts):

- Created a `createUIMessageStream` with a `MyMessage` type
- Set up a way to turn that stream into a `UIMessageStreamResponse`

## Declare Custom Data Parts

Your first job is to declare custom data parts:

```typescript
export type MyMessage = UIMessage<
  unknown,
  {
    // TODO: declare custom data parts here
  }
>;
```

I recommend one part for the evaluation and one for the first draft. The final draft we can stream down as normal text parts.

You'll need to replace all instances of `UIMessage` with `MyMessage` in this folder.

## Switch from `generateText` to `streamText`

Next, we need to strip out the `generateText` calls inside the execute function:

```typescript
// TODO - change to streamText and write to the stream as custom data parts
const writeSlackResult = await generateText({
  model: google('gemini-2.5-flash'),
  system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM,
  prompt: `
    Conversation history:
    ${formatMessageHistory(messages)}
  `,
});

// TODO - change to streamText and write to the stream as custom data parts
const evaluateSlackResult = await generateText({
  model: google('gemini-2.5-flash'),
  system: EVALUATE_SLACK_MESSAGE_SYSTEM,
  prompt: `
    Conversation history:
    ${formatMessageHistory(messages)}

    Slack message:
    ${writeSlackResult.text}
  `,
});
```

Change each of these `generateText` calls into a `streamText`. Watch the text stream and as it happens, stream that to the frontend as that data part.

Make sure you use the ID trick so you update the same data part over time. I've got some [reference material](/exercises/99-reference/99.06-custom-data-parts-id-reconciliation/explainer/readme.md) that explains this in more detail.

## Handling the Stream Text Call

The final Slack attempt is already streaming, which is good:

```typescript
const finalSlackAttempt = streamText({
  model: google('gemini-2.5-flash'),
  system: WRITE_SLACK_MESSAGE_FINAL_SYSTEM,
  prompt: `
    Conversation history:
    ${formatMessageHistory(messages)}

    First draft:
    ${writeSlackResult.text}

    Previous feedback:
    ${evaluateSlackResult.text}
  `,
});

// TODO: merge the final slack attempt into the stream,
// sending sendStart: false
writer.TODO;
```

We need to merge it into the writer. When we merge it, we need to pass `sendStart: false`.

By default, when you merge a `UIMessageStream` into another `UIMessageStream`, it will send the start and finish parts. But because we've already begun the message up above, we don't want it to send the start part again.

In fact, we want to manually start it ourselves, by following the `TODO` at the top of the `execute` function:

```typescript
// TODO: write a { type: 'start' } message via writer.write
TODO;
```

I've got some [reference material](/exercises/99-reference/99.09-start-and-finish-parts/explainer/readme.md) that explains this in more detail.

## Frontend Changes

Once the backend is done, we need to go to the frontend.

First, pass our `MyMessage` type to the `useChat` hook:

```typescript
// TODO: pass MyMessage to the useChat hook: useChat<MyMessage>({})
const { messages, sendMessage } = useChat({});
```

Then, we'll need to adjust the message component:

```tsx
export const Message = ({
  role,
  parts,
}: {
  role: string;
  parts: UIMessage['parts'];
}) => (
  <div className="my-4">
    {parts.map((part) => {
      // TODO: use this component to handle the custom data parts
      // you have created in the api/chat.ts file
      TODO;

      if (part.type === 'text') {
        return (
          <div className="mb-4">
            <p className="text-gray-400 text-xs">
              <ReactMarkdown>
                {(role === 'user' ? 'User: ' : 'AI: ') +
                  part.text}
              </ReactMarkdown>
            </p>
          </div>
        );
      }

      return null;
    })}
  </div>
);
```

We'll need to render some UI to render the custom parts to the frontend.

## Testing

Once all these changes are done, you should see each part of the workflow streaming to the frontend. This will:

1. Massively improve our time to first token
2. Give the user full awareness over every single part of the workflow

## Steps To Complete

- [ ] Declare custom data parts in `MyMessage` type in api/chat.ts
  - One for evaluation
  - One for first draft
  - Final draft can use normal text parts

- [ ] Replace all instances of `UIMessage` with `MyMessage` in the code

- [ ] Update the execute function in api/chat.ts
  - Add code to write a `{ type: 'start' }` message via writer.write. Check out the [reference material](/exercises/99-reference/99.09-start-and-finish-parts/explainer/readme.md) to understand why we do this.
  - Change both `generateText` calls to `streamText` and stream to frontend as custom data parts. Check out the [reference material](/exercises/99-reference/99.06-custom-data-parts-id-reconciliation/explainer/readme.md) to understand how to do this.

- [ ] Handle the final Slack attempt stream
  - Merge the `finalSlackAttempt` into the writer with `sendStart: false`

- [ ] Update the frontend components
  - Pass `MyMessage` to the `useChat` hook in client/root.tsx
  - Update the Message component in client/components.tsx to handle custom data parts

- [ ] Test your implementation
  - Run the dev server with `pnpm run dev`
  - Check localhost:3000 in your browser
  - Confirm you can see all parts streaming separately to the frontend
