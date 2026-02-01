import { useChat } from "@ai-sdk/react";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ChatInput, Message, Wrapper } from "./components.tsx";
import "./tailwind.css";
import type { MyUIMessage } from "../api/chat.ts";

const App = () => {
	// TODO - pass MyUIMessage as a type argument to useChat
	const { messages, sendMessage } = useChat<MyUIMessage>({});

	const [input, setInput] = useState("Tell me what todo items I have today.");

	return (
		<Wrapper>
			{messages.map((message) => (
				<Message key={message.id} role={message.role} parts={message.parts} />
			))}
			<ChatInput
				input={input}
				onChange={(e) => setInput(e.target.value)}
				onSubmit={(e) => {
					e.preventDefault();
					sendMessage({
						text: input,
					});
					setInput("");
				}}
			/>
		</Wrapper>
	);
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
