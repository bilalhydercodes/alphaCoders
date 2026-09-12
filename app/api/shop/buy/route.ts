import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

const BuySchema = z.object({
  itemId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = BuySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const { itemId } = result.data;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found in shop' }, { status: 404 });
    }

    if (user.gold < item.cost) {
      return NextResponse.json(
        { error: `Insufficient Gold Coins! You need ${item.cost} GP but only have ${user.gold} GP.` },
        { status: 400 }
      );
    }

    // Check if consumable or already owned
    const existing = await prisma.inventoryItem.findFirst({
      where: { userId: user.id, itemId: item.id },
    });

    const [updatedUser, inventoryItem] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { gold: { decrement: item.cost } },
      }),
      existing
        ? prisma.inventoryItem.update({
            where: { id: existing.id },
            data: { quantity: { increment: 1 } },
          })
        : prisma.inventoryItem.create({
            data: {
              userId: user.id,
              itemId: item.id,
              quantity: 1,
              isEquipped: false,
            },
            include: { item: true },
          }),
    ]);

    return NextResponse.json({
      success: true,
      item,
      newGold: updatedUser.gold,
      inventoryItem,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Transaction failed at the counter' }, { status: 500 });
  }
}
