import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hashPassword, comparePassword } from "@/lib/auth";

// GET /api/profile — returns full profile data + lifetime achievement stats
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questLogs = await prisma.questLog.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
    });

    const totalQuestsCompleted = questLogs.length;
    const totalXpEarned = questLogs.reduce((sum, l) => sum + l.xpGained, 0);
    const totalGoldEarned = questLogs.reduce((sum, l) => sum + l.goldGained, 0);

    const categoryBreakdown: Record<string, number> = {};
    for (const log of questLogs) {
      categoryBreakdown[log.category] = (categoryBreakdown[log.category] || 0) + 1;
    }

    const bossDamageLogs = await prisma.bossDamageLog.findMany({
      where: { userId: user.id },
    });
    const totalBossDamage = bossDamageLogs.reduce((sum, l) => sum + l.damageDealt, 0);

    const uniqueDays = new Set(
      questLogs.map((l) => new Date(l.completedAt).toDateString())
    );

    const recentActivity = questLogs.slice(0, 10);

    return NextResponse.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        title: user.title,
        level: user.level,
        bio: (user as any).bio ?? null,
        avatarEmoji: (user as any).avatarEmoji ?? "🧙",
        bestStreak: (user as any).bestStreak ?? 0,
        streak: user.streak,
        createdAt: user.createdAt,
      },
      stats: {
        totalQuestsCompleted,
        totalXpEarned,
        totalGoldEarned,
        bestStreak: (user as any).bestStreak ?? 0,
        daysActive: uniqueDays.size,
        totalBossDamage,
        categoryBreakdown,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

// PATCH /api/profile — update bio, avatarEmoji, username, or password
export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bio, avatarEmoji, username, currentPassword, newPassword } = body;

    const updateData: Record<string, any> = {};

    if (bio !== undefined) {
      updateData.bio = bio ? String(bio).slice(0, 160) : null;
    }

    if (avatarEmoji !== undefined) {
      updateData.avatarEmoji = String(avatarEmoji);
    }

    if (username && username !== user.username) {
      const trimmed = String(username).trim();
      if (trimmed.length < 3 || trimmed.length > 24) {
        return NextResponse.json(
          { error: "Username must be between 3 and 24 characters." },
          { status: 400 }
        );
      }
      const existing = await prisma.user.findUnique({ where: { username: trimmed } });
      if (existing) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
      }
      updateData.username = trimmed;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const isValid = await comparePassword(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });
      }
      if (String(newPassword).length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes provided." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      profile: {
        username: updated.username,
        bio: (updated as any).bio,
        avatarEmoji: (updated as any).avatarEmoji,
      },
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
