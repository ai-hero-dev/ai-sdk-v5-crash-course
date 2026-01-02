Generating text with AI is powerful, but waiting for the entire output can make applications feel unresponsive. Modern AI applications stream text to users as it's being generated, creating a more dynamic experience.

This streaming process is complex, but the AI SDK simplifies it for us. In this exercise, we'll use the Google model to generate a story about an imaginary planet and stream the output directly to our terminal.

Let's look at the problem we need to solve:

```ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const model = google('gemini-2.5-flash');

const prompt =
  'Give me the first paragraph of a story about an imaginary planet.';

const stream = TODO; // TODO - stream some text with the model above.

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

We need to replace the `TODO` with code that creates a text stream using the [`streamText`](./main.ts) function from the AI SDK.

The `streamText` function requires a `model` and a `prompt`. We already have both of these defined in our code.

We need to pass these values to [`streamText`](./main.ts) to create our `stream` object, which will then allow us to access the `textStream` property.

The `for await` loop will iterate through each chunk of text as it's generated, and `process.stdout.write()` will display it in the terminal without adding new lines (unlike `console.log`).

This approach allows us to see the text appearing incrementally as the AI generates it, creating that responsive streaming effect you see in modern AI applications.

## Steps To Complete

- [ ] Replace the `TODO` with a call to the `streamText` function.

- [ ] Make sure to pass an object containing the `model` and `prompt` variables to `streamText`.

- [ ] Run the code in your terminal to see the text streaming in real-time.

- [ ] Observe how the text appears incrementally rather than all at once.

- [ ] If everything is working correctly, you should see a paragraph about an imaginary planet appear gradually in your terminal.

- [ ] If you get stuck, check the solution.
