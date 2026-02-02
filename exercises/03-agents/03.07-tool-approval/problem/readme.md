There's a fundamental tension when building AI agents: the more power you give them, the more useful they become, but the more likely they are to make costly mistakes. A destructive action like sending an email can't be undone.

The solution is human-in-the-loop approval. Before the LLM executes risky actions, it asks for your permission first. Fortunately, the [AI SDK](https://ai-sdk.dev/docs/introduction) has built-in support for this pattern, so you don't need to implement it from scratch.

In this exercise, you'll add approval workflows to a `sendEmail` tool, creating a UI that lets users review and approve emails before they're sent.

## Steps To Complete

### Set Up the Backend

- [ ] Add `needsApproval: true` to the `sendEmail` tool definition in `api/chat.ts`

This tells the AI SDK that this tool requires user approval before execution.

```ts
const tools = {
  sendEmail: tool({
    description: 'Send an email to a recipient',
    inputSchema: z.object({
      to: z
        .string()
        .describe('The email address of the recipient'),
      subject: z.string().describe('The subject of the email'),
      body: z.string().describe('The body of the email'),
    }),
    needsApproval: true,
    // TODO: Add needsApproval: true to require user approval before sending
    execute: async ({ to, subject, body }) => {
      // In a real app, this would send an email
      console.log(`Sending email to ${to}: ${subject}`);
      return { sent: true, to, subject };
    },
  }),
};
```

### Build the Frontend UI

- [ ] Add the `addToolApprovalResponse` prop to the `Message` component in `client/components.tsx`

This prop is a function that takes an `id` (string) and `approved` (boolean).

```ts
export const Message = ({
  role,
  parts,
}: // TODO: Add addToolApprovalResponse prop, a function which takes in:
// - id: string
// - approved: boolean
{
  role: string;
  parts: MyUIMessage['parts'];
})
```

- [ ] Render an approval UI when `part.state === 'approval-requested'`

Check for the `approval-requested` state and display the email details (to, subject, body) with approve and reject buttons.

```ts
if (part.type === 'tool-sendEmail') {
  // TODO: Check if part.state === 'approval-requested'
  // If so, render the email preview with approve/reject buttons
  // Use addToolApprovalResponse({ id: part.approval.id, approved: true/false })
```

When the user clicks approve, call `addToolApprovalResponse({ id: part.approval.id, approved: true })`. When they click reject, use `approved: false`.

### Wire Up the Parent Component

- [ ] Get `addToolApprovalResponse` from [`useChat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) in `client/root.tsx`

The [`useChat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) hook returns this function directly.

```ts
const { messages, sendMessage, addToolApprovalResponse } =
  useChat<MyUIMessage>({
    // TODO: Get addToolApprovalResponse from useChat
    // TODO: Add sendAutomaticallyWhen option using
    // lastAssistantMessageIsCompleteWithApprovalResponses
  });
```

- [ ] Pass `addToolApprovalResponse` down to the `Message` component

```ts
{messages.map((message) => (
  <Message
    key={message.id}
    role={message.role}
    parts={message.parts}
    // TODO: Pass addToolApprovalResponse to Message
  />
))}
```

- [ ] Add the `sendAutomaticallyWhen` option to [`useChat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)

Import [`lastAssistantMessageIsCompleteWithApprovalResponses`](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage) from the [AI SDK](https://ai-sdk.dev/docs/introduction) and pass it to the hook. This automatically sends responses once all approvals are handled.

```ts
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';

const { messages, sendMessage, addToolApprovalResponse } =
  useChat<MyUIMessage>({
    sendAutomaticallyWhen:
      lastAssistantMessageIsCompleteWithApprovalResponses,
  });
```

### Test Your Implementation

- [ ] Run the dev server with `pnpm run dev`

- [ ] Send a message: "Send an email to bob@example.com saying hello"

The LLM should call the `sendEmail` tool and display your approval UI.

- [ ] Test the approve button

Click approve and check your browser console. You should see `Sending email to bob@example.com: hello`.

- [ ] Test the reject button

Reject an email and verify the LLM asks for follow-up information instead of sending it.
