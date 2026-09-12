import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let boss = await prisma.dungeonBoss.findFirst({
      where: { isActive: true },
    });

    // If active boss was defeated, check if next boss can be activated
    if (!boss) {
      const nextBoss = await prisma.dungeonBoss.findFirst({
        where: { defeatedAt: null },
        orderBy: { level: 'asc' },
      });
      if (nextBoss) {
        boss = await prisma.dungeonBoss.update({
          where: { id: nextBoss.id },
          data: { isActive: true },
        });
      }
    }

    const recentHits = boss
      ? await prisma.bossDamageLog.findMany({
          where: { bossId: boss.id },
          include: {
            user: {
              select: { username: true, title: true, level: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        })
      : [];

    return NextResponse.json({
      boss,
      recentHits,
    });
  } catch (error) {
    console.error('Fetch boss error:', error);
    return NextResponse.json({ error: 'Failed to scout dungeon boss' }, { status: 500 });
  }
}
