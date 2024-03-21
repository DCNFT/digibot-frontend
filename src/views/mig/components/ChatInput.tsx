import { FormEvent, useEffect, useRef, useState } from 'react';
import HiddenButtons from './HiddenButtons';
import { useChatHandler } from '@/hooks/useChatHandler';
import useChatStore from '@/store/useChatStoreMig';
import { TextareaAutosize } from '@/components/ui/textareaAutosize';
import { usePromptAndCommand } from '@/hooks/use-prompt-and-command';

const ChatInput = () => {
  const { chatInputRef, handleSendMessage } = useChatHandler();
  const { handleInputChange } = usePromptAndCommand();
  const userInput = useChatStore((state) => state.userInput);
  const chatMessages = useChatStore((state) => state.chatMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    console.log('[seo] handleKeyDown');
    if (!isTyping && event.key === 'Enter' && !event.shiftKey) {
      console.log('[seo] enter');
      event.preventDefault();
      handleSendMessage(userInput, chatMessages, false);
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
    <div className="input-container">
      <TextareaAutosize
        textareaRef={chatInputRef}
        className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={`XD-BOT에게 질문해보세요~`}
        onValueChange={handleInputChange}
        value={userInput}
        minRows={1}
        maxRows={18}
        onKeyDown={handleKeyDown}
        // onPaste={handlePaste}
        // onCompositionStart={() => setIsTyping(true)}
        // onCompositionEnd={() => setIsTyping(false)}
      />
    </div>
  );
};

export default ChatInput;
