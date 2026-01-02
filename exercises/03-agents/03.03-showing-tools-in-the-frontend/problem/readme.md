In this exercise, we're going to learn how to work with tools in the AI SDK to create a front-end that displays tool interactions with full type safety and autocomplete. The key challenge is to properly type our UI messages so that they understand the shape of our tool definitions.

## Moving Tool Definitions

Our first task is to extract the tool definitions from inside the [`streamText`](./api/chat.ts) call in [`api/chat.ts`](./api/chat.ts) and move them to the module scope. This allows us to both use the tools at runtime and infer types from them.

The tools are currently defined within the [`streamText`](./api/chat.ts) function call:

```ts
const result = streamText({
  model: google('gemini-2.5-flash'),
  messages: await convertToModelMessages(messages),
  system: `...`,
  tools: {
    writeFile: tool({...}),
    readFile: tool({...}),
    // ...other tools
  },
  // ...
});
```

We need to move these tool definitions into the module scope variable that's currently marked with `TODO`:

```ts
// Move the tool definitions here
const tools = TODO;
```

## Creating a Custom UI Message Type

After moving the tool definitions, we need to create a custom UI message type that knows about our tools. The `UIMessage` type from the AI SDK accepts type parameters, and we need to pass in information about our tools:

```ts
// Replace this TODO with the correct type
export type MyUIMessage = TODO;
```

We'll use the `InferUITools` utility type from `ai`to infer the correct tool types from our tool definitions.

## Using the Custom Type in Front-End Components

Once we have our custom `MyUIMessage` type, we need to use it in our front-end components:

1. In [`root.tsx`](./client/root.tsx), we need to pass `MyUIMessage` as a type argument to `useChat`
2. In [`components.tsx`](./client/components.tsx), we need to update the `parts` prop type to use `MyUIMessage['parts']` instead of `UIMessage['parts']`

## Implementing the `writeFile` Tool Display

Finally, we need to implement the missing JSX for the `writeFile` tool

The `writeFile` tool JSX should show:

- An icon/emoji (📝)
- A title ("Wrote to file")
- The path of the file
- The length of the content

It should be styled similarly to the other tool displays.

## Testing the Implementation

When everything is correctly implemented, we should be able to:

1. Run the dev server
2. Ask the LLM questions (like "Tell me what todo items I have today")
3. See nicely formatted displays of the tool calls, including our newly implemented `writeFile` tool display

Good luck, and I'll see you in the solution!

## Steps To Complete

- [ ] Move the tool definitions from inside the `streamText` function to the module scope variable `tools`

- [ ] Create the `MyUIMessage` type using `InferUITools<typeof tools>` as the third type parameter. Check [these docs](https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message#creating-your-own-uimessage-type) for more information

- [ ] Update the `useChat` call in `root.tsx` to pass `MyUIMessage` as a type argument

- [ ] Update the `parts` prop type in the `Message` component to use `MyUIMessage['parts']` instead of `UIMessage['parts']`

- [ ] Implement the JSX for the `writeFile` tool in the `Message` component, following the pattern of the other tool displays

- [ ] Run the dev server and test that tool calls are displayed correctly in the UI
