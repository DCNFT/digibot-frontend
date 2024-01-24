import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useChatStore from '@/store/useChatStore';
import { ReloadIcon } from '@radix-ui/react-icons';
import { FormEvent } from 'react';

type ChatInputProps = {
  handleSubmit: (e: FormEvent) => void;
};

const ChatInput = ({ handleSubmit }: ChatInputProps) => {
  const prompt = useChatStore((state) => state.prompt);
  const setPrompt = useChatStore((state) => state.setPrompt);
  const isRunning = useChatStore((state) => state.isRunning);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t fixed bottom-0 left-0 right-0 bg-white "
        style={{ height: '4rem' }}
      >
        <div className="flex gap-2 items-center">
          <Input
            value={prompt}
            onChange={handleInput}
            placeholder="Type your message here"
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isRunning}
            className={`flex-shrink-0 ${
              isRunning ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-md transition duration-300`}
          >
            {isRunning && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
