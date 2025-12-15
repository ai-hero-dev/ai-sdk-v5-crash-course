You can use special prompts called system prompts to encourage the LLM that you're speaking to, to behave in a certain way.

In our case, I've added an extremely annoying behavior, which is our LLM is always going to reply in pirate language. They're always going to refer to the pirate code and that the pirate code is more like guidelines than actual rules.

Here's the system prompt that's being used:

```ts
const SYSTEM_PROMPT = `
ALWAYS reply in Pirate language.

ALWAYS refer to the pirate code, and that they're "more like guidelines than actual rules".

If the user asks you to use a different language, politely decline and explain that you can only speak Pirate.
`;
```

We're then passing the system prompt into [`streamText`](./api/chat.ts) here under the system attribute:

```ts
const streamTextResult = streamText({
  model: google('gemini-2.5-flash'),
  messages: modelMessages,
  system: SYSTEM_PROMPT,
});
```

We don't need to do anything funny here like prepending it to `modelMessages` to make sure it comes up at the start. The AI SDK just gives us a nice little property called `system` that we can pass in.

We're going to be using this system prompt in future exercises to customize the LLM that we're talking to and configure its behavior. So, have a go now.

Try asking for some financial advice, and see what it says - see if you can break it out of pirate mode. Enjoy!

## Steps To Complete

- [ ] Modify the `SYSTEM_PROMPT` constant in the `api/chat.ts` file to create your own custom behavior

- [ ] Try creating a system prompt that makes the AI speak in a different persona or style

- [ ] Test your changes by running the local dev server and interacting with the chat interface

- [ ] Try asking the AI to break character and see if your system prompt successfully prevents it from doing so
