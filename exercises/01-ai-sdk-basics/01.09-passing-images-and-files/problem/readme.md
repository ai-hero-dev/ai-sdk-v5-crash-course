Sometimes you need to be able to use more than text to prompt your LLM. You might need it to describe images, to extract data from PDFs.

Fortunately, the AI SDK provides a way of passing files through the wire so that your backend, where you actually contact the LLM, can pick them up.

## Our Frontend

I've given our frontend a couple of upgrades, namely the ability to upload files. I've given you an image that you can upload, and the plan is to ask the LLM to describe the image.

Our [`/api/chat`](./api/chat.ts) POST endpoint looks very similar to previous exercises:

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
    messages: modelMessages,
  });

  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
```

We're calling Gemini 2.5 Flash, which is a model that can handle images. Not all models can handle images, so check your provider details for more info.

We're converting the messages that we get from the body into `ModelMessage`s, passing those messages directly into `streamText`, then turning that into a `UIMessageStream`, which we stream back to the frontend.

## The TODO

The only TODO inside this exercise is in the [frontend](./client/root.tsx).

The issue is really on the `sendMessage` function. Currently, we are only sending a message with the text:

```tsx
<ChatInput
  // ...
  onSubmit={async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get('file') as File;

    // TODO: figure out how to pass the file
    // _as well as the text_ to the
    // /api/chat route!

    // NOTE: You have a helpful function below
    // called fileToDataURL that you can use to
    // convert the file to a data URL. This
    // will be useful!
    sendMessage({
      text: input,
    });

    // ...
  }}
/>
```

We're extracting the file off the form data that we get from the `onSubmit` event, but we're not actually passing it to the `sendMessage` function.

Your job is to look inside this `sendMessage` function, and especially look at the parts array here, which is going to tell you some interesting little features. Using parts, you should be able to send both a text part and a file part.

## The `fileToDataURL` Function

There is also a `fileToDataURL` function down at the bottom that I've provided to you:

```ts
const fileToDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

When we send the file part, we're going to need to turn it into a data URL so that we can send it.

Once this is done, you should be able to upload any image and tell the LLM what you want doing with that image, either to describe it or do a bit of OCR or anything.

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Modify the `sendMessage` call to include both text and file data
  - You'll need to use the `parts` array to send both types of data. Use autocompletion to find the right type.
  - Convert the file to a data URL using the provided `fileToDataURL` function

- [ ] Test your implementation by uploading an image
  - Run the exercise with `pnpm run exercise`
  - Upload an image using the file upload button
  - Ask a question about the image (e.g., "Can you describe this image?")
  - Verify that the LLM responds with a description of the image
