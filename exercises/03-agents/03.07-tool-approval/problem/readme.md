Sometimes you don't want a tool to execute immediately. For actions like sending emails, deleting data, or making payments, you want the user to review and approve before the tool runs.

The AI SDK v6 provides a built-in tool approval system using `needsApproval`. When a tool has `needsApproval: true`, it pauses execution and waits for the user to approve or reject.

## The Exercise

We have an email assistant that can send emails. Right now, the `sendEmail` tool in [`api/chat.ts`](./api/chat.ts) executes immediately without any user confirmation.

```ts
sendEmail: tool({
  description: 'Send an email to a recipient',
  inputSchema: z.object({
    to: z.string().describe('The email address of the recipient'),
    subject: z.string().describe('The subject of the email'),
    body: z.string().describe('The body of the email'),
  }),
  // TODO: Add needsApproval: true to require user approval before sending
  execute: async ({ to, subject, body }) => {
    // In a real app, this would send an email
    console.log(`Sending email to ${to}: ${subject}`);
    return { sent: true, to, subject };
  },
}),
```

Your job is to:

1. Add `needsApproval: true` to the tool definition
2. Get `addToolApprovalResponse` from `useChat` in [`root.tsx`](./client/root.tsx)
3. Add `sendAutomaticallyWhen` to continue the conversation after approval
4. Wire up the approve/reject buttons in [`components.tsx`](./client/components.tsx)

## Tool States

When a tool has `needsApproval: true`, the tool invocation will have different states:

- `approval-requested` - Tool is waiting for user approval
- `output-available` - Tool executed successfully after approval

In the `approval-requested` state, you can access `part.approval.id` to call `addToolApprovalResponse`.

## Auto-Submit After Approval

By default, after you call `addToolApprovalResponse`, nothing happens until the user sends another message. To automatically continue the conversation after approval, use `sendAutomaticallyWhen`:

```ts
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';

const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

## Steps To Complete

- [ ] Add `needsApproval: true` to the `sendEmail` tool in `api/chat.ts`

- [ ] In `root.tsx`, get `addToolApprovalResponse` from `useChat`:

```ts
const { messages, sendMessage, addToolApprovalResponse } = useChat<MyUIMessage>({
  // ...
});
```

- [ ] Add `sendAutomaticallyWhen` to `useChat` using `lastAssistantMessageIsCompleteWithApprovalResponses` from `ai`

- [ ] Pass `addToolApprovalResponse` to the `Message` component

- [ ] In `components.tsx`, add the `addToolApprovalResponse` prop to the `Message` component

- [ ] Add a check for `part.state === 'approval-requested'` in the `Message` component. When in this state, render:
  - An email preview showing `to`, `subject`, and `body`
  - A "Send" button that calls `addToolApprovalResponse({ id: part.approval.id, approved: true })`
  - A "Cancel" button that calls `addToolApprovalResponse({ id: part.approval.id, approved: false })`

- [ ] Run the local dev server and test the approval flow by asking the assistant to send an email
