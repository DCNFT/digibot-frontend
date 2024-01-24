import ChatMessage from './chatMessage/ChatMessage';
import { useEffect, useRef, useState } from 'react';
import useChatStore from '@/store/useChatStore';
import Image from 'next/image';
import { CHAT_BOT_DEFAULT_ID } from '@/constants/default';
import { Message } from '@/types';

type IntroProps = {
  chatData: Message[];
};
const Intro = ({ chatData }: IntroProps) => {
  return (
    <>
      {chatData.length === 0 && (
        <div className="flex justify-center gap-2 my-2">
          <div className="jusmax-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg">
            <div className="flex justify-center gap-2 my-2">
              <Image
                src="/images/XD_BOT.jpg"
                alt="Bot"
                className="w-12 h-12 rounded-full"
                width={48}
                height={48}
              />
            </div>
            <p className="text-center font-bold">XD-BOT</p>
            <p className="text-center">채팅을 시작해보세요😆</p>
          </div>
        </div>
      )}
    </>
  );
};

const ChatBody = () => {
  const chatData = useChatStore((state) => state.chatData);
  const isRunning = useChatStore((state) => state.isRunning);
  const lastChatMessageId = useChatStore((state) => state.lastChatMessageId);
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]); // Scroll to bottom every time chatData changes

  //   ------------------------------------
  // Step 1) F/E 인사 메시지 출력
  // ------------------------------------

  // > user : 4

  // ------------------------------------
  // Step 2) 사용자가 선택한 번호에 따른 추가 메시지 출력
  // ------------------------------------
  // 카페테리아 문의와 관련 되어 무엇을 도와드릴까요?

  // > user : 내가 2018년 10월 입사했는데 얼마 받을수있어?
  const [isFlowChat, setIsFlowChat] = useState(true);
  const [flowChatData, setFlowChatData] = useState([
    {
      role: 'assistant',
      //content: "안녕하세요? 디지봇입니다.\n도움 받고자 하는 항목을 입력해주세요.\n단, 항목은 "1" 과 같이 숫자 형태로 입력해주세요.\n1. 경조금 문의\n2. 복지 및 포상 문의\n3. 여비 문의\n4. 카페테리아 문의\n5. chat!XD-BOT\n",
      content: '입력',
      id: CHAT_BOT_DEFAULT_ID,
    },
  ]);
  return (
    <div
      className="flex w-full justify-center"
      style={{ marginBottom: '4rem' }}
    >
      <div className="relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]">
        <Intro chatData={chatData} />
        {/* {flowChatData.map((message, index) => (
          <ChatMessage
            key={`chat-message-${index}`}
            message={message}
            isRunning={isRunning}
          />
        ))} */}
        {chatData.map((message, index) => (
          <ChatMessage
            key={`chat-message-${index}`}
            isLastChatMessage={lastChatMessageId === message.id}
            message={message}
            isRunning={isRunning}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatBody;
