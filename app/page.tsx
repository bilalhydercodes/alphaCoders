import React from 'react';
import { HomeLandingWrapper } from '@/components/landing/HomeLandingWrapper';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

interface PageProps {
  searchParams?: Promise<{
    view?: string;
    tab?: string;
    auth?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const isDashboardView = params?.view === 'dashboard';

  if (isDashboardView) {
    return <DashboardClient initialTab={params?.tab || 'map'} />;
  }

  return <HomeLandingWrapper />;
}
