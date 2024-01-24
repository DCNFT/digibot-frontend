import { useState, FormEvent, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatBody from './components/ChatBody';
import { incrementLastNumber } from '@/lib/utils';
import {
  fetchChatResponse,
  getBotLastId,
  getUserLastId,
  processResponse,
  systemSettings,
} from '@/lib/chat';
import useChatStore from '@/store/useChatStore';
import useToast from '@/hooks/useToast';

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

  //   ------------------------------------
  // Step 1) F/E 인사 메시지 출력
  // ------------------------------------
  // 안녕하세요? 디지봇입니다.
  // 도움 받고자 하는 항목을 입력해주세요.
  // 단, 항목은 "1" 과 같이 숫자 형태로 입력해주세요.

  //  1. 경조금 문의
  //  2. 복지 및 포상 문의
  //  3. 여비 문의
  //  4. 카페테리아 문의
  //  5. 그 외

  // > user : 4

  // ------------------------------------
  // Step 2) 사용자가 선택한 번호에 따른 추가 메시지 출력
  // ------------------------------------
  // 카페테리아 문의와 관련 되어 무엇을 도와드릴까요?

  // > user : 내가 2018년 10월 입사했는데 얼마 받을수있어?

  return (
    <div className="flex flex-col h-screen">
      <ChatBody />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
};
export default Chat;
