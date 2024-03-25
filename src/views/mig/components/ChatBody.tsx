import { useEffect, useRef, useState } from 'react';
import useChatStore from '@/store/useChatStoreMig';
import ChatMessage from '@/views/mig/components/chatMessage/ChatMessage';
import { ChatSettings } from '@/components/chat/chatSettings';
import { v4 as uuidv4 } from 'uuid';
import { ChatData, ChatMessage as TChatMessage } from '@/types';
import { Input } from 'postcss';
import { Button } from '@/components/ui/button';

type RenderChatMessagesProps = {
  chatMessages: TChatMessage[];
};
const RenderChatMessages = ({ chatMessages }: RenderChatMessagesProps) => {
  return (
    <div className="h-[400px] w-full overflow-auto">
      {chatMessages.map((chatMessage, index) => {
        return (
          <ChatMessage
            key={`${chatMessage.message.sequence_number}-${chatMessage.message.role}-${index}`}
            message={chatMessage.message} // 여기서 message prop 타입에 맞게 전달합니다.
            isLast={index === chatMessages.length - 1}
          />
        );
      })}
    </div>
  );
};

type UserQuestionsProps = {
  chatMessagesList: ChatData[];
};

const UserQuestions = ({ chatMessagesList }: UserQuestionsProps) => {
  const userQuestionList = chatMessagesList.flatMap((chatData) =>
    chatData.chatMessages
      .filter((chatMessage) => chatMessage.message.role === 'user')
      .map((chatMessage) => chatMessage.message),
  );

  const scrollToItem = (id: string) => {
    const item = document.getElementById(id);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col">
      {userQuestionList.map((question) => {
        return (
          <div
            key={question?.id}
            onClick={() => scrollToItem(question?.user_input_sequence_id ?? '')}
          >
            {question?.content}
          </div>
        );
      })}
    </div>
  );
};

type ChatBodyProps = {
  data?: ChatData;
};

const ChatBody = ({ data }: ChatBodyProps) => {
  const chatMessagesList = useChatStore((state) => state.chatMessagesList);
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex">
      <UserQuestions chatMessagesList={chatMessagesList} />
      <div className="grid overflow-hidden grow auto-rows-fr grid-cols-2 gap-3 mb-3">
        {chatMessagesList.map((chatData) => {
          return (
            <div className="flex flex-col rounded-xl w-full" key={chatData.id}>
              <p>{chatData?.chatSettings?.model}</p>
              <RenderChatMessages chatMessages={chatData.chatMessages} />
            </div>
          );
        })}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;

{
  /* <>
        {chatMessagesList.map((chatData) => {
          return chatData.chatMessages.map((chatMessage, index) => {
            if (chatMessage.message.role === 'user') {
              return (
                <ChatMessage
                  key={`${chatMessage.message.sequence_number}-user`}
                  message={chatMessage.message} // Fix: Update the type of the message prop
                  isLast={index === chatData.chatMessages.length - 1}
                />
              );
            }
            if (chatMessage.message.role === 'assistant') {
              return (
                <ChatMessage
                  key={`${chatMessage.message.sequence_number}-assistant-${index}`}
                  message={chatMessage.message} // Fix: Update the type of the message prop
                  isLast={index === chatData.chatMessages.length - 1}
                />
              );
            }
          });
        })}
      </> */
}
