const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpegPath = ffmpegInstaller.path;

const files = fs.readdirSync(path.join(__dirname, '..', 'public', 'videos'));
const matchedFile = files.find(f => f.startsWith('Architectural_commercial_video') && f.endsWith('.mp4'));
console.log('Matched file:', matchedFile);

const sourceVideo = path.join(__dirname, '..', 'public', 'videos', matchedFile);
const destVideo = path.join(__dirname, '..', 'public', 'videos', 'hero-background.mp4');

console.log('Source video exists:', fs.existsSync(sourceVideo));
console.log('Source size:', fs.statSync(sourceVideo).size, 'bytes');

try {
  const result = execSync(`"${ffmpegPath}" -i "${sourceVideo}"`, { encoding: 'utf8' });
  console.log(result);
} catch (err) {
  // ffmpeg -i returns code 1 because no output file specified, but stderr contains video info
  console.log('Video Information:');
  console.log(err.stderr || err.stdout || err.message);
}

// Extract sample frames for inspection
try {
  execSync(`"${ffmpegPath}" -y -ss 00:00:01 -i "${destVideo}" -vframes 1 "${path.join(__dirname, '..', 'public', 'images', 'hero-frame-1s.jpg')}"`);
  execSync(`"${ffmpegPath}" -y -ss 00:00:04 -i "${destVideo}" -vframes 1 "${path.join(__dirname, '..', 'public', 'images', 'hero-frame-4s.jpg')}"`);
  console.log('Sample frames extracted to public/images/');
} catch (e) {
  console.error('Frame extraction failed:', e.message);
}
