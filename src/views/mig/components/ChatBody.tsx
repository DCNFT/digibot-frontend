import { useEffect, useRef, useState } from 'react';
import useChatStore from '@/store/useChatStoreMig';
import ChatMessage from '@/views/mig/components/chatMessage/ChatMessage';
import { ChatSettings } from '@/components/chat/chatSettings';
import { v4 as uuidv4 } from 'uuid';
import { ChatData, Messages, ChatMessage as TChatMessage } from '@/types';

import UserQuestions from './UserQuestions';

type RenderChatMessagesProps = {
  chatData: ChatData;
};
const ModelContainer = ({ chatData }: RenderChatMessagesProps) => {
  return (
    <div className="flex flex-col rounded-xl w-full" key={chatData.id}>
      <p>{chatData?.chatSettings?.model}</p>

      <div className="h-[400px] w-full overflow-auto">
        {chatData?.chatMessages.map((chatMessage, index) => {
          return (
            <ChatMessage
              key={`${chatMessage.message.sequence_number}-${chatMessage.message.role}-${index}`}
              message={chatMessage.message} // 여기서 message prop 타입에 맞게 전달합니다.
              isLast={index === chatData?.chatMessages.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};

type ChatBodyProps = {
  data?: ChatData;
};

const ChatBody = ({ data }: ChatBodyProps) => {
  const chatMessagesList = useChatStore((state) => state.chatMessagesList);
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex">
      <UserQuestions chatMessagesList={chatMessagesList} />
      <div className="grid overflow-hidden grow auto-rows-fr grid-cols-2 gap-3 mb-3">
        {chatMessagesList.map((chatData) => (
          <ModelContainer key={chatData.id} chatData={chatData} />
        ))}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
