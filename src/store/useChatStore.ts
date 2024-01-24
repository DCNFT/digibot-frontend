import { Message } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  prompt: string;
  isRunning: boolean;
  chatData: Message[];
  lastChatMessageId: string | undefined;
  menuNum: number;
};

type Actions = {
  reset: () => void;
  setPrompt: (prompt: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setInsertChatData: (newMessage: Message) => void;
  setChatData: (chatData: Message[]) => void;
  setChatDataUpdateWithMessageId: (
    lastChatMessageId: string | undefined,
    text: string,
  ) => void;
  setLastChatMessageId: (lastChatMessageId: string | undefined) => void;
  setMenuNum: (menuNum: number) => void;
};

const initialState: State = {
  prompt: '',
  isRunning: false,
  chatData: [],
  lastChatMessageId: undefined,
  menuNum: 5,
};

const useChatStore = create(
  devtools(
    immer<State & Actions>((set, get) => ({
      ...initialState,
      reset: () => set(initialState),
      setPrompt: (prompt) => set({ prompt }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setChatDataUpdateWithMessageId: (lastChatMessageId, text) =>
        set((state) => {
          const chatMessage = state.chatData.find(
            (chatMessage) => chatMessage.id === lastChatMessageId,
          );
          if (chatMessage) chatMessage.content += text;
        }),
      setChatData: (chatData) => set({ chatData }),
      setInsertChatData: (newMessage) =>
        set((state) => {
          state.chatData.push(newMessage);
        }),
      setLastChatMessageId: (lastChatMessageId) => set({ lastChatMessageId }),
      setMenuNum: (menuNum) => set({ menuNum }),
    })),
  ),
);

export default useChatStore;
