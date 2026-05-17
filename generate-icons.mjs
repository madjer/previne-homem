import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgBuffer = readFileSync(join(__dirname, 'public/logo-full.svg'));

const sizes = [72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `public/icons/icon-${size}x${size}.png`));
  console.log(`icon-${size}x${size}.png`);
}

await sharp(svgBuffer).resize(32, 32).png().toFile(join(__dirname, 'public/favicon.png'));
console.log('favicon.png');
console.log('Done.');
