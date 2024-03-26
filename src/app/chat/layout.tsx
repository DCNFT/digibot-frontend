'use client';

import { Dashboard } from '@/components/ui/dashboard';
// import { useRouter } from 'next/router';
// import { supabase } from '@/lib/supabase/browser-client';
// import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (async () => {
    //   const session = (await supabase.auth.getSession()).data.session;
    //   if (!session) {
    //     router.push('/login');
    //   } else {
    //     setLoading(false);
    //   }
    // })();
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Dashboard>
      <div className="flex h-full w-full"> {children}</div>
    </Dashboard>
  );
}
