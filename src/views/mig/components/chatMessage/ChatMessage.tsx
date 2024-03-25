import { Messages } from '@/types';
import { MessageMarkdown } from '@/views/mig/components/chatMessage/ChatMessageMarkdown';
import classNames from 'classnames';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ChatMessageProps = {
  message?: Messages;
  isLast?: boolean;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const now = new Date();
  return (
    <div
      className={cn(
        'flex w-full justify-center',
        message?.role === 'user' ? '' : 'bg-secondary',
      )}
      id={message?.id}
    >
      <div className="flex flex-col">
        {message?.model === 'gpt-3.5-turbo' ? <p>gpt-3.5</p> : <p>gpt-4</p>}
        {message?.role === 'user' ? <p>user</p> : <p>bot</p>}
      </div>

      <div
        // className={
        //   'relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]'
        // }
        className="relative flex w-full"
      >
        <MessageMarkdown content={message?.content} />
      </div>
    </div>
  );
};

export default ChatMessage;
