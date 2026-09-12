import sharp from 'sharp';

async function checkMetadata() {
  const moodMeta = await sharp('public/lumi/lumi-mood-pack.png').metadata();
  console.log('lumi-mood-pack:', moodMeta.width, 'x', moodMeta.height);

  const reactMeta = await sharp('public/lumi/lumi-core-reactions.png').metadata();
  console.log('lumi-core-reactions:', reactMeta.width, 'x', reactMeta.height);

  const charMeta = await sharp('public/lumi/lumi-character-pack.png').metadata();
  console.log('lumi-character-pack:', charMeta.width, 'x', charMeta.height);

  const mainMeta = await sharp('public/lumi/lumi.png').metadata();
  console.log('lumi.png:', mainMeta.width, 'x', mainMeta.height);
}

checkMetadata();
