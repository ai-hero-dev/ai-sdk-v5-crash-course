Up until now, we've been flying blind with the AI SDK. We send requests to the LLM and get responses back, but we haven't had much visibility into what's actually happening under the hood.

The [AI SDK](https://ai-sdk.dev/docs/introduction) V6 shipped with [DevTools](https://ai-sdk.dev/docs/ai-sdk-core/devtools) - a powerful local development tool that lets you inspect every interaction with your language model. You can see request payloads, response streams, token usage, and even watch reasoning tokens get consumed in real-time.

This observability is critical when building with LLMs. It helps you debug issues, understand what's being sent to the provider, and optimize your prompts based on actual usage data.

## Steps To Complete

### Set Up DevTools Middleware

- [ ] Import `devToolsMiddleware` from `@ai-sdk/devtools`

The middleware comes from the [AI SDK DevTools](https://ai-sdk.dev/docs/ai-sdk-core/devtools) package and allows you to intercept and inspect LLM calls.

- [ ] Wrap your language model with `wrapLanguageModel()`

Use the [`wrapLanguageModel()`](https://ai-sdk.dev/docs/reference/ai-sdk-core/wrap-language-model) function from the [AI SDK](https://ai-sdk.dev/docs/introduction) to add the middleware to your model. Pass the model and the middleware to it:

```ts
import { google } from '@ai-sdk/google';
import { devToolsMiddleware } from '@ai-sdk/devtools';
import { wrapLanguageModel } from 'ai';

const model = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: devToolsMiddleware(),
});
```

### Launch DevTools

- [ ] Run your development server with `pnpm run dev`

This starts your local dev server which will be instrumented with DevTools.

- [ ] Open a new terminal window and run `npx @ai-sdk/devtools@latest`

This launches the DevTools UI at `http://localhost:4983`.

- [ ] Keep both terminal windows open side-by-side

One terminal runs your app, the other runs the DevTools interface.

### Test the Integration

- [ ] Navigate to `http://localhost:3000` in your browser

This is where your application is running.

- [ ] Make a request to your LLM (like asking "What's the capital of France?")

Send a message through your application UI.

- [ ] Switch to the DevTools tab at `http://localhost:4983`

You should now see a new run appear in the DevTools interface.

- [ ] Click into the run to inspect its details

Explore the different tabs available:

- **General**: See how long the request took and basic metrics
- **Usage**: View detailed token counts, including reasoning tokens if applicable
- **Request/Response**: Inspect the raw request payload and streaming response

### Verify Full Observability

- [ ] Check the token usage breakdown

Notice the input tokens, output tokens, and any reasoning tokens that were consumed.

- [ ] Review the request payload

Confirm you can see exactly what was sent to the LLM provider.

- [ ] Examine the streaming response

Understand how the response was streamed back from the provider.
