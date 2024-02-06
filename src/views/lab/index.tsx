import { useState, FormEvent, useRef, useEffect } from 'react';
import ChatInput from '@/views/lab/components/ChatInput';
import ChatBody from '@/views/lab/components/ChatBody';
import { incrementLastNumber } from '@/lib/utils';
import {
  fetchChatResponse,
  getBotLastId,
  getDefaultSystemMessage,
  getUserLastId,
  processResponse,
  systemSettings,
} from '@/lib/chat';
import useChatStoreLab from '@/store/useChatStoreLab';
import useToast from '@/hooks/useToast';
import { COMMAND_LIST, MENU_DATA_LAB } from '@/views/chat/data';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import AppBar from '@/components/Appbar';
import { error } from 'console';
const ChatLab = () => {
  const prompt = useChatStoreLab((state) => state.prompt);
  const chatData = useChatStoreLab((state) => state.chatData);
  const setChatDataUpdateWithMessageId = useChatStoreLab(
    (state) => state.setChatDataUpdateWithMessageId,
  );
  const setInsertChatData = useChatStoreLab((state) => state.setInsertChatData);
  const setPrompt = useChatStoreLab((state) => state.setPrompt);
  const setIsRunning = useChatStoreLab((state) => state.setIsRunning);
  const ref = useRef(false);
  const setLastChatMessageId = useChatStoreLab(
    (state) => state.setLastChatMessageId,
  );
  const { enqueueErrorBar } = useToast();
  const [updateComplete, setUpdateComplete] = useState(false);

  let controller: AbortController | undefined;
  const menuNum = useChatStoreLab((state) => state.menuNum);
  const setMenuNum = useChatStoreLab((state) => state.setMenuNum);
  const isFlowChat = useChatStoreLab((state) => state.isFlowChat);
  const setIsFlowChat = useChatStoreLab((state) => state.setIsFlowChat);
  const daouOfficeCookie = useChatStoreLab((state) => state.daouOfficeCookie);
  const handleSendMessage = async () => {
    setIsRunning(true);
    controller = new AbortController();
    const lastChatMessageId = getBotLastId(chatData);
    console.log('prompt = ', prompt);
    setLastChatMessageId(lastChatMessageId);
    const setting = systemSettings(chatData, prompt, menuNum);
    const url = setting?.url as string;
    const params = setting?.setting as object;
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${daouOfficeCookie}`,
    };
    try {
      const response = await fetchChatResponse(
        url,
        params,
        true,
        controller,
        setIsRunning,
        header,
      );
      console.log('[seo]  = ', response);

      if ('error' in response && response.error) {
        const fullText = await processResponse(
          null,
          true,
          controller,
          //setFirstTokenReceived,
          setChatDataUpdateWithMessageId,
          lastChatMessageId,
          true,
          `${response.message} 쿠키값 재 설정 필요`,
        );
        enqueueErrorBar(response.message);
        setIsRunning(false);
        return;
      }

      const fullText = await processResponse(
        response as Response,
        true,
        controller,
        //setFirstTokenReceived,
        setChatDataUpdateWithMessageId,
        lastChatMessageId,
      );
      setIsRunning(false);
    } catch (e: any) {
      console.log('[seo] error = ', e);
      setIsRunning(false);
      enqueueErrorBar(e.status);
      // processResponse(
      //   null,
      //   true,
      //   controller,
      //   //setFirstTokenReceived,
      //   setChatDataUpdateWithMessageId,
      //   lastChatMessageId,
      //   true,
      //   e.message,
      // );
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

  // 사용자가 "/명령어"를 입력했을 때 호출되는 함수
  const handleCommandsInput = () => {
    setInsertChatData({
      role: 'system',
      content: `도움말 명령어 리스트입니다:\n${COMMAND_LIST}`,
      id: uuidv4(),
    });
    setPrompt(''); // 입력란 초기화
  };

  const handleSubmit = async (e: FormEvent) => {
    const { lastUserChatIdIncrease, lastBotChatIdIncrease } = getIds();
    console.log(lastBotChatIdIncrease);
    if (prompt === '/명령어') {
      handleCommandsInput();
      return;
    }

    if (prompt === '/메뉴') {
      const systemMessage = getDefaultSystemMessage();
      setInsertChatData(systemMessage as Message);
      setIsFlowChat(true);
      setPrompt(''); // 입력란 초기화
      return;
    }

    if (isFlowChat) {
      const menuObject = MENU_DATA_LAB.find((item) => {
        return item.menu_id === prompt.toString();
      });
      console.log('menuObject = ', menuObject);
      if (menuObject) {
        setInsertChatData({
          role: 'system',
          content: `${menuObject?.menu_name} 선택하셨습니다 관련 질문을 해주세요~`,
          id: uuidv4(),
        });
        setMenuNum(Number(menuObject.menu_id));
        setIsFlowChat(false);
        setPrompt(''); // 입력란 초기화
        return;
      }

      setInsertChatData({
        role: 'system',
        content: '잘못 선택하셧습니다. 다시 선택해주세요.',
        id: uuidv4(),
      });
      setPrompt(''); // 입력란 초기화
      return;
    }
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
    <div className="relative flex h-full flex-col items-center">
      <AppBar />
      <ChatBody />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
};
export default ChatLab;
