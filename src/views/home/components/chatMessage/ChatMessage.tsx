import { Message } from '@/types';
import { MessageMarkdown } from '@/views/chat/components/chatMessage/ChatMessageMarkdown';
import classNames from 'classnames';
import { format } from 'date-fns';

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
  const now = new Date();
  const timeString = format(now, 'HH:mm');
  const chatMessageClass = classNames({
    'chat-message': true,
    'user-message': message?.role === 'user',
    'bot-message': message?.role === 'system' || message?.role === 'assistant',
  });
  const chatMessageTimeClass = classNames({
    'message-time': true,
    'user-message-time': message?.role === 'user',
    'bot-message-time':
      message?.role === 'system' || message?.role === 'assistant',
  });

  return (
    <div className="message-container">
      <div className={chatMessageClass}>
        <img src="/images/profile.jpg" className="avatar bot-avatar" alt="" />

        <div className="message-content">
          {isGenerating &&
            (message?.content.length === 0 || message?.content === undefined) &&
            isLastChatMessage && <div className="loader" />}

          {message?.role === 'user' ? (
            <>{message.content}</>
          ) : (
            <MessageMarkdown content={message?.content} />
          )}
        </div>
      </div>
      <div className={chatMessageTimeClass}>{timeString}</div>
    </div>
  );
};

export default ChatMessage;
