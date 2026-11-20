#!/usr/bin/env node
/**
 * ElevenLabs Voiceover Generator untuk NEGARA DIATAS AWAN
 * Generate voiceover dari script episode.json
 * Output: WAV files di packages/assets/audio/
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const STABILITY = parseFloat(process.env.ELEVENLABS_STABILITY || '0.5');
const SIMILARITY_BOOST = parseFloat(process.env.ELEVENLABS_SIMILARITY_BOOST || '0.75');
const STYLE = parseFloat(process.env.ELEVENLABS_STYLE || '0.0');
const USE_SPEAKER_BOOST = process.env.ELEVENLABS_USE_SPEAKER_BOOST === 'true';

if (!API_KEY || !VOICE_ID) {
  console.error('❌ ELEVENLABS_API_KEY dan ELEVENLABS_VOICE_ID harus di-set di .env');
  process.exit(1);
}

const BASE_URL = 'https://api.elevenlabs.io/v1';
const OUTPUT_DIR = path.join(process.cwd(), 'packages/assets/audio');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateVoiceover(text, filename, voiceSettings = {}) {
  const url = `${BASE_URL}/text-to-speech/${VOICE_ID}?output_format=wav_48000`;
  
  const body = {
    text,
    model_id: MODEL_ID,
    voice_settings: {
      stability: voiceSettings.stability ?? STABILITY,
      similarity_boost: voiceSettings.similarity_boost ?? SIMILARITY_BOOST,
      style: voiceSettings.style ?? STYLE,
      use_speaker_boost: voiceSettings.use_speaker_boost ?? USE_SPEAKER_BOOST,
    },
  };
  
  console.log(`🎙️ Generating: ${filename}`);
  console.log(`   Text: "${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outPath, buffer);
  
  console.log(`✅ Saved: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return outPath;
}

// Voice settings per speaker
const SPEAKER_VOICE_SETTINGS = {
  narrator: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
  presiden: { stability: 0.4, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
  system: { stability: 0.7, similarity_boost: 0.6, style: 0.0, use_speaker_boost: true },
  warga: { stability: 0.5, similarity_boost: 0.7, style: 0.1, use_speaker_boost: true },
};

function getVoiceSettings(speaker) {
  return SPEAKER_VOICE_SETTINGS[speaker] || SPEAKER_VOICE_SETTINGS.narrator;
}

async function generateFromEpisode(episodePath) {
  const episode = JSON.parse(fs.readFileSync(episodePath, 'utf-8'));
  
  console.log(`📖 Generating voiceover for Episode ${episode.nomor}: ${episode.judul}`);
  console.log(`📝 ${episode.script.length} lines to process\n`);
  
  const results = [];
  
  for (const line of episode.script) {
    // Skip if already has voiceover file (optional: check assets.audio)
    const filename = `vo_${line.id}.wav`;
    const voiceSettings = getVoiceSettings(line.speaker || 'narrator');
    
    try {
      await generateVoiceover(line.textDisplay, filename, voiceSettings);
      results.push({ id: line.id, file: filename, success: true, speaker: line.speaker });
      
      // Rate limit: 1 request per second
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (error) {
      console.error(`❌ Failed ${line.id}:`, error.message);
      results.push({ id: line.id, file: filename, success: false, error: error.message });
    }
  }
  
  // Summary
  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Summary: ${success} success, ${failed} failed`);
  
  // Update episode.json with voiceover files
  const voiceoverFiles = results
    .filter(r => r.success)
    .map(r => r.file);
  
  episode.assets.audio = [
    ...episode.assets.audio.filter(a => !a.startsWith('vo_')),
    ...voiceoverFiles
  ];
  
  fs.writeFileSync(episodePath, JSON.stringify(episode, null, 2));
  console.log(`💾 Updated episode.json with ${voiceoverFiles.length} voiceover files`);
  
  return results;
}

// CLI
const args = process.argv.slice(2);
const episodePath = args[0] || path.join(process.cwd(), 'packages/episodes/ep01-pendirian/src/data/episode.json');

if (!fs.existsSync(episodePath)) {
  console.error(`❌ Episode file not found: ${episodePath}`);
  process.exit(1);
}

generateFromEpisode(episodePath).catch(console.error);