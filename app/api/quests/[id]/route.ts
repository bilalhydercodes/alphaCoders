import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { DIFFICULTY_REWARDS } from '@/lib/progression';

const UpdateQuestSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['STRENGTH', 'INTELLECT', 'AGILITY', 'VITALITY', 'SPIRIT']).optional(),
  difficulty: z.enum(['TRIVIAL', 'EASY', 'MEDIUM', 'HARD', 'EPIC']).optional(),
  dueDate: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = UpdateQuestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id },
    });

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (result.data.title !== undefined) updateData.title = result.data.title;
    if (result.data.description !== undefined) updateData.description = result.data.description;
    if (result.data.category !== undefined) updateData.category = result.data.category;
    if (result.data.dueDate !== undefined) {
      updateData.dueDate = result.data.dueDate ? new Date(result.data.dueDate) : null;
    }
    if (result.data.difficulty !== undefined) {
      updateData.difficulty = result.data.difficulty;
      const rewards = DIFFICULTY_REWARDS[result.data.difficulty];
      updateData.xpReward = rewards.xp;
      updateData.goldReward = rewards.gold;
    }

    const updated = await prisma.quest.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, quest: updated });
  } catch (error) {
    console.error('Update quest error:', error);
    return NextResponse.json({ error: 'Failed to update quest' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id },
    });

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    await prisma.quest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Quest deleted' });
  } catch (error) {
    console.error('Delete quest error:', error);
    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 });
  }
}
