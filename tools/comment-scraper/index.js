#!/usr/bin/env node
/**
 * Comment Scraper untuk NEGARA DIATAS AWAN
 * Scrape komentar dari YouTube, Instagram, Facebook, TikTok
 * Simpan ke Google Sheets untuk scoring
 */

import { google } from 'googleapis';
import { config } from 'dotenv';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';

config();

// ============================================
// KONFIGURASI
// ============================================

const PLATFORMS = ['youtube', 'instagram', 'facebook', 'tiktok'];

/**
 * @typedef {Object} RawComment
 * @property {'youtube'|'instagram'|'facebook'|'tiktok'} platform
 * @property {string} commentId
 * @property {string} authorHandle
 * @property {string} authorName
 * @property {string} [authorAvatarUrl]
 * @property {string} text
 * @property {number} likes
 * @property {number} replies
 * @property {string} timestamp
 * @property {string} [videoId]
 * @property {string} [postId]
 */

/**
 * @typedef {Object} ParsedComment
 * @property {'youtube'|'instagram'|'facebook'|'tiktok'} platform
 * @property {string} commentId
 * @property {string} authorHandle
 * @property {string} authorName
 * @property {string} [authorAvatarUrl]
 * @property {string} text
 * @property {number} likes
 * @property {number} replies
 * @property {string} timestamp
 * @property {string} [videoId]
 * @property {string} [postId]
 * @property {{nama:string, jabatan:string, alasan:string, valid:boolean}} parsed
 */

// ============================================
// PARSER KOMENTAR
// ============================================

const FORMAT_REGEX = /^\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\s*$/;

function parseComment(text) {
  const match = text.match(FORMAT_REGEX);
  if (!match) {
    return { nama: '', jabatan: '', alasan: '', valid: false };
  }
  
  const [, nama, jabatan, alasan] = match;
  return {
    nama: nama.trim(),
    jabatan: jabatan.trim(),
    alasan: alasan.trim(),
    valid: nama.length > 0 && jabatan.length > 0 && alasan.length >= 10,
  };
}

// ============================================
// SCRAPER PER PLATFORM
// ============================================

// YouTube via yt-dlp (butuh yt-dlp terinstall)
async function scrapeYouTube(videoId, maxComments = 500) {
  const { execSync } = await import('child_process');
  try {
    const output = execSync(`yt-dlp --flat-playlist --get-comments "https://www.youtube.com/watch?v=${videoId}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    
    const lines = output.trim().split('\n');
    return lines.slice(0, maxComments).map((line, i) => {
      const [author, ...textParts] = line.split(': ');
      return {
        platform: 'youtube',
        commentId: `yt_${videoId}_${i}`,
        authorHandle: author.trim(),
        authorName: author.trim(),
        text: textParts.join(': ').trim(),
        likes: 0,
        replies: 0,
        timestamp: new Date().toISOString(),
        videoId,
      };
    });
  } catch (error) {
    console.error('YouTube scrape error:', error);
    return [];
  }
}

// Instagram via Graph API (butuh access token)
async function scrapeInstagram(postId, accessToken, maxComments = 200) {
  try {
    const url = `https://graph.instagram.com/${postId}/comments?fields=id,username,text,timestamp,like_count&access_token=${accessToken}&limit=${maxComments}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.data?.map((c) => ({
      platform: 'instagram',
      commentId: c.id,
      authorHandle: c.username,
      authorName: c.username,
      text: c.text,
      likes: c.like_count || 0,
      replies: 0,
      timestamp: c.timestamp,
      postId,
    })) || [];
  } catch (error) {
    console.error('Instagram scrape error:', error);
    return [];
  }
}

// Facebook via Graph API
async function scrapeFacebook(postId, accessToken, maxComments = 200) {
  try {
    const url = `https://graph.facebook.com/${postId}/comments?fields=id,from,message,created_time,like_count&access_token=${accessToken}&limit=${maxComments}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.data?.map((c) => ({
      platform: 'facebook',
      commentId: c.id,
      authorHandle: c.from?.name || 'unknown',
      authorName: c.from?.name || 'unknown',
      text: c.message,
      likes: c.like_count || 0,
      replies: 0,
      timestamp: c.created_time,
      postId,
    })) || [];
  } catch (error) {
    console.error('Facebook scrape error:', error);
    return [];
  }
}

// TikTok - manual only (anti-scraping), gunakan file export manual
async function scrapeTikTokManual(jsonPath) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    return data.comments?.map((c, i) => ({
      platform: 'tiktok',
      commentId: `tt_${c.cid || i}`,
      authorHandle: c.user?.unique_id || `user_${i}`,
      authorName: c.user?.nickname || `User ${i}`,
      text: c.text,
      likes: c.digg_count || 0,
      replies: c.reply_comment_total || 0,
      timestamp: new Date(c.create_time * 1000).toISOString(),
    })) || [];
  } catch (error) {
    console.error('TikTok manual parse error:', error);
    return [];
  }
}

// ============================================
// GOOGLE SHEETS WRITER
// ============================================

async function writeToSheets(comments) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Comments!A:Z';
  
  const rows = comments.map(c => [
    c.platform,
    c.commentId,
    c.authorHandle,
    c.authorName,
    c.authorAvatarUrl || '',
    c.text,
    c.likes,
    c.replies,
    c.timestamp,
    c.videoId || c.postId || '',
    c.parsed.nama,
    c.parsed.jabatan,
    c.parsed.alasan,
    c.parsed.valid ? 'VALID' : 'INVALID',
    '', // score (diisi oleh llm-scorer)
    '', // status (dipilih/cadangan/ditolak)
    '', // episodeMasuk
    '', // avatarSeed
    '', // warnaTema
  ]);
  
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });
  
  console.log(`✅ ${rows.length} komentar ditulis ke Google Sheets`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');
  
  if (testMode) {
    console.log('🧪 Test mode: parsing sample comments...');
    const samples = [
      'Budi | Menteri Gravitasi | Supaya orang tidak jatuh ke bumi saat tidur',
      'Siti | Gubernur Awan Barat | Awan barat butuh pengelola yang ngerti angin',
      'Invalid comment tanpa format',
      'Ahmad|Menteri Cuaca|Biar hujan hanya di weekend',
      '  Dewi  |  Kepala Biro Mimpi  |  Mimpi warga harus tercatat dan dilindungi  ',
    ];
    samples.forEach(s => {
      const parsed = parseComment(s);
      console.log(`"${s}" →`, parsed);
    });
    return;
  }
  
  // Config dari env
  const youtubeVideoId = process.env.YOUTUBE_VIDEO_ID;
  const instagramPostId = process.env.INSTAGRAM_POST_ID;
  const instagramToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const facebookPostId = process.env.FACEBOOK_POST_ID;
  const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const tiktokJsonPath = process.env.TIKTOK_JSON_PATH;
  
  if (!youtubeVideoId && !instagramPostId && !facebookPostId && !tiktokJsonPath) {
    console.error('❌ Set minimal satu env: YOUTUBE_VIDEO_ID, INSTAGRAM_POST_ID, FACEBOOK_POST_ID, TIKTOK_JSON_PATH');
    process.exit(1);
  }
  
  const limit = pLimit(3);
  const allComments = [];
  
  // Scrape paralel
  const tasks = [];
  
  if (youtubeVideoId) {
    tasks.push(limit(() => scrapeYouTube(youtubeVideoId)));
  }
  if (instagramPostId && instagramToken) {
    tasks.push(limit(() => scrapeInstagram(instagramPostId, instagramToken)));
  }
  if (facebookPostId && facebookToken) {
    tasks.push(limit(() => scrapeFacebook(facebookPostId, facebookToken)));
  }
  if (tiktokJsonPath) {
    tasks.push(limit(() => scrapeTikTokManual(tiktokJsonPath)));
  }
  
  const results = await Promise.all(tasks);
  results.forEach(r => allComments.push(...r));
  
  console.log(`📥 Total komentar mentah: ${allComments.length}`);
  
  // Parse & filter
  const parsedComments = allComments.map(c => ({
    ...c,
    parsed: parseComment(c.text),
  }));
  
  const validComments = parsedComments.filter(c => c.parsed.valid);
  console.log(`✅ Komentar valid format: ${validComments.length}`);
  
  // Dedup: 1 akun = 1 entri (ambil yang like paling tinggi)
  const byAuthor = new Map();
  for (const c of validComments) {
    const key = `${c.platform}:${c.authorHandle}`;
    const existing = byAuthor.get(key);
    if (!existing || c.likes > existing.likes) {
      byAuthor.set(key, c);
    }
  }
  
  const deduped = Array.from(byAuthor.values());
  console.log(`🔄 Setelah dedup (1 akun 1 entri): ${deduped.length}`);
  
  // Simpan ke file untuk backup
  const backupPath = path.join(process.cwd(), `comments-backup-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(deduped, null, 2));
  console.log(`💾 Backup disimpan: ${backupPath}`);
  
  // Tulis ke Google Sheets
  if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    await writeToSheets(deduped);
  } else {
    console.log('⚠️ Google Sheets tidak dikonfigurasi, lewati write.');
  }
  
  console.log('🎉 Selesai! Jalankan `npm run score:comments` untuk scoring LLM.');
}

main().catch(console.error);