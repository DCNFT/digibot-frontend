import { Messages } from '@/types';

export interface ChatMessage {
  message: Messages;
  fileItems: string[];
  id?: string;
}
