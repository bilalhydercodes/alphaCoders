import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Life RPG with Lumi · Chronicles of Mastery',
  description:
    'Transform everyday productivity, habits, and chores into an engaging RPG progression adventure with your supportive companion Lumi.',
  keywords: [
    'Life RPG',
    'Habit Tracker',
    'Gamified Productivity',
    'Lumi',
    'Task Manager',
    'RPG Progression',
  ],
  authors: [{ name: 'Life RPG Adventurers Guild' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-copy antialiased selection:bg-primary/20 selection:text-copy">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
