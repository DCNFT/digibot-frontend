import ChatBody from './components/ChatBody';
import ChatInput from './components/ChatInput';
import useChatStore from '@/store/useChatStore';

const NewHome = () => {
  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="absolute left-4 top-2.5 flex justify-center"></div>

      <div className="absolute right-4 top-1 flex h-[40px] items-center space-x-2"></div>

      <div className="bg-secondary flex max-h-[50px] min-h-[50px] w-full items-center justify-center border-b-2 px-20 font-bold">
        <div className="max-w-[300px] truncate sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
          {'Chat'}
        </div>
      </div>

      <div className="flex size-full flex-col overflow-auto border-b h-full w-full">
        <ChatBody />
      </div>
      <div className="relative w-[300px] items-end pb-8 pt-5 sm:w-[400px] md:w-[500px] lg:w-[660px] xl:w-[800px]">
        <ChatInput />
      </div>
    </div>
  );
};
export default NewHome;
