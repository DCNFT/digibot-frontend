import { Message } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

type State = {
  prompt: string;
  isRunning: boolean;
  chatData: Message[];
  isFlowChat: boolean;
  lastChatMessageId: string | undefined;
  menuNum: number;
};

type Actions = {
  reset: () => void;
  setPrompt: (prompt: string) => void;
  setIsRunning: (isRunning: boolean) => void;
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
  isRunning: false,
  chatData: [
    {
      role: 'system',
      content:
        "안녕하세요? XD 봇입니다.\n도움 받고자 하는 항목을 입력해주세요.\n단, 항목은 '1' 과 같이 숫자 형태로 입력해주세요.\n1. 경조금 문의\n2. 복지 및 포상 문의\n3. 여비 문의\n4. 카페테리아 문의\n5. 리조트 문의 \n6. 그 외 질문\n",
      id: uuidv4(),
    },
  ],
  isFlowChat: true,
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
      setIsFlowChat(isFlowChat) {
        set({ isFlowChat });
      },
    })),
  ),
);

export default useChatStore;
