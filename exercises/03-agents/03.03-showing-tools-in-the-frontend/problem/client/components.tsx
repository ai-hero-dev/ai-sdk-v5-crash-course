import React from "react";
import ReactMarkdown from "react-markdown";
import type { UIMessage } from "ai";
import type { MyUIMessage } from "../api/chat.ts";

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
}: {
	role: string;
	// TODO - replace the type of UIMessage with MyUIMessage
	parts: MyUIMessage["parts"];
}) => {
	const prefix = role === "user" ? "User: " : "AI: ";

	const text = parts
		.map((part) => {
			if (part.type === "text") {
				return part.text;
			}
			return "";
		})
		.join("");
	return (
		<div className="flex flex-col gap-2">
			<div className="prose prose-invert my-6">
				<ReactMarkdown>{prefix + text}</ReactMarkdown>
			</div>
			{parts.map((part, index) => {
				if (part.type === "tool-writeFile") {
					return (
						<div
							key={index}
							className="bg-blue-900/20 border border-blue-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-blue-300 mb-1">
								✍️ Wrote file
							</div>
							<div className="text-blue-200">
								Path: {part.input?.path || "Unknown"}
							</div>
						</div>
					);
				}
				if (part.type === "tool-readFile") {
					return (
						<div
							key={index}
							className="bg-green-900/20 border border-green-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-green-300 mb-1">
								📖 Read file
							</div>
							<div className="text-green-200">
								Path: {part.input?.path || "Unknown"}
							</div>
						</div>
					);
				}
				if (part.type === "tool-deletePath") {
					return (
						<div
							key={index}
							className="bg-red-900/20 border border-red-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-red-300 mb-1">
								🗑️ Deleted path
							</div>
							<div className="text-red-200">
								Path: {part.input?.path || "Unknown"}
							</div>
						</div>
					);
				}
				if (part.type === "tool-listDirectory") {
					return (
						<div
							key={index}
							className="bg-yellow-900/20 border border-yellow-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-yellow-300 mb-1">
								📁 Listed directory
							</div>
							<div className="text-yellow-200">
								Path: {part.input?.path || "Unknown"}
							</div>
						</div>
					);
				}
				if (part.type === "tool-createDirectory") {
					return (
						<div
							key={index}
							className="bg-purple-900/20 border border-purple-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-purple-300 mb-1">
								📂 Created directory
							</div>
							<div className="text-purple-200">
								Path: {part.input?.path || "Unknown"}
							</div>
						</div>
					);
				}
				if (part.type === "tool-exists") {
					return (
						<div
							key={index}
							className="bg-cyan-900/20 border border-cyan-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-cyan-300 mb-1">
								🔍 Checked existence
							</div>
							<div className="text-cyan-200">
								Path: {part.input?.path || "Unknown"}
							</div>
						</div>
					);
				}
				if (part.type === "tool-searchFiles") {
					return (
						<div
							key={index}
							className="bg-orange-900/20 border border-orange-700 rounded p-3 text-sm"
						>
							<div className="font-semibold text-orange-300 mb-1">
								🔎 Searched files
							</div>
							<div className="text-orange-200">
								Pattern: {part.input?.pattern || "Unknown"}
							</div>
						</div>
					);
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
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`}
			value={input}
			placeholder={
				disabled ? "Please handle tool calls first..." : "Say something..."
			}
			onChange={onChange}
			disabled={disabled}
			autoFocus
		/>
	</form>
);
