#!/usr/bin/env node
/**
 * Deploy Package Creator — NEGARA DIATAS AWAN
 * Creates a ZIP with all files needed for manual render/deployment
 * Run: node create-deploy-package.js
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { glob } from 'glob';

const PROJECT_ROOT = process.cwd();
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'deploy-packages');
const PACKAGE_NAME = `negara-awan-deploy-${new Date().toISOString().split('T')[0]}`;

const INCLUDE_PATTERNS = [
  // Core configs
  'package.json',
  'README.md',
  '.env.example',
  'RENDER_INSTRUCTIONS.md',
  'EPISODE_1_CHECKLIST.md',
  
  // Source code
  'packages/core/**/*',
  'packages/episodes/**/*',
  'packages/assets/**/*',
  'packages/render-pipeline/**/*',
  
  // Tools
  'tools/**/*',
  
  // Docs
  'docs/**/*',
  
  // GitHub Actions
  '.github/workflows/**/*',
  
  // Render scripts
  'render_episode1.py',
];

const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/*.log',
  '**/.DS_Store',
  '**/Thumbs.db',
  'deploy-packages/**',
];

const ESSENTIAL_FILES = [
  'render_episode1.py',
  'RENDER_INSTRUCTIONS.md',
  'packages/episodes/ep01-pendirian/src/data/episode.json',
  'packages/assets/audio/vo_s01_hook.wav',
  'packages/assets/audio/vo_s02_lore_intro.wav',
  'packages/assets/audio/vo_s03_presiden_entrance.wav',
  'packages/assets/audio/vo_s04_sumpah.wav',
  'packages/assets/audio/vo_s05_buka_pendaftaran.wav',
  'packages/assets/audio/vo_s06_teaser_ep2.wav',
  'packages/assets/audio/vo_s07_cta.wav',
];

async function createPackage() {
  console.log('📦 Creating deploy package...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Find all files
  const files = [];
  for (const pattern of INCLUDE_PATTERNS) {
    const matches = await glob(pattern, { 
      cwd: PROJECT_ROOT, 
      ignore: EXCLUDE_PATTERNS,
      nodir: true,
      windowsPathsNoEscape: true
    });
    files.push(...matches);
  }
  
  // Deduplicate
  const uniqueFiles = [...new Set(files)];
  console.log(`📁 Found ${uniqueFiles.length} files to package`);
  
  // Write file list
  const listPath = path.join(OUTPUT_DIR, `${PACKAGE_NAME}-filelist.txt`);
  fs.writeFileSync(listPath, uniqueFiles.sort().join('\n'));
  console.log(`📋 File list saved: ${listPath}`);
  
  // Create ZIP using PowerShell Compress-Archive (Windows native)
  const zipPath = path.join(OUTPUT_DIR, `${PACKAGE_NAME}.zip`);
  const psScript = `
    $ErrorActionPreference = 'Stop'
    $files = @(
${uniqueFiles.map(f => `    '${f.replace(/'/g, "''")}'`).join('\n')}
    )
    Compress-Archive -Path $files -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force
    Write-Host "ZIP created: ${zipPath}"
    (Get-Item '${zipPath.replace(/'/g, "''")}').Length / 1MB | ForEach-Object { Write-Host "Size: $('{0:N1}' -f $_) MB" }
  `;
  
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell', ['-NoProfile', '-Command', psScript], { 
      cwd: PROJECT_ROOT, 
      stdio: 'inherit' 
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        const stats = fs.statSync(zipPath);
        console.log(`\n✅ Package created: ${zipPath}`);
        console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
        console.log(`📁 Files: ${uniqueFiles.length}`);
        resolve(zipPath);
      } else {
        reject(new Error(`PowerShell exited with code ${code}`));
      }
    });
    
    proc.on('error', reject);
  });
}

async function createEssentialZip() {
  console.log('\n📦 Creating essential package...');
  
  const existingEssential = ESSENTIAL_FILES.filter(f => fs.existsSync(path.join(PROJECT_ROOT, f)));
  console.log(`📁 Essential files found: ${existingEssential.length}/${ESSENTIAL_FILES.length}`);
  
  if (existingEssential.length === 0) {
    console.log('⚠️ No essential files found');
    return;
  }
  
  const zipPath = path.join(OUTPUT_DIR, `${PACKAGE_NAME}-essential.zip`);
  const psScript = `
    $ErrorActionPreference = 'Stop'
    $files = @(
${existingEssential.map(f => `    '${f.replace(/'/g, "''")}'`).join('\n')}
    )
    Compress-Archive -Path $files -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force
    Write-Host "Essential ZIP created: ${zipPath}"
    (Get-Item '${zipPath.replace(/'/g, "''")}').Length / 1MB | ForEach-Object { Write-Host "Size: $('{0:N1}' -f $_) MB" }
  `;
  
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell', ['-NoProfile', '-Command', psScript], { 
      cwd: PROJECT_ROOT, 
      stdio: 'inherit' 
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        const stats = fs.statSync(zipPath);
        console.log(`✅ Essential package: ${zipPath}`);
        console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
        resolve(zipPath);
      } else {
        reject(new Error(`PowerShell exited with code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    await createPackage();
    await createEssentialZip();
    console.log('\n🎉 Deploy packages ready in deploy-packages/');
    console.log('📤 Upload to GitHub / cloud / send to editor');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

main();