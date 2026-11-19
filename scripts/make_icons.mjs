// Draws the three-layer pyramid as PNGs for the web manifest and for every Android icon and splash screen.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const background = [11, 10, 26, 255];
const transparent = [0, 0, 0, 0];
const white = [255, 255, 255, 255];
const layer_colors = [[255, 209, 102, 255], [239, 71, 111, 255], [118, 120, 237, 255]];
const android_res = 'android/app/src/main/res';
// Status bar icons are 24dp; Android tints them, so only the shape matters.
const notification_sizes = { mdpi: 24, hdpi: 36, xhdpi: 48, xxhdpi: 72, xxxhdpi: 96 };

// Launcher icons get cropped to a circle, so the pyramid stays inside the middle 60 %.
const styles = {
  app_icon: { fill: background, colors: layer_colors, scale: 0.5 },
  foreground: { fill: transparent, colors: layer_colors, scale: 0.5 },
  splash: { fill: background, colors: layer_colors, scale: 0.3 },
  notification: { fill: transparent, colors: [white, white, white], scale: 0.84 },
};

write_icon('assets/icons/icon_192.png', 192, 192, styles.app_icon);
write_icon('assets/icons/icon_512.png', 512, 512, styles.app_icon);
replace_android_images();
Object.entries(notification_sizes).forEach(([density, size]) => {
  mkdirSync(`${android_res}/drawable-${density}`, { recursive: true });
  write_icon(`${android_res}/drawable-${density}/ic_stat_pyramid.png`, size, size, styles.notification);
});

/** Keeps the sizes Capacitor generated and only swaps the picture. */
function replace_android_images() {
  for (const folder of readdirSync(android_res)) {
    for (const file of readdirSync(`${android_res}/${folder}`).filter((name) => name.endsWith('.png'))) {
      const path = `${android_res}/${folder}/${file}`;
      const header = readFileSync(path);
      write_icon(path, header.readUInt32BE(16), header.readUInt32BE(20), style_for(file));
    }
  }
}

function style_for(file) {
  if (file === 'splash.png') return styles.splash;
  if (file === 'ic_launcher_foreground.png') return styles.foreground;
  if (file === 'ic_stat_pyramid.png') return styles.notification;
  return styles.app_icon;
}

function write_icon(path, width, height, style) {
  const pixels = Array.from({ length: height }, (_, y) => Buffer.from([0, ...Array.from({ length: width }, (_, x) => pixel(x, y, width, height, style)).flat()]));
  writeFileSync(path, encode_png(width, height, Buffer.concat(pixels)));
}

function pixel(x, y, width, height, { fill, colors, scale }) {
  const size = Math.min(width, height) * scale;
  const top = height / 2 - size / 2;
  const progress = (y - top) / size;
  if (progress < 0 || progress > 1 || Math.abs(x - width / 2) > size * 0.6 * progress) return fill;
  const layer = Math.min(2, Math.floor(progress * 3));
  // Thin gaps between layers keep them readable even in the one-color notification icon.
  const is_gap = layer > 0 && progress * 3 - layer < 0.08;
  return is_gap ? fill : colors[2 - layer];
}

function encode_png(width, height, rows) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk('IHDR', header), chunk('IDAT', deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, checksum]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
