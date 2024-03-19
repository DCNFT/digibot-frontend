import { Message } from "postcss";

export interface ChatMessage {
  message: Message;
  fileItems: string[];
}
