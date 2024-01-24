import ChatMessage from './chatMessage/ChatMessage';
import { useEffect, useRef } from 'react';
import useChatStore from '@/store/useChatStore';
import Image from 'next/image';

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
    <div
      className="overflow-auto p-4 border rounded-md flex-grow "
      style={{ marginBottom: '4rem' }}
    >
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

      {chatData.map((message, index) => (
        <ChatMessage
          key={`chat-message-${index}`}
          isLastChatMessage={lastChatMessageId === message.id}
          message={message}
          isRunning={isRunning}
        />
      ))}
      {/* <ChatMessage isLoader isRunning={isRunning} /> */}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
