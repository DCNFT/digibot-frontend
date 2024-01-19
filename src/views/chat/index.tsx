import { useState, FormEvent, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatBody from './components/ChatBody';
import { incrementLastNumber } from '@/lib/utils';
import { getBotLastId, getUserLastId } from '@/lib/chat';
import useChatStore from '@/store/useChatStore';

export type Message = {
  id?: string;
  sender: 'user' | 'bot';
  content: string;
};

const Chat = () => {
  const prompt = useChatStore((state) => state.prompt);
  const isRunning = useChatStore((state) => state.isRunning);
  const chatData = useChatStore((state) => state.chatData);
  const setChatData = useChatStore((state) => state.setChatData);
  const setInsertChatData = useChatStore((state) => state.setInsertChatData);
  const setPrompt = useChatStore((state) => state.setPrompt);
  const setIsRunning = useChatStore((state) => state.setIsRunning);

  const ref = useRef(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  let controller: AbortController | undefined;

  const callNyanChat = () => {
    setIsRunning(true);
    controller = new AbortController();
    const { signal } = controller;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: prompt }),
      signal,
    })
      .then((response: any) => {
        const lastChatMessageId = getBotLastId(chatData);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return reader
          .read()
          .then(function processText({
            done,
            value,
          }: {
            done: boolean;
            value: Uint8Array;
          }) {
            if (done) return;

            const text = decoder.decode(value, { stream: true });

            // setChatData((prev) =>
            //   prev.map((chatMessage) => {
            //     if (chatMessage.id === lastChatMessageId) {
            //       const updatedChatMessage: Message = {
            //         ...chatMessage,
            //         sender: 'bot',
            //         content: chatMessage.content + text,
            //       };
            //       return updatedChatMessage;
            //     }
            //     return chatMessage;
            //   }),
            // );
            setChatData(chatData, lastChatMessageId, text);
            // const chatDatas = chatData.map((chatMessage) => {
            //   if (chatMessage.id === lastChatMessageId) {
            //     const updatedChatMessage: Message = {
            //       ...chatMessage,
            //       sender: 'bot',
            //       content: chatMessage.content + text,
            //     };
            //     return updatedChatMessage;
            //   }
            //   return chatMessage;
            // });
            // console.log('[seo] ', chatDatas);

            return reader.read().then(processText);
          });
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }

        setIsRunning(false);
      })
      .finally(() => {
        setIsRunning(false);
      });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
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
      callNyanChat();
      setUpdateComplete(false); // 플래그 초기화
      setPrompt(''); // 입력란 초기화
    }
  }, [updateComplete]);

  return (
    <div className="flex flex-col h-screen">
      <ChatBody chatData={chatData} isRunning={isRunning} />
      <ChatInput
        prompt={prompt}
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        isRunning={isRunning}
      />
    </div>
  );
};
export default Chat;
