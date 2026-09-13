import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://alpha-coders-xi.vercel.app'),
  title: 'Life RPG with Lumi · Level Up Your Real Life',
  description:
    'Bridge the delayed gratification gap. Turn real-world habits, study sprints, and fitness into an engaging RPG progression with your autonomous 3D companion Lumi.',
  keywords: [
    'Life RPG',
    'Gamified Productivity',
    'Habit Tracker RPG',
    '3D Lumi Companion',
    'Task Manager Game',
    'ADHD Productivity Tool',
    'Pomodoro Focus Sanctuary',
    'Self Improvement RPG',
    'gamified to-do list app',
    'RPG habit tracker free',
    'productivity app with XP and leveling',
    'Duolingo for habits',
    'best habit app for students',
    'gamification productivity ADHD',
    'task manager with rewards',
    'habit tracker with streaks',
  ],
  authors: [{ name: 'Life RPG Adventurers Guild' }],
  openGraph: {
    title: 'Life RPG with Lumi · Turn Daily Habits into an Epic Quest',
    description:
      'Ditch the chore trap. Earn XP, train 5 real-world attributes, and celebrate every milestone with your living 3D companion Lumi.',
    url: 'https://alpha-coders-xi.vercel.app',
    siteName: 'Life RPG',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Life RPG with Lumi — Turn Habits into an RPG',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life RPG with Lumi · Level Up Your Real Life',
    description:
      'Transform mundane to-do lists into rewarding RPG progression with instant feedback loops and a living 3D companion.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#9966CC',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://alpha-coders-xi.vercel.app/#software',
      name: 'Life RPG with Lumi',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web, iOS, Android, macOS, Windows',
      datePublished: '2025-02-15',
      dateModified: '2026-09-13',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '127',
      },
      screenshot: 'https://alpha-coders-xi.vercel.app/opengraph-image',
      description:
        'Transform real-world daily tasks, habits, and self-improvement into an immersive RPG adventure with immediate dopamine loops and a 3D living mascot.',
      featureList: [
        'Non-linear RPG leveling progression engine',
        '5 Real-life character attributes: Intellect, Strength, Agility, Vitality, Spirit',
        'Autonomous 3D companion mascot (Lumi) with real-time reactive behaviors',
        'Tactile bounty logging with instant XP arcs and sound feedback',
        'Guild Boss raids and Emporium gold economy',
        'Deep Focus Sanctuary Pomodoro timer',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://alpha-coders-xi.vercel.app/#organization',
      name: 'Life RPG Guild',
      url: 'https://alpha-coders-xi.vercel.app',
      creator: {
        '@type': 'Organization',
        name: 'Life RPG Guild',
        url: 'https://github.com/bilalhydercodes/alphaCoders',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://alpha-coders-xi.vercel.app/#website',
      url: 'https://alpha-coders-xi.vercel.app',
      name: 'Life RPG',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://alpha-coders-xi.vercel.app/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${plusJakartaSans.className} min-h-screen bg-background text-copy antialiased selection:bg-primary/20 selection:text-copy`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
