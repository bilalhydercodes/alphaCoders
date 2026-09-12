'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?view=dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-xs font-black text-copy tracking-wide">Loading Guild Dashboard...</span>
      </div>
    </div>
  );
}
