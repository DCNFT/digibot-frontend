import { useEffect, useRef, useState } from 'react';
import useChatStore from '@/store/useChatStoreMig';
import ChatMessage from '@/views/mig/components/chatMessage/ChatMessage';
import { ChatSettings } from '@/components/chat/chatSettings';
import { v4 as uuidv4 } from 'uuid';
import { ChatData } from '@/types';

type ChatBodyProps = {
  data?: ChatData;
};
const ChatBody = ({ data }: ChatBodyProps) => {
  const chatMessagesList = useChatStore((state) => state.chatMessagesList);
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // console.log(
  //   '[seo][chatbody] chatMessages',
  //   chatMessages.sort(
  //     (a, b) => a.message.sequence_number - b.message.sequence_number,
  //   ),
  // );
  //TypeError: Cannot assign to read only property '0' of object '[object Array]'
  // const chatSettings = useChatStore((state) => state.chatSettings);
  // console.log('[seo] chatSettings= ', chatSettings);

  console.log('chatMessagesList= ', chatMessagesList);
  return (
    <div>
      <>
        {chatMessagesList.map((chatData) => {
          return chatData.chatMessages.map((chatMessage, index) => {
            if (chatMessage.message.role === 'user' && index === 0) {
              return (
                <ChatMessage
                  key={`${chatMessage.message.sequence_number}-user`}
                  message={chatMessage.message} // Fix: Update the type of the message prop
                  isLast={index === chatData.chatMessages.length - 1}
                />
              );
            }
            if (chatMessage.message.role === 'assistant') {
              return (
                <ChatMessage
                  key={`${chatMessage.message.sequence_number}-assistant-${index}`}
                  message={chatMessage.message} // Fix: Update the type of the message prop
                  isLast={index === chatData.chatMessages.length - 1}
                />
              );
            }
          });
        })}
      </>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
