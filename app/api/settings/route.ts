import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json({ error: 'Settings payload required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        ...(typeof settings.notificationsEnabled === 'boolean' && {
          notificationsEnabled: settings.notificationsEnabled,
        }),
        ...(typeof settings.dailyReminders === 'boolean' && {
          dailyReminders: settings.dailyReminders,
        }),
        ...(typeof settings.focusModeAuto === 'boolean' && {
          focusModeAuto: settings.focusModeAuto,
        }),
        ...(typeof settings.privacyMode === 'boolean' && {
          privacyMode: settings.privacyMode,
        }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}