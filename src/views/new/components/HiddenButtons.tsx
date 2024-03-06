import useChatStore from '@/store/useChatStore';
import { FormEvent } from 'react';

type HiddenButtonsProps = {
  isShowHiddenButton: boolean;
  handleSubmit?: (e: FormEvent) => void;
};
const HiddenButtons = ({
  handleSubmit,
  isShowHiddenButton,
}: HiddenButtonsProps) => {
  const setPrompt = useChatStore((state) => state.setPrompt);

  const handleButton = (e: any, title: string) => {
    setPrompt(title);
    if (handleSubmit) handleSubmit(e);
  };
  return (
    <div
      id="hiddenButtons"
      className="absolute bottom-[66px]"
      style={{ display: isShowHiddenButton ? 'block' : 'none' }}
    >
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '경조금 문의')}
      >
        경조금 문의
      </button>
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '복지 및 포상 문의')}
      >
        복지 및 포상 문의
      </button>
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '여비 문의')}
      >
        여비 문의
      </button>
      <button
        className="hidden-button"
        onClick={(e) => handleButton(e, '카페테리아 문의')}
      >
        카페테리아 문의
      </button>
    </div>
  );
};

export default HiddenButtons;
