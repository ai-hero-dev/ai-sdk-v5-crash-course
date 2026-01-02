import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileIcon,
  FileInput,
  Upload,
  XIcon,
} from 'lucide-react';

export const Wrapper = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch">
      {props.children}
    </div>
  );
};

export const Message = ({
  role,
  parts,
}: {
  role: string;
  parts: UIMessagePart<UIDataTypes, UITools>[];
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
    <div className="prose prose-invert my-6">
      <ReactMarkdown>{prefix + text}</ReactMarkdown>
    </div>
  );
};

export const ChatInput = ({
  input,
  onInputChange,
  onFileSelect,
  selectedFile,
  onSubmit,
}: {
  input: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!fileInputRef.current) return;

    if (!selectedFile) {
      fileInputRef.current.value = '';
    }
  }, [selectedFile]);

  return (
    <form
      onSubmit={onSubmit}
      className="fixed bottom-0 w-full max-w-xl p-2 mb-8 rounded shadow-xl bg-gray-800 flex gap-2 items-center"
    >
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title="Upload file"
        >
          <Upload className="w-5 h-5 text-gray-300" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      <div className="flex-1 flex gap-3 items-center p-2 px-3 border-2 border-zinc-700 rounded shadow-xl bg-gray-800 focus-within:outline-2">
        {selectedFile && (
          <div className="text-xs text-gray-400 bg-gray-700 py-1 px-2 flex-shrink-0 flex gap-2 items-center rounded -ml-1">
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="text-gray-400 hover:text-gray-300"
            >
              <XIcon className="size-4" />
            </button>
            <span>{selectedFile.name}</span>
          </div>
        )}
        <input
          className="w-full outline-0"
          value={input}
          placeholder="Say something..."
          onChange={onInputChange}
          autoFocus
        />
      </div>
    </form>
  );
};
