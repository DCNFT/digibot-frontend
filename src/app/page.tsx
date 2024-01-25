'use client';
import AppBar from '@/components/Appbar';
import Chat from '@/views/chat';

export default function HomePage() {
  return (
    <div className="flex h-full w-full">
      <div className="bg-muted/50 flex grow flex-col">
        <Chat />
      </div>
    </div>
  );
}
