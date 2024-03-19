import useChatStore from "@/store/useChatStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import HiddenButtons from "./HiddenButtons";

type ChatInputProps = {
  handleSubmit?: (e: FormEvent) => void;
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
    if (event.key === "Enter" && !event.shiftKey) {
      if (!isGenerating) {
        // isGenerating 상태가 false일 때만 폼 제출을 허용합니다.
      } else {
        // isGenerating 상태가 true이면 폼 제출을 방지합니다.
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const textarea = chatInputRef.current;
    if (textarea) {
      const handleCompositionStart = () => setIsTyping(true);
      const handleCompositionEnd = () => setIsTyping(false);

      textarea.addEventListener("compositionstart", handleCompositionStart);
      textarea.addEventListener("compositionend", handleCompositionEnd);

      return () => {
        textarea.removeEventListener(
          "compositionstart",
          handleCompositionStart
        );
        textarea.removeEventListener("compositionend", handleCompositionEnd);
      };
    }
  }, [chatInputRef]);

  const [isShowHiddenButton, setIsShowHiddenButton] = useState(false);
  const handleOptionButton = (e: any) => {
    e.preventDefault();
    console.log("handleOptionButton");
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
            value={prompt}
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
