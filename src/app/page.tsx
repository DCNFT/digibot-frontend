'use client';
import AppBar from '@/components/Appbar';
import Chat from '@/views/chat';

export default function HomePage() {
  return (
    <>
      <main className="flex flex-col h-full w-full">
        <AppBar />
        <Chat />
      </main>
    </>
  );
}
