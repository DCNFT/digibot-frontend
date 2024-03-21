import { useEffect, useRef, useState } from 'react';
import useChatStore from '@/store/useChatStoreMig';
import ChatMessage from '@/views/mig/components/chatMessage/ChatMessage';
import { ChatSettings } from '@/components/chat/chatSettings';
import { v4 as uuidv4 } from 'uuid';

type ChatBodyProps = {
  data: any;
};
const ChatBody = ({ data }: ChatBodyProps) => {
  const [chatMessageListId, setChatMessageListId] = useState(uuidv4());
  useEffect(() => {
    console.log('chatBody useEffect');
  }, []);
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
  const chatSettings = useChatStore((state) => state.chatSettings);
  console.log('[seo] chatSettings= ', chatSettings);

  return (
    <div>
      {data?.chatSettings?.model}
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
