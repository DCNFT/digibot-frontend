import Image from 'next/image';
import React from 'react';
import { Message } from '..';

type ChatMessageProps = {
  message?: Message;
  isLoader?: boolean;
  isRunning?: boolean;
};

const ChatMessage = ({
  message,
  isLoader = false,
  isRunning,
}: ChatMessageProps) => {
  if (isLoader) {
    {
      isRunning && (
        <div className="flex items-end gap-2 my-2">
          {
            <Image
              src="/images/nyan.png"
              alt="Bot"
              className="w-12 h-12 rounded-full"
            />
          }
          <div className="message max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg">
            <div className="loader"></div>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className={`flex items-end gap-2 my-2 ${
        message?.sender === 'user' ? 'justify-end' : ''
      }`}
    >
      {message?.sender === 'bot' && (
        <Image
          src="/images/nyan.png"
          alt="Bot"
          className="w-12 h-12 rounded-full"
        />
      )}
      <div className="message max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg">
        {message?.content}
      </div>
      {message?.sender === 'user' && (
        <Image
          src="/images/wk.jpg"
          alt="User"
          className="w-12 h-12 rounded-full"
        />
      )}
    </div>
  );
};
export default React.memo(ChatMessage);
