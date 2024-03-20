import { FormEvent, useEffect, useRef, useState } from 'react';
import HiddenButtons from './HiddenButtons';
import { useChatHandler } from '@/hooks/useChatHandler';
import useChatStore from '@/store/useChatStoreMig';

type ChatInputProps = {
  handleSubmit?: (e: FormEvent) => void;
};

const ChatInput = ({ handleSubmit }: ChatInputProps) => {
  const { chatInputRef, handleSendMessage, handleStopMessage } =
    useChatHandler();

  const userInput = useChatStore((state) => state.userInput);
  const setUserInput = useChatStore((state) => state.setUserInput);
  const chatMessages = useChatStore((state) => state.chatMessages);
  const handleInput = (value: string) => {};

  const [isTyping, setIsTyping] = useState(false);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // setIsPromptPickerOpen(false);
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

  const [isShowHiddenButton, setIsShowHiddenButton] = useState(false);
  const handleOptionButton = (e: any) => {
    e.preventDefault();
    console.log('handleOptionButton');
    setIsShowHiddenButton(!isShowHiddenButton);
  };

  return (
    <div className="input-container">
      <HiddenButtons
        isShowHiddenButton={isShowHiddenButton}
        handleOptionButton={handleOptionButton}
        handleSubmit={handleSubmit}
      />
      <form id="chat-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            // ref={chatInputRef}
            type="text"
            id="user-input"
            onChange={(e) => handleInput(e.target.value)}
            value={userInput}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
          />
          {/* <button
            type="button"
            className="show-options-btn"
            onClick={handleOptionButton}
          >
            #
          </button> */}
          <input
            type="submit"
            id="send-button"
            className="send_btn"
            value="" // defaultValue 대신 value 사용, 버튼에 표시될 텍스트
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
