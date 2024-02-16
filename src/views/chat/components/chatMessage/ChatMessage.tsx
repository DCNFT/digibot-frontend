import Image from 'next/image';
import React, { useState } from 'react';
import { ChatMessageActions } from './ChatMessageActions';
import { MessageMarkdown } from './ChatMessageMarkdown';
import { Message } from '@/types';

type ChatMessageProps = {
  message?: Message;
  isLoader?: boolean;
  isGenerating?: boolean;
  isLastChatMessage?: boolean;
};

const ChatMessage = ({
  message,
  isGenerating,
  isLastChatMessage,
}: ChatMessageProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(message?.content ?? '');
  };

  return (
    <div
      className="relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`flex items-end gap-2 my-2 ${
          message?.role === 'user' ? 'justify-end' : ''
        }`}
      >
        {(message?.role === 'assistant' || message?.role === 'system') && (
          <Image
            src="/images/XD_BOT.jpg"
            alt="Bot"
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
          />
        )}
        <div className="message max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg relative">
          {(message?.role === 'assistant' || message?.role === 'system') &&
            isGenerating &&
            (message?.content.length === 0 || message?.content === undefined) &&
            isLastChatMessage && <div className="loader" />}
          <div className="absolute right-[5px] top-[2px]">
            <ChatMessageActions
              onCopy={handleCopy}
              isAssistant={message?.role === 'assistant'}
              isHovering={isHovering}
            />
          </div>

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
    </div>
  );
};
export default React.memo(ChatMessage);
