import { useChat } from '@ai-sdk/react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatInput, Message, Wrapper } from './components.tsx';
import './tailwind.css';
import type { MyUIMessage } from '../api/chat.ts';

const App = () => {
  // TODO: Get addToolApprovalResponse from useChat
  // TODO: Add sendAutomaticallyWhen option using lastAssistantMessageIsCompleteWithApprovalResponses
  const { messages, sendMessage } = useChat<MyUIMessage>({});

  const [input, setInput] = useState(
    'Send an email to bob@example.com saying hello',
  );

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          parts={message.parts}
          // TODO: Pass addToolApprovalResponse to Message
        />
      ))}
      <ChatInput
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({
            text: input,
          });
          setInput('');
        }}
      />
    </Wrapper>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
