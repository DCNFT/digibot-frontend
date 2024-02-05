'use client';

import useToast from '@/hooks/useToast';
import { useRouter } from 'next/router';

import useChatStore from '@/store/useChatStore';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { DialogCloseButton } from '@/views/lab/components/SettingModal';

const BannerTitle = () => {
  const menuNum = useChatStore((state) => state.menuNum);
  return (
    <div className="text-center">
      <>{menuNum === 1 && <p>경조금 문의</p>}</>
      <>{menuNum === 2 && <p>복지 및 포상 문의</p>}</>
      <>{menuNum === 3 && <p>여비 문의</p>}</>
      <>{menuNum === 4 && <p>카페테리아 문의</p>}</>
      <>{menuNum === 5 && <p>Chat</p>}</>
    </div>
  );
};
const AppBar = () => {
  const { enqueueInfoBar } = useToast();
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
  });
  const menuNum = useChatStore((state) => state.menuNum);
  const setMenuNum = useChatStore((state) => state.setMenuNum);
  const chatData = useChatStore((state) => state.chatData);
  const setChatData = useChatStore((state) => state.setChatData);
  // const router = useRouter();

  const handleMenuNumber = (menuNumber: number) => {
    setMenuNum(menuNumber);
    setChatData([]);
  };

  const buttonStyle = (number: number) =>
    `hover:bg-blue-200 ${menuNum === number ? 'bg-blue-500' : ''}`;

  const handleLog = () => {
    //console.log(chatData.map(({ id, ...rest }) => rest));
    console.log(chatData);
    copyToClipboard(JSON.stringify(chatData.map(({ id, ...rest }) => rest)));
    enqueueInfoBar('복사가 완료되었습니다.');
  };

  return (
    <div className="flex bg:white max-h-[60px] min-h-[60px] w-full items-center justify-center border-b-2 px-20 font-bold">
      <div className="flex gap-2 items-center">
        <BannerTitle />
        {/* {router?.pathname === '/lab' && <DialogCloseButton />} */}
        <DialogCloseButton />
      </div>
    </div>
  );
};

export default AppBar;
