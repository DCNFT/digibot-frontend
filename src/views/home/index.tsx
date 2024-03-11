import ChatBody from './components/ChatBody';
import ChatInput from './components/ChatInput';
import SubPost from './components/SubPost';
import Sidebar from './components/Sidebar';
import classNames from 'classnames';
import useChatStore from '@/store/useChatStore';
import { useState, FormEvent, useRef, useEffect } from 'react';

import { incrementLastNumber } from '@/lib/utils';
import {
  fetchChatResponse,
  getBotLastId,
  getDefaultSystemMessage,
  getUserLastId,
  processResponse,
  systemSettings,
} from '@/lib/chat';

import useToast from '@/hooks/useToast';
import useDaouOfficeStore from '@/store/useDaouOfficeStore';
import use100vh from '@/hooks/use100vh';

const NewHome = () => {
  // use100vh();
  const isSideMenuOpen = useChatStore((state) => state.isSideMenuOpen);
  const mainClass = classNames({
    main: true,
    active: isSideMenuOpen,
  });
  const prompt = useChatStore((state) => state.prompt);
  const chatData = useChatStore((state) => state.chatData);
  const setChatDataUpdateWithMessageId = useChatStore(
    (state) => state.setChatDataUpdateWithMessageId,
  );
  const setInsertChatData = useChatStore((state) => state.setInsertChatData);
  const setPrompt = useChatStore((state) => state.setPrompt);
  const setIsGenerating = useChatStore((state) => state.setIsGenerating);
  const ref = useRef(false);
  const setLastChatMessageId = useChatStore(
    (state) => state.setLastChatMessageId,
  );
  const { enqueueErrorBar } = useToast();
  const [updateComplete, setUpdateComplete] = useState(false);

  let controller: AbortController | undefined;
  const menuNum = useChatStore((state) => state.menuNum);
  const profile = useDaouOfficeStore((store) => store.profile);
  const daouOfficeCookie = useDaouOfficeStore(
    (state) => state.daouOfficeCookie,
  );

  const handleSendMessage = async () => {
    setIsGenerating(true);
    controller = new AbortController();
    const lastChatMessageId = getBotLastId(chatData);

    setLastChatMessageId(lastChatMessageId);
    const setting = systemSettings(chatData, prompt, menuNum);
    const url = setting?.url as string;
    const params = setting?.setting as object;
    try {
      const response = await fetchChatResponse(
        url,
        params,
        true,
        controller,
        setIsGenerating,
      );
      console.log(response);

      const fullText = await processResponse(
        response as Response,
        true,
        controller,
        //setFirstTokenReceived,
        setChatDataUpdateWithMessageId,
        lastChatMessageId,
      );
      setIsGenerating(false);
    } catch (e: any) {
      setIsGenerating(false);
      enqueueErrorBar(e.message);
    }
  };

  const getIds = () => {
    const lastUserChatId = getUserLastId(chatData); // 기본값 설정
    const lastBotChatId = getBotLastId(chatData);
    // ID를 증가시키거나 초기값을 사용
    const lastUserChatIdIncrease = ref.current
      ? incrementLastNumber(lastUserChatId)
      : lastUserChatId;
    const lastBotChatIdIncrease = ref.current
      ? incrementLastNumber(lastBotChatId)
      : lastBotChatId;

    return { lastUserChatIdIncrease, lastBotChatIdIncrease };
  };

  const handleSubmit = async (e: FormEvent, sendPrompt = '') => {
    if (sendPrompt !== '') {
      const { lastUserChatIdIncrease, lastBotChatIdIncrease } = getIds();
      e.preventDefault();
      // 새로운 채팅 데이터 추가
      setInsertChatData({
        role: 'user',
        content: sendPrompt,
        id: lastUserChatIdIncrease,
      });

      setInsertChatData({
        role: 'assistant',
        content: '',
        id: lastBotChatIdIncrease,
      });
      setUpdateComplete(true); // 상태 업데이트 완료 플래그 설정
      ref.current = true; // 참조 플래그 업데이트
      return;
    }

    const { lastUserChatIdIncrease, lastBotChatIdIncrease } = getIds();
    e.preventDefault();
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
    <>
      <Sidebar />
      <div className={mainClass} id="main">
        <SubPost />
        <ChatBody />
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </>
  );
};
export default NewHome;
