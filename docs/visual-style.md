# Visual Style Guide — NEGARA DIATAS AWAN

> **Tujuan:** Konsistensi visual di semua episode, asset, platform. Semua artist/AI generate harus refer ke dokumen ini.

---

## 🎨 Palet Warna Nasional

| Nama | Hex | RGB | Penggunaan |
|------|-----|-----|------------|
| **Biru Langit (Primary)** | `#1E3A5F` | 30, 58, 95 | Background malam, tekst utama, bendera atas, Presiden |
| **Biru Awan (Secondary)** | `#7DD3FC` | 125, 211, 252 | UI hologram, partikel awan, Menteri, glow effects |
| **Kuning Matahari (Accent)** | `#FDE047` | 253, 224, 71 | Highlight, bendera bawah, bintang, CTA button, Gubernur |
| **Putih Awan (Background)** | `#F0F9FF` | 240, 249, 255 | Background terang, awan, halaman putih |
| **Hampir Hitam (Text)** | `#0F172A` | 15, 23, 42 | Teks body, outline, silhouette |
| **Hijau Sukses** | `#22C55E` | 34, 197, 94 | Status valid, konfirmasi, tumbuh |
| **Orange Warning** | `#F97316` | 249, 115, 22 | Warning, countdown, tier C |
| **Merah Error** | `#EF4444` | 239, 68, 68 | Error, invalid, tier D |

### Warna per Jabatan (Identitas Visual)
| Jabatan | Warna Utama | Warna Glow |
|---------|-------------|------------|
| Presiden | `#1E3A5F` | `#FDE047` |
| Menteri | `#7DD3FC` | `#FDE047` |
| Gubernur | `#FDE047` | `#1E3A5F` |
| Kepala Biro/Dirjen | `#A855F7` | `#FDE047` |
| Warga | `#64748B` | `#7DD3FC` |

---

## 🎭 Style Visual: Low-Poly Stylized 3D

### Karakteristik
- **Geometry:** Low-poly (blocky, segi segi terlihat), tidak photorealistic
- **Shading:** Cel-shaded / flat shading + subtle gradient
- **Edge:** Hard edges diprioritaskan, smooth shading hanya untuk organik (awan, karakter)
- **Polycount target:** < 5k tris per bangunan, < 2k tris per karakter
- **Texture:** Procedural / solid color + vertex color, **no PBR textures** (ringan render)

### Environment: Kota Awan (Stratos)
- **Bangunan:** Menara geometris (silinder, kerucut, prisma) + jendela glowing
- **Jalan:** Tidak ada jalan tanah — **jembatan awan** & **lift angin** antar bangunan
- **Vegetasi:** Pohon low-poly bentuk awan (bola-bola cluster), warna pastel
- **Air:** Danau awan (reflektif, partikel), tidak air fisik
- **Langit:** Gradient biru malam → biru siang → oranye senja (time-lapse per episode)

### Awan & Atmosfer
- **Volumetric cloud** via particle system (bukan mesh)
- **Layer:** 3 layer (dekat, menengah, jauh) parallax
- **Animasi:** Gerak lambat horizontal + naik turun subtle (breathing)
- **Warna:** Putih dengan tint biru/kuning sesuai waktu

---

## 🎬 Cinematography Rules

### Camera
| Shot | Penggunaan | Durasi |
|------|------------|--------|
| **Wide Aerial** | Establishing shot kota awan | 3-5 detik |
| **Dolly Forward** | Reveal monumen/bangunan | 4-6 detik |
| **Low Angle** | Presiden/Monumen (heroic) | 2-3 detik |
| **Eye Level** | Dialog, UI hologram | 5-8 detik |
| **Split Screen** | Form kiri + komentar kanan | 8-10 detik |
| **Fast Cuts** | Montage bangunan tumbuh | 0.5-1 detik/cut |
| **Static Centered** | CTA, logo, tagline | 3-4 detik |

### Camera Movement
- **Smooth ease-in-out** semua movement (no linear)
- **Parallax** background saat kamera dolly
- **Depth of field** shallow untuk close-up karakter
- **No handheld shake** (kecuali stylistic: "gempa awan")

### Lighting
- **Key Light:** Directional (matahari) — posisi berubah per episode (pagi/siang/sore/malam)
- **Fill Light:** Hemisphere (langit biru + tanah gelap) — intensity 0.3
- **Rim Light:** Backlight emas untuk silhouet hero
- **Volumetric:** God rays melalui awan (opsional, berat render)
- **UI Hologram:** Self-illuminated, additive blending

---

## 🧱 Asset Standards

### 3D Models (glTF/GLB)
- **Format:** `.glb` (binary, single file)
- **Up axis:** Y-up
- **Units:** Meter (1 unit = 1 meter)
- **Naming:** `kebab-case` (contoh: `presiden-avatar.glb`, `monumen-awan.glb`)
- **LOD:** 3 level (high/med/low) untuk bangunan besar
- **Pivot:** Center bottom untuk bangunan, center mass untuk karakter

### Animations
- **Format:** glTF animation tracks
- **Naming:** `idle`, `walk`, `oath`, `talk`, `wave`, `build`
- **Frame rate:** 30 fps (match Remotion)
- **Loop:** `idle`, `walk`, `talk` = loop; `oath`, `wave` = once

### Textures (jika dipakai)
- **Max resolution:** 512x512 (UI), 1024x1024 (hero)
- **Format:** WebP lossless atau PNG
- **Channels:** RGB + Alpha (jika transparan)
- **Naming:** `{model}_baseColor.webp`, `{model}_emissive.webp`

### Audio
- **Voiceover:** WAV 48kHz 16-bit mono (VoiceStudio output)
- **SFX:** WAV 48kHz 16-bit stereo
- **Music:** MP3 320kbps / OGG Vorbis
- **Loudness:** -14 LUFS (YouTube standard)
- **Naming:** `vo_narrator_ep01_line01.wav`, `sfx_flag_raise.wav`, `music_theme_main.mp3`

---

## 🖥️ Render Settings (Remotion)

| Setting | Value |
|---------|-------|
| **Resolution** | 1920×1080 (16:9) |
| **FPS** | 30 |
| **Codec** | H.264 (libx264) |
| **CRF** | 22 (high) / 24 (Telegram compress) |
| **Preset** | medium |
| **Pixel Format** | yuv420p |
| **Audio** | AAC 128kbps stereo |
| **Faststart** | Enabled (web streaming) |

### Platform Variants
| Platform | Resolution | Duration | Notes |
|----------|------------|----------|-------|
| YouTube | 1920×1080 | 3:00 | Full, horizontal |
| Instagram Reels | 1080×1920 | 3:00 | Vertical crop (safe zone 4:5 center) |
| Facebook Reels | 1080×1920 | 3:00 | Same as IG |
| TikTok | 1080×1920 | 3:00 | Vertical, cover custom, pinned comment |
| Telegram | 720×1280 | 3:00 | Compressed CRF24, <50MB |

---

## 🎨 AI Generation Prompts (ComfyUI/FLUX)

### Bangunan Low-Poly
```
low poly stylized cloud city building, geometric tower, cylindrical with conical roof, glowing windows, pastel blue white yellow palette, flat shading, hard edges, vertex colors, no textures, isometric view, unity game asset style --no photorealistic --no pbr --no round shapes
```

### Karakter (Presiden/Warga)
```
low poly stylized character, indonesian features, presidential sash, simple geometry, flat shaded, vertex colors, rigged for animation, 2000 tris, cel shaded, pastel skin tones, expressive eyes --no realistic --no high poly --no textures
```

### Bendera & Lambang (Vector)
```
flag design, three horizontal stripes deep sky blue white golden yellow, center dark blue circle with 7 white stars ring, vector flat design, 3:2 ratio --no gradient --no texture --no 3d
```
```
coat of arms, phoenix rising holding scroll, stylized cloud mountain tower behind, circular border 7 stars motto 'MERDEKA DARI GRAVITASI', vector minimal emblem style --no photo --no 3d --no gradient
```

### UI Hologram
```
futuristic holographic UI panel, translucent cyan blue, grid lines, data cards, constitution scroll animation, sci-fi but warm, Indonesia aesthetic, 16:9 --no cold sterile --no western sci-fi tropes
```

---

## ♿ Accessibility

- **Color contrast:** Minimum 4.5:1 (text vs background)
- **Colorblind safe:** Palet diuji deuteranopia/protanopia (biru-kuning aman)
- **Subtitle:** Selalu ada (Indonesia + English)
- **Audio description:** Opsional untuk platform yang support
- **Reduced motion:** Opsi `prefers-reduced-motion` untuk web player

---

## 📋 Asset Checklist per Episode

- [ ] Presiden avatar (glb + animasi)
- [ ] Monument/monumen utama
- [ ] 5-10 bangunan reusable (kantor menteri, rumah warga, dll)
- [ ] Bendera & lambang (SVG + GLB)
- [ ] UI hologram components (panel, card, scroll, button)
- [ ] Particle systems (awan, confetti, light particles, construction dust)
- [ ] Voiceover all lines (narrator, presiden, system)
- [ ] SFX pack (flag, oath glow, building grow, notif, typing)
- [ ] Music tracks (tema, epik, teaser, outro)
- [ ] Cover art (YouTube thumbnail, TikTok cover, IG story)