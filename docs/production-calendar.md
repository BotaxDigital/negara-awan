# Production Calendar — NEGARA DIATAS AWAN

> **Schedule:** Rabu & Sabtu, 19:00 WIB (prime time Indonesia)
> **Pipeline:** 7 hari per episode (scrape → score → sync → render → upload)

---

## 📅 Mingguan Template (Episode Baru Setiap 2 Minggu)

| Hari | Aktivitas | Owner | Tools |
|------|-----------|-------|-------|
| **Senin** | 🎬 **Episode N Upload** (YouTube, IG, FB, TikTok manual, Telegram) | Owner | `npm run upload:all` |
| **Selasa** | 📊 **Scrape & Score Komentar Episode N** | Auto (cron) | `npm run scrape:comments` → `npm run score:comments` |
| **Rabu** | 🔄 **Sync Sheet → Officials & Lore Update** | Auto (cron) | `npm run sync:sheet` |
| **Kamis** | ✍️ **Script & Storyboard Episode N+1** | Owner | Manual (Notion/Obsidian) |
| **Jumat** | 🎨 **Asset Generation (ComfyUI) + Voiceover (VoiceStudio)** | Owner + AI | ComfyUI, VoiceStudio |
| **Sabtu** | 🎬 **Episode N+1 Upload** | Owner | `npm run upload:all` |
| **Minggu** | 🛠️ **Render Episode N+2 (background)** | Auto (GPU) | `npm run build:ep{N+2}` |

---

## 🗓️ Kalender 2026-2027 (Target)

### Bulan 1: Fondasi (Episode 1-4)
| Episode | Tanggal Upload | Judul | Fokus Utama |
|---------|----------------|-------|-------------|
| **Ep 1** | 2026-11-25 (Rabu) | **Pendirian NEGARA DIATAS AWAN** | Sumpah Presiden, Konstitusi, Buka Pendaftaran Kabinet |
| **Ep 2** | 2026-12-09 (Sabtu) | **Kabinet Pertama Terbentuk** | 50 pejabat diumumkan, Kantor menteri tumbuh, UU#1 |
| **Ep 3** | 2026-12-23 (Rabu) | **Provinsi & Gubernur** | Pembagian wilayah, Gubernur pertama, Infrastruktur |
| **Ep 4** | 2027-01-06 (Sabtu) | **Warga Bangun Rumah** | Partisipasi warga, properti virtual, komunitas |

### Bulan 2: Ekspansi (Episode 5-8)
| Episode | Tanggal Upload | Judul | Fokus Utama |
|---------|----------------|-------|-------------|
| **Ep 5** | 2027-01-20 (Rabu) | **Ekonomi Nimbus Launch** | Mata uang resmi, pasar ide, UMKM awan |
| **Ep 6** | 2027-02-03 (Sabtu) | **Undang-Undang #2: Hak Mimpi** | Legislative process via komentar |
| **Ep 7** | 2027-02-17 (Rabu) | **Diplomasi: Negara Tetangga** | Kolaborasi dengan creator lain (crossover) |
| **Ep 8** | 2027-03-03 (Sabtu) | **Festival Terbang Pertama** | Event besar, kompetisi desain bangunan |

### Bulan 3: Kemajemukan (Episode 9-12)
| Episode | Tanggal Upload | Judul | Fokus Utama |
|---------|----------------|-------|-------------|
| **Ep 9** | 2027-03-17 (Rabu) | **Krisis: Awan Menipis** | Conflict arc, solusi kolektif |
| **Ep 10** | 2027-03-31 (Sabtu) | **Konstitusi Amandemen** | Pasal 4 ditambah via musyawarah |
| **Ep 11** | 2027-04-14 (Rabu) | **Stratos jadi Metropolis** | Populasi 1000+, infrastructure scale |
| **Ep 12** | 2027-04-28 (Sabtu) | **Season 1 Finale: Negara Jadi** | Recap, stats, teaser Season 2 |

---

## ⏰ Timeline Detail per Episode (7 Hari)

### Hari 1-2: Scrape & Score (Otomatis via Cron)
```bash
# Cron: Selasa 02:00 WIB
npm run scrape:comments   # Ambil komentar YT/IG/FB/TikTok
npm run score:comments    # LLM scoring (OpenRouter/GPT-4o-mini)
```

### Hari 3: Sync & Generate (Otomatis via Cron)
```bash
# Cron: Rabu 02:00 WIB
npm run sync:sheet        # Update officials.json, lore.json, generate episode template
```

### Hari 4: Script & Storyboard (Manual - Owner)
- Baca `officials.json` baru → pilih highlight 5-10 pejabat
- Tulis script 3 menit (~390 kata) di `episode.json`
- Storyboard 8-10 shot di Notion/Obsidian
- Tentukan asset baru yang butuh generate

### Hari 5: Asset Generation (Owner + AI)
```bash
# ComfyUI batch generate:
# - 5 bangunan kantor menteri baru
# - Avatar 5 pejabat highlight
# - UI elements baru (stempel, segel, dll)
# VoiceStudio: generate voiceover script lines
```

### Hari 6: Production & Render (Owner)
- Import asset ke Remotion scenes
- Animate per storyboard
- `npm run build:ep{N}` (render ~30-60 menit di RTX 3050)
- Review video, fix glitch

### Hari 7: Upload & Promote (Owner)
```bash
# Compress untuk Telegram
node packages/render-pipeline/compress.js out/video.mp4 -tg

# Upload semua platform
npm run upload:all

# Manual TikTok:
# - Video: out/video-tg.mp4
# - Cover: assets/cover-tiktok.png
# - Caption: assets/posting.md
# - Pinned comment: format pendaftaran
```

---

## 🤖 Cron Jobs (Disarankan)

```yaml
# ~/.config/cron/negara-awan.yaml
jobs:
  - name: "scrape-score"
    schedule: "0 2 * * 2"  # Selasa 02:00
    command: "cd ~/Documents/negara-awan && npm run scrape:comments && npm run score:comments"
    
  - name: "sync-sheet"
    schedule: "0 2 * * 3"  # Rabu 02:00
    command: "cd ~/Documents/negara-awan && npm run sync:sheet"
    
  - name: "render-next"
    schedule: "0 3 * * 0"  # Minggu 03:00 (GPU idle)
    command: "cd ~/Documents/negara-awan && npm run build:ep{next}"
```

> **Note:** Setup cron via `cronjob_manage` skill atau systemd timer.

---

## 📊 KPI & Target per Episode

| Metrik | Target Ep 1-4 | Target Ep 5-8 | Target Ep 9-12 |
|--------|---------------|---------------|----------------|
| **Views YT (7 hari)** | 5.000 | 15.000 | 30.000 |
| **Komentar Valid** | 200 | 500 | 1.000 |
| **Pejabat Baru** | 50 | 30 | 20 |
| **Subscribers** | +500 | +1.000 | +2.000 |
| **Share/Retweet** | 100 | 300 | 500 |
| **TikTok Views** | 10.000 | 50.000 | 100.000 |

---

## 🚨 Kontingensi

| Risiko | Mitigasi |
|--------|----------|
| **GPU render timeout** | Render preview dulu (scale 0.5), batch malam |
| **ComfyUI VRAM OOM** | Generate sequential, gunakan `--lowvram` flag |
| **YouTube quota limit** | Schedule upload staggered, gunakan service account |
| **TikTok shadowban** | Variasi caption, hashtag, jangan spam link |
| **Komentar spam/bot** | Validasi manual top 50, captcha di form komentar |
| **Owner burnout** | Buffer 2 episode di avanti, ambil cuti 1 minggu per bulan |

---

## 📝 Catatan Production

- **Episode 1** = Foundation (hardest: setup pipeline, asset base)
- **Episode 2-3** = Momentum (banyak pejabat baru, excitement tinggi)
- **Episode 4-6** = Systems building (ekonomi, UU, diplomasi)
- **Episode 7-9** = Conflict & Resolution (narrative arc)
- **Episode 10-12** = Climax & Season Finale

> **Philosophy:** "Negara ini dibangun satu komentar per kali. Sabar, konsisten, nikmati prosesnya."