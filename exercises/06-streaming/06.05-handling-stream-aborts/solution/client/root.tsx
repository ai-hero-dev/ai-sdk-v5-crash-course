import { useChat } from '@ai-sdk/react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertCircle } from 'lucide-react';
import { ChatInput, Message, Wrapper } from './components.tsx';
import './tailwind.css';

const App = () => {
  const { messages, sendMessage, error, stop, status } = useChat(
    {},
  );

  const [input, setInput] = useState(
    `Tell me a long story involving an owl.`,
  );

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          parts={message.parts}
        />
      ))}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-red-300 bg-red-900/20 border border-red-500/30 rounded-lg">
          <AlertCircle className="size-5 flex-shrink-0" />
          <span>{error.message}</span>
        </div>
      )}
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
        onStop={() => stop()}
        isStreaming={status === 'streaming'}
      />
    </Wrapper>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
