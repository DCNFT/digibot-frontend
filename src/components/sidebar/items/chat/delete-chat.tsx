// import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useChatHandler } from '@/hooks/useChatHandler';
import useHotkey from '@/hooks/useHotkey';
import useChatStore from '@/store/useChatStoreMig';
import { Chats } from '@/types';
import { IconTrash } from '@tabler/icons-react';
import { FC, useContext, useRef, useState } from 'react';

interface DeleteChatProps {
  chat: Chats;
}

export const DeleteChat: FC<DeleteChatProps> = ({ chat }) => {
  useHotkey('Backspace', () => setShowChatDialog(true));

  const setChats = useChatStore((state) => state.setChats);
  const { handleNewChat } = useChatHandler();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [showChatDialog, setShowChatDialog] = useState(false);

  const handleDeleteChat = async () => {
    // await deleteChat(chat.id);
    // setChats((prevState) => prevState.filter((c) => c.id !== chat.id));
    // setShowChatDialog(false);
    // handleNewChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      buttonRef.current?.click();
    }
  };

  return (
    <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
      <DialogTrigger asChild>
        <IconTrash className="hover:opacity-50" size={18} />
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Delete {chat.name}</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this chat?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
            Cancel
          </Button>

          <Button
            ref={buttonRef}
            variant="destructive"
            onClick={handleDeleteChat}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
