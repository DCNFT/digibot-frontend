'use client';

import { ReactNode } from 'react';

interface LabLayoutProps {
  children: ReactNode;
}

export default function LabLayout({ children }: LabLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen  md:px-8 lg:px-12 xl:px-16 mx-auto">
      {children}
    </main>
  );
}
