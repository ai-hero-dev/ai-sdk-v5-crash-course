# Tool Approval Lesson (end of agents)

**Format: problem-solution**
**Setup: client-server with frontend partially built**

## Scenario
User wants to preview an email before sending. Approve or reject the send.

## Backend: needsApproval on tool

```ts
import { tool } from 'ai';
import { z } from 'zod';

export const sendEmailTool = tool({
  description: 'Send an email',
  inputSchema: z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
  }),
  needsApproval: true, // Require user approval
  execute: async ({ to, subject, body }) => {
    // Send email logic
    return { sent: true };
  },
});
```

## Frontend: approval UI component

```tsx
export function EmailToolView({ invocation, addToolApprovalResponse }) {
  if (invocation.state === 'approval-requested') {
    return (
      <div>
        <p>Send this email?</p>
        <p>To: {invocation.input.to}</p>
        <p>Subject: {invocation.input.subject}</p>
        <p>{invocation.input.body}</p>
        <button
          onClick={() =>
            addToolApprovalResponse({
              id: invocation.approval.id,
              approved: true,
            })
          }
        >
          Send
        </button>
        <button
          onClick={() =>
            addToolApprovalResponse({
              id: invocation.approval.id,
              approved: false,
            })
          }
        >
          Cancel
        </button>
      </div>
    );
  }

  if (invocation.state === 'output-available') {
    return <div>Email sent!</div>;
  }
}
```

## useChat hook setup

```ts
import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';

const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

## Problem setup
- Frontend component partially built (shows email preview)
- User needs to:
  1. Add `needsApproval: true` to tool
  2. Hook up `addToolApprovalResponse` from useChat
  3. Wire up approve/reject buttons

## Open Questions
- When does reject reason come in? (need to investigate API)
