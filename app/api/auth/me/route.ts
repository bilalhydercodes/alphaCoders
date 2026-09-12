import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getXpForNextLevel } from '@/lib/progression';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const xpNeeded = getXpForNextLevel(user.level);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        title: user.title,
        level: user.level,
        xp: user.xp,
        xpNeeded,
        gold: user.gold,
        hp: user.hp,
        maxHp: user.maxHp,
        streak: user.streak,
        companionMood: user.companionMood,
        bio: (user as any).bio ?? null,
        avatarEmoji: (user as any).avatarEmoji ?? '🧙',
        bestStreak: (user as any).bestStreak ?? 0,
        createdAt: user.createdAt,
        notificationsEnabled: (user as any).notificationsEnabled ?? true,
        dailyReminders: (user as any).dailyReminders ?? true,
        focusModeAuto: (user as any).focusModeAuto ?? false,
        privacyMode: (user as any).privacyMode ?? false,
        stats: user.stats,
        inventory: user.inventory,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Session check failed' }, { status: 500 });
  }
}
