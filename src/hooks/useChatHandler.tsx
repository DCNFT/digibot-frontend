// import { ChatbotUIContext } from "@/context/context";
// import { getAssistantCollectionsByAssistantId } from "@/db/assistant-collections";
// import { getAssistantFilesByAssistantId } from "@/db/assistant-files";
// import { getAssistantToolsByAssistantId } from "@/db/assistant-tools";
// import { updateChat } from "@/db/chats";
// import { getCollectionFilesByCollectionId } from "@/db/collection-files";
// import { deleteMessagesIncludingAndAfter } from "@/db/messages";
// import { buildFinalMessages } from "@/lib/build-prompt";
// import { Tables } from "@/supabase/types";
// import { ChatMessage, ChatPayload, LLMID, ModelProvider } from "@/types";
import { useRouter } from 'next/navigation';
// import { useContext, useEffect, useRef } from "react";
import {
  createTempMessages,
  handleCreateMessages,
  handleCreateChat,
  handleHostedChat,
  // handleLocalChat,
  // handleRetrieval,
  processResponse,
  validateChatSettings,
  // validateChatSettings,
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

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean,
  ) => {
    const startingInput = messageContent;

    try {
      setUserInput('');
      setIsGenerating(true);
      setIsPromptPickerOpen(false);
      setIsFilePickerOpen(false);
      setNewMessageImages([]);

      const newAbortController = new AbortController();
      setAbortController(newAbortController);

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
        // ...availableLocalModels,
        // ...availableOpenRouterModels,
      ].find((llm) => llm.modelId === chatSettings?.model);

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

      // if (
      //   (newMessageFiles.length > 0 || chatFiles.length > 0) &&
      //   useRetrieval
      // ) {
      //   setToolInUse("retrieval");

      //   retrievedFileItems = await handleRetrieval(
      //     userInput,
      //     newMessageFiles,
      //     chatFiles,
      //     chatSettings!.embeddingsProvider,
      //     sourceCount
      //   );
      // }

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

      let generatedText = '';

      // if (selectedTools.length > 0) {
      //   setToolInUse("Tools");

      //   const formattedMessages = await buildFinalMessages(
      //     payload,
      //     profile!,
      //     chatImages
      //   );

      //   const response = await fetch("/api/chat/tools", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       chatSettings: payload.chatSettings,
      //       messages: formattedMessages,
      //       selectedTools,
      //     }),
      //   });

      //   setToolInUse("none");

      //   generatedText = await processResponse(
      //     response,
      //     isRegeneration
      //       ? payload.chatMessages[payload.chatMessages.length - 1]
      //       : tempAssistantChatMessage,
      //     true,
      //     newAbortController,
      //     setFirstTokenReceived,
      //     setChatMessages,
      //     setToolInUse
      //   );
      // }

      // else {
      if (modelData!.provider === 'ollama') {
        // generatedText = await handleLocalChat(
        //   payload,
        //   profile!,
        //   chatSettings!,
        //   tempAssistantChatMessage,
        //   isRegeneration,
        //   newAbortController,
        //   setIsGenerating,
        //   setFirstTokenReceived,
        //   setChatMessages,
        //   setToolInUse
        // );
      } else {
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
      }
      // }

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
        newMessageImages,
        isRegeneration,
        retrievedFileItems,
        setChatMessages,
        // setChatFileItems,
        // setChatImages,
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

  // const handleSendEdit = async (
  //   editedContent: string,
  //   sequenceNumber: number
  // ) => {
  //   if (!selectedChat) return;

  //   await deleteMessagesIncludingAndAfter(
  //     selectedChat.user_id,
  //     selectedChat.id,
  //     sequenceNumber
  //   );

  //   const filteredMessages = chatMessages.filter(
  //     (chatMessage) => chatMessage.message.sequence_number < sequenceNumber
  //   );

  //   setChatMessages(filteredMessages);

  //   handleSendMessage(editedContent, filteredMessages, false);
  // };

  return {
    chatInputRef,
    prompt,
    // handleNewChat,
    handleSendMessage,
    // handleFocusChatInput,
    handleStopMessage,
    // handleSendEdit,
  };
};
