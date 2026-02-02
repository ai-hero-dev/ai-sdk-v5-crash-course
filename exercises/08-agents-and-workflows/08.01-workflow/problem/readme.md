So far, we've mostly been dealing with agents as a setup. An agent is where you've hand full control of your control flow of your application to an LLM. In other words, you give the LLM a bunch of tools and the LLM goes, right, I'll call this tool, then maybe call another tool, and that can produce some mixed results.

It can be extremely good for open-ended tasks, but less good for tasks where you know that one step should always follow another step.

## Generator-Evaluator Workflow

The goal of this exercise is to show you what you can do with a deterministic workflow setup. We're going to use a generator-evaluator workflow where we:

1. Have one LLM create a Slack message for us
2. Get another LLM to evaluate it
3. Produce a final draft and stream that to the user

This should give us a better output than just generating a message with a single LLM call.

## The Code

Here's the structure of the code we'll be working with:

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const writeSlackResult = TODO; // Write Slack message

  const evaluateSlackResult = TODO; // Evaluate Slack message

  const finalSlackAttempt = TODO; // Write final Slack message

  return finalSlackAttempt.toUIMessageStreamResponse();
};
```

All the code you're gonna be writing is inside this POST request. We have an initial `writeSlackResult` up here, then an `evaluateSlackResult` where we're gonna take the message from this first one and pass it to the second one, and then finally we have a `finalSlackAttempt`.

## Helper Functions and Prompts

We've been provided with useful system prompts for each step:

```ts
const WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM = `You are writing a Slack message for a user based on the conversation history. Only return the Slack message, no other text.`;

const EVALUATE_SLACK_MESSAGE_SYSTEM = `You are evaluating the Slack message produced by the user.

  Evaluation criteria:
  - The Slack message should be written in a way that is easy to understand.
  - It should be appropriate for a professional Slack conversation.
`;

const WRITE_SLACK_MESSAGE_FINAL_SYSTEM = `You are writing a Slack message based on the conversation history, a first draft, and some feedback given about that draft.

  Return only the final Slack message, no other text.
`;
```

We also have a helper function to format the message history:

```ts
const formatMessageHistory = (messages: UIMessage[]) => {
  return messages
    .map((message) => {
      return `${message.role}: ${message.parts
        .map((part) => {
          if (part.type === 'text') {
            return part.text;
          }

          return '';
        })
        .join('')}`;
    })
    .join('\n');
};
```

The final draft will be streamed directly to the frontend, so the user will only see the best attempt so far.

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Implement the first `writeSlackResult` function to generate the initial Slack message draft using the Google Gemini model with the provided system prompt. You'll need to use [`generateText`](/exercises/01-ai-sdk-basics/01.05-generating-text/problem/readme.md) here.

- [ ] Implement the `evaluateSlackResult` function to evaluate the first draft using another LLM call with the evaluation system prompt - again, with [`generateText`](/exercises/01-ai-sdk-basics/01.05-generating-text/problem/readme.md).

- [ ] Implement the `finalSlackAttempt` function to stream the final Slack message based on the conversation, first draft, and feedback. You'll need to use [`streamText`](/exercises/01-ai-sdk-basics/01.06-stream-text-to-terminal/problem/readme.md) here and then [`.toUIMessageStreamResponse()`](/exercises/01-ai-sdk-basics/01.08-stream-text-to-ui/problem/readme.md) to pass the final response.

- [ ] Test your implementation by running the local dev server and submitting the pre-filled prompt in the UI. While you won't see the initial draft or evaluation, you should see the final result.

- [ ] Observe whether the three-step process produces a better result than a single LLM call would, checking the final streamed response in the UI.
