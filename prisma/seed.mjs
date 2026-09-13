import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Life RPG database...');

  // 1. Seed Demo User
  const demoUser = await prisma.user.findFirst({ where: { username: 'demo' } });
  if (!demoUser) {
    const passwordHash = await bcrypt.hash('demo123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'demo@liferpg.com',
        username: 'demo',
        passwordHash,
        title: 'Novice Adventurer',
        level: 1,
        xp: 0,
        gold: 50,
        hp: 100,
        maxHp: 100,
        streak: 0,
        companionMood: 'content',
        bio: 'Ready to embark on an epic journey!',
        avatarEmoji: '🧙',
        bestStreak: 0,
      },
    });
    
    // Create character stats for demo user
    await prisma.characterStats.create({
      data: {
        userId: user.id,
        strength: 5,
        intellect: 5,
        agility: 5,
        vitality: 5,
        spirit: 5,
      },
    });
    
    console.log('Created demo user: demo / demo123');
  }

  // 3. Seed Shop Items
  const items = [
    {
      name: 'Amethyst Silk Scarf',
      description: 'A finely woven scarf dyed in royal amethyst. Kept warm by Lumi.',
      category: 'ACCESSORY',
      cost: 35,
      rarity: 'COMMON',
      icon: 'sparkles',
      statModifier: JSON.stringify({ vitality: 2, spirit: 1 }),
    },
    {
      name: 'Golden Sprout Crown',
      description: 'A radiant golden crown that rests atop Lumi’s leafy sprout.',
      category: 'COMPANION_DECOR',
      cost: 80,
      rarity: 'RARE',
      icon: 'crown',
      statModifier: JSON.stringify({ spirit: 3 }),
    },
    {
      name: 'Elixir of Vitality',
      description: 'Restores 50 HP when life gets tiring. A gentle soothing brew.',
      category: 'CONSUMABLE',
      cost: 20,
      rarity: 'COMMON',
      icon: 'heart',
      statModifier: JSON.stringify({ hpRestore: 50 }),
    },
    {
      name: 'Codex of Deep Focus',
      description: 'An ancient scroll that sharpens mental clarity and grants bonus INT.',
      category: 'ACCESSORY',
      cost: 65,
      rarity: 'RARE',
      icon: 'book-open',
      statModifier: JSON.stringify({ intellect: 4 }),
    },
    {
      name: 'Iron Will Dumbbell',
      description: 'Forged from determination. Grants physical vigor and strength.',
      category: 'ACCESSORY',
      cost: 60,
      rarity: 'UNCOMMON',
      icon: 'dumbbell',
      statModifier: JSON.stringify({ strength: 4 }),
    },
    {
      name: 'Sandals of the Wind',
      description: 'Lightweight sandals that encourage swift habit completion.',
      category: 'ACCESSORY',
      cost: 55,
      rarity: 'UNCOMMON',
      icon: 'zap',
      statModifier: JSON.stringify({ agility: 4 }),
    },
    {
      name: 'Streak Guardian Talisman',
      description: 'A golden amulet that protects your active streak from a missed day.',
      category: 'ACCESSORY',
      cost: 120,
      rarity: 'EPIC',
      icon: 'shield',
      statModifier: JSON.stringify({ streakShield: 1 }),
    },
    {
      name: 'Grand Guildmaster Robe',
      description: 'Legendary regalia woven with starlight and amethyst essence.',
      category: 'ACCESSORY',
      cost: 250,
      rarity: 'LEGENDARY',
      icon: 'award',
      statModifier: JSON.stringify({ strength: 3, intellect: 3, agility: 3, vitality: 3, spirit: 3 }),
    },
  ];

  for (const item of items) {
    const existing = await prisma.item.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.item.create({ data: item });
      console.log(`Created item: ${item.name}`);
    }
  }

  // 4. Seed Dungeon Bosses
  const bosses = [
    {
      name: 'The Sloth Behemoth',
      title: 'Scourge of Lost Hours',
      description: 'A sluggish titan composed of unwashed dishes and skipped workouts. Struck by every completed quest!',
      sprite: 'behemoth',
      maxHp: 400,
      currentHp: 400,
      level: 1,
      rewardXp: 150,
      rewardGold: 100,
      rewardBadge: 'Behemoth Slayer',
      isActive: true,
    },
    {
      name: 'The Procrastination Hydra',
      title: 'Serpent of "I’ll Do It Tomorrow"',
      description: 'Cut off one excuse and two take its place! Requires persistent daily habit strikes to slay.',
      sprite: 'hydra',
      maxHp: 1000,
      currentHp: 1000,
      level: 2,
      rewardXp: 350,
      rewardGold: 220,
      rewardBadge: 'Hydra Tamer',
      isActive: false,
    },
  ];

  for (const boss of bosses) {
    const existing = await prisma.dungeonBoss.findFirst({ where: { name: boss.name } });
    if (!existing) {
      await prisma.dungeonBoss.create({ data: boss });
      console.log(`Created boss: ${boss.name}`);
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
