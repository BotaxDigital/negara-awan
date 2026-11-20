# Cara Render Episode 1 via Blender

## Prasyarat
- Blender 3.6+ terinstall
- Voiceover files sudah di-generate (sudah: `packages/assets/audio/vo_s0*.wav`)

## Cara Menjalankan

### Opsi 1: Command Line (Background Render)
```cmd
cd "C:\Users\saidk\Documents\negara-awan"
"C:\Program Files\Blender Foundation\Blender 4.0\blender.exe" --background --python render_episode1.py
```
*Ganti path Blender sesuai instalasi Anda*

### Opsi 2: Via Blender UI
1. Buka Blender
2. Tab **Scripting** (atas)
3. Klik **New** → Paste seluruh isi `render_episode1.py`
4. Tekan **Run Script** (▶️)

## Output
- Video: `packages/episodes/assets/video/ep01-pendirian.mp4` (1920x1080, 30fps, H.264)
- Durasi: 72 detik (test) — ubah `TOTAL_FRAMES = 5400` di script untuk 3 menit penuh

## Kompres untuk Telegram (Opsional)
```cmd
ffmpeg -i packages/episodes/assets/video/ep01-pendirian.mp4 -vf scale=720:1280 -crf 24 -c:a aac -b:a 96k packages/episodes/assets/video/ep01-pendirian-tg.mp4
```

## Catatan
- Script membuat semua aset **prosedural** (tidak butuh file GLB eksternal)
- Voiceover otomatis masuk ke VSE (Video Sequence Editor) channel 1
- Render time estimate: 15-30 menit tergantung GPU (RTX 3050 ~20 menit)

## Troubleshooting
- **Error "No module named colorsys"**: Sudah built-in Python, tidak perlu install
- **Voiceover tidak muncul**: Pastikan file WAV ada di `packages/assets/audio/`
- **Render lambat**: Turunkan `TOTAL_FRAMES` untuk test (72 detik = 2160 frames)
- **Memory error**: Kurangi jumlah building/clouds di script