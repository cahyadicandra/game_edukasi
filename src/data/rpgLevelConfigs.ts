// Data & Konfigurasi Level RPG Platformer Edukasi
// Setiap level memiliki tata letak platform unik dari game_assets,
// mekanik khusus yang berbeda di setiap levelnya, koin, item, dan bos penutup.

export type PlatformAssetKey =
  | 'island_wide'
  | 'island_L'
  | 'island_M'
  | 'island_S'
  | 'platform_L'
  | 'platform_M'
  | 'platform_S'
  | 'cloud_1'
  | 'cloud_2';

export type UniqueMechanicType =
  | 'basic_precision'      // Lv 1: Lompatan presisi dasar & rute koin
  | 'wind_gusts'           // Lv 2: Hembusan angin mendorong karakter
  | 'bounce_springs'       // Lv 3: Pegas pantul super tinggi
  | 'moving_platforms'     // Lv 4: Platform bergerak horizontal & vertikal
  | 'fading_clouds'        // Lv 5: Awan menghilang 1.2 detik setelah diinjak
  | 'low_gravity'          // Lv 6: Gravitasi rendah melayang di udara
  | 'warp_portals'         // Lv 7: Portal teleportasi dua arah
  | 'laser_hazards'        // Lv 8: Sinar laser bahaya berkedip
  | 'crumbling_bridge'     // Lv 9: Pijakan runtuh beruntun menuntut lari cepat
  | 'magnetic_floor'       // Lv 10: Lantai magnetik & lonjakan dorong
  | 'ghost_platforms'      // Lv 11: Platform bayangan muncul bergantian
  | 'waterfall_lift'       // Lv 12: Arus air terjun mengangkat karakter ke atas
  | 'gravity_flip'         // Lv 13: Pembalik gravitasi sesaat
  | 'mirror_pads'          // Lv 14: Pijakan cermin ganda
  | 'sandstorm_rush'       // Lv 15: Badai pasir dengan dorongan bolak-balik
  | 'sliding_rails'        // Lv 16: Pijakan rel bergerak kencang
  | 'size_shifter'         // Lv 17: Pengubah ukuran maskot
  | 'time_slow_crystal'    // Lv 18: Kristal waktu melambatkan gerakan
  | 'pivot_rotator'        // Lv 19: Platform berputar di titik sumbu
  | 'lava_surge'           // Lv 20: Permukaan panas naik-turun
  | 'balloon_float'        // Lv 21: Balon udara geometri
  | 'hologram_decoy'       // Lv 22: Pijakan ilusi yang menipu
  | 'shockwave_timing'     // Lv 23: Gelombang resonansi getaran
  | 'cyclone_winds'        // Lv 24: Angin pusaran 4 arah
  | 'omni_apex_castle';    // Lv 25: Kastil pamungkas kombinasi mekanik

export interface PlatformDef {
  id: string;
  asset: PlatformAssetKey;
  x: number;             // koordinat piksel di dalam arena level (lebar level misal 2400-3600px)
  y: number;             // koordinat piksel dari atas arena level (tinggi misal 700px)
  width: number;
  height: number;
  isMoving?: boolean;
  moveRangeX?: number;   // jarak gerak horizontal (+/- px)
  moveSpeedX?: number;
  moveRangeY?: number;   // jarak gerak vertikal (+/- px)
  moveSpeedY?: number;
  isBouncy?: boolean;    // mekanik pegas pantul
  isFading?: boolean;    // awan runtuh setelah diinjak
  fadeDurationMs?: number;
  isPortal?: boolean;
  portalTargetX?: number;
  portalTargetY?: number;
  isHazard?: boolean;
}

export interface CollectibleDef {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'heart' | 'token';
  shapeToken?:
    | 'token_segitiga'
    | 'token_persegi'
    | 'token_lingkaran'
    | 'token_persegi_panjang'
    | 'token_trapesium'
    | 'token_belah_ketupat'
    | 'token_jajar_genjang';
  points: number;
}

export interface HazardDef {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'laser' | 'spikes' | 'wind_zone' | 'whirlpool';
  intervalMs?: number;
  activeDurationMs?: number;
  pushForceX?: number;
  pushForceY?: number;
}

export type IslandThemeKey =
  | 'pulau-bentuk'
  | 'hutan-segi-empat'
  | 'pegunungan-segitiga'
  | 'danau-lingkaran'
  | 'kastil-geometri';

export interface LevelCurriculumInfo {
  levelNum: number;
  title: string;
  learningGoal: string;
  targetShapes: string[];
  targetShapesDesc: string;
  isBossLevel: boolean;
  bossName?: string;
}

export const LEVEL_CURRICULUM_DATA: Record<number, LevelCurriculumInfo> = {
  // Pulau 1: Pulau Bentuk (Level 1 - 5)
  1: {
    levelNum: 1,
    title: 'Mengenal Segitiga, Persegi, & Lingkaran',
    learningGoal: 'Mengenal bentuk dasar segitiga (3 sisi), persegi (4 sisi sama), dan lingkaran (1 sisi lengkung).',
    targetShapes: ['Segitiga', 'Persegi', 'Lingkaran'],
    targetShapesDesc: 'Koleksi token segitiga & persegi',
    isBossLevel: false,
  },
  2: {
    levelNum: 2,
    title: 'Mengenal Persegi Panjang & Menghitung Sisi',
    learningGoal: 'Membedakan persegi dan persegi panjang, serta memahami sisi berhadapan sama panjang.',
    targetShapes: ['Persegi Panjang'],
    targetShapesDesc: 'Koleksi token persegi panjang',
    isBossLevel: false,
  },
  3: {
    levelNum: 3,
    title: 'Mengenal Titik Sudut & Sudut Siku-Siku',
    learningGoal: 'Mengenal apa itu titik sudut dan mengidentifikasi sudut tegak siku-siku (90°).',
    targetShapes: ['Persegi', 'Segitiga'],
    targetShapesDesc: 'Koleksi token sudut geometri',
    isBossLevel: false,
  },
  4: {
    levelNum: 4,
    title: 'Benda Nyata & Pengelompokan Bangun Datar',
    learningGoal: 'Mengelompokkan berbagai objek di sekitar kita berdasarkan bentuk bangun datarnya.',
    targetShapes: ['Segitiga', 'Lingkaran', 'Persegi'],
    targetShapesDesc: 'Koleksi token aneka bentuk benda nyata',
    isBossLevel: false,
  },
  5: {
    levelNum: 5,
    title: 'Ujian Pulau Bentuk: Golem Tri-Shape',
    learningGoal: 'Ujian komprehensif bentuk dasar geometri untuk menaklukkan Bos Golem Tri-Shape Purba!',
    targetShapes: ['Segitiga', 'Persegi', 'Lingkaran'],
    targetShapesDesc: 'Koleksi token kristal inti bentuk',
    isBossLevel: true,
    bossName: 'Golem Tri-Shape Purba',
  },

  // Pulau 2: Hutan Segi Empat (Level 6 - 10)
  6: {
    levelNum: 6,
    title: 'Mengenal Sifat Persegi',
    learningGoal: 'Memahami 4 sisi sama panjang dan 4 sudut siku-siku pada bangun persegi.',
    targetShapes: ['Persegi'],
    targetShapesDesc: 'Koleksi token persegi emas',
    isBossLevel: false,
  },
  7: {
    levelNum: 7,
    title: 'Persegi Panjang & Keliling Dasarnya',
    learningGoal: 'Mengenal konsep panjang dan lebar serta cara menghitung keliling persegi panjang.',
    targetShapes: ['Persegi Panjang'],
    targetShapesDesc: 'Koleksi token persegi panjang',
    isBossLevel: false,
  },
  8: {
    levelNum: 8,
    title: 'Jajar Genjang & Sisi Sejajar',
    learningGoal: 'Mengenal sifat dua pasang sisi sejajar dan sudut berhadapan sama besar pada jajar genjang.',
    targetShapes: ['Jajar Genjang'],
    targetShapesDesc: 'Koleksi token jajar genjang',
    isBossLevel: false,
  },
  9: {
    levelNum: 9,
    title: 'Belah Ketupat & Layang-Layang',
    learningGoal: 'Memahami sifat 4 sisi sama belah ketupat dan diagonal tegak lurus layang-layang.',
    targetShapes: ['Belah Ketupat'],
    targetShapesDesc: 'Koleksi token belah ketupat',
    isBossLevel: false,
  },
  10: {
    levelNum: 10,
    title: 'Ujian Hutan: Kuadraton Penjaga Rimba',
    learningGoal: 'Evaluasi menyeluruh seluruh sifat segi empat melawan Bos Kuadraton Penjaga Rimba!',
    targetShapes: ['Persegi', 'Jajar Genjang', 'Belah Ketupat', 'Trapesium'],
    targetShapesDesc: 'Koleksi token inti segi empat',
    isBossLevel: true,
    bossName: 'Kuadraton Penjaga Rimba',
  },

  // Pulau 3: Pegunungan Segitiga (Level 11 - 15)
  11: {
    levelNum: 11,
    title: 'Segitiga Berdasarkan Sisi',
    learningGoal: 'Mengklasifikasikan segitiga sama sisi, sama kaki, dan sembarang berdasarkan panjang sisinya.',
    targetShapes: ['Segitiga Sama Sisi', 'Segitiga Sama Kaki'],
    targetShapesDesc: 'Koleksi token segitiga sama sisi',
    isBossLevel: false,
  },
  12: {
    levelNum: 12,
    title: 'Segitiga Berdasarkan Sudut',
    learningGoal: 'Mengidentifikasi segitiga lancip (<90°), siku-siku (90°), dan tumpul (>90°).',
    targetShapes: ['Segitiga Siku-siku'],
    targetShapesDesc: 'Koleksi token segitiga siku-siku',
    isBossLevel: false,
  },
  13: {
    levelNum: 13,
    title: 'Jumlah Sudut Segitiga Selalu 180°',
    learningGoal: 'Menghitung salah satu sudut segitiga jika dua sudut lainnya diketahui (total 180°).',
    targetShapes: ['Segitiga'],
    targetShapesDesc: 'Koleksi token sudut segitiga',
    isBossLevel: false,
  },
  14: {
    levelNum: 14,
    title: 'Keliling Segitiga & Alas-Tinggi',
    learningGoal: 'Menghitung keliling segitiga (a + b + c) serta mengenal garis alas dan tinggi tegak lurus.',
    targetShapes: ['Segitiga'],
    targetShapesDesc: 'Koleksi token piramida segitiga',
    isBossLevel: false,
  },
  15: {
    levelNum: 15,
    title: 'Ujian Pegunungan: Naga Trigon Puncak Salju',
    learningGoal: 'Ujian segitiga komprehensif untuk menundukkan Bos Naga Trigon di puncak salju abadi!',
    targetShapes: ['Segitiga Sama Sisi', 'Segitiga Siku-siku'],
    targetShapesDesc: 'Koleksi kristal es segitiga murni',
    isBossLevel: true,
    bossName: 'Naga Trigon Puncak Salju',
  },

  // Pulau 4: Danau Lingkaran (Level 16 - 20)
  16: {
    levelNum: 16,
    title: 'Unsur Lingkaran: Pusat, Jari-Jari, Diameter',
    learningGoal: 'Mengenal titik pusat, jari-jari (r), dan diameter (d) pada bangun datar lingkaran.',
    targetShapes: ['Lingkaran'],
    targetShapesDesc: 'Koleksi token lingkaran air',
    isBossLevel: false,
  },
  17: {
    levelNum: 17,
    title: 'Hubungan Diameter & Jari-Jari',
    learningGoal: 'Menghitung diameter dari jari-jari atau sebaliknya (d = 2r dan r = d / 2).',
    targetShapes: ['Lingkaran'],
    targetShapesDesc: 'Koleksi token kompas sirkular',
    isBossLevel: false,
  },
  18: {
    levelNum: 18,
    title: 'Busur, Tali Busur, Juring, Tembereng',
    learningGoal: 'Mengenal bagian interior lingkaran seperti potongan pizza (juring) dan tembereng.',
    targetShapes: ['Lingkaran'],
    targetShapesDesc: 'Koleksi token juring lingkaran',
    isBossLevel: false,
  },
  19: {
    levelNum: 19,
    title: 'Mengenal Nilai Pi (π) & Keliling Lingkaran',
    learningGoal: 'Mengenal nilai pecahan pendekatan π (22/7 atau 3,14) dan rumus keliling lingkaran.',
    targetShapes: ['Lingkaran'],
    targetShapesDesc: 'Koleksi token simbol pi emas',
    isBossLevel: false,
  },
  20: {
    levelNum: 20,
    title: 'Ujian Samudra: Kraken Sirkular Samudra',
    learningGoal: 'Ujian penguasaan lingkaran menyeluruh melawan penguasa pusaran Danau Lingkaran!',
    targetShapes: ['Lingkaran'],
    targetShapesDesc: 'Koleksi mutiara lingkaran samudra',
    isBossLevel: true,
    bossName: 'Kraken Sirkular Samudra',
  },

  // Pulau 5: Kastil Geometri (Level 21 - 25)
  21: {
    levelNum: 21,
    title: 'Bangun Gabungan: Rumah Geometri',
    learningGoal: 'Menghitung keliling luar bangun rumah gabungan persegi dan atap segitiga.',
    targetShapes: ['Persegi', 'Segitiga'],
    targetShapesDesc: 'Koleksi token rumah geometri',
    isBossLevel: false,
  },
  22: {
    levelNum: 22,
    title: 'Bangun Gabungan: Lapangan & Kapsul',
    learningGoal: 'Memahami keliling bentuk stadion dari persegi panjang dan dua setengah lingkaran.',
    targetShapes: ['Persegi Panjang', 'Lingkaran'],
    targetShapesDesc: 'Koleksi token kapsul stadion',
    isBossLevel: false,
  },
  23: {
    levelNum: 23,
    title: 'Keliling Bangun Berundak (Bentuk L)',
    learningGoal: 'Menghitung keliling bangun poligon tak beraturan dan berundak dengan menjumlahkan sisi luar.',
    targetShapes: ['Persegi', 'Persegi Panjang'],
    targetShapesDesc: 'Koleksi token poligon berundak',
    isBossLevel: false,
  },
  24: {
    levelNum: 24,
    title: 'Soal Cerita Pemecahan Masalah Nyata',
    learningGoal: 'Menerapkan konsep keliling geometri dalam menghitung pagar taman dan renda pita taplak.',
    targetShapes: ['Persegi', 'Lingkaran', 'Segitiga'],
    targetShapesDesc: 'Koleksi token bintang geometri terapan',
    isBossLevel: false,
  },
  25: {
    levelNum: 25,
    title: 'Tantangan Terakhir: Kaisar Agung Poly-Apex',
    learningGoal: 'Ujian Pamungkas Geometri Edukasi SD: Buktikan kehebatanmu melawan Kaisar Poly-Apex!',
    targetShapes: ['Segitiga', 'Persegi', 'Lingkaran', 'Trapesium'],
    targetShapesDesc: 'Koleksi mahkota geometrikal kuno',
    isBossLevel: true,
    bossName: 'Kaisar Agung Poly-Apex',
  },
};

export interface RPGLevelConfig {
  levelNum: number;
  title: string;
  worldName: string;
  islandThemeKey: IslandThemeKey;
  description: string;
  learningGoal: string;
  targetShapes: string[];
  targetShapesDesc: string;
  isBossLevel: boolean;
  bossName?: string;
  mechanic: UniqueMechanicType;
  mechanicName: string;
  mechanicInstruction: string;
  mechanicBadgeColor: string;
  levelWidth: number;   // Lebar arena level (default 2600-3800px)
  levelHeight: number;  // Tinggi arena level (default 720px)
  playerStartX: number;
  playerStartY: number;
  platforms: PlatformDef[];
  collectibles: CollectibleDef[];
  hazards: HazardDef[];
  bossPlatform: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  targetTimeSec: number; // Batas waktu untuk bintang 3
  targetCoins: number;   // Minimal koin untuk bintang 3
  skyGradient: string;
  ambientClouds: { x: number; y: number; asset: 'cloud_1' | 'cloud_2'; speed: number }[];
}

// ============================================================================
// GENERATOR LEVEL DENGAN MEKANIK VARIATIF & BERBEDA DI SETIAP LEVEL
// ============================================================================

export function getRPGLevelConfig(levelNum: number): RPGLevelConfig {
  // Database mekanik khusus 25 level
  const mechanicsMap: Record<number, {
    name: string;
    type: UniqueMechanicType;
    instruction: string;
    color: string;
    targetTime: number;
    targetCoins: number;
  }> = {
    1: {
      name: 'Lompatan Presisi Dasar',
      type: 'basic_precision',
      instruction: 'Lompati pulau-pulau melayang dan kumpulkan koin emas menuju sarang Bos Slime!',
      color: '#22c55e',
      targetTime: 65,
      targetCoins: 12,
    },
    2: {
      name: 'Hembusan Angin Dinamis',
      type: 'wind_gusts',
      instruction: 'Manfaatkan hembusan angin kencang yang bertiup ke kanan untuk melayang lebih jauh!',
      color: '#38bdf8',
      targetTime: 60,
      targetCoins: 15,
    },
    3: {
      name: 'Pegas Pantul Super Jump',
      type: 'bounce_springs',
      instruction: 'Injak platform berpegas neon untuk melontarkan diri setinggi awan!',
      color: '#f59e0b',
      targetTime: 70,
      targetCoins: 16,
    },
    4: {
      name: 'Pulau Melayang Bergerak',
      type: 'moving_platforms',
      instruction: 'Perhatikan timing lompatanmu! Pulau-pulau meluncur ke kiri, kanan, atas, dan bawah.',
      color: '#a855f7',
      targetTime: 75,
      targetCoins: 18,
    },
    5: {
      name: 'Platform Awan Rapuh',
      type: 'fading_clouds',
      instruction: 'Awas! Awan putih akan bergetar dan lenyap 1.2 detik setelah kamu injak!',
      color: '#ec4899',
      targetTime: 80,
      targetCoins: 20,
    },
    6: {
      name: 'Gravitasi Rendah (Moon Float)',
      type: 'low_gravity',
      instruction: 'Gravitasi berkurang drastis! Maskot melayang tinggi dan lambat seperti di bulan.',
      color: '#6366f1',
      targetTime: 70,
      targetCoins: 18,
    },
    7: {
      name: 'Portal Teleportasi Geometri',
      type: 'warp_portals',
      instruction: 'Masuki portal lingkaran biru untuk diteleportasi seketika ke tebing seberang!',
      color: '#06b6d4',
      targetTime: 75,
      targetCoins: 20,
    },
    8: {
      name: 'Sinar Laser Geometri',
      type: 'laser_hazards',
      instruction: 'Hati-hati! Tunggu sinar laser merah padam sebelum melompat melintasinya.',
      color: '#ef4444',
      targetTime: 80,
      targetCoins: 22,
    },
    9: {
      name: 'Jembatan Runtuh Beruntun',
      type: 'crumbling_bridge',
      instruction: 'Teruslah berlari tanpa berhenti! Pijakan di belakangmu runtuh satu demi satu.',
      color: '#ea580c',
      targetTime: 60,
      targetCoins: 20,
    },
    10: {
      name: 'Lantai Magnetik & Impuls',
      type: 'magnetic_floor',
      instruction: 'Kutub magnet mendorongmu melesat cepat ke depan saat berada di atas lantai besi!',
      color: '#14b8a6',
      targetTime: 85,
      targetCoins: 24,
    },
  };

  // Default fallback untuk level 11 - 25 dengan variasi mekanik rotasi
  const defaultMechanic = mechanicsMap[levelNum] || {
    name: `Tantangan Geometri Lanjutan ${levelNum}`,
    type: (['moving_platforms', 'bounce_springs', 'wind_gusts', 'fading_clouds', 'low_gravity'] as const)[levelNum % 5],
    instruction: 'Gunakan seluruh keahlian melompat dan kelincahanmu untuk menaklukkan rintangan!',
    color: '#8b5cf6',
    targetTime: 75 + (levelNum % 5) * 5,
    targetCoins: 18 + (levelNum % 3) * 2,
  };

  const levelHeight = 720;
  const groundY = 560; // Garis acuan dasar pulau

  // Tata letak platform berbasis aset tanah game_assets
  const platforms: PlatformDef[] = [];
  const collectibles: CollectibleDef[] = [];
  const hazards: HazardDef[] = [];

  // 1. Platform Awal Tempat Karakter Muncul (Start Island yang lebar dan kokoh)
  const startIslandWidth = 520;
  platforms.push({
    id: 'plat-start',
    asset: 'island_wide',
    x: 60,
    y: groundY - 20, // surfaceY = 564
    width: startIslandWidth,
    height: 192,
  });

  // 2. Platform Tengah Berurutan dengan Variasi Jalur Mulus & Mekanik Menyenangkan
  const totalWaypoints = 6;
  let currentX = 60 + startIslandWidth + 75; // Jarak awalan 75px yang sangat mudah dilompati

  for (let i = 1; i <= totalWaypoints; i++) {
    // Tentukan tipe dan lebar platform
    let asset: PlatformAssetKey = 'platform_L';
    let width = 340;
    if (i % 3 === 1) {
      asset = 'island_M';
      width = 360;
    } else if (i % 3 === 2) {
      asset = 'platform_M';
      width = 300;
    } else if (i % 3 === 0) {
      asset = 'island_S';
      width = 270;
    }

    // Variasi mekanik khusus per level
    const isMoving = defaultMechanic.type === 'moving_platforms' && (i === 2 || i === 5);
    const isBouncy = defaultMechanic.type === 'bounce_springs' && (i === 2 || i === 4);
    const isFading = defaultMechanic.type === 'fading_clouds' && (i === 3 || i === 5);

    if (isFading) {
      asset = 'cloud_1';
      width = 290;
    }

    // Variasi ketinggian bergelombang landai (+/- 35px, sangat mudah & mulus dijelajahi)
    const heightWave = Math.sin((i + levelNum * 0.7) * 1.1) * 40;
    const platSurfaceY = groundY - 15 - heightWave;
    const platY = platSurfaceY - 24;

    platforms.push({
      id: `plat-${i}`,
      asset,
      x: currentX,
      y: platY,
      width,
      height: isFading ? 140 : 137,
      isMoving,
      moveRangeX: isMoving ? 60 : 0,
      moveSpeedX: isMoving ? 1.4 : 0,
      moveRangeY: 0,
      moveSpeedY: 0,
      isBouncy,
      isFading,
      fadeDurationMs: 1400,
    });

    // Sebar Koin melengkung indah di atas setiap platform
    collectibles.push({
      id: `coin-${i}-1`,
      x: currentX + 70,
      y: platSurfaceY - 45,
      type: 'coin',
      points: 10,
    });
    collectibles.push({
      id: `coin-${i}-2`,
      x: currentX + width / 2,
      y: platSurfaceY - 65,
      type: 'coin',
      points: 10,
    });
    collectibles.push({
      id: `coin-${i}-3`,
      x: currentX + width - 70,
      y: platSurfaceY - 45,
      type: 'coin',
      points: 10,
    });

    // Token Bangun Datar Spesial di platform tertentu sesuai kurikulum pulau
    if (i === 2 || i === 4) {
      let shapeToken: CollectibleDef['shapeToken'] = 'token_segitiga';
      if (levelNum <= 5) {
        const p1Tokens: CollectibleDef['shapeToken'][] = ['token_segitiga', 'token_persegi', 'token_lingkaran', 'token_persegi_panjang'];
        shapeToken = p1Tokens[(levelNum + i) % p1Tokens.length];
      } else if (levelNum <= 10) {
        const p2Tokens: CollectibleDef['shapeToken'][] = ['token_persegi', 'token_persegi_panjang', 'token_jajar_genjang', 'token_belah_ketupat', 'token_trapesium'];
        shapeToken = p2Tokens[(levelNum + i) % p2Tokens.length];
      } else if (levelNum <= 15) {
        shapeToken = 'token_segitiga';
      } else if (levelNum <= 20) {
        shapeToken = 'token_lingkaran';
      } else {
        const p5Tokens: CollectibleDef['shapeToken'][] = ['token_segitiga', 'token_persegi', 'token_lingkaran', 'token_trapesium', 'token_jajar_genjang'];
        shapeToken = p5Tokens[(levelNum + i) % p5Tokens.length];
      }

      collectibles.push({
        id: `token-${i}`,
        x: currentX + width / 2,
        y: platSurfaceY - 110,
        type: 'token',
        shapeToken,
        points: 50,
      });
    }

    // Item Heart Pemulih Darah di titik tengah petualangan
    if (i === 3) {
      collectibles.push({
        id: `heart-${i}`,
        x: currentX + width / 2,
        y: platSurfaceY - 50,
        type: 'heart',
        points: 0,
      });
    }

    // Hitung posisi platform berikutnya dengan celah jumpable yang konsisten (80-100px)
    const gap = isMoving ? 110 : 85;
    currentX += width + gap;
  }

  // 3. Mekanik Bahaya / Fitur Tambahan
  if (defaultMechanic.type === 'wind_gusts') {
    hazards.push({
      id: 'hazard-wind-1',
      x: 800,
      y: 100,
      width: 1400,
      height: 480,
      type: 'wind_zone',
      pushForceX: 20,
      pushForceY: -4,
    });
  } else if (defaultMechanic.type === 'warp_portals') {
    platforms[2].isPortal = true;
    platforms[2].portalTargetX = platforms[4].x + 60;
    platforms[2].portalTargetY = platforms[4].y - 30;
  }

  // 4. Platform Akhir: Arena Pertemuan Bos (Boss Gate Island)
  const bossGap = 90;
  const bossX = currentX + bossGap;
  const bossY = groundY - 40;
  platforms.push({
    id: 'plat-boss',
    asset: 'island_L',
    x: bossX,
    y: bossY,
    width: 560,
    height: 364,
  });

  const levelWidth = bossX + 650;

  // Koin Bonus di Arena Bos
  for (let c = 0; c < 3; c++) {
    collectibles.push({
      id: `boss-coin-${c}`,
      x: bossX + 120 + c * 80,
      y: bossY - 50,
      type: 'coin',
      points: 15,
    });
  }

  // Awan Ambien Mengambang di Langit
  const ambientClouds = [
    { x: 200, y: 120, asset: 'cloud_1' as const, speed: 0.2 },
    { x: 800, y: 160, asset: 'cloud_2' as const, speed: 0.35 },
    { x: 1400, y: 90, asset: 'cloud_1' as const, speed: 0.18 },
    { x: 2100, y: 140, asset: 'cloud_2' as const, speed: 0.28 },
    { x: 2800, y: 110, asset: 'cloud_1' as const, speed: 0.22 },
  ];

  // Gradien Langit & Tema Khusus Setiap Pulau
  const skyGradients: Record<IslandThemeKey, string> = {
    'pulau-bentuk': 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 45%, #bae6fd 75%, #dcfce7 100%)',
    'hutan-segi-empat': 'linear-gradient(180deg, #064e3b 0%, #065f46 40%, #047857 70%, #022c22 100%)',
    'pegunungan-segitiga': 'linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #c7d2fe 100%)',
    'danau-lingkaran': 'linear-gradient(180deg, #134e4a 0%, #0f766e 40%, #0d9488 70%, #fde047 100%)',
    'kastil-geometri': 'linear-gradient(180deg, #090314 0%, #1e103f 35%, #3b0764 70%, #581c87 100%)',
  };

  const islandThemeKey: IslandThemeKey =
    levelNum <= 5
      ? 'pulau-bentuk'
      : levelNum <= 10
      ? 'hutan-segi-empat'
      : levelNum <= 15
      ? 'pegunungan-segitiga'
      : levelNum <= 20
      ? 'danau-lingkaran'
      : 'kastil-geometri';

  const worldName =
    islandThemeKey === 'pulau-bentuk'
      ? 'Pulau Bentuk'
      : islandThemeKey === 'hutan-segi-empat'
      ? 'Hutan Segi Empat'
      : islandThemeKey === 'pegunungan-segitiga'
      ? 'Pegunungan Segitiga'
      : islandThemeKey === 'danau-lingkaran'
      ? 'Danau Lingkaran'
      : 'Kastil Geometri';

  const curriculum = LEVEL_CURRICULUM_DATA[levelNum] || {
    levelNum,
    title: `Level ${levelNum}`,
    learningGoal: defaultMechanic.instruction,
    targetShapes: ['Bangun Datar'],
    targetShapesDesc: 'Koleksi token geometri',
    isBossLevel: levelNum % 5 === 0,
    bossName: levelNum % 5 === 0 ? 'Bos Geometri' : undefined,
  };

  return {
    levelNum,
    title: curriculum.title,
    worldName,
    islandThemeKey,
    description: defaultMechanic.instruction,
    learningGoal: curriculum.learningGoal,
    targetShapes: curriculum.targetShapes,
    targetShapesDesc: curriculum.targetShapesDesc,
    isBossLevel: curriculum.isBossLevel,
    bossName: curriculum.bossName,
    mechanic: defaultMechanic.type,
    mechanicName: defaultMechanic.name,
    mechanicInstruction: defaultMechanic.instruction,
    mechanicBadgeColor: defaultMechanic.color,
    levelWidth,
    levelHeight,
    playerStartX: 180,
    playerStartY: groundY - 140,
    platforms,
    collectibles,
    hazards,
    bossPlatform: {
      x: bossX,
      y: bossY,
      width: 560,
      height: 364,
    },
    targetTimeSec: defaultMechanic.targetTime,
    targetCoins: defaultMechanic.targetCoins,
    skyGradient: skyGradients[islandThemeKey],
    ambientClouds,
  };
}
