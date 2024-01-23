import { useState, FormEvent, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatBody from './components/ChatBody';
import { incrementLastNumber } from '@/lib/utils';
import {
  fetchChatResponse,
  getBotLastId,
  getUserLastId,
  processResponse,
} from '@/lib/chat';
import useChatStore from '@/store/useChatStore';
import useToast from '@/hooks/useToast';

export type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
};
const USE_OPEN_AI_SERVER = false;

const systemSettings = (chatData: Message[], prompt: string | undefined) => {
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
        menu_num: 4,
        chat_history: chatData.map(({ id, ...rest }) => rest).slice(0, -1),
        query: prompt,
      },
    };
  }
};
const Chat = () => {
  const prompt = useChatStore((state) => state.prompt);
  const chatData = useChatStore((state) => state.chatData);
  const setChatDataUpdateWithMessageId = useChatStore(
    (state) => state.setChatDataUpdateWithMessageId,
  );
  const setInsertChatData = useChatStore((state) => state.setInsertChatData);
  const setPrompt = useChatStore((state) => state.setPrompt);
  const setIsRunning = useChatStore((state) => state.setIsRunning);

  const ref = useRef(false);
  const setLastChatMessageId = useChatStore(
    (state) => state.setLastChatMessageId,
  );
  const { enqueueErrorBar } = useToast();
  const [updateComplete, setUpdateComplete] = useState(false);
  let controller: AbortController | undefined;

  const handleSendMessage = async () => {
    setIsRunning(true);
    controller = new AbortController();
    const lastChatMessageId = getBotLastId(chatData);
    setLastChatMessageId(lastChatMessageId);
    console.log(chatData.map(({ id, ...rest }) => rest).slice(0, -1));
    const setting = systemSettings(chatData, prompt);
    const url = setting?.url as string;
    const params = setting?.setting as object;
    try {
      const response = await fetchChatResponse(
        url,
        params,
        true,
        controller,
        setIsRunning,
      );
      console.log(response);

      const fullText = await processResponse(
        response,
        true,
        controller,
        //setFirstTokenReceived,
        setChatDataUpdateWithMessageId,
        lastChatMessageId,
      );
      setIsRunning(false);
    } catch (e: any) {
      setIsRunning(false);
      enqueueErrorBar(e.message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const lastUserChatId = getUserLastId(chatData); // 기본값 설정
    const lastBotChatId = getBotLastId(chatData);

    // ID를 증가시키거나 초기값을 사용
    const lastUserChatIdIncrease = ref.current
      ? incrementLastNumber(lastUserChatId)
      : lastUserChatId;
    const lastBotChatIdIncrease = ref.current
      ? incrementLastNumber(lastBotChatId)
      : lastBotChatId;

    // 새로운 채팅 데이터 추가
    setInsertChatData({
      role: 'user',
      content: prompt,
      id: lastUserChatIdIncrease,
    });
    setInsertChatData({
      role: 'assistant',
      content: '',
      id: lastBotChatIdIncrease,
    });

    setUpdateComplete(true); // 상태 업데이트 완료 플래그 설정
    ref.current = true; // 참조 플래그 업데이트
  };

  useEffect(() => {
    if (updateComplete) {
      handleSendMessage();
      setUpdateComplete(false); // 플래그 초기화
      setPrompt(''); // 입력란 초기화
    }
  }, [updateComplete]);

  return (
    <div className="flex flex-col h-screen">
      <ChatBody />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
};
export default Chat;
