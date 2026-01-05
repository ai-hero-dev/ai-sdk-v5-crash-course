# `/lesson` Skill Reference

Reference documentation for the `/lesson` Claude skill that manages AI Hero lesson repositories.

## Directory Hierarchy

```
exercises/
├── {NN}-{section-name}/           # Section: 01-ai-sdk-basics
│   └── {NN}.{NN}-{lesson-name}/   # Lesson: 01.05-generating-text
│       ├── problem/               # Exercise to solve
│       ├── solution/              # Reference implementation
│       ├── solution.1/            # Alternative solution
│       ├── explainer/             # Educational content
│       └── explainer.1/           # Multiple explanations
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Section | `{2-digit}-{kebab-case}` | `01-ai-sdk-basics` |
| Lesson | `{section}.{lesson}-{kebab-case}` | `01.05-generating-text` |
| Variant | `.{number}` suffix | `solution.1`, `explainer.2` |

## Required Files

| Folder Type | readme.md | main.ts |
|-------------|-----------|---------|
| problem/    | Required  | Required |
| solution/   | Optional  | Required |
| explainer/  | Required  | Required |

## main.ts Templates

### 1. React Dev Server

For full-stack exercises with React UI. Creates `client/` and `api/` subdirectories.

```typescript
import { runLocalDevServer } from '#shared/run-local-dev-server.ts';

await runLocalDevServer({
  root: import.meta.dirname,
});
```

**Directory structure:**
```
problem/
├── main.ts
├── readme.md
├── client/
│   └── root.tsx
└── api/
    └── chat.ts
```

### 2. Console Output (generateText)

For exercises that generate text and output to console.

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const result = await generateText({
  model: google('gemini-2.0-flash'),
  prompt: 'Your prompt here',
});

console.log(result.text);
```

### 3. Stream to Terminal (streamText)

For exercises that stream text to stdout.

```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const stream = streamText({
  model: google('gemini-2.0-flash'),
  prompt: 'Your prompt here',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### 4. Evalite Runner

For evaluation/testing exercises.

```typescript
import { runEvalite } from 'evalite/runner';

await runEvalite({
  cwd: import.meta.dirname,
  mode: 'watch-for-file-changes',
});
```

### 5. Readme Pointer

For explainers focused on reading, not execution.

```typescript
import path from 'node:path';

console.log(
  `Check out the readme at ${path.join(
    import.meta.dirname,
    'readme.md',
  )}`,
);
```

## README Templates

### Problem readme.md

```markdown
Brief context about the exercise (1-2 sentences).

## The Problem Setup

Explain what code exists and what needs to be done.

\`\`\`typescript
// Show existing code with TODO comments
const result = await generateText({
  model,
  prompt,
  // TODO: Add configuration here
});
\`\`\`

## Key Concept (optional)

Explain relevant APIs or functions that will help solve the problem.

## Hints (optional)

Provide guidance without giving away the answer.

## Steps To Complete

- [ ] First implementation step
- [ ] Second step with details
  - Sub-bullet for additional context
- [ ] Test your implementation
  - Run with \`pnpm run exercise\`
```

### Explainer readme.md

```markdown
Introductory context establishing what's being learned and why.

## Main Concept

Educational explanation with narrative prose.

### Subsection

Deeper dive into specific aspects.

\`\`\`typescript
// Working example code
const example = await generateText({
  model,
  prompt: 'Example prompt',
});
\`\`\`

Explanation of what the code does.

## Another Section (optional)

Additional concepts as needed.

## Steps To Complete

- [ ] Review the code in [\`main.ts\`](./main.ts)
- [ ] Understand how X works
- [ ] Try changing Y to see what happens
```

## Checkbox Format

Always use GitHub markdown checkboxes:

```markdown
## Steps To Complete

- [ ] First task description
- [ ] Second task with details
  - Sub-bullet for additional info
- [ ] Final verification step
```

## 99-reference Section

Special section for reference implementations:

- **Location**: `exercises/99-reference/`
- **Purpose**: Patterns and techniques used across multiple lessons
- **Format**: Explainer-only (no problem/solution)
- **Numbering**: Uses `99.XX` prefix

**Current references:**
- `99.01-ui-messages-vs-model-messages`
- `99.02-defining-tools`
- `99.03-consume-stream`
- `99.04-custom-data-parts-streaming`
- `99.05-custom-data-parts-stream-to-frontend`
- `99.06-custom-data-parts-id-reconciliation`
- `99.07-message-metadata`
- `99.08-streaming-text-parts-by-hand`
- `99.09-start-and-finish-parts`

## AI Hero CLI

The repo uses `ai-hero-cli` for exercise navigation:

```bash
pnpm dev        # Interactive exercise selector
pnpm exercise   # Alternative entry point
```

**Shortcuts:**
- `Enter` - Choose new exercise
- `n` - Next exercise
- `p` - Previous exercise
- `q` - Quit
- `h` - Help

## Section Overview

| Section | Name | Lessons |
|---------|------|---------|
| 01 | ai-sdk-basics | 13 |
| 02 | llm-fundamentals | 6 |
| 03 | agents | 8 |
| 04 | persistence | 7 |
| 05 | context-engineering | 4 |
| 06 | evals | 4 |
| 07 | streaming | 5 |
| 08 | agents-and-workflows | 3 |
| 09 | advanced-patterns | 5 |
| 99 | reference | 9 |
