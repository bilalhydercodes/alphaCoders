import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

const EquipSchema = z.object({
  inventoryId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = EquipSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid inventory ID' }, { status: 400 });
    }

    const { inventoryId } = result.data;

    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: { id: inventoryId, userId: user.id },
      include: { item: true },
    });

    if (!inventoryItem) {
      return NextResponse.json({ error: 'Item not found in your inventory' }, { status: 404 });
    }

    // If consumable (e.g. Elixir of Vitality)
    if (inventoryItem.item.category === 'CONSUMABLE') {
      let hpRestore = 30;
      if (inventoryItem.item.statModifier) {
        try {
          const mod = JSON.parse(inventoryItem.item.statModifier);
          if (mod.hpRestore) hpRestore = mod.hpRestore;
        } catch {
          // ignore
        }
      }

      const newHp = Math.min(user.maxHp, user.hp + hpRestore);

      // Decrement or delete inventory item
      if (inventoryItem.quantity > 1) {
        await prisma.inventoryItem.update({
          where: { id: inventoryItem.id },
          data: { quantity: { decrement: 1 } },
        });
      } else {
        await prisma.inventoryItem.delete({
          where: { id: inventoryItem.id },
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { hp: newHp },
      });

      return NextResponse.json({
        success: true,
        consumed: true,
        message: `Drank ${inventoryItem.item.name}! Restored ${hpRestore} HP.`,
        newHp: updatedUser.hp,
      });
    }

    // Toggle equip state
    const newEquipped = !inventoryItem.isEquipped;

    // If statModifier exists, update stats accordingly
    let statDelta: Record<string, number> = {};
    if (inventoryItem.item.statModifier) {
      try {
        statDelta = JSON.parse(inventoryItem.item.statModifier);
      } catch {
        // ignore
      }
    }

    const multiplier = newEquipped ? 1 : -1;
    const statUpdates: Record<string, { increment: number }> = {};
    for (const [statKey, value] of Object.entries(statDelta)) {
      if (['strength', 'intellect', 'agility', 'vitality', 'spirit'].includes(statKey)) {
        statUpdates[statKey] = { increment: Number(value) * multiplier };
      }
    }

    const [updatedInv, updatedStats] = await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: inventoryItem.id },
        data: { isEquipped: newEquipped },
      }),
      ...(Object.keys(statUpdates).length > 0
        ? [
            prisma.characterStats.update({
              where: { userId: user.id },
              data: statUpdates,
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      isEquipped: updatedInv.isEquipped,
      stats: updatedStats || user.stats,
      message: newEquipped ? `Equipped ${inventoryItem.item.name}!` : `Unequipped ${inventoryItem.item.name}.`,
    });
  } catch (error) {
    console.error('Equip error:', error);
    return NextResponse.json({ error: 'Failed to adjust equipment' }, { status: 500 });
  }
}
