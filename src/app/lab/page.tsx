'use client';

import Lab from '@/views/lab';
export default function LabPage() {
  return (
    <div className="flex h-full w-full">
      <div className="bg-muted/50 flex grow flex-col">
        <Lab />
      </div>
    </div>
  );
}
