import ChatBody from './components/ChatBody';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import classNames from 'classnames';
import useChatStore from '@/store/useChatStore';
import { useState, FormEvent, useRef, useEffect } from 'react';
import {
  fetchChatResponse,
  getBotLastId,
  getDefaultSystemMessage,
  getUserLastId,
  processResponse,
  systemSettings,
} from '@/lib/chat';

import useToast from '@/hooks/useToast';

const NewHome = () => {
  const isSideMenuOpen = useChatStore((state) => state.isSideMenuOpen);
  const mainClass = classNames({
    main: true,
    active: isSideMenuOpen,
  });
  const setPrompt = useChatStore((state) => state.setPrompt);

  const { enqueueErrorBar } = useToast();
  const [updateComplete, setUpdateComplete] = useState(false);

  let controller: AbortController | undefined;

  const handleSendMessage = async () => {};
  const handleSubmit = async (e: FormEvent, sendPrompt = '') => {};

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
        <ChatBody />
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </>
  );
};
export default NewHome;
