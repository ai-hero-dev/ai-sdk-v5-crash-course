import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamObject,
  streamText,
  type ModelMessage,
  type UIMessage,
  type UIMessageStreamWriter,
} from 'ai';
import { tavily } from '@tavily/core';
import z, { url } from 'zod';

export type MyMessage = UIMessage<
  unknown,
  {
    queries: string[];
    plan: string;
  }
>;

const generateQueriesForTavily = (
  modelMessages: ModelMessage[],
) => {
  const queriesResult = streamObject({
    model: google('gemini-2.5-flash'),
    system: `
      You are a helpful assistant that generates queries to search the web for information.

      <rules>
        Make a plan before you generate the queries. The plan should identify the groups of information required to answer the question.
        The plan should list pieces of information that are required to answer the question, then consider how to break down the information into queries.
      </rules>

      Generate 3-5 queries that are relevant to the conversation history.
      
      <output-format>
        Reply as a JSON object with the following properties:
        - plan: A string describing the plan for the queries.
        - queries: An array of strings, each representing a query.
      </output-format>
    `,
    schema: z.object({
      plan: z.string(),
      queries: z.array(z.string()),
    }),
    messages: modelMessages,
  });

  return queriesResult;
};

const streamQueriesToFrontend = async (
  queriesResult: ReturnType<typeof generateQueriesForTavily>,
  writer: UIMessageStreamWriter<MyMessage>,
) => {
  const queriesPartId = crypto.randomUUID();
  const planPartId = crypto.randomUUID();

  for await (const part of queriesResult.partialObjectStream) {
    if (
      part.queries &&
      part.queries.every((query) => typeof query === 'string')
    ) {
      writer.write({
        type: 'data-queries',
        data: part.queries,
        id: queriesPartId,
      });
    }

    if (part.plan) {
      writer.write({
        type: 'data-plan',
        data: part.plan,
        id: planPartId,
      });
    }
  }
};

const callTavilyToGetSearchResults = async (
  queries: string[],
) => {
  const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY,
  });

  const searchResults = await Promise.all(
    queries.map(async (query) => {
      const response = await tavilyClient.search(query, {
        maxResults: 5,
      });

      return {
        query,
        response,
      };
    }),
  );

  return searchResults;
};

const streamFinalSummary = async (
  searchResults: Awaited<
    ReturnType<typeof callTavilyToGetSearchResults>
  >,
  messages: ModelMessage[],
  writer: UIMessageStreamWriter<MyMessage>,
) => {
  const formattedSources = searchResults
    .map(({ response, query }, i) => {
      return `<search-query index="${i + 1}" query="${query}">
        ${response.results
          .map((res, j) => {
            return `<result index="${j + 1}">
            <title>${res.title}</title>
            <url>${res.url ?? '#'}</url>
            <content>${res.content ?? ''}</content>
          </result>`;
          })
          .join('\n')}
      </search-query>`;
    })
    .join('\n');

  const answerResult = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are a helpful assistant that answers questions based on the search results.
      <rules>
      You should use the search results to answer the question.
      Use sources from the search results to answer the question.
      Sources should be cited as markdown links.

      <markdown-link-example>
        You might consider looking at [this article](https://www.example.com) to answer the question.
      </markdown-link-example>
      
      Sources should not be cited with the full URL visible to the user. Instead, use a short description of the source:

      <bad-markdown-link-example>
        This site will be useful to you: [https://www.example.com](https://www.example.com)
      </bad-markdown-link-example>

      </rules>

      <sources>
        ${formattedSources}
      </sources>

      <output-format>
        Use markdown formatting.
      </output-format>
    `,
    messages,
  });

  writer.merge(
    answerResult.toUIMessageStream({ sendStart: false }),
  );
};

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyMessage[] } = await req.json();
  const { messages } = body;

  const modelMessages = await convertToModelMessages(messages);

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      const queriesResult =
        generateQueriesForTavily(modelMessages);

      await streamQueriesToFrontend(queriesResult, writer);

      const searchResults = await callTavilyToGetSearchResults(
        (await queriesResult.object).queries,
      );

      await streamFinalSummary(
        searchResults,
        modelMessages,
        writer,
      );
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
