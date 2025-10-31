const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function optimizeFramesUltra() {
  const framesDir = "./public/video-frames";
  const mobileDir = "./public/video-frames/mobile";
  const mobileLowDir = "./public/video-frames/mobile-low";

  // Create directories
  if (!fs.existsSync(mobileLowDir)) {
    fs.mkdirSync(mobileLowDir, { recursive: true });
    console.log("✅ Created mobile-low directory:", mobileLowDir);
  }

  if (!fs.existsSync(mobileDir)) {
    fs.mkdirSync(mobileDir, { recursive: true });
    console.log("✅ Created mobile directory:", mobileDir);
  }

  // Get all jpg files
  const frames = fs
    .readdirSync(framesDir)
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg"));

  console.log(`🔄 Creating ultra-optimized frames for mobile...`);

  let mobileCount = 0;
  let mobileLowCount = 0;

  for (const frame of frames) {
    try {
      const inputPath = path.join(framesDir, frame);

      // Create mobile-optimized (medium quality)
      await sharp(inputPath)
        .resize(1280, 720) // 16:9 ratio, smaller size
        .jpeg({
          quality: 80, // Medium quality
          mozjpeg: true,
          progressive: true,
        })
        .toFile(path.join(mobileDir, frame));

      mobileCount++;

      // Create mobile-low (ultra low quality for slow devices)
      await sharp(inputPath)
        .resize(960, 540) // Very small size
        .jpeg({
          quality: 60, // Very low quality
          mozjpeg: true,
          progressive: true,
        })
        .toFile(path.join(mobileLowDir, frame));

      mobileLowCount++;

      console.log(`✅ Optimized: ${frame}`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${frame}:`, error.message);
    }
  }

  console.log("\n🎉 Ultra Optimization Complete!");
  console.log(`📱 Mobile frames: ${mobileCount}`);
  console.log(`🔋 Mobile-low frames: ${mobileLowCount}`);
  console.log("\nYour 3D model will now be SUPER SMOOTH on mobile! 🚀");
}

optimizeFramesUltra().catch(console.error);
