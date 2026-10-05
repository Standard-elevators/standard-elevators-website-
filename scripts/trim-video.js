const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');

const inputPath = 'public/videos/site-loader.mp4';
const outputPath = 'public/videos/site-loader-trimmed.mp4';

console.log('Using ffmpeg at:', ffmpeg.path);

// 1. Probe input duration
let probeOutput = '';
try {
  execSync(`"${ffmpeg.path}" -i "${inputPath}"`, { stdio: 'pipe' });
} catch (err) {
  // ffmpeg outputs info on stderr
  probeOutput = err.stderr ? err.stderr.toString() : '';
}

console.log('--- Probing site-loader.mp4 ---');
const durationMatch = probeOutput.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
if (durationMatch) {
  const hours = parseFloat(durationMatch[1]);
  const minutes = parseFloat(durationMatch[2]);
  const seconds = parseFloat(durationMatch[3]);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  console.log(`Original duration: ${totalSeconds.toFixed(3)}s (${durationMatch[0]})`);
  
  // Target: Remove exactly one second from the end
  const targetDuration = totalSeconds - 1.0;
  console.log(`Target trimmed duration: ${targetDuration.toFixed(3)}s`);

  // Run trim with high quality H.264 preserving audio stream
  const cmd = `"${ffmpeg.path}" -y -i "${inputPath}" -t ${targetDuration.toFixed(3)} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac "${outputPath}"`;
  console.log('Running:', cmd);
  execSync(cmd, { stdio: 'inherit' });

  console.log('Trim complete. Checking output file...');
  const stat = fs.statSync(outputPath);
  console.log(`Trimmed file size: ${stat.size} bytes (${outputPath})`);

  // Probe output duration to verify
  let outProbe = '';
  try {
    execSync(`"${ffmpeg.path}" -i "${outputPath}"`, { stdio: 'pipe' });
  } catch (err) {
    outProbe = err.stderr ? err.stderr.toString() : '';
  }
  const outMatch = outProbe.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  if (outMatch) {
    const oH = parseFloat(outMatch[1]);
    const oM = parseFloat(outMatch[2]);
    const oS = parseFloat(outMatch[3]);
    const oTotal = oH * 3600 + oM * 60 + oS;
    console.log(`Verified trimmed duration: ${oTotal.toFixed(3)}s (Diff from original: ${(totalSeconds - oTotal).toFixed(3)}s shorter)`);
  }
} else {
  console.error('Could not parse duration from ffmpeg output:', probeOutput);
}
