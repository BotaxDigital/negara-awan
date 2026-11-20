import { z } from 'zod';

// ============================================
// KONSTANTA NEGARA
// ============================================

export const NEGARA_NAMA = 'NEGARA DIATAS AWAN';
export const NEGARA_SINGKAT = 'NDA';
export const MOTTO = 'Merdeka dari Gravitasi';
export const IBUKOTA = 'Stratos';
export const MATA_UANG = 'Nimbus (NMB)';
export const BAHASA_RESMI = ['Indonesia', 'Inggris'];
export const ZONA_WAKTU = 'UTC+7 (WIB)';

// ============================================
// SKEMA DATA EPISODE
// ============================================

// Script narasi per scene
export const ScriptLineSchema = z.object({
  id: z.string(),
  textDisplay: z.string(), // text overlay yang ditampilkan (tanpa voiceover)
  durationSec: z.number().positive(),
  animationNotes: z.string().optional(),
  cameraNotes: z.string().optional(),
  audioCue: z.string().optional(), // BGM + SFX filenames
});

export type ScriptLine = z.infer<typeof ScriptLineSchema>;

// Data pejabat (dari komentar terpilih)
export const OfficialSchema = z.object({
  id: z.string(), // UUID
  nama: z.string(),
  jabatan: z.string(), // bebas: "Menteri Gravitasi", "Gubernur Awan Barat", dll
  alasan: z.string(), // alasan 1 kalimat dari komentar
  sumber: z.object({
    platform: z.enum(['youtube', 'instagram', 'facebook', 'tiktok']),
    commentId: z.string(),
    authorHandle: z.string(),
    authorAvatarUrl: z.string().url().optional(),
    likes: z.number().int().nonnegative(),
    timestamp: z.string().datetime(),
  }),
  status: z.enum(['dipilih', 'cadangan', 'ditolak']),
  episodeMasuk: z.number().int().positive(), // episode ke berapa masuk
  avatarSeed: z.string().optional(), // seed untuk generate avatar konsisten
  warnaTema: z.string().optional(), // hex color untuk identitas visual
});

export type Official = z.infer<typeof OfficialSchema>;

// Lore negara (update tiap episode)
export const LoreSchema = z.object({
  versi: z.number().int().positive(),
  namaNegara: z.string(),
  motto: z.string(),
  ibukota: z.string(),
  mataUang: z.string(),
  bendera: z.object({
    deskripsi: z.string(),
    artiWarna: z.record(z.string()),
    svgUrl: z.string().url().optional(),
    generatedPrompt: z.string().optional(),
  }),
  lambang: z.object({
    deskripsi: z.string(),
    svgUrl: z.string().url().optional(),
    generatedPrompt: z.string().optional(),
  }),
  konstitusi: z.array(z.object({
    pasal: z.number().int().positive(),
    judul: z.string(),
    isi: z.string(),
  })),
  sejarahSingkat: z.string(), // 2-3 paragraf
  geografis: z.object({
    lokasi: z.string(), // "Koordinat awan: 0°0'0\"S 0°0'0\"E (virtual)"
    tinggiRataRata: z.string(), // "12.000 kaki di atas permukaan laut"
    iklim: z.string(),
    populasi: z.number().int().nonnegative(),
    provinsi: z.array(z.string()),
  }),
  kabinet: z.array(z.object({
    jabatan: z.string(),
    nama: z.string(),
    officialId: z.string(),
  })),
  updatedAt: z.string().datetime(),
});

export type Lore = z.infer<typeof LoreSchema>;

// Episode metadata
export const EpisodeMetadataSchema = z.object({
  nomor: z.number().int().positive(),
  judul: z.string(),
  deskripsi: z.string(),
  durasiTargetDetik: z.number().int().positive(), // 180 untuk 3 menit
  script: z.array(ScriptLineSchema),
  officialsBaru: z.array(OfficialSchema), // pejabat baru yang debut episode ini
  loreUpdate: LoreSchema.partial(), // delta update lore
  assets: z.object({
    models: z.array(z.string()), // path glTF
    textures: z.array(z.string()),
    audio: z.array(z.string()), // voiceover, SFX, musik
  }),
  renderSettings: z.object({
    resolution: z.tuple([z.number(), z.number()]), // [1920, 1080]
    fps: z.number().int().positive(),
    codec: z.string(),
    crf: z.number().int().min(18).max(28),
  }),
  uploadTargets: z.array(z.enum(['youtube', 'instagram', 'facebook', 'tiktok'])),
  scheduledAt: z.string().datetime().optional(),
  status: z.enum(['draft', 'production', 'rendering', 'uploading', 'published']),
});

export type EpisodeMetadata = z.infer<typeof EpisodeMetadataSchema>;

// ============================================
// UTILITAS
// ============================================

export function estimateSpeechDuration(text: string, wpm = 135): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil((words / wpm) * 60);
}

export function generateId(prefix = 'nda'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Palet warna negara (konsisten di semua episode)
export const WARNA_NEGARA = {
  primary: '#1E3A5F',    // Biru langit malam
  secondary: '#7DD3FC',  // Biru awan cerah
  accent: '#FDE047',     // Kuning matahari
  background: '#F0F9FF', // Putih awan
  text: '#0F172A',       // Hampir hitam
  success: '#22C55E',    // Hijau
  warning: '#F97316',    // Orange
  error: '#EF4444',      // Merah
  // Per jabatan (generate otomatis)
  jabatan: {
    presiden: '#1E3A5F',
    menteri: '#7DD3FC',
    gubernur: '#FDE047',
    warga: '#64748B',
  },
} as const;

export type WarnaNegara = typeof WARNA_NEGARA;