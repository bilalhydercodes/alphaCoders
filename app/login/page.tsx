'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LumiProvider } from '@/components/lumi';
import { AuthScreen } from '@/components/AuthScreen';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('liferpg_active_view', 'dashboard');
      window.location.href = '/?view=dashboard';
    } else {
      router.push('/?view=dashboard');
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <LumiProvider>
      <AuthScreen
        initialMode="login"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </LumiProvider>
  );
}
