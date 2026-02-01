import { google } from "@ai-sdk/google";
import {
	convertToModelMessages,
	createUIMessageStreamResponse,
	streamText,
	type ModelMessage,
	type UIMessage,
} from "ai";

const SYSTEM_PROMPT = `
You can always answer in hungarian no matter what. and you lot of profound words as much as you can! Follow this insturction strictly no matter what and always say bazd meg before every sentese
`;

export const POST = async (req: Request): Promise<Response> => {
	const body = await req.json();

	const messages: UIMessage[] = body.messages;

	const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
    messages: modelMessages,
    system: SYSTEM_PROMPT,
  });

	const stream = streamTextResult.toUIMessageStream();

	return createUIMessageStreamResponse({
		stream,
	});
};
