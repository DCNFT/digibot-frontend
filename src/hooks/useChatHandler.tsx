import {
  createTempMessages,
  handleCreateMessages,
  handleCreateChat,
  handleHostedChat,
  processResponse,
  validateChatSettings,
} from '@/lib/chat';
import {
  ChatMessage,
  ChatPayload,
  FileItems,
  LLMID,
  ModelProvider,
} from '@/types';
import useChatStore from '@/store/useChatStoreMig';
import { LLM_LIST } from '@/lib/models/llm/llm-list';
import { useRef } from 'react';

export const useChatHandler = () => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const profile = useChatStore((state) => state.profile);
  const setUserInput = useChatStore((state) => state.setUserInput);
  const setIsGenerating = useChatStore((state) => state.setIsGenerating);
  const setIsPromptPickerOpen = useChatStore(
    (state) => state.setIsPromptPickerOpen,
  );
  const setIsFilePickerOpen = useChatStore(
    (state) => state.setIsFilePickerOpen,
  );
  const newMessageImages = useChatStore((state) => state.newMessageImages);
  const setNewMessageImages = useChatStore(
    (state) => state.setNewMessageImages,
  );
  const abortController = useChatStore((state) => state.abortController);
  const setAbortController = useChatStore((state) => state.setAbortController);
  const models = useChatStore((state) => state.models);
  const chatSettings = useChatStore((state) => state.chatSettings);
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const selectedWorkspace = useChatStore((state) => state.selectedWorkspace);
  const setChatMessages = useChatStore((state) => state.setChatMessages);
  const selectedAssistant = useChatStore((state) => state.selectedAssistant);
  const setFirstTokenReceived = useChatStore(
    (state) => state.setFirstTokenReceived,
  );
  const chatFileItems = useChatStore((state) => state.chatFileItems);
  const chatImages = useChatStore((state) => state.chatImages);
  const setToolInUse = useChatStore((state) => state.setToolInUse);
  const removeLastTwoChatMessages = useChatStore(
    (state) => state.removeLastTwoChatMessages,
  );
  const updateChatMessageContent = useChatStore(
    (state) => state.updateChatMessageContent,
  );

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean,
  ) => {
    const startingInput = messageContent;

    try {
      setUserInput('');
      setIsGenerating(true);
      // setIsPromptPickerOpen(false);
      // setIsFilePickerOpen(false);
      setNewMessageImages([]);

      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      console.log('[seo][handleSendMessage] chatSettings', chatSettings);
      // console.log('[sep] LLM_LIST = ', LLM_LIST);
      const modelData = [
        ...models.map((model) => ({
          modelId: model.model_id as LLMID,
          modelName: model.name,
          provider: 'custom' as ModelProvider,
          hostedId: model.id,
          platformLink: '',
          imageInput: false,
        })),
        ...LLM_LIST,
      ].find((llm) => llm.modelId === chatSettings?.model);

      console.log('[seo][handleSendMessage] modelData', modelData);

      validateChatSettings(
        chatSettings,
        modelData,
        profile,
        selectedWorkspace,
        messageContent,
      );

      let currentChat = selectedChat ? { ...selectedChat } : null;

      const b64Images = newMessageImages.map((image) => image.base64);

      let retrievedFileItems: FileItems[] = [];

      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          chatSettings!,
          b64Images,
          isRegeneration,
          setChatMessages,
        );

      let payload: ChatPayload = {
        chatSettings: chatSettings!,
        workspaceInstructions: selectedWorkspace!.instructions || '',
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
        assistant: selectedChat?.assistant_id ? selectedAssistant : null,
        messageFileItems: retrievedFileItems,
        chatFileItems: chatFileItems,
      };
      console.log('[seo] payload= ', payload);
      let generatedText = '';
      generatedText = await handleHostedChat(
        payload,
        profile!,
        modelData!,
        tempAssistantChatMessage,
        isRegeneration,
        newAbortController,
        newMessageImages,
        chatImages,
        setIsGenerating,
        setFirstTokenReceived,
        removeLastTwoChatMessages,
        updateChatMessageContent,
        setToolInUse,
      );

      if (!currentChat) {
        currentChat = await handleCreateChat(
          chatSettings!,
          profile!,
          selectedWorkspace!,
          messageContent,
          selectedAssistant!,
          //newMessageFiles,
          setSelectedChat,
          chats,
          setChats,
          //setChatFiles,
        );
        console.log('[seo][handleSendMessage] currentChat', currentChat);
      } else {
        // const updatedChat = await updateChat(currentChat.id, {
        //   updated_at: new Date().toISOString(),
        // });

        const updatedChat = chats.map((chat) => {
          if (currentChat?.id === chat.id) {
            return { ...chat, updated_at: new Date().toISOString() };
          }
          return chat;
        });

        setChats(updatedChat);
        // setChats((prevChats) => {
        //   const updatedChats = prevChats.map((prevChat) =>
        //     prevChat.id === updatedChat.id ? updatedChat : prevChat,
        //   );
        //   return updatedChats;
        // });
      }

      await handleCreateMessages(
        chatMessages,
        currentChat,
        profile!,
        modelData!,
        messageContent,
        generatedText,
        retrievedFileItems,
        setChatMessages,
        selectedAssistant,
      );
      setIsGenerating(false);
      setFirstTokenReceived(false);
      setUserInput('');
    } catch (error) {
      setIsGenerating(false);
      setFirstTokenReceived(false);
      setUserInput(startingInput);
    }
  };

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return {
    chatInputRef,
    handleSendMessage,
    // handleFocusChatInput,
    handleStopMessage,
  };
};
