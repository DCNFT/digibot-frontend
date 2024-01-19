import ChatMessage from './ChatMessage';
import { useEffect, useRef } from 'react';
import { Message } from '..';

type ChatBodyProps = {
  chatData: Message[];
  isRunning: boolean;
};

const ChatBody = ({ chatData, isRunning }: ChatBodyProps) => {
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
      {chatData.map((message, index) => (
        <ChatMessage
          key={`chat-message-${index}`}
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
