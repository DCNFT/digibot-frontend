import { Messages } from '@/types';
import { MessageMarkdown } from '@/views/chat/components/chatMessage/ChatMessageMarkdown';
import classNames from 'classnames';
import { format } from 'date-fns';

type ChatMessageProps = {
  message?: Messages;
  isLast?: boolean;
};

const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
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
      <div className={chatMessageClass}></div>
    </div>
  );
};

export default ChatMessage;
