Here's an example of how you can define a tool using the AI SDK.

We're inside a `streamText` call here where we have a prompt saying, log the message "hello world" to the console:

```ts
const result = streamText({
  model: google('gemini-2.5-flash'),
  prompt: 'Log the message "Hello, world!" to the console',
  tools: {
    // ...explained below
  },
});
```

Of course, the LLM can't do that natively, so we've given it a tool called `logToConsole`, which it can use to perform that task.

## The `tool` function

This tool takes in a description of itself, which is passed to the LLM, then an `inputSchema`, which is passed to the LLM to describe what it should call the tool with. We're using Zod to describe the input schema.

Under the hood, this will be turned into JSON schema and then passed to the LLM. But it's also used internally to validate what we get back from the LLM. So this means that the LLM can't really call our tool with stuff that it's not expecting because Zod will validate it.

```ts
tools: {
  logToConsole: tool({
    description: 'Log a message to the console',
    inputSchema: z.object({
      message: z
        .string()
        .describe('The message to log to the console'),
    }),
    // execute function will go here
  }),
}
```

In this case, the schema is an object with a `message` property of string, which is being described as "the message to log to the console".

This `.describe` call is really handy, especially when you have objects with lots of properties. And just like everything else with LLMs, it's an opportunity to do prompt engineering here.

You can declare the `tools` object inline here, of course, or you can move it out to a separate file. It's just a piece of code like anything else.

## The `execute` function

Our `execute` function is where the tool is actually executed. Now, of course, the LLM doesn't execute our code for us, it tells us what code it wants executed and we, in our process, execute the code.

```ts
execute: async ({ message }) => {
  console.log(styleText(['green', 'bold'], message));

  return 'Message logged to console';
};
```

In this case, we're going to log styled text (green bold) message to the console. Anything we return back from the `execute` function will be passed back to the LLM as a report for what happened when it called this function.

So this means that the LLM can call a tool using this message `z.string()`, give us the function to execute here, we execute it and then tell the LLM what happened.

## Streaming the result

At the bottom here, we're just saying, for await chunk of result to UI message stream, so we should see all of the chunks of the stream:

```ts
for await (const chunk of result.toUIMessageStream()) {
  console.log(chunk);
}
```

And when we run this, we end up with a start, then a start step, so a step has begun. Then the tool inputs, just like everything else, actually stream from the LLM. So we have a tool input start, then a tool input delta, which is the entire actual message.

Then we can see it gets executed with this "Hello, world!" here. We then have another part coming called tool input available, tool output available, and this is the message that we've passed back to the LLM. And in this case, it finished the step and then finished its output.

```txt
{ type: 'start' }
{ type: 'start-step' }
{
  type: 'tool-input-start',
  toolCallId: 'B1iGVK2Sa3b0JRzJ',
  toolName: 'logToConsole',
  dynamic: false
}
{
  type: 'tool-input-delta',
  toolCallId: 'B1iGVK2Sa3b0JRzJ',
  inputTextDelta: '{"message":"Hello, world!"}'
}
Hello, world!
{
  type: 'tool-input-available',
  toolCallId: 'B1iGVK2Sa3b0JRzJ',
  toolName: 'logToConsole',
  input: { message: 'Hello, world!' }
}
{
  type: 'tool-output-available',
  toolCallId: 'B1iGVK2Sa3b0JRzJ',
  output: 'Message logged to console'
}
{ type: 'finish-step' }
{ type: 'finish' }
```

So hopefully that gives you a decent idea for how to declare these tools. Nice work, and I'll see you in the next one.

## Steps To Complete

- [ ] Try running our [`main.ts`](./main.ts) exercise code and see what happens.

- [ ] Try changing the prompt to something else, or experimenting with different tools. Why not try a `writeFile` tool?
