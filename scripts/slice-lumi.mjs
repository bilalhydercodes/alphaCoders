import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'public/lumi/extracted';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function sliceAssets() {
  console.log('Slicing Lumi assets...');

  // 1. Mood pack: 1536 x 1024
  // 7 cards: M01 to M07.
  // The card area runs from x approx 18 to 1518, y approx 220 to 765
  // Width per card: ~210px, gap ~4px
  const moodNames = [
    'content',
    'radiant',
    'sleepy',
    'concerned',
    'wilting',
    'focused',
    'sleeping'
  ];

  // Let's extract each full mood card and also the character sub-region
  for (let i = 0; i < 7; i++) {
    const left = Math.round(18 + i * 213.5);
    const top = 220;
    const width = 210;
    const height = 540;

    // Full card
    await sharp('public/lumi/lumi-mood-pack.png')
      .extract({ left, top, width, height })
      .toFile(path.join(outDir, `mood-card-${moodNames[i]}.png`));

    // Character avatar area within card
    const charTop = 330;
    const charHeight = 290;
    await sharp('public/lumi/lumi-mood-pack.png')
      .extract({ left: left + 5, top: charTop, width: width - 10, height: charHeight })
      .toFile(path.join(outDir, `mood-${moodNames[i]}.png`));
    
    console.log(`Extracted mood: ${moodNames[i]}`);
  }

  // 2. Core reactions: 1536 x 1024
  // 6 cards: 01 Level Up to 06 Focus
  const reactionNames = [
    'levelup',
    'achievement',
    'explore',
    'selfcare',
    'yougotthis',
    'focus'
  ];

  // Area runs from x approx 18 to 1518, y approx 220 to 800
  // 6 cards -> width per card ~248px
  for (let i = 0; i < 6; i++) {
    const left = Math.round(18 + i * 250);
    const top = 220;
    const width = 246;
    const height = 580;

    // Full reaction card
    await sharp('public/lumi/lumi-core-reactions.png')
      .extract({ left, top, width, height })
      .toFile(path.join(outDir, `reaction-card-${reactionNames[i]}.png`));

    // Character sub-crop
    const charTop = 310;
    const charHeight = 310;
    await sharp('public/lumi/lumi-core-reactions.png')
      .extract({ left: left + 10, top: charTop, width: width - 20, height: charHeight })
      .toFile(path.join(outDir, `reaction-${reactionNames[i]}.png`));

    console.log(`Extracted reaction: ${reactionNames[i]}`);
  }

  // 3. Hero Lumi from lumi.png (1212 x 1298)
  // Top-right hero: waving with purple backpack
  // x ~ 460 to 1180, y ~ 20 to 520
  await sharp('public/lumi/lumi.png')
    .extract({ left: 450, top: 15, width: 730, height: 510 })
    .toFile(path.join(outDir, 'lumi-hero.png'));
  console.log('Extracted lumi-hero.png');

  // Small companion avatar from lumi.png
  // Left: 470, Top: 80, Width: 420, Height: 440
  await sharp('public/lumi/lumi.png')
    .extract({ left: 470, top: 80, width: 420, height: 440 })
    .toFile(path.join(outDir, 'lumi-avatar.png'));
  console.log('Extracted lumi-avatar.png');

  console.log('Done slicing Lumi assets!');
}

sliceAssets().catch(err => {
  console.error('Error slicing assets:', err);
  process.exit(1);
});
