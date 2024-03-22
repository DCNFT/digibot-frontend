import {
  Assistants,
  ChatData,
  ChatFile,
  ChatMessage,
  ChatSettings,
  Chats,
  FileItems,
  LLMID,
  Message,
  MessageImage,
  Models,
  Profiles,
  Workspaces,
} from '@/types';
import { set } from 'date-fns';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  userInput: string;
  profile: Profiles;
  isGenerating: boolean;
  isPromptPickerOpen: boolean;
  isFilePickerOpen: boolean;
  newMessageImages: MessageImage[];
  abortController: AbortController;
  models: Models[];
  chatSettings: ChatSettings | null;

  chats: Chats[];
  selectedChat: Chats | null;
  selectedWorkspace: Workspaces;
  chatMessages: ChatMessage[];
  chatMessagesList: ChatData[];
  toolInUse: string;
  firstTokenReceived: boolean;
  selectedAssistant: Assistants;
  chatFileItems: FileItems[];
  chatFiles: ChatFile[];
  chatImages: MessageImage[];
};

type Actions = {
  setProfile: (profile: Profiles) => void;
  setUserInput: (userInput: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsPromptPickerOpen: (isPromptPickerOpen: boolean) => void;
  setIsFilePickerOpen: (isFilePickerOpen: boolean) => void;
  setNewMessageImages: (newMessageImages: MessageImage[]) => void;
  setAbortController: (abortController: AbortController) => void;
  setModels: (models: Models[]) => void;
  setChatSettings: (chatSettings: ChatSettings) => void;
  setChats: (chats: Chats[]) => void;
  setSelectedChat: (selectedChat: Chats) => void;
  setSelectedWorkspace: (selectedWorkspace: Workspaces) => void;
  setChatMessages: (chatMessages: ChatMessage[]) => void;
  setToolInUse: (toolInUse: string) => void;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  setAssistant: (selectedAssistant: Assistants) => void;
  removeLastTwoChatMessages: () => void;
  updateChatMessageContent: (messageId: string, contentToAdd: string) => void;
  updateChatMessageListContent: (
    chatDataId: string,
    messageId: string,
    contentToAdd: string,
  ) => void;
  setChatFileItems: (chatFileItems: FileItems[]) => void;
  setChatMessagesListMessages: (
    chatDataId: string,
    chatMessages: ChatMessage[],
  ) => void;
};

const initialState: State = {
  profile: {} as Profiles,
  userInput: '',
  isGenerating: false,
  isPromptPickerOpen: false,
  isFilePickerOpen: false,
  newMessageImages: [],
  abortController: new AbortController(),
  models: [],
  chatSettings: {
    model: 'gpt-3.5-turbo' as LLMID,
    prompt: 'You are a friendly, helpful AI assistant.',
    temperature: 0.5,
    contextLength: 4096,
    includeProfileContext: true,
    includeWorkspaceInstructions: true,
    embeddingsProvider: 'openai',
  },
  chats: [] as Chats[],
  selectedChat: null,
  selectedWorkspace: {} as Workspaces,
  chatMessages: [],
  toolInUse: '',
  firstTokenReceived: false,
  selectedAssistant: {} as Assistants,
  chatFileItems: [],
  chatImages: [],
  chatFiles: [],
  chatMessagesList: [
    {
      chatMessages: [],
      chatId: '',
      chatSettings: {
        model: 'gpt-3.5-turbo' as LLMID,
        prompt: 'You are a friendly, helpful AI assistant.',
        temperature: 0.5,
        contextLength: 4096,
        includeProfileContext: true,
        includeWorkspaceInstructions: true,
        embeddingsProvider: 'openai',
      },
      id: '1',
      isDisplay: true,
    },
    {
      chatMessages: [],
      chatId: '',
      chatSettings: {
        model: 'gpt-4' as LLMID,
        prompt: 'You are a friendly, helpful AI assistant.',
        temperature: 0.5,
        contextLength: 4096,
        includeProfileContext: true,
        includeWorkspaceInstructions: true,
        embeddingsProvider: 'openai',
      },
      id: '2',
      isDisplay: true,
    },
  ],
};

const useChatStore = create(
  devtools(
    immer<State & Actions>((set, get) => ({
      ...initialState,
      reset: () => set(initialState),
      setUserInput: (userInput) => set({ userInput }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setIsPromptPickerOpen: (isPromptPickerOpen) =>
        set({ isPromptPickerOpen }),
      setIsFilePickerOpen: (isFilePickerOpen) => set({ isFilePickerOpen }),
      setNewMessageImages: (newMessageImages) => set({ newMessageImages }),
      setAbortController: (abortController) => set({ abortController }),
      setModels: (models) => set({ models }),
      setChatSettings: (chatSettings) => set({ chatSettings }),
      setProfile: (profile) => set({ profile }),
      setChats: (chats) => set({ chats }),
      setSelectedChat: (selectedChat) => set({ selectedChat }),
      setSelectedWorkspace: (selectedWorkspace) => set({ selectedWorkspace }),
      setChatMessages: (chatMessages) => set({ chatMessages }),
      setToolInUse: (toolInUse) => set({ toolInUse }),
      setFirstTokenReceived: (firstTokenReceived) =>
        set({ firstTokenReceived }),
      setAssistant: (selectedAssistant) => set({ selectedAssistant }),
      setChatFileItems: (chatFileItems) => set({ chatFileItems }),

      removeLastTwoChatMessages: () =>
        set((state) => {
          state.chatMessages = state.chatMessages.slice(0, -2);
        }),

      updateChatMessageContent: (messageId: string, contentToAdd: string) =>
        set((state) => {
          const messageIndex = state.chatMessages.findIndex(
            (chatMessage) => chatMessage.message.id === messageId,
          );
          if (messageIndex !== -1) {
            state.chatMessages[messageIndex].message.content += contentToAdd;
          }
        }),

      updateChatMessageListContent: (
        chatDataId: string,
        messageId: string,
        contentToAdd: string,
      ) =>
        set((state) => {
          const chatMessageData = state.chatMessagesList.find(
            (chatData) => chatData.id === chatDataId,
          );
          console.log(
            'updateChatMessageListContent= chatMessageData',
            chatMessageData,
          );
          const message = chatMessageData?.chatMessages.find(
            (chatMessage) => chatMessage.message.id === messageId,
          );
          console.log('updateChatMessageListContent= ', message);
          if (message) {
            // 직접 상태 수정. Immer가 불변성을 자동으로 처리함.
            message.message.content += contentToAdd;
          }
        }),
      setChatMessagesListMessages: (
        chatDataId: string,
        chatMessages: ChatMessage[],
      ) =>
        set((state) => {
          const chatData = state.chatMessagesList.find(
            (chatData) => chatData.id === chatDataId,
          );
          if (chatData) {
            chatData.chatMessages = chatMessages;
          }
        }),
    })),
  ),
);

export default useChatStore;
