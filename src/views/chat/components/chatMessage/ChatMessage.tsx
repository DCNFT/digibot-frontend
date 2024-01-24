import Image from 'next/image';
import React from 'react';

import { MessageMarkdown } from './ChatMessageMarkdown';
import { Message } from '@/types';

type ChatMessageProps = {
  message?: Message;
  isLoader?: boolean;
  isRunning?: boolean;
  isLastChatMessage?: boolean;
};

const ChatMessage = ({
  message,
  isRunning,
  isLastChatMessage,
}: ChatMessageProps) => {
  console.log(isLastChatMessage);
  return (
    <div
      className={`flex items-end gap-2 my-2 ${
        message?.role === 'user' ? 'justify-end' : ''
      }`}
    >
      {message?.role === 'assistant' && (
        <Image
          src="/images/XD_BOT.jpg"
          alt="Bot"
          className="w-12 h-12 rounded-full"
          width={48}
          height={48}
        />
      )}
      <div className="message max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg">
        {message?.role === 'assistant' &&
          isRunning &&
          (message?.content.length === 0 || message?.content === undefined) &&
          isLastChatMessage && <div className="loader" />}
        <MessageMarkdown content={message?.content} />
      </div>

      {message?.role === 'user' && (
        <Image
          src="/images/wk.jpg"
          alt="User"
          className="w-12 h-12 rounded-full"
          width={48}
          height={48}
        />
      )}
    </div>
  );
};
export default React.memo(ChatMessage);
