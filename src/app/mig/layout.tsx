'use client';

import { ReactNode } from 'react';

interface LabLayoutProps {
  children: ReactNode;
}

export default function LabLayout({ children }: LabLayoutProps) {
  return <div className="flex h-full w-full">{children}</div>;
}
