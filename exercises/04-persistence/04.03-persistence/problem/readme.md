So, the next step on our journey now is to actually persist the messages that we get from the LLM and our own user messages to a database of some sort. To spare you any trouble of setting up a Postgres database, I've provided you with a persistence layer.

## Understanding the Persistence Layer

This persistence layer has a few functions that you'll need to know about:

```ts
// Available functions
loadChats();
saveChats();
createChat();
getChat();
appendToChatMessages();
deleteChat();
```

The main two you'll need to know about are:

- `getChat`: Retrieves chats and their associated messages
- `appendToChatMessages`: Takes a `chatId` and messages and appends them to the chat history

### Todo:

- Review all available persistence functions
- Focus on learning how to use `getChat` and `appendToChatMessages`

## Frontend Code Structure

Let's take a look at the frontend first. I've added a `backupChatId` piece of state:

```tsx
// This provides a stable chatId for when we're creating a new chat
const [backupChatId, setBackupChatId] = useState(
  crypto.randomUUID(),
);
const [searchParams, setSearchParams] = useSearchParams();

const chatIdFromSearchParams = searchParams.get('chatId');
```

The idea is that when we're at `localhost:3000` without any `chatId` in the URL, we want a valid stable `chatId` to be passed - one that doesn't change every render.

I've also added React Query code to fetch the chat from the backend:

```tsx
const { data } = useSuspenseQuery({
  queryKey: ['chat', chatIdFromSearchParams],
  queryFn: () => {
    if (!chatIdFromSearchParams) {
      return null;
    }

    return fetch(
      `/api/chat?chatId=${chatIdFromSearchParams}`,
    ).then((res): Promise<DB.Chat> => res.json());
  },
});
```

This takes the `chatId` from search params and fetches from the `/api/chat` endpoint.

We need to pass the `chatId` to the `useChat` hook as well as any existing messages:

```tsx
// TODO: pass the chatId to the useChat hook,
// as well as any existing messages from the backend
const { messages, sendMessage } = useChat({});
```

### Todo:

- Update the `useChat` hook to include the `chatId`
- Pass existing messages from the backend to the `useChat` hook

## Backend Implementation

Looking at the backend code for `/api/chat`, the `GET` endpoint is already implemented. It's just fetching the chat from the database:

```ts
export const GET = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const chatId = url.searchParams.get('chatId');

  if (!chatId) {
    return new Response('No chatId provided', { status: 400 });
  }

  const chat = await getChat(chatId);

  return new Response(JSON.stringify(chat), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

The `POST` endpoint is where we need to do most of our work:

```ts
export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[]; id: string } =
    await req.json();
  const { messages, id } = body;

  const mostRecentMessage = messages[messages.length - 1];

  if (!mostRecentMessage) {
    return new Response('No messages provided', { status: 400 });
  }

  if (mostRecentMessage.role !== 'user') {
    return new Response('Last message must be from the user', {
      status: 400,
    });
  }

  const chat = TODO; // TODO: Get the existing chat

  if (!chat) {
    // TODO: If the chat doesn't exist, create it with the id
  } else {
    // TODO: Otherwise, append the most recent message to the chat
  }

  // TODO: wait for the stream to finish and append the
  // last message to the chat
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};
```

### Todo:

- Implement getting existing chat with `getChat(id)`
- Create new chat if it doesn't exist with `createChat(id, messages)`
- Append most recent message to chat if it exists
- Modify `result.toUIMessageStreamResponse()` to save AI response message

## Form Submission Updates

Finally, we need to update the form submission handler:

```tsx
onSubmit={(e) => {
  e.preventDefault();
  sendMessage({
    text: input,
  });
  setInput('');

  // TODO: set the search params to the new chatId
  // if the chatId is not already set

  // TODO: refresh the backup chatId
  // if the chatId is not already set
}}
```

## Steps To Complete

- [ ] Modify the `useChat` hook call in the frontend to include the `chatId` (either from URL or backup) and any existing messages from the backend. You should be able to explore the autocomplete in the options object passed to `useChat` to figure it out.

- [ ] Update the form submission handler:
  - to set search params with the chatId when creating a new chat
  - to refresh the backup chatId when creating a new chat

- [ ] In the backend POST handler:
  - implement retrieving an existing chat with `getChat(id)`
  - if the chat doesn't exist, create it with `createChat(id, messages)`
  - if the chat exists, append the most recent message with `appendToChatMessages`
  - modify `toUIMessageStreamResponse()` to save the AI response message using `onFinish` callback

- [ ] Test your implementation by running the dev server and seeing if messages persist when you refresh the page

- [ ] Test that new chats get unique IDs in the URL

- [ ] Check that when you visit a chat URL directly, the previous messages load correctly
