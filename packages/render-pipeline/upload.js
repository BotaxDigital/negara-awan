#!/usr/bin/env node
/**
 * Upload script untuk NEGARA DIATAS AWAN
 * Upload ke YouTube, Instagram, Facebook, TikTok (manual)
 * Telegram via Bot API
 */

import { google } from 'googleapis';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

config();

const VIDEO_FILE = process.argv[2];
const EPISODE = process.argv[3] || 'ep01-pendirian';

if (!VIDEO_FILE) {
  console.error('❌ Usage: node upload.js <video.mp4> [episode]');
  process.exit(1);
}

if (!fs.existsSync(VIDEO_FILE)) {
  console.error(`❌ File tidak ditemukan: ${VIDEO_FILE}`);
  process.exit(1);
}

// Load episode metadata
const episodePath = path.join(process.cwd(), `../episodes/${EPISODE}/src/data/episode.json`);
let episodeData = {};
if (fs.existsSync(episodePath)) {
  episodeData = JSON.parse(fs.readFileSync(episodePath, 'utf-8'));
}

const title = episodeData.judul || `NEGARA DIATAS AWAN - ${EPISODE}`;
const description = `${episodeData.deskripsi || ''}\n\n` +
  `🌐 NEGARA DIATAS AWAN\n` +
  `📜 Konstitusi: Hak Terbang | Musyawarah Digital | Awan Milik Angin\n` +
  `💬 Mau jadi pejabat? Komentar: NAMA | JABATAN | ALASAN\n` +
  `#NegaraDiAtasAwan #AnimasiIndonesia #WorldBuilding`;

const tags = ['NegaraDiAtasAwan', 'animasi', 'worldbuilding', 'indonesia', 'kolaboratif'];

// ============================================
// YOUTUBE UPLOAD
// ============================================

async function uploadYouTube() {
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_REFRESH_TOKEN) {
    console.log('⏭️ YouTube credentials tidak diset, skip');
    return;
  }
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  
  oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  
  const fileSize = fs.statSync(VIDEO_FILE).size;
  const chunkSize = 1024 * 1024 * 10; // 10MB chunks
  
  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId: '1', // Film & Animation
        defaultLanguage: 'id',
        defaultAudioLanguage: 'id',
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
        madeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(VIDEO_FILE),
      mimeType: 'video/mp4',
    },
  }, {
    // Resumable upload
    onUploadProgress: (progress) => {
      const percent = ((progress.bytesRead / fileSize) * 100).toFixed(1);
      process.stdout.write(`\r📤 YouTube: ${percent}%`);
    },
  });
  
  console.log(`\n✅ YouTube uploaded: https://youtu.be/${response.data.id}`);
  return response.data.id;
}

// ============================================
// INSTAGRAM UPLOAD (via Graph API - Reels)
// ============================================

async function uploadInstagram() {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_USER_ID) {
    console.log('⏭️ Instagram credentials tidak diset, skip');
    return;
  }
  
  // Step 1: Create media container
  const form = new FormData();
  form.append('video_url', `file://${VIDEO_FILE}`); // Butuh URL publik, gunakan hosting sementara
  form.append('caption', description);
  form.append('media_type', 'REELS');
  form.append('access_token', process.env.INSTAGRAM_ACCESS_TOKEN);
  
  // Note: Instagram API butuh video URL yang publikly accessible
  // Workaround: upload ke temp hosting dulu, atau gunakan Instagram Basic Display API
  
  console.log('⚠️ Instagram Reels butuh video URL publik. Gunakan manual upload atau setup hosting.');
}

// ============================================
// FACEBOOK UPLOAD (via Graph API)
// ============================================

async function uploadFacebook() {
  if (!process.env.FACEBOOK_ACCESS_TOKEN || !process.env.FACEBOOK_PAGE_ID) {
    console.log('⏭️ Facebook credentials tidak diset, skip');
    return;
  }
  
  // Similar to Instagram, butuh video URL
  console.log('⚠️ Facebook Reels butuh video URL publik. Gunakan manual upload.');
}

// ============================================
// TIKTOK - MANUAL ONLY
// ============================================

function tiktokInstructions() {
  const compressedFile = VIDEO_FILE.replace('.mp4', '-tg.mp4');
  const coverFile = path.join(path.dirname(VIDEO_FILE), 'cover-tiktok.png');
  const captionFile = path.join(path.dirname(VIDEO_FILE), 'posting.md');
  
  console.log('\n📱 TIKTOK UPLOAD (MANUAL):');
  console.log('   1. Buka TikTok Creator Center / App');
  console.log(`   2. Upload video: ${fs.existsSync(compressedFile) ? compressedFile : VIDEO_FILE}`);
  console.log(`   3. Cover: ${fs.existsSync(coverFile) ? coverFile : '(buat manual)'}`);
  console.log(`   4. Caption: ${fs.existsSync(captionFile) ? captionFile : '(copy dari posting.md)'}`);
  console.log('   5. Pin comment: "Mau jadi pejabat? Format: NAMA | JABATAN | ALASAN"');
  console.log('   6. Label: "AI-generated content" ✅');
  console.log('   7. Post jam 11:30-13:00 atau 18:30-21:00 WIB');
}

// ============================================
// TELEGRAM BOT UPLOAD
// ============================================

async function uploadTelegram() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || '@botax_claude_bot';
  
  if (!botToken) {
    console.log('⏭️ Telegram bot token tidak diset, skip');
    return;
  }
  
  const compressedFile = VIDEO_FILE.replace('.mp4', '-tg.mp4');
  const fileToUpload = fs.existsSync(compressedFile) ? compressedFile : VIDEO_FILE;
  
  const fileSize = fs.statSync(fileToUpload).size;
  if (fileSize > 50 * 1024 * 1024) {
    console.error(`❌ File terlalu besar untuk Telegram Bot API (${(fileSize/1024/1024).toFixed(1)}MB > 50MB)`);
    console.error('   Gunakan file terkompres (-tg.mp4) atau upload manual');
    return;
  }
  
  console.log(`📤 Upload ke Telegram: ${fileToUpload} (${(fileSize/1024/1024).toFixed(1)}MB)`);
  
  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('video', fs.createReadStream(fileToUpload));
  form.append('caption', description);
  form.append('supports_streaming', 'true');
  form.append('parse_mode', 'HTML');
  
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendVideo`,
      form,
      { headers: form.getHeaders(), timeout: 300000, onUploadProgress: (p) => {
        const percent = ((p.loaded / fileSize) * 100).toFixed(1);
        process.stdout.write(`\r📤 Telegram: ${percent}%`);
      }}
    );
    
    if (response.data.ok) {
      console.log(`\n✅ Telegram uploaded: Message ID ${response.data.result.message_id}`);
    } else {
      console.error('❌ Telegram error:', response.data.description);
    }
  } catch (error) {
    console.error('❌ Telegram upload error:', error.message);
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log(`🚀 Upload episode: ${EPISODE}`);
  console.log(`📹 File: ${VIDEO_FILE}`);
  console.log(`📝 Title: ${title}\n`);
  
  const targets = episodeData.uploadTargets || ['youtube', 'instagram', 'facebook', 'tiktok'];
  
  if (targets.includes('youtube')) await uploadYouTube();
  if (targets.includes('instagram')) await uploadInstagram();
  if (targets.includes('facebook')) await uploadFacebook();
  if (targets.includes('tiktok')) tiktokInstructions();
  if (targets.includes('telegram')) await uploadTelegram();
  
  console.log('\n🎉 Upload process selesai!');
  console.log('📋 Checklist manual:');
  console.log('   - [ ] TikTok upload + cover + caption + pinned comment');
  console.log('   - [ ] Instagram Reels upload (jika auto gagal)');
  console.log('   - [ ] Facebook Reels upload (jika auto gagal)');
  console.log('   - [ ] Community post / Story announce episode baru');
  console.log('   - [ ] Update kalender konten di data/kalender-konten.md');
}

main().catch(console.error);