import { Messages } from '@/types';
import { MessageMarkdown } from '@/views/mig/components/chatMessage/ChatMessageMarkdown';
import classNames from 'classnames';
import { format } from 'date-fns';

type ChatMessageProps = {
  message?: Messages;
  isLast?: boolean;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const now = new Date();
  return (
    <div className="flex w-full justify-center">
      <div
        className={
          'relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]'
        }
      >
        <MessageMarkdown content={message?.content} />
      </div>
    </div>
  );
};

export default ChatMessage;
