import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    // 1. Find existing guest or demo user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: 'guest' },
          { username: 'demo' },
          { email: 'guest@liferpg.com' },
          { email: 'demo@liferpg.com' },
        ],
      },
      include: {
        stats: true,
        quests: true,
      },
    });

    // 2. If no user found, create a new guest account
    if (!user) {
      const passwordHash = await hashPassword('guest123');
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
            create: [
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
            ],
          },
        },
        include: {
          stats: true,
          quests: true,
        },
      });
    } else {
      // If user has no quests, seed starter quests
      if (!user.quests || user.quests.length === 0) {
        await prisma.quest.createMany({
          data: [
            {
              userId: user.id,
              title: 'Morning Glass of Water',
              description: 'Drink a full glass of cool fresh water to rehydrate your body.',
              category: 'VITALITY',
              difficulty: 'TRIVIAL',
              type: 'DAILY',
              xpReward: 10,
              goldReward: 5,
            },
            {
              userId: user.id,
              title: '25-Minute Deep Focus Session',
              description: 'Work on your primary coding, studying, or reading project with zero distractions.',
              category: 'INTELLECT',
              difficulty: 'MEDIUM',
              type: 'DAILY',
              xpReward: 50,
              goldReward: 25,
            },
            {
              userId: user.id,
              title: '15-Minute Movement or Stretching',
              description: 'Go for a walk, do a set of pushups, or complete a limbering stretch routine.',
              category: 'STRENGTH',
              difficulty: 'EASY',
              type: 'DAILY',
              xpReward: 25,
              goldReward: 12,
            },
          ],
        });
      }

      // Update lastActiveDate and mood
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastActiveDate: new Date(),
          companionMood: 'content',
        },
      });
    }

    // 3. Issue authentication JWT cookie
    const token = signToken({ userId: user.id, email: user.email });

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
        stats: user.stats,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
