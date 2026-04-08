import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, 'public', 'logo.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

for (const size of sizes) {
  const outPath = join(__dirname, 'public', 'icons', `icon-${size}x${size}.png`);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`Generated: icon-${size}x${size}.png`);
}

// Generate favicon.ico (using 48x48 PNG as base, saved as favicon.png then renamed)
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(__dirname, 'public', 'favicon.png'));
console.log('Generated: favicon.png');

// Also generate SVG favicon reference
console.log('\nAll icons generated successfully!');
