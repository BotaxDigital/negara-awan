#!/usr/bin/env node
/**
 * Helper: Generate YouTube Refresh Token
 * Jalankan sekali: node get-youtube-token.js
 * Ikuti URL di browser, authorize, copy code, paste di sini
 */

import { google } from 'googleapis';
import { createInterface } from 'readline';
import { config } from 'dotenv';
import fs from 'fs';

config();

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Set YOUTUBE_CLIENT_ID dan YOUTUBE_CLIENT_SECRET di .env dulu');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob' // Out-of-band flow
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtubepartner',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('🔗 Buka URL ini di browser:');
console.log(authUrl);
console.log('');

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.question('📋 Paste authorization code di sini: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    
    console.log('\n✅ Tokens received:');
    console.log(`Access Token: ${tokens.access_token}`);
    console.log(`Refresh Token: ${tokens.refresh_token}`);
    console.log(`Expiry: ${tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'N/A'}`);
    
    // Save to .env
    const envPath = '.env';
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }
    
    const updateEnv = (key, value) => {
      const regex = new RegExp(`^${key}=.*`, 'm');
      const line = `${key}=${value}`;
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, line);
      } else {
        envContent += (envContent.endsWith('\n') ? '' : '\n') + line + '\n';
      }
    };
    
    updateEnv('YOUTUBE_REFRESH_TOKEN', tokens.refresh_token || '');
    
    fs.writeFileSync(envPath, envContent);
    console.log(`\n💾 Refresh token disimpan ke ${envPath}`);
    console.log('🎉 YouTube upload siap digunakan!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
});