'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LumiProvider } from '@/components/lumi';
import { LandingPage } from '@/components/landing/LandingPage';

interface HomeLandingWrapperProps {
  onEnterDashboard?: () => void;
}

export function HomeLandingWrapper({ onEnterDashboard }: HomeLandingWrapperProps) {
  const router = useRouter();

  const handleEnterDashboard = () => {
    if (onEnterDashboard) {
      onEnterDashboard();
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('liferpg_active_view', 'dashboard');
      window.location.href = '/dashboard';
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <LumiProvider>
      <LandingPage onEnterDashboard={handleEnterDashboard} />
    </LumiProvider>
  );
}
