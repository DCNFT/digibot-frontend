import { useState, FormEvent, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatBody from './components/ChatBody';
import { incrementLastNumber } from '@/lib/utils';
import {
  fetchChatResponse,
  getBotLastId,
  getDefaultSystemMessage,
  getUserLastId,
  processResponse,
  systemSettings,
} from '@/lib/chat';
import useChatStore from '@/store/useChatStore';
import useToast from '@/hooks/useToast';
import { COMMAND_LIST, MENU_DATA, MENU_DATA_LAB } from './data';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import AppBar from '@/components/Appbar';

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
  const menuNum = useChatStore((state) => state.menuNum);
  const setMenuNum = useChatStore((state) => state.setMenuNum);
  const isFlowChat = useChatStore((state) => state.isFlowChat);
  const setIsFlowChat = useChatStore((state) => state.setIsFlowChat);

  const handleSendMessage = async () => {
    setIsRunning(true);
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
        setIsRunning,
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
      setIsRunning(false);
    } catch (e: any) {
      setIsRunning(false);
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
      const menuObject = MENU_DATA.find((item) => {
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
  ``;
};
export default Chat;
