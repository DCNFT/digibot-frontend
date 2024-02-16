import { Message } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { SYSTEM_MESSAGE_LAB } from '@/constants/default';

type State = {
  prompt: string;
  isGenerating: boolean;
  chatData: Message[];
  isFlowChat: boolean;
  lastChatMessageId: string | undefined;
  menuNum: number;
};

type Actions = {
  reset: () => void;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setInsertChatData: (newMessage: Message) => void;
  setChatData: (chatData: Message[]) => void;
  setIsFlowChat: (isFlowChat: boolean) => void;
  setChatDataUpdateWithMessageId: (
    lastChatMessageId: string | undefined,
    text: string,
  ) => void;
  setLastChatMessageId: (lastChatMessageId: string | undefined) => void;
  setMenuNum: (menuNum: number) => void;
};

const initialState: State = {
  prompt: '',
  isGenerating: false,
  chatData: [
    {
      role: 'system',
      content: SYSTEM_MESSAGE_LAB,
      id: uuidv4(),
    },
  ],
  isFlowChat: true,
  lastChatMessageId: undefined,
  menuNum: 5,
};

const useChatStoreLab = create(
  devtools(
    immer<State & Actions>((set, get) => ({
      ...initialState,
      reset: () => set(initialState),
      setPrompt: (prompt) => set({ prompt }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
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
      setIsFlowChat(isFlowChat) {
        set({ isFlowChat });
      },
    })),
  ),
);

export default useChatStoreLab;
