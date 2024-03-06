import { useEffect, useRef } from 'react';
import useChatStore from '@/store/useChatStore';
import Image from 'next/image';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';

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
  const isGenerating = useChatStore((state) => state.isGenerating);
  const lastChatMessageId = useChatStore((state) => state.lastChatMessageId);
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]); // Scroll to bottom every time chatData changes

  console.log('chatData = ', chatData);
  return (
    <div id="chatbox">
      {chatData.map((message, index) => (
        <ChatMessage
          key={`chat-message-${index}`}
          isLastChatMessage={lastChatMessageId === message.id}
          message={message}
          isGenerating={isGenerating}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;