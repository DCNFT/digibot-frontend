import { Button } from '@/components/ui/button';
import { TextareaAutosize } from '@/components/ui/textareaAutosize';
import useChatStore from '@/store/useChatStore';
import { ReloadIcon } from '@radix-ui/react-icons';
import { FormEvent, useEffect, useRef, useState } from 'react';

type ChatInputProps = {
  handleSubmit: (e: FormEvent) => void;
};

const ChatInput = ({ handleSubmit }: ChatInputProps) => {
  const prompt = useChatStore((state) => state.prompt);
  const setPrompt = useChatStore((state) => state.setPrompt);
  const isGenerating = useChatStore((state) => state.isGenerating);

  const handleInput = (value: string) => {
    setPrompt(value);
  };

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      !isTyping &&
      event.key === 'Enter' &&
      !event.shiftKey &&
      !isGenerating
    ) {
      event.preventDefault();
      //setIsPromptPickerOpen(false);
      handleSubmit(event);
      //handleSendMessage(userInput, chatMessages, false);
    }
  };
  useEffect(() => {
    const textarea = chatInputRef.current;
    if (textarea) {
      const handleCompositionStart = () => setIsTyping(true);
      const handleCompositionEnd = () => setIsTyping(false);

      textarea.addEventListener('compositionstart', handleCompositionStart);
      textarea.addEventListener('compositionend', handleCompositionEnd);

      return () => {
        textarea.removeEventListener(
          'compositionstart',
          handleCompositionStart,
        );
        textarea.removeEventListener('compositionend', handleCompositionEnd);
      };
    }
  }, [chatInputRef]);

  return (
    <div className="relative w-[300px] items-end pb-8 pt-5 sm:w-[400px] md:w-[500px] lg:w-[660px] xl:w-[800px]">
      {/* <form onSubmit={handleSubmit} className="" style={{ height: '4rem' }}> */}
      <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <TextareaAutosize
          textareaRef={chatInputRef}
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-7 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`XD-BOT에게 질문해보세요~`}
          onValueChange={handleInput}
          value={prompt}
          minRows={1}
          maxRows={18}
          onKeyDown={handleKeyDown}
          // onPaste={handlePaste}
        />
        <Button
          onClick={handleSubmit}
          disabled={isGenerating}
          className={`flex-shrink-0 ${
            isGenerating ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
          } text-white py-2 px-4 rounded-md transition duration-300`}
        >
          {isGenerating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Send
        </Button>
      </div>
      {/* </form> */}
    </div>
  );
};

export default ChatInput;
