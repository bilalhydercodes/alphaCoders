import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, username, password } = result.data;

    // Check existing
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An adventurer with that email or username already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user with starter stats and starter quests
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        passwordHash,
        level: 1,
        xp: 0,
        gold: 50,
        hp: 100,
        maxHp: 100,
        streak: 1,
        lastActiveDate: new Date(),
        companionMood: 'content',
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
            {
              title: 'Organize Workspace or Room',
              description: 'Tidy up your desk, clear unnecessary clutter, and set yourself up for calm clarity.',
              category: 'AGILITY',
              difficulty: 'EASY',
              type: 'TODO',
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create adventurer account' },
      { status: 500 }
    );
  }
}
