import { useEffect, useRef } from 'react';
import useChatStore from '@/store/useChatStoreMig';
import ChatMessage from '@/views/mig/components/chatMessage/ChatMessage';
import { ChatSettings } from '@/components/chat/chatSettings';

const ChatBody = () => {
  const chatMessages = useChatStore((state) => state.chatMessages);
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]); // Scroll to bottom every time chatData changes

  // console.log(
  //   '[seo][chatbody] chatMessages',
  //   chatMessages.sort(
  //     (a, b) => a.message.sequence_number - b.message.sequence_number,
  //   ),
  // );
  //TypeError: Cannot assign to read only property '0' of object '[object Array]'

  return (
    <div>
      {chatMessages?.map((chatMessage, index, array) => {
        return (
          <ChatMessage
            key={chatMessage.message.sequence_number}
            message={chatMessage.message} // Fix: Update the type of the message prop
            isLast={index === array.length - 1}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
