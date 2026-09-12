const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '..', 'everything_is_good_just_when_s_gwr_video_mvp_frames');
const outputDir = path.join(__dirname, '..', 'public', 'frames');
const TOTAL_TARGET_FRAMES = 184;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertFrames() {
  console.log('Starting frame optimization from:', inputDir);
  console.log('Output directory:', outputDir);
  console.log(`Targeting frames 1 to ${TOTAL_TARGET_FRAMES}`);

  // Clean up any frames with index > 184
  const existingFiles = fs.readdirSync(outputDir);
  for (const file of existingFiles) {
    const m = file.match(/frame_(\d+)\.webp/);
    if (m && parseInt(m[1]) > TOTAL_TARGET_FRAMES) {
      fs.unlinkSync(path.join(outputDir, file));
      console.log(`Removed obsolete frame: ${file}`);
    }
  }

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;
  let lastValidInputPath = null;

  for (let i = 1; i <= TOTAL_TARGET_FRAMES; i++) {
    const padded = String(i).padStart(3, '0');
    const directFile = `frame_${padded}.png`;
    let currentInputPath = path.join(inputDir, directFile);

    if (fs.existsSync(currentInputPath)) {
      lastValidInputPath = currentInputPath;
    } else if (lastValidInputPath) {
      console.log(`Frame ${i} missing; filling forward from previous available frame.`);
      currentInputPath = lastValidInputPath;
    } else {
      throw new Error(`Cannot find initial frame ${i}`);
    }

    const outFileName = `frame_${padded}.webp`;
    const outputPath = path.join(outputDir, outFileName);

    const inStat = fs.statSync(currentInputPath);
    totalOriginalBytes += inStat.size;

    await sharp(currentInputPath)
      .webp({ quality: 84, effort: 4 })
      .toFile(outputPath);

    const outStat = fs.statSync(outputPath);
    totalOptimizedBytes += outStat.size;

    if (i % 20 === 0 || i === TOTAL_TARGET_FRAMES) {
      process.stdout.write(`\rConverted ${i} / ${TOTAL_TARGET_FRAMES} frames...`);
    }
  }

  console.log('\nOptimization complete!');
  console.log(`Original: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized: ${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Saved: ${((1 - totalOptimizedBytes / totalOriginalBytes) * 100).toFixed(1)}% bandwidth`);
}

convertFrames().catch(err => {
  console.error('Frame conversion error:', err);
  process.exit(1);
});
