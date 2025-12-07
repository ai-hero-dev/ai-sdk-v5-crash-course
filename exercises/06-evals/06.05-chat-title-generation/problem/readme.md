Now we understand the basics about evals and how you can use LLM as a judge, scorers, and deterministic scorers. I want to put you in a situation where you can do some eval-driven development. We're going to redo an exercise that we did before: generating titles from a chat history.

## The Eval

We have an eval here called chat title generation that simply calls `generateText` passing in `google('gemini-2.5-flash-lite')` and says "generate me a title based on an input.":

```typescript
const result = await generateText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    Generate me a title:
    ${input}
  `,
});
```

Your job, and it is a pretty free-form job, is to improve this prompt by leveraging a dataset that I have prepared for you.

## The Dataset

We have a `titles-dataset.csv` which has two columns: an input and a desired output. Here are some examples from the dataset:

| Input                                                   | Output                       |
| ------------------------------------------------------- | ---------------------------- |
| Did Google just release their latest smartwatch?        | Google watch release date    |
| How do I set up authentication in Next.js?              | Next.js authentication setup |
| What are some recent changes to React Query?            | React Query recent changes   |
| Is there a way to optimize my Tailwind CSS bundle size? | Tailwind CSS optimization    |
| When is the next Apple iPhone event?                    | Apple iPhone event schedule  |

I manually wrote the first 5-10 entries and then I got an LLM to generate the rest.

In the eval, I'm reading the CSV file and parsing it into an array with input and output. Then I'm slicing off only the first five of the dataset and mapping that into a format that Evalite expects:

```typescript
const EVAL_DATA_SIZE = 5;

const dataForEvalite = data.data
  .slice(0, EVAL_DATA_SIZE)
  .map((row) => ({
    input: row.Input,
    expected: row.Output,
  }));
```

## The Plan

Here's how I recommend you complete this exercise:

1. Run these evals without any scorers just to get a kind of baseline of what's happening. You can use an `EVAL_DATA_SIZE` of 5 just to start with.
2. From there, iterate on the prompts just to get the first five working. You can use the prompt template that we talked about in our [previous exercises](/exercises/05-context-engineering/05.01-the-template/explainer/readme.md). Right now, the prompt is very basic:

```typescript
const result = await generateText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    Generate me a title:
    ${input}
  `,
});
```

3. Once you've got the first five working, expand the dataset to let's say 15. The way you're going to evaluate this is by hand: comparing the output from your system to what is expected from the dataset.

For instance, in the dataset it might say "react query recent changes" but in your output it might say "react query latest updates." Initially, you can just visually check between the golden output and your output to see if they're good enough.

4. Once that phase is over, consider adding a deterministic scorer once you get a sense for what you want your outputs to be. One example would be to check if the output is over a certain length.

At this point, the scorer will act more like an assistant - giving you extra feedback while you're manually evaluating the outputs.

5. Finally, you may consider using an llm-as-a-judge scorer. For that, you could take the input, the desired output, and the actual output of your system, and ask the LLM to say whether the output is comparable in quality to the expected output.

They don't have to be exactly the same, but if they're comparable in quality then you can say yes, that's a win.

Consider this your chance to experiment with evals, trying to do some eval-driven development in a very free-form way. Good luck!

## Steps To Complete

- [ ] Run the evals without any scorers to get a baseline
  - Set `EVAL_DATA_SIZE` to 5
  - Observe the current outputs vs expected outputs

- [ ] Improve the prompt template
  - Use techniques from previous exercises
  - Modify the prompt to better generate titles that match the expected output

- [ ] Test with first 5 entries until you get good results
  - Compare your outputs visually against the expected outputs

- [ ] Expand the dataset size
  - Change `EVAL_DATA_SIZE` to 15
  - Test your prompt with more examples

- [ ] Add a deterministic scorer
  - Create a scorer that checks for output length
  - Add it to the `scorers` array in the eval

- [ ] Implement an LLM-as-judge scorer
  - Create a scorer that compares the quality of your output to the expected output
  - Add it to the `scorers` array in the eval
