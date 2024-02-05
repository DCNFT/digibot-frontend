'use client';

import { ReactNode } from 'react';

interface LabLayoutProps {
  children: ReactNode;
}

export default function LabLayout({ children }: LabLayoutProps) {
  return <>{children}</>;
}
