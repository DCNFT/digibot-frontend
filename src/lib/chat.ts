import { Message } from '@/views/chat';
import { consumeReadableStream } from './consumeStream';
import { CHAT_BOT_DEFAULT_ID, CHAT_USER_DEFAULT_ID } from '@/constants/default';

export const processResponse = async (
  response: Response,
  lastChatMessage: Message,
  isHosted: boolean,
  controller: AbortController,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<'none' | 'retrieval'>>,
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
          contentToAdd = isHosted ? chunk : JSON.parse(chunk).message.content;
          fullText += contentToAdd;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }

        // setChatMessages((prev) =>
        //   prev.map((chatMessage) => {
        //     if (chatMessage.message.id === lastChatMessage.message.id) {
        //       const updatedChatMessage: Message = {
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
    (chatMessage) => chatMessage.sender === 'bot',
  );
  return lastBotMessage ? lastBotMessage.id : CHAT_BOT_DEFAULT_ID;
};

export const getUserLastId = (chatData: Message[]) => {
  const lastUserMessage = chatData.findLast(
    (chatMessage) => chatMessage.sender === 'user',
  );
  return lastUserMessage ? lastUserMessage.id : CHAT_USER_DEFAULT_ID;
};
