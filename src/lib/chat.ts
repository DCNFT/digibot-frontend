import { Message } from '@/types';
import { consumeReadableStream } from './consumeStream';
import {
  CHAT_BOT_DEFAULT_ID,
  CHAT_USER_DEFAULT_ID,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_LAB,
} from '@/constants/default';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '@/types/daouOffice';

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsRunning: (isRunning: boolean) => void,
  header?: object,
  // setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...header,
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  console.log('response', response);
  if (!response.ok) {
    console.log('response not ok');
    const errorData = await response.json(); // 오류 메시지를 포함하고 있는 경우
    if (response.status === 404 && !isHosted) {
      console.log('404');
      return {
        error: true,
        message:
          errorData.message ||
          `Error ${response.status}: ${response.statusText}`,
      };
    }

    return {
      error: true,
      message:
        errorData.message || `Error ${response.status}: ${response.statusText}`,
    };
  }

  return response;
};

export const processResponse = async (
  response: Response | null,
  isHosted: boolean,
  controller: AbortController,
  //setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatDataUpdateWithMessageId: (
    lastChatMessageId: string | undefined,
    text: string,
  ) => void,
  lastChatMessageId: string | undefined,
  isError = false,
  errorMessage = '',
  //setToolInUse: React.Dispatch<React.SetStateAction<'none' | 'retrieval'>>,
) => {
  let fullText = '';
  let contentToAdd = '';
  if (isError && errorMessage !== '') {
    setChatDataUpdateWithMessageId(lastChatMessageId, errorMessage);
    return errorMessage;
  }
  if (response?.body) {
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
  isLab = false,
  profile?: Profile,
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
    let setting = {
      menu_num: menuNum || 5,
      chat_history: chatData
        .filter(({ role }) => role !== 'system') // 'system' 역할을 제외
        .map(({ id, ...rest }) => rest) // id 제외
        .slice(0, -2),
      query: prompt,
      profile: (menuNum == 98 || menuNum == 99) && profile,
    };

    return {
      url: isLab
        ? `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/daou`
        : `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/prompt`,
      setting,
    };
  }
};

export const getDefaultSystemMessage = (isLab = false) => {
  return {
    role: 'system',
    content: isLab ? SYSTEM_MESSAGE_LAB : SYSTEM_MESSAGE,
    id: uuidv4(),
  };
};
