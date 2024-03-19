import {
  Assistants,
  ChatMessage,
  ChatPayload,
  ChatSettings,
  LLM,
  Message,
  MessageImage,
  Profiles,
} from "@/types";
import { consumeReadableStream } from "./consumeStream";
import {
  CHAT_BOT_DEFAULT_ID,
  CHAT_USER_DEFAULT_ID,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_LAB,
} from "@/constants/default";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "@/types/daouOffice";
import {
  buildFinalMessages,
  buildGoogleGeminiFinalMessages,
} from "./build-prompt";

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
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
    setChatMessages((prevMessages) => prevMessages.slice(0, -2));
  }

  return response;
};

export const processResponse = async (
  response: Response,
  lastChatMessage: ChatMessage,
  isHosted: boolean,
  controller: AbortController,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  let fullText = "";
  let contentToAdd = "";

  if (response.body) {
    await consumeReadableStream(
      response.body,
      (chunk) => {
        setFirstTokenReceived(true);
        setToolInUse("none");

        try {
          contentToAdd = isHosted
            ? chunk
            : // Ollama's streaming endpoint returns new-line separated JSON
              // objects. A chunk may have more than one of these objects, so we
              // need to split the chunk by new-lines and handle each one
              // separately.
              chunk
                .trimEnd()
                .split("\n")
                .reduce(
                  (acc, line) => acc + JSON.parse(line).message.content,
                  ""
                );
          fullText += contentToAdd;
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }

        setChatMessages((prev) =>
          prev.map((chatMessage) => {
            if (chatMessage.message.id === lastChatMessage.message.id) {
              const updatedChatMessage: ChatMessage = {
                message: {
                  ...chatMessage.message,
                  content: chatMessage.message.content + contentToAdd,
                },
                fileItems: chatMessage.fileItems,
              };

              return updatedChatMessage;
            }

            return chatMessage;
          })
        );
      },
      controller.signal
    );

    return fullText;
  } else {
    throw new Error("Response body is null");
  }
};

export const getBotLastId = (chatData: Message[]) => {
  const lastBotMessage = chatData.findLast(
    (chatMessage) => chatMessage.role === "assistant"
  );
  return lastBotMessage ? lastBotMessage.id : CHAT_BOT_DEFAULT_ID;
};

export const getUserLastId = (chatData: Message[]) => {
  const lastUserMessage = chatData.findLast(
    (chatMessage) => chatMessage.role === "user"
  );
  return lastUserMessage ? lastUserMessage.id : CHAT_USER_DEFAULT_ID;
};

const USE_OPEN_AI_SERVER = false;
export const systemSettings = (
  chatData: Message[],
  prompt: string | undefined,
  menuNum: number,
  isLab = false,
  profile?: Profile
) => {
  if (USE_OPEN_AI_SERVER)
    return {
      url: "/api/chat/openai",
      setting: {
        chatSettings: {
          contextLength: 4096,
          embeddingsProvider: "openai",
          includeProfileContext: true,
          includeWorkspaceInstructions: true,
          model: "gpt-3.5-turbo-1106",
          prompt: "You are a friendly, helpful AI assistant.",
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
        .filter(({ role }) => role !== "system") // 'system' 역할을 제외
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
    role: "system",
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
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  selectedAssistant: Assistants | null
) => {
  let tempUserChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      assistant_id: null,
      content: messageContent,
      created_at: "",
      id: uuidv4(),
      image_paths: b64Images,
      model: chatSettings.model,
      role: "user",
      sequence_number: chatMessages.length,
      updated_at: "",
      user_id: "",
      type: "",
    },
    fileItems: [],
  };

  let tempAssistantChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      assistant_id: selectedAssistant?.id || null,
      content: "",
      created_at: "",
      id: uuidv4(),
      image_paths: [],
      model: chatSettings.model,
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      updated_at: "",
      user_id: "",
      type: "",
    },
    fileItems: [],
  };

  let newMessages = [];

  if (isRegeneration) {
    const lastMessageIndex = chatMessages.length - 1;
    chatMessages[lastMessageIndex].message.content = "";
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

export const handleLocalChat = async (
  payload: ChatPayload,
  profile: Profiles,
  chatSettings: ChatSettings,
  tempAssistantMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  const formattedMessages = await buildFinalMessages(payload, profile, []);

  // Ollama API: https://github.com/jmorganca/ollama/blob/main/docs/api.md
  const response = await fetchChatResponse(
    process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/chat",
    {
      model: chatSettings.model,
      messages: formattedMessages,
      options: {
        temperature: payload.chatSettings.temperature,
      },
    },
    false,
    newAbortController,
    setIsGenerating,
    setChatMessages
  );

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantMessage,
    false,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages,
    setToolInUse
  );
};

export const handleHostedChat = async (
  payload: ChatPayload,
  profile: Profiles,
  modelData: LLM,
  tempAssistantChatMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  newMessageImages: MessageImage[],
  chatImages: MessageImage[],
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  const provider =
    modelData.provider === "openai" && profile.use_azure_openai
      ? "azure"
      : modelData.provider;

  let formattedMessages = [];

  if (provider === "google") {
    formattedMessages = await buildGoogleGeminiFinalMessages(
      payload,
      profile,
      newMessageImages
    );
  } else {
    formattedMessages = await buildFinalMessages(payload, profile, chatImages);
  }

  const apiEndpoint =
    provider === "custom" ? "/api/chat/custom" : `/api/chat/${provider}`;

  const requestBody = {
    chatSettings: payload.chatSettings,
    messages: formattedMessages,
    customModelId: provider === "custom" ? modelData.hostedId : "",
  };

  const response = await fetchChatResponse(
    apiEndpoint,
    requestBody,
    true,
    newAbortController,
    setIsGenerating,
    setChatMessages
  );

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    true,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages,
    setToolInUse
  );
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
