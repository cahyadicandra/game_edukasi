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

export interface RPGLevelConfig {
  levelNum: number;
  title: string;
  worldName: string;
  islandThemeKey: IslandThemeKey;
  description: string;
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

  const levelWidth = 3200;
  const levelHeight = 720;
  const groundY = 560; // Tinggi garis dasar platform utama

  // Tata letak platform berbasis aset tanah game_assets
  const platforms: PlatformDef[] = [];
  const collectibles: CollectibleDef[] = [];
  const hazards: HazardDef[] = [];

  // 1. Platform Awal Tempat Karakter Muncul (Start Island)
  platforms.push({
    id: 'plat-start',
    asset: 'island_wide',
    x: 60,
    y: groundY - 20,
    width: 600,
    height: 192,
  });

  // 2. Platform Tengah Berurutan dengan Variasi Mekanik Level
  const totalWaypoints = 6;
  for (let i = 1; i <= totalWaypoints; i++) {
    const xBase = 650 + (i - 1) * 360;
    // Variasi ketinggian platform
    const heightOffset = Math.sin((i + levelNum) * 1.3) * 120;
    const platY = groundY - 40 - heightOffset;

    let asset: PlatformAssetKey = 'platform_L';
    if (i % 3 === 1) asset = 'island_M';
    if (i % 3 === 2) asset = 'platform_M';
    if (i % 3 === 0) asset = 'island_S';

    // Pengaturan fitur mekanik per level
    const isMoving = defaultMechanic.type === 'moving_platforms' && i % 2 === 1;
    const isBouncy = defaultMechanic.type === 'bounce_springs' && (i === 2 || i === 4);
    const isFading = defaultMechanic.type === 'fading_clouds' && (i === 3 || i === 5);

    platforms.push({
      id: `plat-${i}`,
      asset: isFading ? 'cloud_1' : asset,
      x: xBase,
      y: platY,
      width: isFading ? 340 : (asset === 'island_M' ? 380 : asset === 'island_S' ? 250 : 330),
      height: isFading ? 140 : 137,
      isMoving,
      moveRangeX: isMoving ? 140 : 0,
      moveSpeedX: isMoving ? 1.4 : 0,
      moveRangeY: isMoving && i % 2 === 0 ? 80 : 0,
      moveSpeedY: isMoving && i % 2 === 0 ? 1.2 : 0,
      isBouncy,
      isFading,
      fadeDurationMs: 1200,
    });

    // Sebar Koin di atas setiap platform
    collectibles.push({
      id: `coin-${i}-1`,
      x: xBase + 80,
      y: platY - 45,
      type: 'coin',
      points: 10,
    });
    collectibles.push({
      id: `coin-${i}-2`,
      x: xBase + 160,
      y: platY - 75,
      type: 'coin',
      points: 10,
    });

    // Token Bangun Datar Spesial di platform tertentu
    if (i === 2 || i === 4) {
      const tokens: CollectibleDef['shapeToken'][] = [
        'token_segitiga',
        'token_persegi',
        'token_lingkaran',
        'token_persegi_panjang',
        'token_trapesium',
      ];
      collectibles.push({
        id: `token-${i}`,
        x: xBase + 120,
        y: platY - 110,
        type: 'token',
        shapeToken: tokens[(levelNum + i) % tokens.length],
        points: 50,
      });
    }

    // Item Heart Pemulih Darah di titik sulit
    if (i === 3) {
      collectibles.push({
        id: `heart-${i}`,
        x: xBase + 220,
        y: platY - 55,
        type: 'heart',
        points: 0,
      });
    }
  }

  // 3. Mekanik Bahaya Khusus
  if (defaultMechanic.type === 'wind_gusts') {
    hazards.push({
      id: 'hazard-wind-1',
      x: 900,
      y: 100,
      width: 1400,
      height: 480,
      type: 'wind_zone',
      pushForceX: 28,
      pushForceY: -4,
    });
  } else if (defaultMechanic.type === 'laser_hazards') {
    hazards.push({
      id: 'hazard-laser-1',
      x: 1300,
      y: 320,
      width: 30,
      height: 180,
      type: 'laser',
      intervalMs: 3000,
      activeDurationMs: 1400,
    });
    hazards.push({
      id: 'hazard-laser-2',
      x: 1950,
      y: 280,
      width: 30,
      height: 200,
      type: 'laser',
      intervalMs: 3000,
      activeDurationMs: 1400,
    });
  } else if (defaultMechanic.type === 'warp_portals') {
    platforms[2].isPortal = true;
    platforms[2].portalTargetX = platforms[4].x + 40;
    platforms[2].portalTargetY = platforms[4].y - 60;
  }

  // 4. Platform Akhir: Arena Pertemuan Bos (Boss Gate Island)
  const bossX = 2700;
  const bossY = groundY - 60;
  platforms.push({
    id: 'plat-boss',
    asset: 'island_L',
    x: bossX,
    y: bossY,
    width: 560,
    height: 364,
  });

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

  return {
    levelNum,
    title: `Level ${levelNum}`,
    worldName,
    islandThemeKey,
    description: defaultMechanic.instruction,
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
