Many language models can process more than just text—they can analyze images, PDFs, and other files. The [AI SDK](/PLACEHOLDER/ai-sdk) provides built-in support for sending files to your LLM provider's API.

Right now, your chat application has a file upload button on the frontend, but it doesn't actually do anything with the file. The backend is expecting only text messages, so uploading an image won't work.

You need to modify the form submission handler to capture the uploaded file and send it along with the user's text message to the LLM.

## Steps To Complete

### Convert the File to a Data URL

- [ ] Look at the `fileToDataURL` helper function already provided in your code

This function converts a `File` object from the form into a string that the [AI SDK](/PLACEHOLDER/ai-sdk) can send over the network.

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

### Update the Form Submission Handler

- [ ] Modify the `onSubmit` callback in the `ChatInput` component

Instead of passing only `text` to `sendMessage()`, you need to pass a `parts` array that includes both a text part and an optional file part.

```ts
onSubmit={async (e) => {
  e.preventDefault();

  const formData = new FormData(
    e.target as HTMLFormElement,
  );
  const file = formData.get('file') as File | null;

  // TODO: figure out how to pass the file
  // _as well as the text_ to the
  // /api/chat route!

  // NOTE: You have a helpful function below
  // called fileToDataURL that you can use to
  // convert the file to a data URL. This
  // will be useful!

  // NOTE: Make sure you handle the case where
  // `file` is null!
  sendMessage({
    // NOTE: 'parts' will be useful
    text: input,
  });

  setInput('');
  setSelectedFile(null);
}}
```

Look at the [message parts documentation](/PLACEHOLDER/ai-sdk-message-parts) to understand the structure you need to create.

### Handle the Optional File Part

- [ ] Create a file part object only if a file exists

Use the `fileToDataURL` function to convert the file to a data URL string. Include the file's `mediaType` property so the LLM knows what kind of file it is.

- [ ] Update the `sendMessage()` call to use a `parts` array

The `parts` array should always include a text part with the user's input. If a file was selected, add a file part to the array as well.

Look at the solution code to see what the `FileUIPart` type looks like.

### Test Your Implementation

- [ ] Run the development server with `pnpm run dev`

Open http://localhost:3000 in your browser.

- [ ] Click the Upload File button and select the `image.png` file from the problem folder

This is an image of Lake Bled in Slovenia.

- [ ] Type "Could you describe this image?" in the chat input

- [ ] Submit the form and check that the LLM successfully analyzes the image

The model should describe what it sees in the image rather than failing silently.

- [ ] Make sure you're using a model that supports image analysis

[Gemini 2.5 Flash](/PLACEHOLDER/gemini-2.5-flash) has this capability built in.
