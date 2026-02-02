import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { MyUIMessage } from '../api/chat.ts';

export const Wrapper = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {props.children}
    </div>
  );
};

export const Message = ({
  role,
  parts,
  addToolApprovalResponse,
}: {
  role: string;
  parts: MyUIMessage['parts'];
  addToolApprovalResponse: (response: {
    id: string;
    approved: boolean;
  }) => void;
}) => {
  const prefix = role === 'user' ? 'User: ' : 'AI: ';

  const text = parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text;
      }
      return '';
    })
    .join('');

  return (
    <div className="flex flex-col gap-2">
      <div className="prose prose-invert my-6">
        <ReactMarkdown>{prefix + text}</ReactMarkdown>
      </div>
      {parts.map((part, index) => {
        if (part.type === 'tool-sendEmail') {
          if (part.state === 'approval-requested') {
            return (
              <div
                key={index}
                className="bg-amber-900/20 border border-amber-700 rounded p-4"
              >
                <div className="font-semibold text-amber-300 mb-3">
                  Review Email
                </div>
                <div className="text-amber-200 space-y-2 mb-4">
                  <div>
                    <span className="font-medium">To:</span>{' '}
                    {part.input.to}
                  </div>
                  <div>
                    <span className="font-medium">Subject:</span>{' '}
                    {part.input.subject}
                  </div>
                  <div>
                    <span className="font-medium">Body:</span>
                    <div className="mt-1 p-2 bg-amber-950/50 rounded text-sm">
                      {part.input.body}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      addToolApprovalResponse({
                        id: part.approval.id,
                        approved: true,
                      })
                    }
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
                  >
                    Send
                  </button>
                  <button
                    onClick={() =>
                      addToolApprovalResponse({
                        id: part.approval.id,
                        approved: false,
                      })
                    }
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }
          if (part.state === 'output-available') {
            return (
              <div
                key={index}
                className="bg-green-900/20 border border-green-700 rounded p-3 text-sm"
              >
                <div className="font-semibold text-green-300 mb-1">
                  Email Sent
                </div>
                <div className="text-green-200">
                  To: {part.input.to}
                </div>
              </div>
            );
          }
        }
        return null;
      })}
    </div>
  );
};

export const ChatInput = ({
  input,
  onChange,
  onSubmit,
  disabled,
}: {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}) => (
  <form onSubmit={onSubmit}>
    <input
      className={`fixed bottom-0 w-full max-w-md p-2 mb-8 border-2 border-zinc-700 rounded shadow-xl bg-gray-800 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      value={input}
      placeholder={
        disabled
          ? 'Please handle tool calls first...'
          : 'Say something...'
      }
      onChange={onChange}
      disabled={disabled}
      autoFocus
    />
  </form>
);
