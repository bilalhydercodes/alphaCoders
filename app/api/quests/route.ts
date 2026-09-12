import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { DIFFICULTY_REWARDS } from '@/lib/progression';

const CreateQuestSchema = z.object({
  title: z.string().min(1, 'Quest title is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['STRENGTH', 'INTELLECT', 'AGILITY', 'VITALITY', 'SPIRIT']),
  difficulty: z.enum(['TRIVIAL', 'EASY', 'MEDIUM', 'HARD', 'EPIC']),
  type: z.enum(['TODO', 'DAILY', 'HABIT']),
  habitDirection: z.enum(['POSITIVE', 'NEGATIVE', 'BOTH']).optional(),
  dueDate: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const whereClause: {
      userId: string;
      type?: string;
      category?: string;
    } = { userId: user.id };

    if (type) whereClause.type = type;
    if (category) whereClause.category = category;

    const quests = await prisma.quest.findMany({
      where: whereClause,
      orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ quests });
  } catch (error) {
    console.error('Fetch quests error:', error);
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = CreateQuestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, category, difficulty, type, habitDirection, dueDate } = result.data;
    const rewards = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.MEDIUM;

    const quest = await prisma.quest.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        category,
        difficulty,
        type,
        habitDirection: habitDirection || 'POSITIVE',
        xpReward: rewards.xp,
        goldReward: rewards.gold,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ success: true, quest }, { status: 201 });
  } catch (error) {
    console.error('Create quest error:', error);
    return NextResponse.json({ error: 'Failed to post bounty to quest board' }, { status: 500 });
  }
}
