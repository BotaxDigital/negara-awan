# BGM & SFX Guide — NEGARA DIATAS AWAN Episode 1

> **Text-only + BGM/SFX only** — No voiceover
> Semua file audio di `packages/assets/audio/` (buat folder ini)

---

## 🎵 Required Audio Files (Episode 1)

| File | Durasi | Mood | Keterangan |
|------|--------|------|------------|
| `musik_tema_awal.mp3` | 30-60s (loop) | Tenang, haru, misteri | Tema utama negara — ambient synth + piano lembut, 90-100 BPM |
| `musik_epik_naik.mp3` | 15-20s | Epik, bangkit, inspiratif | Saat sumpah presiden — orkestra/epic trailer style, crescendo |
| `musik_teaser.mp3` | 10-15s | Antisipasi, penasaran | Teaser episode 2 — pendek, cliffhanger vibe |
| `musik_outro.mp3` | 10-15s | Tenang, penutup | CTA akhir — fade out dari tema utama |
| `ambient_awans.mp3` | 60s+ (loop) | Ambien, tenang | Background suara angin/awan halus — terus menerus di episode |

---

## 🔊 SFX (Sound Effects)

| File | Durasi | Keterangan |
|------|--------|------------|
| `sfx_bendera_naik.mp3` | 1-2s | Kain berkibar + tiang logam, heroic |
| `sfx_sumpah_glow.mp3` | 2-3s | Partikel cahaya naik, magical chime |
| `sfx_gedung_tumbuh.mp3` | 1-2s | Bangunan muncul dari awan, low poly "pop" |
| `sfx_logo_pop.mp3` | 0.5-1s | Logo zoom in + subtle impact |
| `ui_hologram.mp3` | 1-2s | UI muncul, digital chime halus |
| `ui_typing.mp3` | 0.1s (loop) | Ketik text overlay, mechanical keyboard lembut |
| `notif_komentar.mp3` | 0.5s | Komentar masuk, "ping" lembut |
| `crowd_murmur.mp3` | 5-10s (loop) | Kerumunan digital, bisikan halus |
| `sfx_langkah.mp3` | 0.5s | Langkah presiden, echo di monumen |

---

## 🎼 Sourcing Options

### Option 1: AI Generate (Recommended)
- **Suno AI / Udio** — generate instrumental tracks via prompt
- **Stable Audio / AudioLDM** — local generation via ComfyUI (jika ada node)

**Prompts untuk Suno:**
```
musik_tema_awal: ambient electronic, soft piano, atmospheric synth, slow tempo 95 BPM, peaceful hopeful mysterious, no drums, loopable, indonesian fantasy vibe
musik_epik_naik: epic orchestral trailer, strings brass choir, crescendo building, inspirational heroic, 20 seconds, cinematic
musik_teaser: suspenseful ambient, minimal piano, tension building, cliffhanger ending, 10 seconds
musik_outro: ambient electronic fade out, soft piano resolving, peaceful closure, 15 seconds
```

### Option 2: Free Royalty-Free Libraries
- **Pixabay Music** (gratis komersial)
- **YouTube Audio Library** (gratis dengan atribusi)
- **Freesound.org** (SFX, CC0/CC-BY)
- **Incompetech** (Kevin MacLeod, CC-BY)

### Option 3: Manual Create (DAW)
- **LMMS / Cakewalk / Reaper (free)** — buat sendiri
- Loop 4 chord: Am - F - C - G (key A minor, peaceful)

---

## 📁 Folder Structure

```
packages/assets/
├── audio/
│   ├── musik_tema_awal.mp3
│   ├── musik_epik_naik.mp3
│   ├── musik_teaser.mp3
│   ├── musik_outro.mp3
│   ├── ambient_awans.mp3
│   ├── sfx_bendera_naik.mp3
│   ├── sfx_sumpah_glow.mp3
│   ├── sfx_gedung_tumbuh.mp3
│   ├── sfx_logo_pop.mp3
│   ├── ui_hologram.mp3
│   ├── ui_typing.mp3
│   ├── notif_komentar.mp3
│   ├── crowd_murmur.mp3
│   └── sfx_langkah.mp3
├── models/          # GLB files (dari Blender batch)
│   ├── building_01.glb
│   ├── building_02.glb
│   ├── ...
│   ├── avatar_01.glb
│   ├── flag_01.glb
│   └── ui_01.glb
└── comfyui-workflows/
    ├── building_batch.json
    ├── avatar_batch.json
    ├── flag_emblem.json
    └── ui_hologram.json
```

---

## ⚙️ Audio Specs (Technical)

| Spec | Value |
|------|-------|
| **Format** | MP3 (320kbps) atau OGG Vorbis |
| **Sample Rate** | 48 kHz (match video) |
| **Channels** | Stereo (musik), Mono (SFX) |
| **Loudness** | -14 LUFS (YouTube standard) |
| **Loop Points** | Seamless untuk ambient & musik loop |

---

## 🔧 Integration ke Remotion

Di `episode.json` sudah referensi `audioCue` per scene. Saat render, Remotion akan:
1. Load audio files via `<Audio>` component
2. Sync dengan timeline (frame-accurate)
3. Mix ke output video

**Contoh penggunaan di scene component:**
```tsx
import { Audio } from 'remotion';

<Audio
  src="../assets/audio/musik_tema_awal.mp3"
  startFrame={0}
  endFrame={180 * 30} // 3 menit
  volume={0.6}
/>
<Audio
  src="../assets/audio/sfx_bendera_naik.mp3"
  startFrame={120} // frame 4 detik
  volume={0.8}
/>
```

---

## ✅ Checklist Episode 1 Audio

- [ ] `musik_tema_awal.mp3` — loop 60s, ambient peaceful
- [ ] `musik_epik_naik.mp3` — 15s crescendo epic
- [ ] `musik_teaser.mp3` — 10s suspense
- [ ] `musik_outro.mp3` — 15s fade out
- [ ] `ambient_awans.mp3` — 60s+ loop wind/ambient
- [ ] 9 SFX files (1-3s each)
- [ ] Semua di `packages/assets/audio/`
- [ ] Test loudness -14 LUFS (gunakan `ffmpeg -i input.mp3 -af loudnorm=I=-14:TP=-1:LRA=11 output.mp3`)

---

## 💡 Tips

1. **Consistency**: Pakai instrumen yang sama (piano + synth pad) di semua musik untuk kohesi
2. **Volume Balance**: SFX 0.8-1.0, BGM 0.4-0.6, Ambient 0.2-0.3
3. **Crossfade**: Antar scene BGM crossfade 1-2 detik agar tidak putus
4. **Silence Gaps**: Pastikan tidak ada gap diam total — selalu ada ambient minimal