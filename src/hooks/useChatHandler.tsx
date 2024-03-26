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
  ChatSettings,
  FileItems,
  LLMID,
  ModelProvider,
} from '@/types';
import useChatStore from '@/store/useChatStoreMig';
import { LLM_LIST } from '@/lib/models/llm/llm-list';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export const useChatHandler = () => {
  const router = useRouter();
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

  const updateChatMessageListContent = useChatStore(
    (state) => state.updateChatMessageListContent,
  );
  const setChatMessagesListMessages = useChatStore(
    (state) => state.setChatMessagesListMessages,
  );

  const setChatSettings = useChatStore((state) => state.setChatSettings);

  const handleNewChat = () => {
    setUserInput('');
    setChatMessages([]);
    setSelectedChat(null);
    //setChatFileItems([]);

    setIsGenerating(false);
    setFirstTokenReceived(false);

    //setChatFiles([]);
    //setChatImages([]);
    //setNewMessageFiles([]);
    //setNewMessageImages([]);
    //setShowFilesDisplay(false);
    setIsPromptPickerOpen(false);
    //setIsAtPickerOpen(false);

    //setSelectedTools([]);
    setToolInUse('none');

    // if (selectedAssistant) {
    //   setChatSettings({
    //     model: selectedAssistant.model as LLMID,
    //     prompt: selectedAssistant.prompt,
    //     temperature: selectedAssistant.temperature,
    //     contextLength: selectedAssistant.context_length,
    //     includeProfileContext: selectedAssistant.include_profile_context,
    //     includeWorkspaceInstructions:
    //       selectedAssistant.include_workspace_instructions,
    //     embeddingsProvider: selectedAssistant.embeddings_provider as
    //       | 'openai'
    //       | 'local',
    //   });
    // } else if (selectedPreset) {
    //   setChatSettings({
    //     model: selectedPreset.model as LLMID,
    //     prompt: selectedPreset.prompt,
    //     temperature: selectedPreset.temperature,
    //     contextLength: selectedPreset.context_length,
    //     includeProfileContext: selectedPreset.include_profile_context,
    //     includeWorkspaceInstructions:
    //       selectedPreset.include_workspace_instructions,
    //     embeddingsProvider: selectedPreset.embeddings_provider as
    //       | 'openai'
    //       | 'local',
    //   });
    // } else

    if (selectedWorkspace) {
      setChatSettings({
        model: (selectedWorkspace.default_model || 'gpt-4') as LLMID,
        prompt:
          selectedWorkspace.default_prompt ||
          'You are a friendly, helpful AI assistant.',
        temperature: selectedWorkspace.default_temperature || 0.5,
        contextLength: selectedWorkspace.default_context_length || 4096,
        includeProfileContext:
          selectedWorkspace.include_profile_context || true,
        includeWorkspaceInstructions:
          selectedWorkspace.include_workspace_instructions || true,
        embeddingsProvider:
          (selectedWorkspace.embeddings_provider as 'openai' | 'local') ||
          'openai',
      });
    }

    router.push('/chat');
  };

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

      console.log('[seo] selectedChat ', selectedChat);
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
        console.log('[seo][handleSendMessage] currentChat is null');
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
      console.log('[seo][handleSendMessage] currentChat', currentChat);
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

  const handleMultiSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    chatSettings: ChatSettings,
    chatDataId: string,
    userInputSequenceId: string,
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

      console.log('[seo] selectedChat ', selectedChat);
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
          setChatMessagesListMessages,
          chatDataId,
          userInputSequenceId,
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
        updateChatMessageListContent,
        chatDataId,
      );

      if (!currentChat) {
        console.log('[seo][handleSendMessage] currentChat is null');
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
      console.log('[seo][handleSendMessage] currentChat', currentChat);
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
        userInputSequenceId,
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
    handleMultiSendMessage,
    // handleFocusChatInput,
    handleStopMessage,
    handleNewChat,
  };
};
