import { Message } from '@/views/chat';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  prompt: string;
  isRunning: boolean;
  chatData: Message[];
};

type Actions = {
  reset: () => void;
  setPrompt: (prompt: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setInsertChatData: (newMessage: Message) => void;
  setChatData: (
    chatData: Message[],
    lastChatMessageId: string | undefined,
    text: string,
  ) => void;
};

const initialState: State = {
  prompt: '',
  isRunning: false,
  chatData: [],
};

const useChatStore = create(
  devtools(
    immer<State & Actions>((set) => ({
      ...initialState,
      reset: () => set(initialState),
      setPrompt: (prompt) => set({ prompt }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setChatData: (chatData, lastChatMessageId, text) =>
        chatData.map((chatMessage) => {
          if (chatMessage.id === lastChatMessageId) {
            console.log('hi');
            // Immer를 사용하여 직접 객체를 수정
            return {
              ...chatMessage,
              content: chatMessage.content + text,
            };
          }
        }),
      setInsertChatData: (newMessage) =>
        set((state) => {
          state.chatData.push(newMessage);
        }),
    })),
  ),
);

export default useChatStore;
