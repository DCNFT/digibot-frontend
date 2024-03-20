import { createDocXFile } from './../db/files';
import { create } from 'zustand';
import {
  Assistants,
  ChatFile,
  ChatMessage,
  ChatPayload,
  ChatSettings,
  Chats,
  FileItems,
  LLM,
  Message,
  MessageImage,
  Messages,
  Profiles,
  Workspaces,
} from '@/types';
import { consumeReadableStream } from './consumeStream';
import {
  CHAT_BOT_DEFAULT_ID,
  CHAT_USER_DEFAULT_ID,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_LAB,
} from '@/constants/default';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '@/types/daouOffice';
import {
  buildFinalMessages,
  buildGoogleGeminiFinalMessages,
} from './build-prompt';
import { createMessages, updateMessage } from '@/db/messages';
import { uploadMessageImage } from '@/db/storage/message-images';
import { createMessageFileItems } from '@/db/message-file-items';

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  profile: Profiles | null,
  selectedWorkspace: Workspaces | null,
  messageContent: string,
) => {
  if (!chatSettings) {
    throw new Error('Chat settings not found');
  }

  if (!modelData) {
    throw new Error('Model not found');
  }

  if (!profile) {
    throw new Error('Profile not found');
  }

  if (!selectedWorkspace) {
    throw new Error('Workspace not found');
  }

  if (!messageContent) {
    throw new Error('Message content not found');
  }
};

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsGenerating: (isGenerating: boolean) => void,
  removeLastTwoChatMessages: () => void,
) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      // toast.error(
      //   "Model not found. Make sure you have it downloaded via Ollama."
      // );
    }

    const errorData = await response.json();

    // toast.error(errorData.message);

    setIsGenerating(false);
    removeLastTwoChatMessages();
  }

  return response;
};

export const processResponse = async (
  response: Response,
  lastChatMessage: ChatMessage,
  isHosted: boolean,
  controller: AbortController,
  setFirstTokenReceived: (isFirstTokenReceived: boolean) => void,
  // setChatMessages: (chatMessages: ChatMessage[]) => void,
  updateChatMessageContent: (messageId: string, contentToAdd: string) => void,
  setToolInUse: (toolInUse: string) => void,
) => {
  let fullText = '';
  let contentToAdd = '';

  if (response.body) {
    await consumeReadableStream(
      response.body,
      (chunk) => {
        setFirstTokenReceived(true);
        setToolInUse('none');

        try {
          contentToAdd = isHosted
            ? chunk
            : // Ollama's streaming endpoint returns new-line separated JSON
              // objects. A chunk may have more than one of these objects, so we
              // need to split the chunk by new-lines and handle each one
              // separately.
              chunk
                .trimEnd()
                .split('\n')
                .reduce(
                  (acc, line) => acc + JSON.parse(line).message.content,
                  '',
                );
          fullText += contentToAdd;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }

        // setChatMessages((prev) =>
        //   prev.map((chatMessage) => {
        //     if (chatMessage.message.id === lastChatMessage.message.id) {
        //       const updatedChatMessage: ChatMessage = {
        //         message: {
        //           ...chatMessage.message,
        //           content: chatMessage.message.content + contentToAdd,
        //         },
        //         fileItems: chatMessage.fileItems,
        //       };

        //       return updatedChatMessage;
        //     }

        //     return chatMessage;
        //   }),
        // );
        updateChatMessageContent(lastChatMessage.message.id, contentToAdd);
      },
      controller.signal,
    );

    return fullText;
  } else {
    throw new Error('Response body is null');
  }
};

export const getBotLastId = (chatData: Message[]) => {
  const lastBotMessage = chatData.findLast(
    (chatMessage) => chatMessage.role === 'assistant',
  );
  return lastBotMessage ? lastBotMessage.id : CHAT_BOT_DEFAULT_ID;
};

export const getUserLastId = (chatData: Message[]) => {
  const lastUserMessage = chatData.findLast(
    (chatMessage) => chatMessage.role === 'user',
  );
  return lastUserMessage ? lastUserMessage.id : CHAT_USER_DEFAULT_ID;
};

const USE_OPEN_AI_SERVER = false;
export const systemSettings = (
  chatData: Message[],
  prompt: string | undefined,
  menuNum: number,
  isLab = false,
  profile?: Profile,
) => {
  if (USE_OPEN_AI_SERVER)
    return {
      url: '/api/chat/openai',
      setting: {
        chatSettings: {
          contextLength: 4096,
          embeddingsProvider: 'openai',
          includeProfileContext: true,
          includeWorkspaceInstructions: true,
          model: 'gpt-3.5-turbo-1106',
          prompt: 'You are a friendly, helpful AI assistant.',
          temperature: 0.5,
        },
        menuNum: 4,
        messages: chatData.map(({ id, ...rest }) => rest).slice(0, -1),
        query: prompt,
      },
    };

  if (!USE_OPEN_AI_SERVER) {
    let setting = {
      menu_num: menuNum || 5,
      chat_history: chatData
        .filter(({ role }) => role !== 'system') // 'system' 역할을 제외
        .map(({ id, ...rest }) => rest) // id 제외
        .slice(0, -2),
      query: prompt,
      profile: (menuNum == 98 || menuNum == 99) && profile,
    };

    return {
      url: isLab
        ? `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/daou`
        : //`http://localhost:8000/chat/daou`
          `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/prompt`,
      setting,
    };
  }
};

export const getDefaultSystemMessage = (isLab = false) => {
  return {
    role: 'system',
    content: isLab ? SYSTEM_MESSAGE_LAB : SYSTEM_MESSAGE,
    id: uuidv4(),
  };
};

export const createTempMessages = (
  messageContent: string,
  chatMessages: ChatMessage[],
  chatSettings: ChatSettings,
  b64Images: string[],
  isRegeneration: boolean,
  setChatMessages: (chatMessages: ChatMessage[]) => void,
) => {
  let tempUserChatMessage: ChatMessage = {
    message: {
      chat_id: '',
      content: messageContent,
      created_at: '',
      id: uuidv4(),
      image_paths: b64Images,
      model: chatSettings.model,
      role: 'user',
      sequence_number: chatMessages.length,
      updated_at: '',
      user_id: '',
      assistant_id: null,
    },
    fileItems: [],
  };

  let tempAssistantChatMessage: ChatMessage = {
    message: {
      chat_id: '',
      content: '',
      created_at: '',
      id: uuidv4(),
      image_paths: [],
      model: chatSettings.model,
      role: 'assistant',
      sequence_number: chatMessages.length + 1,
      updated_at: '',
      user_id: '',
      assistant_id: null,
    },
    fileItems: [],
  };

  let newMessages = [];

  if (isRegeneration) {
    const lastMessageIndex = chatMessages.length - 1;
    chatMessages[lastMessageIndex].message.content = '';
    newMessages = [...chatMessages];
  } else {
    newMessages = [
      ...chatMessages,
      tempUserChatMessage,
      tempAssistantChatMessage,
    ];
  }

  setChatMessages(newMessages);

  return {
    tempUserChatMessage,
    tempAssistantChatMessage,
  };
};

// export const handleLocalChat = async (
//   payload: ChatPayload,
//   profile: Profiles,
//   chatSettings: ChatSettings,
//   tempAssistantMessage: ChatMessage,
//   isRegeneration: boolean,
//   newAbortController: AbortController,
//   setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
//   setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
//   setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
//   setToolInUse: React.Dispatch<React.SetStateAction<string>>,
// ) => {
//   const formattedMessages = await buildFinalMessages(payload, profile, []);

//   // Ollama API: https://github.com/jmorganca/ollama/blob/main/docs/api.md
//   const response = await fetchChatResponse(
//     process.env.NEXT_PUBLIC_OLLAMA_URL + '/api/chat',
//     {
//       model: chatSettings.model,
//       messages: formattedMessages,
//       options: {
//         temperature: payload.chatSettings.temperature,
//       },
//     },
//     false,
//     newAbortController,
//     setIsGenerating,
//     setChatMessages,
//   );

//   return await processResponse(
//     response,
//     isRegeneration
//       ? payload.chatMessages[payload.chatMessages.length - 1]
//       : tempAssistantMessage,
//     false,
//     newAbortController,
//     setFirstTokenReceived,
//     setChatMessages,
//     setToolInUse,
//   );
// };

export const handleHostedChat = async (
  payload: ChatPayload,
  profile: Profiles,
  modelData: LLM,
  tempAssistantChatMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  newMessageImages: MessageImage[],
  chatImages: MessageImage[],
  setIsGenerating: (isGenerating: boolean) => void,
  setFirstTokenReceived: (firstTokenReceived: boolean) => void,
  removeLastTwoChatMessages: () => void,
  updateChatMessageContent: (messageId: string, contentToAdd: string) => void,
  setToolInUse: (toolInUse: string) => void,
) => {
  const provider =
    modelData.provider === 'openai' && profile.use_azure_openai
      ? 'azure'
      : modelData.provider;

  let formattedMessages = [];

  if (provider === 'google') {
    formattedMessages = await buildGoogleGeminiFinalMessages(
      payload,
      profile,
      newMessageImages,
    );
  } else {
    formattedMessages = await buildFinalMessages(payload, profile, chatImages);
  }

  const apiEndpoint =
    provider === 'custom' ? '/api/chat/custom' : `/api/chat/${provider}`;

  const requestBody = {
    chatSettings: payload.chatSettings,
    messages: formattedMessages,
    customModelId: provider === 'custom' ? modelData.hostedId : '',
  };

  console.log('apiEndpoint=', apiEndpoint);
  console.log('requestBody=', requestBody);

  const response = await fetchChatResponse(
    apiEndpoint,
    requestBody,
    true,
    newAbortController,
    setIsGenerating,
    removeLastTwoChatMessages,
  );

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    true,
    newAbortController,
    setFirstTokenReceived,
    updateChatMessageContent,
    setToolInUse,
  );
};

export const handleCreateMessages = async (
  chatMessages: ChatMessage[],
  currentChat: Chats,
  profile: Profiles,
  modelData: LLM,
  messageContent: string,
  generatedText: string,
  newMessageImages: MessageImage[],
  isRegeneration: boolean,
  retrievedFileItems: FileItems[],
  setChatMessages: (chatMessages: ChatMessage[]) => void,
  //setChatFileItems: (fileItems: FileItems[]) => void,
  //setChatImages: (chatImages: MessageImage[]) => void,
  selectedAssistant: Assistants | null,
) => {
  const finalUserMessage: Messages = {
    chat_id: currentChat.id,
    assistant_id: null,
    user_id: profile.user_id,
    content: messageContent,
    model: modelData.modelId,
    role: 'user',
    sequence_number: chatMessages.length,
    image_paths: [],
    created_at: '', // 디비용 날짜
    id: uuidv4(), // 디비용 id
    updated_at: null, // 디비용 날짜
  };

  const finalAssistantMessage: Messages = {
    chat_id: currentChat.id,
    assistant_id: selectedAssistant?.id || null,
    user_id: profile.user_id,
    content: generatedText,
    model: modelData.modelId,
    role: 'assistant',
    sequence_number: chatMessages.length + 1,
    image_paths: [],
    created_at: '', // 디비용 날짜
    id: uuidv4(), // 디비용 id
    updated_at: null, // 디비용 날짜
  };

  let finalChatMessages: ChatMessage[] = [];

  // if (isRegeneration) {
  //   const lastStartingMessage = chatMessages[chatMessages.length - 1].message;

  //   const updatedMessage = await updateMessage(lastStartingMessage.id, {
  //     ...lastStartingMessage,
  //     content: generatedText,
  //   });

  //   chatMessages[chatMessages.length - 1].message = updatedMessage;

  //   finalChatMessages = [...chatMessages];

  //   setChatMessages(finalChatMessages);
  // } else {
  // const createdMessages = await createMessages([
  //   finalUserMessage,
  //   finalAssistantMessage,
  // ]);

  const createdMessages = [finalUserMessage, finalAssistantMessage];

  // Upload each image (stored in newMessageImages) for the user message to message_images bucket
  // const uploadPromises = newMessageImages
  //   .filter((obj) => obj.file !== null)
  //   .map((obj) => {
  //     let filePath = `${profile.user_id}/${currentChat.id}/${
  //       createdMessages[0].id
  //     }/${uuidv4()}`;

  //     return uploadMessageImage(filePath, obj.file as File).catch((error) => {
  //       console.error(`Failed to upload image at ${filePath}:`, error);
  //       return null;
  //     });
  //   });

  // const paths = (await Promise.all(uploadPromises)).filter(Boolean) as string[];

  // setChatImages((prevImages) => [
  //   ...prevImages,
  //   ...newMessageImages.map((obj, index) => ({
  //     ...obj,
  //     messageId: createdMessages[0].id,
  //     path: paths[index],
  //   })),
  // ]);

  // const updatedMessage = await updateMessage(createdMessages[0].id, {
  //   ...createdMessages[0],
  //   image_paths: paths,
  // });

  // const createdMessageFileItems = await createMessageFileItems(
  //   retrievedFileItems.map((fileItem) => {
  //     return {
  //       user_id: profile.user_id,
  //       message_id: createdMessages[1].id,
  //       file_item_id: fileItem.id,
  //     };
  //   }),
  // );

  finalChatMessages = [
    ...chatMessages,
    {
      message: createdMessages[0],
      fileItems: [],
    },
    {
      message: createdMessages[1],
      fileItems: retrievedFileItems.map((fileItem) => fileItem.id),
    },
  ];

  // setChatFileItems((prevFileItems) => {
  //   const newFileItems = retrievedFileItems.filter(
  //     (fileItem) =>
  //       !prevFileItems.some((prevItem) => prevItem.id === fileItem.id),
  //   );

  //   return [...prevFileItems, ...newFileItems];
  // });

  setChatMessages(finalChatMessages);
  //}
};

export const handleCreateChat = async (
  chatSettings: ChatSettings,
  profile: Profiles,
  selectedWorkspace: Workspaces,
  messageContent: string,
  selectedAssistant: Assistants,
  //newMessageFiles: ChatFile[],
  setSelectedChat: (selectedChat: Chats) => void,
  chats: Chats[],
  setChats: (chats: Chats[]) => void,
  //setChatFiles: React.Dispatch<React.SetStateAction<ChatFile[]>>,
) => {
  // const createdChat = await createChat({
  //   user_id: profile.user_id,
  //   workspace_id: selectedWorkspace.id,
  //   assistant_id: selectedAssistant?.id || null,
  //   context_length: chatSettings.contextLength,
  //   include_profile_context: chatSettings.includeProfileContext,
  //   include_workspace_instructions: chatSettings.includeWorkspaceInstructions,
  //   model: chatSettings.model,
  //   name: messageContent.substring(0, 100),
  //   prompt: chatSettings.prompt,
  //   temperature: chatSettings.temperature,
  //   embeddings_provider: chatSettings.embeddingsProvider,
  // });
  const createdChat = {
    user_id: profile.user_id,
    workspace_id: selectedWorkspace.id,
    assistant_id: selectedAssistant?.id || null,
    context_length: chatSettings.contextLength,
    include_profile_context: chatSettings.includeProfileContext,
    include_workspace_instructions: chatSettings.includeWorkspaceInstructions,
    model: chatSettings.model,
    name: messageContent.substring(0, 100),
    prompt: chatSettings.prompt,
    temperature: chatSettings.temperature,
    embeddings_provider: chatSettings.embeddingsProvider,
    created_at: '', //db
    folder_id: '', //db
    id: uuidv4(), //db
    sharing: '', //db
    updated_at: '', //db
  };

  setSelectedChat(createdChat);
  setChats([createdChat, ...chats]);

  // await createChatFiles(
  //   newMessageFiles.map((file) => ({
  //     user_id: profile.user_id,
  //     chat_id: createdChat.id,
  //     file_id: file.id,
  //   })),
  // );
  // setChatFiles((prev) => [...prev, ...newMessageFiles]);
  return createdChat;
};

// export const fetchChatResponse = async (
//   url: string,
//   body: object,
//   isHosted: boolean,
//   controller: AbortController,
//   setIsGenerating: (isGenerating: boolean) => void,
//   header?: object
//   // setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
// ) => {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...header,
//     },
//     body: JSON.stringify(body),
//     signal: controller.signal,
//   });

//   console.log("response", response);
//   if (!response.ok) {
//     console.log("response not ok");
//     const errorData = await response.json(); // 오류 메시지를 포함하고 있는 경우
//     if (response.status === 404 && !isHosted) {
//       console.log("404");
//       return {
//         error: true,
//         message:
//           errorData.message ||
//           `Error ${response.status}: ${response.statusText}`,
//       };
//     }

//     return {
//       error: true,
//       message:
//         errorData.message || `Error ${response.status}: ${response.statusText}`,
//     };
//   }

//   return response;
// };

// export const processResponse = async (
//   response: Response | null,
//   isHosted: boolean,
//   controller: AbortController,
//   //setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
//   setChatDataUpdateWithMessageId: (
//     lastChatMessageId: string | undefined,
//     text: string
//   ) => void,
//   lastChatMessageId: string | undefined,
//   isError = false,
//   errorMessage = ""
//   //setToolInUse: React.Dispatch<React.SetStateAction<'none' | 'retrieval'>>,
// ) => {
//   let fullText = "";
//   let contentToAdd = "";
//   if (isError && errorMessage !== "") {
//     setChatDataUpdateWithMessageId(lastChatMessageId, errorMessage);
//     return errorMessage;
//   }
//   if (response?.body) {
//     await consumeReadableStream(
//       response.body,
//       (chunk) => {
//         // setFirstTokenReceived(true);
//         // setToolInUse('none');
//         try {
//           contentToAdd = isHosted ? chunk : JSON.parse(chunk).message.content;
//           fullText += contentToAdd;
//         } catch (error) {
//           console.error("Error parsing JSON:", error);
//         }
//         setChatDataUpdateWithMessageId(lastChatMessageId, contentToAdd);
//       },
//       controller.signal
//     );
//     return fullText;
//   } else {
//     throw new Error("Response body is null");
//   }
// };
