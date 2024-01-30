import { Message } from '@/types';
import { consumeReadableStream } from './consumeStream';
import {
  CHAT_BOT_DEFAULT_ID,
  CHAT_USER_DEFAULT_ID,
  SYSTEM_MESSAGE,
} from '@/constants/default';
import { v4 as uuidv4 } from 'uuid';
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
    (chatMessage) => chatMessage.role === 'assistant',
  );
  return lastBotMessage ? lastBotMessage.id : CHAT_BOT_DEFAULT_ID;
};

export const getUserLastId = (chatData: Message[]) => {
  const lastUserMessage = chatData.findLast(
    (chatMessage) => chatMessage.role === 'user',
  );
  return lastUserMessage ? lastUserMessage.id : CHAT_USER_DEFAULT_ID;
};

const USE_OPEN_AI_SERVER = false;
export const systemSettings = (
  chatData: Message[],
  prompt: string | undefined,
  menuNum: number,
) => {
  if (USE_OPEN_AI_SERVER)
    return {
      url: '/api/chat/openai',
      setting: {
        chatSettings: {
          contextLength: 4096,
          embeddingsProvider: 'openai',
          includeProfileContext: true,
          includeWorkspaceInstructions: true,
          model: 'gpt-3.5-turbo-1106',
          prompt: 'You are a friendly, helpful AI assistant.',
          temperature: 0.5,
        },
        menuNum: 4,
        messages: chatData.map(({ id, ...rest }) => rest).slice(0, -1),
        query: prompt,
      },
    };

  if (!USE_OPEN_AI_SERVER) {
    return {
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/prompt`,
      setting: {
        menu_num: menuNum || 5,
        chat_history: chatData
          .filter(({ role }) => role !== 'system') // 'system' 역할을 제외
          .map(({ id, ...rest }) => rest) // id 제외
          .slice(0, -2),
        query: prompt,
      },
    };
  }
};

export const getDefaultSystemMessage = () => {
  return {
    role: 'system',
    content: SYSTEM_MESSAGE,
    id: uuidv4(),
  };
};
