Let's look at the most basic functionality of the AI SDK, generating some text. You need two inputs to generate some text. You need:

- a model that you're going to use
- a prompt that you're going to pass to that model

I've given you a couple of to-dos inside the [`main.ts`](./main.ts) file. The first to-do is to choose a model and then instantiate it. This means going up to the `@ai-sdk/google` import here, grabbing the `google` function and then calling it with the model that you want to choose.

```ts
// Import the necessary functions
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// TODO: Choose a model. I recommend using the Google Gemini model:
// gemini-2.5-flash
const model = TODO;
```

We've got a prompt here asking what is the capital of France:

```ts
const prompt = 'What is the capital of France?';
```

And then this `result` is going to be the result of this [`generateText`](./main.ts) call that we get from the `ai` package here. You're going to call `generateText`, passing in the model that you chose and passing in the prompt and then you're going to await it and get the result back.

```ts
const result = TODO; // TODO: Use generateText to get the result
```

Finally, we're going to `console.log` the text:

```ts
console.log(result.text);
```

This means that when you run this exercise, you should see the LLM that we contacted answering the question that we asked it.

That's it, a nice, simple exercise to start with.

Good luck and I will see you in the solution.

## Steps To Complete

- [ ] Choose a model by replacing the `TODO` in the model declaration with the Google Gemini model.

- [ ] Use the `generateText` function to get the result by replacing the `TODO` in the result declaration.

- [ ] Run the code and check the terminal output to verify that you get a response about the capital of France.

- [ ] If you get stuck, check the solution.
