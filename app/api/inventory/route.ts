import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inventory = await prisma.inventoryItem.findMany({
      where: { userId: user.id },
      include: { item: true },
      orderBy: { acquiredAt: 'desc' },
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json({ error: 'Failed to inspect bag' }, { status: 500 });
  }
}
