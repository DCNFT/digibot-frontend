/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { useState, FormEvent, useRef, useEffect } from 'react';

import ChatInput from './components/ChatInput';
import ChatBody from './components/ChatBody';

export type Message = {
  id?: string;
  sender: 'user' | 'bot';
  content: string;
};
const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [chatData, setChatData] = useState<Message[]>([]);

  async function callNyanChat() {
    try {
      setIsRunning(true);
      const response = await axios.get('http://127.0.0.1:5001/api/', {
        params: {
          prompt: prompt,
        },
      });
      setIsRunning(false);
      setChatData((currentData) => [
        ...currentData,
        { sender: 'bot', content: response?.data?.response },
      ]);
    } catch (error) {
      // Handle errors here. If using AxiosError, you can extract more detailed info
      console.error('Error calling nyanchat:', error);
      setIsRunning(false);
      throw error;
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setChatData((currentData) => [
      ...currentData,
      { sender: 'user', content: prompt },
    ]);
    await callNyanChat();
    setPrompt(''); // Clear the input after sending
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatBody chatData={chatData} isRunning={isRunning} />
      <ChatInput
        prompt={prompt}
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        isRunning={isRunning}
      />
    </div>
  );
};
export default Chat;
