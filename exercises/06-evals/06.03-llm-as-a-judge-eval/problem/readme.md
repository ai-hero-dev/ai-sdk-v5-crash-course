There are some situations where deterministic evals simply won't cut it. What if you want to measure how good an answer is from an LLM? Well, what does "good" mean as a metric?

Do we want the answer to be:

- Humorous?
- Accurate?
- Factual?
- Well-attributed?

For these kind of questions, you'll often be thinking, "I wish I just had an assistant I could use to go through all these responses and grade them."

When you have that desire, it might be time to reach for an LLM-as-a-judge eval.

Turns out that LLMs are really good at evaluating the output of other LLMs. Instead of having to rely on a hypothetical assistant to evaluate everything, you can pass that job to an LLM itself.

## The Setup

We're inside the [`question-answerer.eval.ts`](./evals/question-answerer.eval.ts) function. We've created a task here that takes in a PDF.

The PDF I've picked is the chain of thought prompting paper. It's the first paper that defined the idea of chain of thought prompting.

```ts
evalite('Chain Of Thought Paper', {
  data: () => [
    {
      input: 'What is chain of thought prompting?',
    },
    {
      input:
        'Why do the authors of the paper think that chain of thought prompting produces improvements?',
    },
  ],
  task: async (input) => {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: `
        You are a helpful assistant that can answer questions about the chain of thought prompting paper.

        ALWAYS use quotes from the paper when answering the question.
      `,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: input,
            },
            {
              type: 'file',
              data: chainOfThoughtPaper,
              mediaType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return result.text;
  },
  // Scorers are below...
```

## The Scorers

We're going to take those inputs and pass them to a `generateText` call with a system prompt instructing the AI to always use quotes from the paper when answering.

We have two evaluators at the bottom of our `evalite` configuration:

```ts
  scorers: [
    {
      name: 'Includes Quotes',
      scorer: ({ input, output, expected }) => {
        const quotesFound = output.includes('"');

        return quotesFound ? 1 : 0;
      },
    },
    attributionToChainOfThoughtPaper,
  ],
});
```

1. A simple evaluator that checks whether the output includes quotes - this is a deterministic eval
2. Another scorer - `attributionToChainOfThoughtPaper`. This is where we'll be doing most of our work.

## The Attribution Scorer

Inside the [`attribution-eval.ts`](./evals/attribution-eval.ts) evaluator, we're calling `createScorer`, which is the way you create scorers in separate files:

```ts
export const attributionToChainOfThoughtPaper = createScorer<
  string,
  string
>({
  name: 'Attribution',
  scorer: async ({ input, output, expected }) => {
    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      system: ATTRIBUTION_PROMPT,
      messages: TODO, // TODO: Pass the chain of thought paper, the question and the answer given
      schema: TODO, // TODO: Define the schema for the response
    });

    // NOTE: it's important to use a string-based score for the
    // LLM, since LLM's are notorious for being biased towards
    // different numbers.

    // So, we get the LLM to return a string score, and then
    // we map it to a number.
    const scoreMap = {
      A: 1,
      B: 0.5,
      C: 0,
      D: 0,
    };

    return {
      score: scoreMap[result.object.score],
      metadata: result.object.feedback,
    };
  },
});
```

This evaluator takes in the input (question), the output (answer), and evaluates whether the quotes pulled from the paper accurately represent the intention of the paper and cite sources properly.

We're using a specific attribution prompt:

```ts
const ATTRIBUTION_PROMPT = `
You are a helpful assistant that can answer questions about the chain of thought prompting paper.

Your job is to work out if the answer has been properly attributed to the paper.

Reply with a score of A, B, C or D.

A: The answer is backed up by the contents of the paper, and cites sources accurately.
B: The answer is somewhat backed up by the contents of the paper, or sources are misattributed or inaccurate.
C: The answer misconstrues the intention of the paper.
D: The answer does not provide sources from the paper.
`;
```

## The Task

For the implementation, we need to complete two TODOs:

1. Pass in the chain of thought paper, the question, and the answer to the `messages` object
2. Define the schema for the response

There's an intriguing note about using string-based scores (A, B, C, D) instead of numeric scores with LLMs, since LLMs can be biased toward certain numbers. We then map these string scores to numeric values.

With LLM-as-judge evals, you really want them to explain what they're doing and why they gave a certain score, which is why we're returning both the score and metadata (feedback/reasoning):

```ts
return {
  score: scoreMap[result.object.score],
  metadata: result.object.feedback,
};
```

Once all that's set up, you can add more data points to test if the system can be broken or to experiment with it.

Good luck, and I'll see you in the solution.

## Steps To Complete

- [ ] Pass the chain of thought paper, the question, and the answer to the `messages` object in the [`attributionToChainOfThoughtPaper`](./evals/attribution-eval.ts) scorer

- [ ] Define the schema for the LLM response using zod, which should include a feedback string and a score enum ('A', 'B', 'C', 'D')

- [ ] Optional: Add more test cases to the `data` function in [`question-answerer.eval.ts`](./evals/question-answerer.eval.ts) to further test the system

- [ ] Run the exercise to see if your implementation correctly evaluates the LLM's responses about the Chain of Thought paper

- [ ] Look at the metadata returned by the LLM judge evaluator (by clicking on the test case and looking in the right-hand panel)

- [ ] Debug any issues by checking the metadata (feedback) returned by the LLM judge evaluator
