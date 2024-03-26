'use client';

import { Dashboard } from '@/components/ui/dashboard';
import { ReactNode } from 'react';

interface LabLayoutProps {
  children: ReactNode;
}

export default function LabLayout({ children }: LabLayoutProps) {
  return (
    <Dashboard>
      <div className="flex h-full w-full"> {children}</div>
    </Dashboard>
  );
}
