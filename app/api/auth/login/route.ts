import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, COOKIE_NAME } from '@/lib/auth';

const LoginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { identifier, password } = result.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
      include: {
        stats: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No adventurer found with these credentials' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password. Try again or consult the Guildmaster.' },
        { status: 401 }
      );
    }

    // Determine ambient mood on login
    let mood = 'content';
    const now = new Date();
    if (user.lastActiveDate) {
      const hoursSince = (now.getTime() - new Date(user.lastActiveDate).getTime()) / (1000 * 60 * 60);
      if (hoursSince > 24) {
        mood = 'sleepy';
      } else if (user.streak >= 3) {
        mood = 'radiant';
      }
    }

    // Update lastActiveDate and mood
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveDate: now,
        companionMood: mood,
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
        companionMood: mood,
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to log into the Adventurer’s Guild' },
      { status: 500 }
    );
  }
}
