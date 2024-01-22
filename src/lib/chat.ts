import { Message } from '@/views/chat';
import { consumeReadableStream } from './consumeStream';
import { CHAT_BOT_DEFAULT_ID, CHAT_USER_DEFAULT_ID } from '@/constants/default';

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsRunning: (isRunning: boolean) => void,
  // setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      // toast.error(
      //   'Model not found. Make sure you have it downloaded via Ollama.',
      // );
    }

    const errorData = await response.json();
    //toast.error(errorData.message);
    console.log(errorData);
    setIsRunning(false);
    // setChatMessages((prevMessages) => prevMessages.slice(0, -2));
  }

  return response;
};

export const processResponse = async (
  response: Response,
  isHosted: boolean,
  controller: AbortController,
  //setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatDataUpdateWithMessageId: (
    lastChatMessageId: string | undefined,
    text: string,
  ) => void,
  lastChatMessageId: string | undefined,
  //setToolInUse: React.Dispatch<React.SetStateAction<'none' | 'retrieval'>>,
) => {
  let fullText = '';
  let contentToAdd = '';

  if (response.body) {
    await consumeReadableStream(
      response.body,
      (chunk) => {
        // setFirstTokenReceived(true);
        // setToolInUse('none');
        try {
          contentToAdd = isHosted ? chunk : JSON.parse(chunk).message.content;
          fullText += contentToAdd;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
        setChatDataUpdateWithMessageId(lastChatMessageId, contentToAdd);
      },
      controller.signal,
    );

    return fullText;
  } else {
    throw new Error('Response body is null');
  }
};

export const getBotLastId = (chatData: Message[]) => {
  const lastBotMessage = chatData.findLast(
    (chatMessage) => chatMessage.sender === 'bot',
  );
  return lastBotMessage ? lastBotMessage.id : CHAT_BOT_DEFAULT_ID;
};

export const getUserLastId = (chatData: Message[]) => {
  const lastUserMessage = chatData.findLast(
    (chatMessage) => chatMessage.sender === 'user',
  );
  return lastUserMessage ? lastUserMessage.id : CHAT_USER_DEFAULT_ID;
};
