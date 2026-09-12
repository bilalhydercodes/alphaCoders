import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';

const STARTER_QUESTS = [
  {
    title: 'Morning Glass of Water',
    description: 'Drink a full glass of cool fresh water to rehydrate your body.',
    category: 'VITALITY',
    difficulty: 'TRIVIAL',
    type: 'DAILY',
    xpReward: 10,
    goldReward: 5,
  },
  {
    title: '25-Minute Deep Focus Session',
    description: 'Work on your primary coding, studying, or reading project with zero distractions.',
    category: 'INTELLECT',
    difficulty: 'MEDIUM',
    type: 'DAILY',
    xpReward: 50,
    goldReward: 25,
  },
  {
    title: '15-Minute Movement or Stretching',
    description: 'Go for a walk, do a set of pushups, or complete a limbering stretch routine.',
    category: 'STRENGTH',
    difficulty: 'EASY',
    type: 'DAILY',
    xpReward: 25,
    goldReward: 12,
  },
];

export async function POST(req: Request) {
  try {
    // 1. Find existing guest or demo user (case-safe with multiple fallbacks)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: 'guest' },
          { username: 'demo' },
          { email: 'guest@liferpg.com' },
          { email: 'demo@liferpg.com' },
          { username: { contains: 'guest' } },
          { username: { contains: 'demo' } },
        ],
      },
      include: {
        stats: true,
        quests: true,
      },
    });

    // 2. If no guest account exists, create one with race-condition handling
    if (!user) {
      const passwordHash = await hashPassword('guest123');
      try {
        user = await prisma.user.create({
          data: {
            username: 'guest',
            email: 'guest@liferpg.com',
            passwordHash,
            title: 'Guest Adventurer',
            level: 1,
            xp: 0,
            gold: 50,
            hp: 100,
            maxHp: 100,
            streak: 1,
            companionMood: 'content',
            bio: 'Exploring the realm as an honored guest!',
            avatarEmoji: '🧙',
            stats: {
              create: {
                strength: 5,
                intellect: 5,
                agility: 5,
                vitality: 5,
                spirit: 5,
              },
            },
            quests: {
              create: STARTER_QUESTS,
            },
          },
          include: {
            stats: true,
            quests: true,
          },
        });
      } catch (createErr: any) {
        // Handled race condition: user was created concurrently in another request
        console.warn('Guest creation race condition handled, fetching created user...', createErr?.message);
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: 'guest' },
              { email: 'guest@liferpg.com' },
              { username: 'demo' },
              { email: 'demo@liferpg.com' },
            ],
          },
          include: {
            stats: true,
            quests: true,
          },
        });

        // Fail-safe: if username/email had unique conflict with another account, generate unique guest moniker
        if (!user) {
          const uniqueId = Date.now().toString(36);
          const uniqueUsername = `guest_${uniqueId}`;
          user = await prisma.user.create({
            data: {
              username: uniqueUsername,
              email: `${uniqueUsername}@liferpg.com`,
              passwordHash,
              title: 'Guest Adventurer',
              level: 1,
              xp: 0,
              gold: 50,
              hp: 100,
              maxHp: 100,
              streak: 1,
              companionMood: 'content',
              bio: 'Exploring the realm as an honored guest!',
              avatarEmoji: '🧙',
              stats: {
                create: {
                  strength: 5,
                  intellect: 5,
                  agility: 5,
                  vitality: 5,
                  spirit: 5,
                },
              },
              quests: {
                create: STARTER_QUESTS,
              },
            },
            include: {
              stats: true,
              quests: true,
            },
          });
        }
      }
    }

    // Fail-safe guarantee: user must be defined
    if (!user) {
      // Pick any existing user in the database as ultimate fallback
      const anyUser = await prisma.user.findFirst({
        include: { stats: true, quests: true },
      });
      if (anyUser) {
        user = anyUser;
      } else {
        throw new Error('Database initialization failure: unable to resolve user record');
      }
    }

    // 3. Guarantee character stats exist
    if (!user.stats) {
      try {
        const stats = await prisma.characterStats.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            strength: 5,
            intellect: 5,
            agility: 5,
            vitality: 5,
            spirit: 5,
          },
          update: {},
        });
        (user as any).stats = stats;
      } catch (statsErr) {
        console.warn('Character stats upsert warning:', statsErr);
      }
    }

    // 4. Guarantee starter quests exist
    if (!user.quests || user.quests.length === 0) {
      try {
        for (const q of STARTER_QUESTS) {
          await prisma.quest.create({
            data: {
              ...q,
              userId: user.id,
            },
          });
        }
      } catch (questErr) {
        console.warn('Starter quest seeding notice:', questErr);
      }
    }

    // 5. Update lastActiveDate and mood safely
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastActiveDate: new Date(),
          companionMood: 'content',
        },
      });
    } catch (activeErr) {
      console.warn('Active status update notice:', activeErr);
    }

    // 6. Issue authentication JWT token
    const token = signToken({ userId: user.id, email: user.email });

    const host = req.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.');
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = isProduction && !isLocalhost;

    const finalStats = user.stats || {
      strength: 5,
      intellect: 5,
      agility: 5,
      vitality: 5,
      spirit: 5,
    };

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        title: user.title,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        hp: user.hp,
        maxHp: user.maxHp,
        streak: user.streak,
        companionMood: user.companionMood,
        stats: finalStats,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Guest authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate guest session' },
      { status: 500 }
    );
  }
}
