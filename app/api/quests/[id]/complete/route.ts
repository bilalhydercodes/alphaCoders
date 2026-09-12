import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { calculateQuestCompletion, getXpForNextLevel } from '@/lib/progression';

export async function POST(
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

    // Check if daily already completed today
    const now = new Date();
    if (quest.type === 'DAILY' && quest.completedAt) {
      const isToday =
        new Date(quest.completedAt).toDateString() === now.toDateString();
      if (isToday && quest.isCompleted) {
        return NextResponse.json(
          { error: 'This daily bounty has already been completed today!' },
          { status: 400 }
        );
      }
    }

    // Calculate progression server-side
    const progression = calculateQuestCompletion(
      user.level,
      user.xp,
      user.streak,
      user.lastActiveDate,
      quest.difficulty,
      quest.category
    );

    // Active boss encounter logic
    const activeBoss = await prisma.dungeonBoss.findFirst({
      where: { isActive: true },
    });

    let bossUpdate: {
      bossId: string;
      bossName: string;
      damageDealt: number;
      remainingHp: number;
      maxHp: number;
      wasDefeated: boolean;
      bonusXp?: number;
      bonusGold?: number;
    } | null = null;

    let extraXp = 0;
    let extraGold = 0;

    if (activeBoss) {
      const damage = progression.xpEarned;
      const newHp = Math.max(0, activeBoss.currentHp - damage);
      const wasDefeated = newHp === 0;

      if (wasDefeated) {
        extraXp = activeBoss.rewardXp;
        extraGold = activeBoss.rewardGold;
      }

      bossUpdate = {
        bossId: activeBoss.id,
        bossName: activeBoss.name,
        damageDealt: damage,
        remainingHp: newHp,
        maxHp: activeBoss.maxHp,
        wasDefeated,
        bonusXp: extraXp,
        bonusGold: extraGold,
      };
    }

    // Determine companion mood
    // If streak >= 3 -> radiant; if leveling up -> radiant; if selfcare -> content/loving
    const companionMood = progression.didLevelUp || progression.streakUpdated.currentStreak >= 3 ? 'radiant' : 'content';

    // Atomic transaction for database consistency
    const [updatedUser, updatedStats, updatedQuest] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          level: progression.newLevel,
          xp: progression.newXp + extraXp,
          gold: { increment: progression.goldEarned + extraGold },
          streak: progression.streakUpdated.currentStreak,
          lastActiveDate: now,
          companionMood,
        },
      }),
      prisma.characterStats.update({
        where: { userId: user.id },
        data: {
          [progression.statGained.attribute]: {
            increment: progression.statGained.points,
          },
        },
      }),
      prisma.quest.update({
        where: { id: quest.id },
        data: {
          isCompleted: quest.type === 'TODO' ? true : true,
          completedAt: now,
          streakCount: { increment: 1 },
        },
      }),
      prisma.questLog.create({
        data: {
          userId: user.id,
          questTitle: quest.title,
          category: quest.category,
          difficulty: quest.difficulty,
          xpGained: progression.xpEarned + extraXp,
          goldGained: progression.goldEarned + extraGold,
        },
      }),
      ...(activeBoss && bossUpdate
        ? [
            prisma.bossDamageLog.create({
              data: {
                userId: user.id,
                bossId: activeBoss.id,
                damageDealt: bossUpdate.damageDealt,
                questTitle: quest.title,
              },
            }),
            prisma.dungeonBoss.update({
              where: { id: activeBoss.id },
              data: {
                currentHp: bossUpdate.remainingHp,
                ...(bossUpdate.wasDefeated ? { isActive: false, defeatedAt: now } : {}),
              },
            }),
          ]
        : []),
    ]);

    const xpNeeded = getXpForNextLevel(updatedUser.level);

    return NextResponse.json({
      success: true,
      quest: updatedQuest,
      progression: {
        ...progression,
        totalGold: updatedUser.gold,
        totalXp: updatedUser.xp,
        xpNeeded,
        level: updatedUser.level,
        stats: updatedStats,
        boss: bossUpdate,
        companionMood,
      },
    });
  } catch (error) {
    console.error('Quest completion error:', error);
    return NextResponse.json(
      { error: 'Failed to record quest progression' },
      { status: 500 }
    );
  }
}
