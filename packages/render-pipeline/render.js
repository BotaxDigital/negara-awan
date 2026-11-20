#!/usr/bin/env node
/**
 * Render script untuk NEGARA DIATAS AWAN
 * Jalankan remotion render untuk episode tertentu
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const EPISODE = process.argv[2] || 'ep01-pendirian';
const QUALITY = process.argv[3] || 'high'; // high | preview

const episodePath = path.join(process.cwd(), `../episodes/${EPISODE}`);

if (!fs.existsSync(episodePath)) {
  console.error(`❌ Episode tidak ditemukan: ${episodePath}`);
  process.exit(1);
}

console.log(`🎬 Render episode: ${EPISODE} (quality: ${QUALITY})`);

const outputDir = path.join(episodePath, '../assets/video');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, `${EPISODE}.mp4`);

let cmd;
if (QUALITY === 'preview') {
  cmd = `cd "${episodePath}" && npx remotion render src/composition.tsx NegaraDiAtasAwanEp1 "${outputFile}" --image-format=png --jpeg-quality=80 --scale=0.5 --concurrency=2`;
} else {
  cmd = `cd "${episodePath}" && npx remotion render src/composition.tsx NegaraDiAtasAwanEp1 "${outputFile}" --image-format=png --jpeg-quality=90 --concurrency=2`;
}

try {
  console.log(`🚀 Menjalankan: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', timeout: 3600000 }); // 1 jam timeout
  
  const stats = fs.statSync(outputFile);
  console.log(`✅ Render selesai: ${outputFile} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
  
} catch (error) {
  console.error('❌ Render gagal:', error.message);
  process.exit(1);
}