It's sometimes useful when you're talking to an LLM, when you want it to do something that's relatively complex, to get it to plan its work ahead of time. This was popularized by the idea of chain of thought, where you get the LLM to "think step by step".

In practical terms, what this means is the LLM will:

- output tokens where it displays its thinking
- only then will it go on to solve the problem

The task we're going to try this out on is explaining TypeScript code.

(For those who don't know, a decent chunk of my career has been spent teaching TypeScript, so I'm sort of training an LLM to do my job. Whoops)

## The Existing Prompt

We've provided it some detailed task context here:

```typescript
const result = streamText({
  model: google('gemini-2.5-flash-lite'),
  prompt: `
    <task-context>
    You are a helpful TypeScript expert that can explain complex TypeScript code for beginner TypeScript developers. You will be given a complex TypeScript code and you will need to explain it in a way that is easy to understand.
    </task-context>

    <background-data>
    Here is the complex TypeScript code:
    <code>
    ${COMPLEX_TS_CODE}
    </code>

    And here is an article about the IIMT pattern:
    <article>
    ${IIMT_ARTICLE}
    </article>
    </background-data>

    <rules>
    - Do not let the user know that you are using the article as a reference. Refer to the concepts as if you are an expert.
    - Use section headers to organize the explanation.
    </rules>

    <the-ask>
    Explain the code, using the article as a reference.
    </the-ask>
  `,
});
```

We're passing in some [`COMPLEX_TS_CODE`](./complex-ts-code.ts) into the background data as code, and I'm also passing in an article about the [immediately indexed map type pattern](https://www.totaltypescript.com/immediately-indexed-mapped-type).

If you don't know what this is, don't worry. The idea here is for the LLM to produce some text that's going to explain it to you.

We've got a couple of rules down here, and we've got the ask, which is to explain the code using the article as a reference.

Now, if we run this, we notice it generates an answer for a little bit and then writes to an `output.md` file.

```txt
Generating answer
....................
```

This produces a pretty decent article, really. I advise that you read through it and try to get a sense for the basics.

## Improving The Prompt

From experience, the way that you optimally teach a complex piece of TypeScript like this is you break it down into its individual components. You then explain every single piece of code with different code samples, showing how every little bit works on its own, and then you bring it all together.

_This_ is why I want the LLM to burn a few tokens planning this ahead of time. Ideally, it would figure out the optimal path for the user to understand the code, including all of the syntax.

The way we're going to do this is we're going to add some instructions telling the model to **think about its answer first** before it responds. That's our first TODO.

```ts
// TODO: Add some instructions telling the model to think about its answer first before it responds. Consider the optimal path for the user to understand the code, including each individual piece of syntax.
```

## Output Format

Now, if we just add the instruction to think harder and consider the optimal path, it will return that thinking as a block at the very start of the article:

```txt
OK, let me think about the output. Thinking...

Code explanation begins here.
```

A better way to do that would be for it to wrap its thinking in thinking XML tags:

```txt
<thinking>
OK, let me think about the output. Thinking...
</thinking>

Code explanation begins here.
```

This way, we could make them visually distinct in the frontend.

So, we're going to specify an output format telling the model to return two sections, a thinking XML block and an answer.

Here's where we need to make the changes, at the TODOs in the code:

```typescript
// TODO: Add an output format telling the model to return two sections - a <thinking> block and an answer. The answer should NOT be wrapped in an <answer> tag.
```

So that's the goal: get the model to break down the individual pieces of information that the user needs to know and return that in a thinking XML tag before the actual answer. And hopefully the eventual answer that gets produced will be of better quality than the one we initially got.

Good luck, and I will see you in the solution.

## Steps To Complete

- [ ] Add instructions to the prompt that tell the model to think about its answer first before responding
  - Tell the model to plan the optimal path for user understanding
  - Make sure to include instructions about breaking down individual syntax elements

- [ ] Add an output format instruction to the prompt
  - Specify that the output should include a `<thinking>` XML block
  - Specify that after the thinking block should come the answer
  - Make it clear that the answer should NOT be wrapped in an `<answer>` tag

- [ ] Run the exercise using `pnpm run exercise` to test your implementation
  - Check that the output in the terminal shows dots as the answer generates
  - Verify that the output.md file contains a well-structured explanation
