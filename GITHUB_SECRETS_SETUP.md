# GitHub Actions Secrets Setup — NEGARA DIATAS AWAN

> **Required untuk auto-pipeline & cloud render**

## 🔐 Secrets yang Dibutuhkan

### 1. Google Sheets (Comment Pipeline)
| Secret Name | Value | Cara Dapatkan |
|-------------|-------|---------------|
| `GOOGLE_SHEET_ID` | ID spreadsheet (dari URL) | Buka Sheets → URL: `https://docs.google.com/spreadsheets/d/{ID}/edit` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON service account (full) | Google Cloud Console → IAM → Service Accounts → Create Key (JSON) |

**Setup Service Account:**
1. Google Cloud Console → New Project
2. Enable **Google Sheets API**
3. Create Service Account → Editor role
4. Download JSON key
5. Share spreadsheet ke email service account (Editor)

### 2. LLM Scoring (OpenRouter)
| Secret Name | Value |
|-------------|-------|
| `OPENAI_API_KEY` | `sk-or-xxxxx` (dari openrouter.ai) |
| `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` |
| `SCORING_MODEL` | `openai/gpt-4o-mini` |

### 3. Social Media Scraping
| Secret Name | Platform | Cara Dapatkan |
|-------------|----------|---------------|
| `YOUTUBE_VIDEO_ID` | YouTube | ID video dari URL: `youtube.com/watch?v={ID}` |
| `INSTAGRAM_POST_ID` | Instagram | Post ID dari Graph API Explorer |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram | Long-lived token (60 hari) dari Meta Developer |
| `FACEBOOK_POST_ID` | Facebook | Post ID dari Graph API |
| `FACEBOOK_ACCESS_TOKEN` | Facebook | Page access token |
| `TIKTOK_JSON_PATH` | TikTok | Path file JSON export manual (optional) |

### 4. YouTube Upload
| Secret Name | Cara Dapatkan |
|-------------|---------------|
| `YOUTUBE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 Client ID (Desktop app) |
| `YOUTUBE_CLIENT_SECRET` | Dari OAuth client yang sama |
| `YOUTUBE_REFRESH_TOKEN` | Jalankan `node packages/render-pipeline/get-youtube-token.js` lokal |

### 5. Instagram/Facebook Upload
| Secret Name | Cara Dapatkan |
|-------------|---------------|
| `INSTAGRAM_ACCESS_TOKEN` | Meta Developer → Instagram Basic Display → Long-lived token |
| `INSTAGRAM_USER_ID` | Business/Creator account ID |
| `FACEBOOK_ACCESS_TOKEN` | Page access token dari Graph API Explorer |
| `FACEBOOK_PAGE_ID` | ID halaman Facebook |

### 6. Telegram Bot
| Secret Name | Cara Dapatkan |
|-------------|---------------|
| `TELEGRAM_BOT_TOKEN` | @BotFather → `/newbot` → copy token |
| `TELEGRAM_CHAT_ID` | `@botax_claude_bot` atau numeric ID dari @userinfobot |

### 7. ElevenLabs Voiceover
| Secret Name | Value |
|-------------|-------|
| `ELEVENLABS_API_KEY` | `sk_a6393f29cae163557d2cf205fb2bd39fda255747d635b468` |
| `ELEVENLABS_VOICE_ID` | `zmqLb9Ysr8fUvDD7hXK8` |

---

## 📝 Cara Tambah Secrets di GitHub

1. Buka repo di GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** → Paste name & value
4. Repeat untuk semua secrets di atas

---

## ✅ Checklist Setup

- [ ] Google Sheets API enabled
- [ ] Service Account JSON added
- [ ] Spreadsheet shared ke service account email
- [ ] OpenRouter API key added
- [ ] YouTube OAuth configured (lokal dulu untuk refresh_token)
- [ ] Meta Developer apps created (IG + FB)
- [ ] Telegram bot created
- [ ] ElevenLabs API key verified
- [ ] All secrets added di GitHub

---

## 🚀 Test Pipeline

Setelah secrets disetup:
1. Buka **Actions** tab di GitHub
2. Pilih **Comment Pipeline (Auto)**
3. **Run workflow** → pilih `full` → **Run workflow**
4. Monitor logs untuk error

---

## 💰 Estimasi Biaya GitHub Actions

| Workflow | Frekuensi | Durasi | Biaya/bulan (GitHub Free = 2000 min) |
|----------|-----------|--------|--------------------------------------|
| Scrape | 1×/minggu | 5 min | ~20 min |
| Score (LLM) | 1×/minggu | 10 min | ~40 min |
| Sync | 1×/minggu | 2 min | ~8 min |
| Render (Blender) | 1×/minggu | 30 min | ~120 min |
| **Total** | | | **~188 min/bulk** (dalam free tier) |

---

## 🔧 Troubleshooting

| Error | Solusi |
|-------|--------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` invalid | Pastikan JSON valid, tidak ada newline extra |
| `OPENAI_API_KEY` rate limit | Upgrade OpenRouter plan atau ganti model |
| Blender render timeout | GitHub Actions limit 6h, kurangi frames atau upgrade runner |
| YouTube upload failed | Refresh token expired → generate baru lokal |
| Telegram notify failed | Bot belum di-add ke channel/grup target |