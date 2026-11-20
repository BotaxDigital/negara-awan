#!/usr/bin/env node
/**
 * Compress script untuk NEGARA DIATAS AWAN
 * Kompres video untuk Telegram (50MB limit) & TikTok
 * Target: 720x1280 CRF24 ~13MB untuk 3 menit
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const INPUT_FILE = process.argv[2];
const OUTPUT_SUFFIX = process.argv[3] || '-tg';

if (!INPUT_FILE) {
  console.error('❌ Usage: node compress.js <input.mp4> [suffix]');
  console.error('   Suffix default: -tg (output: input-tg.mp4)');
  process.exit(1);
}

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`❌ File tidak ditemukan: ${INPUT_FILE}`);
  process.exit(1);
}

const parsed = path.parse(INPUT_FILE);
const OUTPUT_FILE = path.join(parsed.dir, `${parsed.name}${OUTPUT_SUFFIX}${parsed.ext}`);

console.log(`🗜️ Kompres: ${INPUT_FILE} → ${OUTPUT_FILE}`);

// FFmpeg command untuk Telegram (720x1280, CRF24, 96kbps audio)
const cmd = `ffmpeg -y -i "${INPUT_FILE}" \
  -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -crf 24 -preset medium \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  "${OUTPUT_FILE}"`;

try {
  console.log(`🚀 Menjalankan FFmpeg...`);
  execSync(cmd, { stdio: 'inherit', timeout: 600000 }); // 10 menit timeout
  
  const inStats = fs.statSync(INPUT_FILE);
  const outStats = fs.statSync(OUTPUT_FILE);
  
  console.log(`✅ Kompres selesai:`);
  console.log(`   Input:  ${(inStats.size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Output: ${(outStats.size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Rasio:  ${(outStats.size / inStats.size * 100).toFixed(1)}%`);
  
  if (outStats.size > 50 * 1024 * 1024) {
    console.warn('⚠️ Output masih > 50MB, mungkin perlu CRF lebih tinggi');
  }
  
} catch (error) {
  console.error('❌ Kompres gagal:', error.message);
  process.exit(1);
}