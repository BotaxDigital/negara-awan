# Episode 1 Completion Checklist — NEGARA DIATAS AWAN

> **Target: Render & Upload Episode 1 "Pendirian NEGARA DIATAS AWAN"**
> **Durasi: 3 menit (180 detik) | Text-only + BGM/SFX | Low-poly 3D**

---

## ✅ Sudah Selesai (Codebase Ready)

| Area | Status | File/Path |
|------|--------|-----------|
| **Project Structure** | ✅ | `negara-awan/` monorepo |
| **Core Types (TS)** | ✅ | `packages/core/src/index.ts` |
| **Episode 1 Data** | ✅ | `packages/episodes/ep01-pendirian/src/data/episode.json` |
| **Lore Bible** | ✅ | `docs/lore-bible.md` |
| **Visual Style Guide** | ✅ | `docs/visual-style.md` |
| **Production Calendar** | ✅ | `docs/production-calendar.md` |
| **Script (7 scenes)** | ✅ | Text-only, 180 detik, ~390 kata |
| **Scene Components** | ✅ | 7 scenes + 10 reusable components |
| **Comment Scraper** | ✅ | `tools/comment-scraper/index.js` |
| **LLM Scorer** | ✅ | `tools/llm-scorer/index.js` |
| **Sheet Sync** | ✅ | `tools/sheet-sync/index.js` |
| **Render Pipeline** | ✅ | `packages/render-pipeline/` (render, compress, upload) |
| **ComfyUI Workflows** | ✅ | `packages/assets/comfyui-workflows/` (4 workflows) |
| **Blender Batch Script** | ✅ | `packages/assets/batch_images_to_glb.py` |
| **Audio Guide** | ✅ | `packages/assets/AUDIO_GUIDE.md` |

---

## 🔴 Owner Action Required (Manual Steps)

### 1. Environment Setup (10 menit)
```bash
cd ~/Documents/negara-awan
cp .env.example .env
# Edit .env isi:
# - GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_KEY
# - OPENAI_API_KEY (OpenRouter)
# - YOUTUBE_CLIENT_ID/SECRET/REFRESH_TOKEN
# - INSTAGRAM/FACEBOOK tokens
# - TELEGRAM_BOT_TOKEN
```

### 2. ComfyUI Asset Generation (30 menit)
```bash
# 1. Start ComfyUI
cd /path/to/ComfyUI
python main.py --listen 127.0.0.1 --port 8188

# 2. Import workflows dari packages/assets/comfyui-workflows/
#    - building_batch.json (8x)
#    - avatar_batch.json (3x) 
#    - flag_emblem.json (2x)
#    - ui_hologram.json (3x)

# 3. Generate semua (sequential, RTX 3050 6GB)
#    Output ke packages/assets/generated/

# 4. Convert ke GLB via Blender
blender --background --python packages/assets/batch_images_to_glb.py
# Atau: Buka Blender -> Scripting -> Paste script -> Run
```

### 3. Audio Files (15 menit)
- Generate/download 14 file audio per `packages/assets/AUDIO_GUIDE.md`
- Taruh di `packages/assets/audio/`
- Test loudness: `ffmpeg -i input.mp3 -af loudnorm=I=-14:TP=-1:LRA=11 output.mp3`

### 4. YouTube OAuth Token (5 menit)
```bash
cd ~/Documents/negara-awan
node packages/render-pipeline/get-youtube-token.js
# Ikuti URL, authorize, paste code
```

### 5. Test Render (30 menit)
```bash
cd ~/Documents/negara-awan

# Preview di Remotion Studio (live)
npm run dev:ep1
# Buka http://localhost:3000 -> cek semua scene

# Render production
npm run build:ep1
# Output: packages/episodes/assets/video/ep01-pendirian.mp4

# Compress untuk Telegram (<50MB)
node packages/render-pipeline/compress.js packages/episodes/assets/video/ep01-pendirian.mp4 -tg
# Output: .../ep01-pendirian-tg.mp4 (~13MB, 720x1280)
```

### 6. Upload & Launch (20 menit)
```bash
# Upload otomatis: YouTube, Instagram, Facebook, Telegram
node packages/render-pipeline/upload.js packages/episodes/assets/video/ep01-pendirian.mp4 ep01-pendirian

# Manual TikTok (WAJIB):
# - Video: packages/episodes/assets/video/ep01-pendirian-tg.mp4
# - Cover: buat cover-tiktok.png (1080x1920, logo + "Episode 1")
# - Caption: copy dari posting.md (buat manual)
# - Pinned comment: "Mau jadi pejabat? Format: NAMA | JABATAN | ALASAN"
# - Label: "AI-generated content" ✅
# - Post jam 11:30-13:00 atau 18:30-21:00 WIB
```

---

## 📊 Episode 1 Specs Summary

| Spec | Value |
|------|-------|
| **Judul** | Pendirian NEGARA DIATAS AWAN |
| **Durasi** | 180 detik (3 menit) |
| **Resolution** | 1920×1080 (YT/IG/FB), 1080×1920 (TikTok/Reels) |
| **FPS** | 30 |
| **Codec** | H.264 CRF 22 |
| **Audio** | Text overlay + BGM + SFX (no voiceover) |
| **Scenes** | 7 (Hook, Lore, Entrance, Sumpah, Daftar, Teaser, CTA) |
| **Key Visual** | Cloud city timelapse, Presiden avatar, Monumen, UI Hologram, Form komentar |
| **CTA** | "Komentar: NAMA \| JABATAN \| ALASAN" → jadi pejabat Episode 2 |

---

## 🎬 Scene Breakdown (Timing)

| Scene | Durasi | Key Visual | Text Overlay |
|-------|--------|------------|--------------|
| 1. Hook | 0:00-0:15 (15s) | Timelapse awan → kota → bendera | "Negara ini tidak punya tanah. Hanya awan, kode, dan kalian." |
| 2. Lore | 0:15-0:45 (30s) | UI hologram: nama, moto, konstitusi, bendera, lambang | Full lore text (ketik berjalan) |
| 3. Entrance | 0:45-0:55 (10s) | Presiden jalan ke podium | "Hari ini, Presiden pertama bersumpah..." |
| 4. Sumpah | 0:55-1:30 (35s) | Presiden angkat tangan, kitab hologram, partikel cahaya | Sumpah penuh dalam tanda kutip |
| 5. Daftar | 1:30-2:15 (45s) | Split screen: Form kiri, Komentar masuk kanan, Timer 7 hari | Format komentar + contoh |
| 6. Teaser | 2:15-2:45 (30s) | Siluet 50 orang, gedung tumbuh, tanda tanya Gubernur | "Minggu depan: 50 nama terpilih..." |
| 7. CTA | 2:45-3:00 (15s) | Logo zoom, handle sosmed, tombol Komentar | "Komentar sekarang. Negara ini milik kita." |

---

## 🚀 Post-Launch (Episode 2 Pipeline)

Setelah Episode 1 upload:
1. **Selasa**: `npm run scrape:comments` → `npm run score:comments`
2. **Rabu**: `npm run sync:sheet` → generate `ep02-kabinet` template + officials.json
3. **Kamis**: Tulis script Episode 2 (highlight 5-10 pejabat terpilih)
4. **Jumat**: Generate asset baru (kantor menteri, avatar pejabat)
5. **Sabtu**: Render & Upload Episode 2

---

## 📞 Troubleshooting Quick Ref

| Error | Solusi |
|-------|--------|
| `ComfyUI OOM` | `--lowvram` flag, generate sequential, restart ComfyUI |
| `Remotion render timeout` | Kurangi concurrency: `--concurrency=1`, render preview dulu (scale 0.5) |
| `YouTube quota exceeded` | Tunggu 24h, atau pakai service account berbeda |
| `Telegram 50MB limit` | Compress CRF 24-26, 720x1280, pastikan <50MB |
| `TikTok shadowban` | Variasi caption, jangan spam link, label AI content |
| `FFmpeg not found` | `winget install ffmpeg` atau download dari ffmpeg.org |

---

## 🎯 Definition of Done (Episode 1)

- [ ] `.env` configured dengan semua credentials
- [ ] ComfyUI assets generated (building, avatar, flag, UI) → GLB di `packages/assets/models/`
- [ ] Audio files (14 files) di `packages/assets/audio/`
- [ ] YouTube OAuth token working
- [ ] `npm run build:ep1` success → video.mp4 (1080p, ~50-80MB)
- [ ] Compress success → video-tg.mp4 (720p, <50MB)
- [ ] YouTube upload success (public, 19:00 WIB)
- [ ] Instagram Reels upload success
- [ ] Facebook Reels upload success
- [ ] Telegram bot upload success
- [ ] TikTok manual upload success (cover, caption, pinned comment, label AI)
- [ ] Episode 1 status di `episode.json` → `"published"`
- [ ] Google Sheet ready untuk komentar Episode 1

---

**Estimasi Total Waktu Owner: ~2 jam** (tergantung kecepatan ComfyUI & upload)
**Next Episode: Otomatis dari komentar netizen** 🌤️