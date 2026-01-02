# AI SDK v6 DevTools Lessons

## 01.12 - DevTools Basics (end of basics section)

**Format: explainer**
**Setup: client-server (api/client)**

### Caveats
- Experimental feature introduced in v6
- Will NOT appear throughout rest of repo
- Included because new in v6

### Content
Show DevTools working with multiple functions:

```ts
// Active example with generateText
const result = await generateText({
  model,
  prompt: '...',
});

// Commented out alternatives for user to try:
// const stream = streamText({ ... });
// const obj = await generateObject({ ... });
```

User can uncomment different approaches to see how DevTools displays each.

## 03.0x - DevTools with Tool Calls (end of agents section)

**Format: explainer**
**Setup: client-server (api/client)**

### Content
- Show how DevTools displays tool calls
- DevTools specifically designed to show tool calls nicely
- Visual breakdown of tool invocations, inputs, outputs

### Notes
- Comes after ToolLoopAgent and MCP lessons
- Mini explainer video
