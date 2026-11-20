#!/usr/bin/env node
/**
 * Sheet Sync untuk NEGARA DIATAS AWAN
 * Baca Google Sheets → generate officials.json untuk episode berikutnya
 * Update lore.json dengan kabinet baru
 */

import { google } from 'googleapis';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Comments';

// Kolom indices (0-indexed)
const COL = {
  PLATFORM: 0,
  COMMENT_ID: 1,
  AUTHOR_HANDLE: 2,
  AUTHOR_NAME: 3,
  AUTHOR_AVATAR: 4,
  TEXT: 5,
  LIKES: 6,
  REPLIES: 7,
  TIMESTAMP: 8,
  VIDEO_POST_ID: 9,
  PARSED_NAMA: 10,
  PARSED_JABATAN: 11,
  PARSED_ALASAN: 12,
  IS_VALID: 13,
  SCORE: 14,
  REASONING: 15,
  TIER: 16,
  STATUS: 17,
  EPISODE: 18,
  AVATAR_SEED: 19,
  WARNA_TEMA: 20,
};

function generateId(prefix = 'nda') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function getTierColor(tier) {
  const colors = {
    S: '#FDE047', // Gold
    A: '#7DD3FC', // Blue
    B: '#22C55E', // Green
    C: '#F97316', // Orange
    D: '#64748B', // Gray
  };
  return colors[tier] || '#64748B';
}

function getRoleColor(role) {
  const lower = role.toLowerCase();
  if (lower.includes('presiden')) return '#1E3A5F';
  if (lower.includes('menteri')) return '#7DD3FC';
  if (lower.includes('gubernur')) return '#FDE047';
  if (lower.includes('kepala') || lower.includes('dir')) return '#A855F7';
  return '#64748B';
}

async function main() {
  if (!SPREADSHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID tidak diset');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  // Baca semua data
  const range = `${SHEET_NAME}!A:Z`;
  const response = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range });
  const rows = response.data.values || [];
  
  if (rows.length <= 1) {
    console.log('📭 Tidak ada data');
    return;
  }
  
  const dataRows = rows.slice(1);
  
  // Filter: valid, scored, tier S/A/B, status belum dipilih
  const candidates = dataRows
    .map((row, i) => ({ row, rowNum: i + 2 }))
    .filter(({ row }) => 
      row[COL.IS_VALID] === 'VALID' &&
      row[COL.SCORE] &&
      parseInt(row[COL.SCORE]) >= 60 &&
      ['S', 'A', 'B'].includes(row[COL.TIER]) &&
      (!row[COL.STATUS] || row[COL.STATUS] === '')
    )
    .sort((a, b) => parseInt(b.row[COL.SCORE]) - parseInt(a.row[COL.SCORE]));
  
  console.log(`🎯 Kandidat eligible: ${candidates.length}`);
  
  if (candidates.length === 0) {
    console.log('ℹ️ Tidak ada kandidat baru');
    return;
  }
  
  // Load episode.json untuk tau episode berapa sekarang
  const episodePath = path.join(process.cwd(), '../../packages/episodes/ep01-pendirian/src/data/episode.json');
  let currentEpisode = 1;
  if (fs.existsSync(episodePath)) {
    const ep = JSON.parse(fs.readFileSync(episodePath, 'utf-8'));
    currentEpisode = ep.nomor;
  }
  const nextEpisode = currentEpisode + 1;
  
  // Ambil top 50 untuk episode berikutnya (atau semua jika < 50)
  const selected = candidates.slice(0, 50);
  
  // Generate officials data
  const officials = selected.map(({ row, rowNum }) => {
    const nama = row[COL.PARSED_NAMA];
    const jabatan = row[COL.PARSED_JABATAN];
    const alasan = row[COL.PARSED_ALASAN];
    const tier = row[COL.TIER];
    const score = parseInt(row[COL.SCORE]);
    
    // Assign role berdasarkan tier & jabatan
    let finalJabatan = jabatan;
    if (tier === 'S' && !jabatan.toLowerCase().includes('menteri')) {
      finalJabatan = `Menteri ${jabatan}`;
    } else if (tier === 'A' && !jabatan.toLowerCase().includes('gubernur')) {
      finalJabatan = `Gubernur ${jabatan}`;
    }
    
    return {
      id: generateId(),
      nama,
      jabatan: finalJabatan,
      alasan,
      sumber: {
        platform: row[COL.PLATFORM],
        commentId: row[COL.COMMENT_ID],
        authorHandle: row[COL.AUTHOR_HANDLE],
        authorAvatarUrl: row[COL.AUTHOR_AVATAR] || undefined,
        likes: parseInt(row[COL.LIKES]) || 0,
        timestamp: row[COL.TIMESTAMP],
      },
      status: 'dipilih',
      episodeMasuk: nextEpisode,
      avatarSeed: `seed_${row[COL.COMMENT_ID]}`,
      warnaTema: getRoleColor(finalJabatan),
    };
  });
  
  // Update status di sheets
  const updates = selected.map(({ rowNum }) => ({
    range: `${SHEET_NAME}!R${rowNum}:T${rowNum}`,
    values: [['dipilih', nextEpisode.toString(), '']],
  }));
  
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: 'RAW', data: updates },
    });
    console.log(`📝 ${updates.length} baris di-update status='dipilih'`);
  }
  
  // Load existing officials
  const officialsPath = path.join(process.cwd(), `../../packages/episodes/ep01-pendirian/src/data/officials.json`);
  let existingOfficials = [];
  if (fs.existsSync(officialsPath)) {
    existingOfficials = JSON.parse(fs.readFileSync(officialsPath, 'utf-8'));
  }
  
  // Merge (avoid duplicates by commentId)
  const existingIds = new Set(existingOfficials.map(o => o.sumber.commentId));
  const newOfficials = officials.filter(o => !existingIds.has(o.sumber.commentId));
  const allOfficials = [...existingOfficials, ...newOfficials];
  
  // Save officials.json
  fs.writeFileSync(officialsPath, JSON.stringify(allOfficials, null, 2));
  console.log(`💾 officials.json updated: ${allOfficials.length} total (${newOfficials.length} baru)`);
  
  // Update lore.json dengan kabinet baru
  const lorePath = path.join(process.cwd(), `../../packages/episodes/ep01-pendirian/src/data/lore.json`);
  let lore = { kabinet: [] };
  if (fs.existsSync(lorePath)) {
    lore = JSON.parse(fs.readFileSync(lorePath, 'utf-8'));
  }
  
  // Build kabinet dari officials yang status dipilih
  const kabinet = allOfficials
    .filter(o => o.status === 'dipilih')
    .map(o => ({
      jabatan: o.jabatan,
      nama: o.nama,
      officialId: o.id,
    }));
  
  lore.kabinet = kabinet;
  lore.populasi = allOfficials.length;
  lore.updatedAt = new Date().toISOString();
  lore.versi = (lore.versi || 0) + 1;
  
  fs.writeFileSync(lorePath, JSON.stringify(lore, null, 2));
  console.log(`🏛️ lore.json updated: kabinet ${kabinet.length} pejabat, populasi ${lore.populasi}`);
  
  // Generate episode template untuk episode berikutnya
  const nextEpisodeDir = path.join(process.cwd(), `../../packages/episodes/ep${String(nextEpisode).padStart(2, '0')}-kabinet`);
  if (!fs.existsSync(nextEpisodeDir)) {
    fs.mkdirSync(nextEpisodeDir, { recursive: true });
    fs.mkdirSync(path.join(nextEpisodeDir, 'src', 'scenes'), { recursive: true });
    fs.mkdirSync(path.join(nextEpisodeDir, 'src', 'data'), { recursive: true });
    fs.mkdirSync(path.join(nextEpisodeDir, 'public'), { recursive: true });
    
    // Copy template files
    const templateFiles = [
      'package.json',
      'remotion.config.ts',
      'tsconfig.json',
      'src/composition.tsx',
    ];
    
    for (const file of templateFiles) {
      const src = path.join(process.cwd(), `../../packages/episodes/ep01-pendirian/${file}`);
      const dest = path.join(nextEpisodeDir, file);
      if (fs.existsSync(src)) {
        let content = fs.readFileSync(src, 'utf-8');
        content = content.replace(/ep01-pendirian/g, `ep${String(nextEpisode).padStart(2, '0')}-kabinet`);
        content = content.replace(/Pendirian NEGARA DIATAS AWAN/g, `Kabinet Pertama NEGARA DIATAS AWAN`);
        content = content.replace(/Episode 1/g, `Episode ${nextEpisode}`);
        fs.writeFileSync(dest, content);
      }
    }
    
    // Create empty data files
    fs.writeFileSync(path.join(nextEpisodeDir, 'src/data/officials.json'), JSON.stringify(newOfficials, null, 2));
    fs.writeFileSync(path.join(nextEpisodeDir, 'src/data/lore.json'), JSON.stringify(lore, null, 2));
    fs.writeFileSync(path.join(nextEpisodeDir, 'src/data/episode.json'), JSON.stringify({
      nomor: nextEpisode,
      judul: `Kabinet Pertama NEGARA DIATAS AWAN`,
      deskripsi: `${kabinet.length} pejabat terpilih diumumkan. Kantor menteri terbentuk. Undang-undang pertama disahkan.`,
      durasiTargetDetik: 180,
      script: [],
      officialsBaru: newOfficials,
      loreUpdate: { kabinet, populasi: allOfficials.length },
      assets: { models: [], textures: [], audio: [] },
      renderSettings: { resolution: [1920, 1080], fps: 30, codec: 'h264', crf: 22 },
      uploadTargets: ['youtube', 'instagram', 'facebook', 'tiktok'],
      status: 'draft',
    }, null, 2));
    
    console.log(`📁 Episode ${nextEpisode} template dibuat di ${nextEpisodeDir}`);
  }
  
  console.log('🎉 Sync selesai! Siap production episode berikutnya.');
}

main().catch(console.error);