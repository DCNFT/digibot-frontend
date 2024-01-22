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

export type Message = {
  id?: string;
  sender: 'user' | 'bot';
  content: string;
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

  const [updateComplete, setUpdateComplete] = useState(false);
  let controller: AbortController | undefined;

  const handleSendMessage = async () => {
    setIsRunning(true);
    controller = new AbortController();
    try {
      const response = await fetchChatResponse(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/stream`,
        { query: prompt },
        true,
        controller,
        setIsRunning,
      );
      const lastChatMessageId = getBotLastId(chatData);

      const fullText = await processResponse(
        response,
        true,
        controller,
        //setFirstTokenReceived,
        setChatDataUpdateWithMessageId,
        lastChatMessageId,
      );
      setIsRunning(false);
    } catch (e) {
      setIsRunning(false);
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
      sender: 'user',
      content: prompt,
      id: lastUserChatIdIncrease,
    });
    setInsertChatData({
      sender: 'bot',
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
