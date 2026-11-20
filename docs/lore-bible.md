# NEGARA DIATAS AWAN — Lore Bible (Kanon Resmi)

> **Aturan utama:** Apa yang tertulis di sini adalah kebenaran mutlak. Setiap episode harus konsisten dengan lore ini. Update versi di `lore.json` setiap episode.

---

## 🏛️ Identitas Negara

| Atribut | Nilai |
|---------|-------|
| **Nama Resmi** | NEGARA DIATAS AWAN |
| **Singkatan** | NDA |
| **Motto** | Merdeka dari Gravitasi |
| **Ibukota** | Stratos |
| **Mata Uang** | Nimbus (NMB) |
| **Bahasa Resmi** | Indonesia, Inggris |
| **Zona Waktu** | UTC+7 (WIB) — sinkron dengan jam posting |
| **Hari Kemerdekaan** | Tanggal episode 1 upload |

---

## 🎌 Bendera & Lambang

### Bendera (3:2)
- **Tiga lapis horizontal:** Biru Langit (#1E3A5F) — Putih Awan (#FFFFFF) — Kuning Matahari (#FDE047)
- **Tengah:** Lingkaran Biru Tua (#0F172A) dengan **7 bintang putih** melingkar (melambangkan 7 lapis atmosfer: Troposfer → Eksosfer)

### Lambang Negara
- **Burung Phoenix** terbang naik, memegang **Konstitusi** (gulungan) di cakarnya
- **Belakang:** Gunung Awan berbentuk Menara (Monumen Kebebasan)
- **Lingkaran luar:** 7 bintang + motto "MERDEKA DARI GRAVITASI"
- **Warna:** Palet negara (biru, putih, kuning, emas)

---

## 📜 Konstitusi (3 Pasal)

> **Prinsip:** Konstitusi singkat, hafal warga, sulit diubah.

| Pasal | Judul | Isi |
|-------|-------|-----|
| **1** | **Hak Terbang** | Setiap warga NEGARA DIATAS AWAN berhak terbang — fisik, digital, maupun imajinasi — tanpa izin gravitasi bumi. |
| **2** | **Musyawarah Digital** | Semua keputusan negara diambil melalui musyawarah di kolom komentar. Suara terbanyak ≠ menang. Suara paling **menginspirasi** yang dipilih. |
| **3** | **Awan Milik Angin** | Tanah, udara, data, dan narasi negara tidak dimiliki individu, korporasi, atau pemerintah. Awan milik angin — dan angin milik semua. |

---

## 🌍 Geografis & Demografi

| Aspek | Detail |
|-------|--------|
| **Lokasi** | Koordinat virtual: 0°0'0"S 0°0'0"E (server terdistribusi, non-fisik) |
| **Tinggi Rata-rata** | 12.000 kaki di atas permukaan laut (metafora: di atas kebiasaan) |
| **Iklim** | Selalu cerah, kemungkinan hujan ide 90%, angin kreatif konstan |
| **Populasi** | Dinamis (update tiap episode via `lore.json`) |
| **Provinsi** | Terbentuk saat Gubernur dipilih (awalnya 0) |

### Provinsi (contoh, update saat Gubernur dipilih)
- **Awan Barat** — Gubernur pertama dari komentar
- **Stratos Selatan** — Ibukota & sekitarnya
- **Timur Breeze** — Daerah angin timur
- **Nimbus Utara** — Daerah awan tebal

---

## 🏛️ Struktur Pemerintahan

### Presiden (Owner)
- **Peran:** Kepala negara, narrator utama, penandatangan konstitusi
- **Masa jabatan:** Selama series berjalan
- **Avatar:** Stylized 3D (generate via ComfyUI/ReadyPlayerMe)

### Kabinet (Menteri)
- **Dipilih dari:** Komentar valid tier S/A (score ≥ 70)
- **Jumlah:** Maksimal 20 menteri per episode
- **Jabatan bebas:** Kreativitas diprioritaskan (contoh: Menteri Gravitasi, Menteri Cuaca, Menteri Bandwidth, Menteri Mimpi, Menteri Humor)

### Gubernur
- **Dipilih dari:** Komentar valid tier A/B
- **Tugas:** Kelola provinsi, wakili warga di Musyawarah Digital
- **Jumlah:** 1 per provinsi

### Pejabat Lainnya
- Kepala Biro, Dirjen, Inspektur, Duta, dll — dari tier B/C

### Warga
- Semua yang komentar valid (termasuk yang tidak dipilih pejabat)
- Hak: Vote di musyawarah, ajukan undang-undang, bangun properti virtual

---

## 💰 Ekonomi: Nimbus (NMB)

- **Bukan kripto, bukan fiat** — mata uang berbasis **kontribusi & kreativitas**
- **Mendapat NMB:** Komentar valid, ide terpilih, bantu warga lain, bikin aset negara
- **Belanja NMB:** Beli tanah virtual, customisasi avatar, sponsor undang-undang, voting power
- **Tidak bisa:** Dibeli dengan uang asli, ditransfer ke luar negara

---

## 📜 Sejarah Ringkas (Kanon)

> **Episode 0 (Pre-lore):** Ribuan netizen lelah dengan negara-negara bumi: birokrasi keras, batas fisik, politik kusut. Mereka bermimpi negara di awan — di mana konstitusi 280 karakter, menteri dipilih dari komentar lucu tapi berarti, dan ibukota dibangun dari voxel, harapan, dan bandwidth.

> **Episode 1 (Pendirian):** Presiden (Owner) bersumpah di Monumen Awan. Konstitusi 3 pasal dibacakan. Bendera & lambang diibarkan. **Pendaftaran Kabinet Pertama DIBUKA** — format: `NAMA | JABATAN | ALASAN`. Batas 7 hari.

> **Episode 2+ (Kabinet & Bangun):** 50 pejabat terpilih diumumkan. Kantor menteri tumbuh dari awan. Undang-undang pertama: *Undang-Undang Hak Terbang Digital*. Provinsi mulai terbentuk. Warga mulai bangun rumah virtual.

---

## 🔄 Aturan Update Lore (Wajib)

1. **Setting episode** → update `lore.json` `versi++`
2. **Pejabat baru** → masuk `kabinet[]`, `populasi++`
3. **Provinsi baru** → masuk `geografis.provinsi[]`
4. **Undang-undang baru** → tambah di `konstitusi[]` (jika amandemen) atau buat `undangUndang[]` baru
5. **Lore conflict** → konsultasi ke Owner (Presiden) sebelum publish

---

## 🚫 Larangan Hard (Tidak Boleh Dilanggar)

- ❌ Negara **tidak pernah mendarat** (kecuali metafora istirahat)
- ❌ Tidak ada **pemilu konvensional** (selalu musyawarah komentar)
- ❌ Tidak ada **partai politik** (hanya jabatan fungsional)
- ❌ Tidak ada **uang asli** masuk ekonomi NMB
- ❌ Presiden **tidak bisa di-gulingkan** (Owner = Presiden selamanya)
- ❌ Konstitusi **tidak bisa dihapus** (hanya bisa di-amend via musyawarah)

---

## 📝 Catatan Penulis (Out-of-Universe)

- Series ini **meta-commentary** pada demokrasi, birokrasi, dan partisipasi digital
- Setiap pejabat = **nyata** (netizen asli), bukan karakter fiksi
- Humor = survival mechanism, bukan sekadar joke
- Target audience: Gen Z/Millennial Indonesia yang suka worldbuilding & partisipasi
- Posting schedule: **Rabu & Sabtu, 19:00 WIB** (prime time)