import ChatMessage from './chatMessage/ChatMessage';
import { useEffect, useRef } from 'react';
import useChatStore from '@/store/useChatStore';
import Image from 'next/image';
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

  return (
    <div className="flex w-full h-full flex-col overflow-auto border-b">
      <div className="flex flex-col w-full justify-center items-center">
        {/* <Intro chatData={chatData} /> */}
        {chatData.map((message, index) => (
          <ChatMessage
            key={`chat-message-${index}`}
            isLastChatMessage={lastChatMessageId === message.id}
            message={message}
            isRunning={isRunning}
          />
        ))}
      </div>
      {/* <div className="relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]"> */}

      {/* </div> */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
