#!/usr/bin/env node
/**
 * LLM Scorer untuk NEGARA DIATAS AWAN
 * Baca komentar dari Google Sheets, skor dengan LLM, update score & status
 */

import { google } from 'googleapis';
import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Comments';
const SCORE_COLUMN = 14; // 0-indexed: column O
const STATUS_COLUMN = 15; // column P
const EPISODE_COLUMN = 16; // column Q

// ============================================
// PROMPT SCORING
// ============================================

const SCORING_PROMPT = `Kamu adalah sistem seleksi pejabat untuk NEGARA DIATAS AWAN — negara fiksi kolaboratif di mana warga dipilih dari kolom komentar.

Tugas: Beri skor 0-100 untuk kandidat berdasarkan:
- Format benar (10 poin): NAMA | JABATAN | ALASAN
- Kreativitas jabatan (25 poin): Unik, cocok tema "negara di awan", bukan jabatan standar
- Kualitas alasan (25 poin): Lucu, insightful, filosofis, atau menginspirasi
- Engagement (15 poin): Likes + replies relatif
- Keunikan nama (10 poin): Bukan nama generik "User123"
- Keselarasan lore (15 poin): Cocok dengan dunia NEGARA DIATAS AWAN (awan, gravitasi, terbang, angin, mimpi, bandwidth, cuaca, humor, arsip)

Output HANYA JSON:
{
  "score": 0-100,
  "reasoning": "Alasan singkat 1-2 kalimat",
  "recommendedRole": "Jabatan yang lebih cocok jika jabatan asli kurang pas",
  "tier": "S|A|B|C|D"  // S=≥90, A=80-89, B=70-79, C=60-69, D=<60
}`;

// ============================================
// MAIN
// ============================================

async function main() {
  if (!SPREADSHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID tidak diset');
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY tidak diset');
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
    console.log('📭 Tidak ada data untuk di-score');
    return;
  }
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  console.log(`📊 Memproses ${dataRows.length} baris...`);
  
  const updates = [];
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const rowNum = i + 2; // 1-indexed + header
    
    // Skip jika sudah di-score
    if (row[SCORE_COLUMN] && row[SCORE_COLUMN] !== '') {
      continue;
    }
    
    const comment = {
      platform: row[0],
      authorHandle: row[2],
      authorName: row[3],
      text: row[5],
      likes: parseInt(row[6]) || 0,
      replies: parseInt(row[7]) || 0,
      parsedNama: row[10],
      parsedJabatan: row[11],
      parsedAlasan: row[12],
      isValid: row[13] === 'VALID',
    };
    
    if (!comment.isValid) {
      // Invalid format = score 0
      updates.push({
        range: `${SHEET_NAME}!O${rowNum}:Q${rowNum}`,
        values: [[0, 'Format tidak valid', 'D']],
      });
      continue;
    }
    
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.SCORING_MODEL || 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: SCORING_PROMPT },
          { role: 'user', content: JSON.stringify(comment) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 200,
      });
      
      const result = JSON.parse(completion.choices[0].message.content);
      
      updates.push({
        range: `${SHEET_NAME}!O${rowNum}:Q${rowNum}`,
        values: [[result.score, result.reasoning, result.tier]],
      });
      
      console.log(`✅ Row ${rowNum}: ${comment.parsedNama} | ${comment.parsedJabatan} → Score: ${result.score} (${result.tier})`);
      
      // Rate limit
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error) {
      console.error(`❌ Row ${rowNum} error:`, error.message);
      updates.push({
        range: `${SHEET_NAME}!O${rowNum}:Q${rowNum}`,
        values: [[0, `Error: ${error.message}`, 'D']],
      });
    }
  }
  
  // Batch update
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'RAW',
        data: updates,
      },
    });
    console.log(`🎉 ${updates.length} baris di-update dengan score!`);
  } else {
    console.log('ℹ️ Tidak ada baris baru untuk di-score');
  }
  
  console.log('✅ Scoring selesai. Jalankan `npm run sync:sheet` untuk sinkron ke episode builder.');
}

main().catch(console.error);