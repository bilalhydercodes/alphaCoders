import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.item.findMany({
      orderBy: { cost: 'asc' },
    });

    const userInventory = await prisma.inventoryItem.findMany({
      where: { userId: user.id },
    });

    const ownedItemIds = new Set(userInventory.map((i) => i.itemId));

    return NextResponse.json({
      items: items.map((item) => ({
        ...item,
        isOwned: ownedItemIds.has(item.id),
      })),
      userGold: user.gold,
    });
  } catch (error) {
    console.error('Fetch shop error:', error);
    return NextResponse.json({ error: 'Failed to open Guild Emporium' }, { status: 500 });
  }
}
