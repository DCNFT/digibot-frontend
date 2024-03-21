import ChatBody from './components/ChatBody';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import classNames from 'classnames';
import useChatStore from '@/store/useChatStore';

const NewHome = () => {
  const isSideMenuOpen = useChatStore((state) => state.isSideMenuOpen);
  const mainClass = classNames({
    main: true,
    active: isSideMenuOpen,
  });

  return (
    <>
      <Sidebar />
      <div className={mainClass} id="main">
        <div>
          <ChatBody />
          <ChatInput />
        </div>
      </div>
    </>
  );
};
export default NewHome;
