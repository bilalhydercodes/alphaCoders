'use client';

import React from 'react';
import { LumiProvider } from '@/components/lumi';
import { LandingPage } from '@/components/landing/LandingPage';

export default function LandingPageRoute() {
  return (
    <LumiProvider>
      <LandingPage />
    </LumiProvider>
  );
}
