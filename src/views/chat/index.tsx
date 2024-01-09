/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState, FormEvent, useRef, useEffect } from "react";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}
const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  async function callNyanchat() {
    try {
      setIsRunning(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/v1/nyan/nyanchat",
        {
          params: {
            prompt: prompt,
          },
        }
      );
      setIsRunning(false);
      setChatData((currentData) => [
        ...currentData,
        { sender: "bot", content: response?.data?.response },
      ]);
    } catch (error) {
      // Handle errors here. If using AxiosError, you can extract more detailed info
      console.error("Error calling nyanchat:", error);
      setIsRunning(false);
      throw error;
    }
  }

  const handleInput = (e: any) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setChatData((currentData) => [
      ...currentData,
      { sender: "user", content: prompt },
    ]);
    setPrompt(""); // Clear the input after sending
    await callNyanchat();
  };

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]); // Scroll to bottom every time chatData changes

  return (
    <div className="flex flex-col h-screen">
      {chatData?.length === 0 && (
        <div className="flex justify-center">
          <div className="flex flex-col text-center absolute top-[40%] justify-center items-center gap-2">
            <p className="text-2xl">Digi Nyan</p>
            <img
              src="/images/nyan.png"
              alt="Bot"
              className="w-24 h-24 rounded-full"
            />
            <p className="">채팅을 시작해보세요!</p>
          </div>
        </div>
      )}

      <div
        className="overflow-auto p-4 border rounded-md flex-grow "
        style={{ marginBottom: "4rem" }}
      >
        {chatData.map((message, chatIndex) => (
          <div
            key={`chat-${chatIndex}`}
            className={`flex items-end gap-2 my-2 ${
              message.sender === "user" ? "justify-end" : ""
            }`}
          >
            {message.sender === "bot" && (
              <img
                src="/images/nyan.png"
                alt="Bot"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="message max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg ">
              {message.content.split("\n").map((line, lineIndex) => {
                return (
                  <p key={`chat-${chatIndex}-line-${lineIndex}`}>{line}</p>
                );
              })}
            </div>
            {message.sender === "user" && (
              <img
                src="/images/wk.jpg"
                alt="User"
                className="w-12 h-12 rounded-full"
              />
            )}
          </div>
        ))}
        <>
          {isRunning && (
            <div className="flex items-end gap-2 my-2">
              {
                <img
                  src="/images/nyan.png"
                  alt="Bot"
                  className="w-12 h-12 rounded-full"
                />
              }
              <div className="message max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl border p-4 rounded-lg">
                <div className="loader"></div>
              </div>
            </div>
          )}
        </>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t fixed bottom-0 left-0 right-0 bg-white "
        style={{ height: "4rem" }}
      >
        <div className="flex gap-2 items-center">
          <Input
            value={prompt}
            onChange={handleInput}
            placeholder="Type your message here"
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isRunning}
            className={`flex-shrink-0 ${
              isRunning ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-md transition duration-300`}
          >
            {isRunning && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Chat;
