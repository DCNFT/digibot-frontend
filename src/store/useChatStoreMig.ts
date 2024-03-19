import {
  Assistants,
  ChatMessage,
  ChatSettings,
  Chats,
  Message,
  MessageImage,
  Models,
  Profiles,
  Workspaces,
} from "@/types";
import { set } from "date-fns";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  profile: Profiles;
  userInput: string;
  isGenerating: boolean;
  isPromptPickerOpen: boolean;
  isFilePickerOpen: boolean;
  newMessageImages: MessageImage[];
  abortController: AbortController;
  models: Models[];
  chatSettings: ChatSettings | null;
  chats: Chats;
  selectedChat: Chats;
  selectedWorkspace: Workspaces;
  chatMessages: ChatMessage[];
  toolInUse: string;
  firstTokenReceived: boolean;
  selectedAssistant: Assistants;
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
  setChats: (chats: Chats) => void;
  setSelectedChat: (selectedChat: Chats) => void;
  setSelectedWorkspace: (selectedWorkspace: Workspaces) => void;
  setChatMessages: (chatMessages: ChatMessage[]) => void;
  setToolInUse: (toolInUse: string) => void;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  setAssistant: (selectedAssistant: Assistants) => void;
};

const initialState: State = {
  profile: {} as Profiles,
  userInput: "",
  isGenerating: false,
  isPromptPickerOpen: false,
  isFilePickerOpen: false,
  newMessageImages: [],
  abortController: new AbortController(),
  models: [],
  chatSettings: null,
  chats: {} as Chats,
  selectedChat: {} as Chats,
  selectedWorkspace: {} as Workspaces,
  chatMessages: [],
  toolInUse: "",
  firstTokenReceived: false,
  selectedAssistant: {} as Assistants,
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
    }))
  )
);

export default useChatStore;
