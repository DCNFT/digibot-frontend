import useChatStore from '@/store/useChatStore';
import { FormEvent } from 'react';

type HiddenButtonsProps = {
  isShowHiddenButton: boolean;
  handleSubmit?: (e: FormEvent, title: string) => void;
  handleOptionButton: (e: any) => void;
};
const HiddenButtons = ({
  handleSubmit,
  isShowHiddenButton,
  handleOptionButton,
}: HiddenButtonsProps) => {
  const setPrompt = useChatStore((state) => state.setPrompt);

  const handleButton = (e: any, title: string) => {
    setPrompt(title);
    if (handleSubmit) handleSubmit(e, title);
    handleOptionButton(e);
  };
  return (
    <div
      id="hiddenButtons"
      className="absolute bottom-[66px]"
      style={{ display: isShowHiddenButton ? 'block' : 'none' }}
    >
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '경조금에 대해서 알려줘')}
      >
        경조금 문의
      </button>
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '복지 및 포상에 대해서 알려줘')}
      >
        복지 및 포상 문의
      </button>
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '여비에 대해서 알려줘')}
      >
        여비 문의
      </button>
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '카페테리아에 대해서 알려줘')}
      >
        카페테리아 문의
      </button>
    </div>
  );
};

export default HiddenButtons;
