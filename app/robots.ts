import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://life-rpg-lumi.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'Anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/dashboard'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
