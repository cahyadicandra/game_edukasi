/**
 * level.js - Level Generator Berbasis Data & Zona Bertema untuk Triangle Quest
 * Panjang: 6400 px, 4 Zona: Rumput (0-1600), Gurun (1600-3200), Salju (3200-4800), Batu/Gua (4800-6400)
 */

export const LEVEL_WIDTH = 6400;
export const LEVEL_HEIGHT = 800;
export const GROUND_Y = 672; // Posisi dasar tanah (800 - 128)

export const ZONES = [
  {
    id: 'grass',
    name: 'Padang Rumput Zamrud',
    startX: 0,
    endX: 1600,
    skyTop: '#60A5FA',
    skyBottom: '#DBEAFE',
    groundTile: 'ground_tile_grass',
    decorations: ['tree_round', 'tree_apple', 'tree_big_oak', 'bush_green_small', 'bush_green_large', 'flowers', 'grass_tuft', 'sign_wood', 'fence'],
    ambientColor: 'rgba(255, 255, 255, 0)'
  },
  {
    id: 'sand',
    name: 'Gurun Pasir Keemasan',
    startX: 1600,
    endX: 3200,
    skyTop: '#F59E0B',
    skyBottom: '#FEF3C7',
    groundTile: 'ground_tile_sand',
    decorations: ['tree_palm', 'tree_cactus', 'rock_sand_small', 'rock_sand_large', 'crate', 'dead_bush'],
    ambientColor: 'rgba(245, 158, 11, 0.08)'
  },
  {
    id: 'snow',
    name: 'Puncak Salju Abadi',
    startX: 3200,
    endX: 4800,
    skyTop: '#38BDF8',
    skyBottom: '#F1F5F9',
    groundTile: 'ground_tile_snow',
    decorations: ['tree_pine_snow', 'rock_snow_small', 'rock_snow_large', 'bush_autumn', 'tree_dead', 'log'],
    ambientColor: 'rgba(56, 189, 248, 0.08)'
  },
  {
    id: 'stone',
    name: 'Gua Batu Kuno & Sarang Raja Slime',
    startX: 4800,
    endX: 6400,
    skyTop: '#1E1B4B',
    skyBottom: '#4338CA',
    groundTile: 'ground_tile_stone',
    decorations: ['crystal_blue', 'crystal_green', 'crystal_pink', 'mushroom_red', 'rock_gray_small', 'rock_gray_large', 'sign_wood'],
    ambientColor: 'rgba(15, 23, 42, 0.25)'
  }
];

// Helper pseudo-random tetap berdasar seed
function pseudoRandom(seed) {
  let s = Math.sin(seed++) * 10000;
  return s - Math.floor(s);
}

export function buildLevelData() {
  const platforms = [];
  const decorations = [];
  const collectibles = [];
  const checkpoints = [];
  const enemySpawns = [];

  // 1. BUAT TANAH DASAR DENGAN JURANG (CHASMS)
  // Zona 1 (Grass): Jurang di 700-850
  // Zona 2 (Sand): Jurang di 2200-2400
  // Zona 3 (Snow): Jurang di 3700-3950
  // Zona 4 (Stone): Jurang di 5100-5250, lalu Arena Boss datar 5400-6400
  const chasms = [
    { start: 700, end: 860 },
    { start: 2200, end: 2420 },
    { start: 3700, end: 3960 },
    { start: 5080, end: 5260 }
  ];

  for (let x = 0; x < LEVEL_WIDTH; x += 128) {
    // Periksa apakah x berada di dalam jurang
    const inChasm = chasms.some(c => x + 64 >= c.start && x + 64 <= c.end);
    if (!inChasm) {
      const zone = getZoneAt(x);
      platforms.push({
        type: 'ground',
        asset: zone.groundTile,
        x: x,
        y: GROUND_Y,
        width: 128,
        height: 128,
        isOneWay: false // tanah dasar solid dari samping/atas
      });
    }
  }

  // 2. PLATFORM MELAYANG (ONE-WAY PLATFORMS)
  const floatingPlats = [
    // === ZONA 1: GRASS ===
    { asset: 'platform_grass_flat_med', x: 260, y: 520, w: 160, h: 48 },
    { asset: 'platform_grass_tri_small', x: 480, y: 440, w: 100, h: 48 },
    // Platform penyeberang jurang 1
    { asset: 'platform_grass_flat_small', x: 710, y: 540, w: 96, h: 40 },
    { asset: 'platform_grass_flat_small', x: 810, y: 500, w: 96, h: 40 },
    // Tangga pulau naik
    { asset: 'platform_grass_flat_large', x: 1050, y: 460, w: 220, h: 48 },
    { asset: 'platform_grass_tri_large', x: 1320, y: 380, w: 180, h: 56 },

    // === ZONA 2: SAND ===
    { asset: 'platform_sand_flat_small', x: 1750, y: 530, w: 110, h: 44 },
    { asset: 'platform_sand_flat_med', x: 1950, y: 450, w: 160, h: 48 },
    // Penyeberang jurang 2
    { asset: 'platform_sand_tri_small', x: 2240, y: 520, w: 100, h: 44 },
    { asset: 'platform_sand_flat_small', x: 2360, y: 460, w: 110, h: 44 },
    // Pilar gurun
    { asset: 'platform_sand_flat_large', x: 2550, y: 400, w: 220, h: 48 },
    { asset: 'platform_sand_flat_med', x: 2850, y: 480, w: 160, h: 48 },

    // === ZONA 3: SNOW ===
    { asset: 'platform_snow_flat_med', x: 3350, y: 510, w: 160, h: 48 },
    { asset: 'platform_snow_tri_large', x: 3550, y: 430, w: 180, h: 56 },
    // Penyeberang jurang 3
    { asset: 'platform_snow_flat_small', x: 3740, y: 500, w: 100, h: 44 },
    { asset: 'platform_snow_flat_small', x: 3890, y: 460, w: 100, h: 44 },
    // Tanjakan puncak
    { asset: 'platform_snow_flat_large', x: 4100, y: 390, w: 220, h: 48 },
    { asset: 'platform_snow_tri_small', x: 4400, y: 480, w: 110, h: 44 },
    { asset: 'platform_snow_flat_med', x: 4600, y: 410, w: 160, h: 48 },

    // === ZONA 4: STONE & BOSS ARENA ===
    { asset: 'platform_stone_flat_med', x: 4920, y: 520, w: 160, h: 48 },
    // Penyeberang jurang 4
    { asset: 'platform_stone_tri_small', x: 5120, y: 480, w: 100, h: 44 },
    // Panggung arena bertingkat di Boss
    { asset: 'platform_stone_flat_med', x: 5500, y: 500, w: 160, h: 48 },
    { asset: 'platform_stone_flat_med', x: 5900, y: 500, w: 160, h: 48 },
    { asset: 'platform_stone_flat_small', x: 5700, y: 380, w: 120, h: 44 }
  ];

  floatingPlats.forEach(fp => {
    platforms.push({
      type: 'floating',
      asset: fp.asset,
      x: fp.x,
      y: fp.y,
      width: fp.w,
      height: fp.h,
      isOneWay: true
    });
  });

  // 3. CHECKPOINTS & GOAL
  checkpoints.push({ id: 'cp_start', x: 120, y: GROUND_Y - 72, reached: true });
  checkpoints.push({ id: 'cp_sand', x: 1650, y: GROUND_Y - 72, reached: false });
  checkpoints.push({ id: 'cp_snow', x: 3250, y: GROUND_Y - 72, reached: false });
  checkpoints.push({ id: 'cp_boss', x: 4850, y: GROUND_Y - 72, reached: false });

  // 4. SPAWN MUSUH BERDASAR TEMA & ZONA
  // Zona 1: Slime Green & Bat
  enemySpawns.push({ type: 'slime_green', x: 400, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'slime_green', x: 520, y: 440 - 48 });
  enemySpawns.push({ type: 'bat', x: 620, y: 360 });
  enemySpawns.push({ type: 'slime_green', x: 1100, y: 460 - 48 });
  enemySpawns.push({ type: 'mushroom_walker', x: 1200, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'bat', x: 1400, y: 300 });

  // Zona 2: Slime Blue (Melompat), Spike Ball (Kebal), Bat
  enemySpawns.push({ type: 'slime_blue', x: 1800, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'spike_ball', x: 2000, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'bat', x: 2150, y: 320 });
  enemySpawns.push({ type: 'slime_blue', x: 2600, y: 400 - 48 });
  enemySpawns.push({ type: 'spike_ball', x: 2900, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'slime_purple', x: 3050, y: GROUND_Y - 48 });

  // Zona 3: Slime Purple (Berduri, no stomp), Ghost (Stalker), Mushroom
  enemySpawns.push({ type: 'slime_purple', x: 3400, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'ghost', x: 3600, y: 360 });
  enemySpawns.push({ type: 'slime_blue', x: 4150, y: 390 - 48 });
  enemySpawns.push({ type: 'ghost', x: 4300, y: 380 });
  enemySpawns.push({ type: 'slime_purple', x: 4500, y: GROUND_Y - 48 });
  enemySpawns.push({ type: 'bat', x: 4680, y: 300 });

  // Zona 4: Slime Purple, Ghost, Spike Ball, dan Arena Slime King Boss!
  enemySpawns.push({ type: 'slime_purple', x: 4950, y: 520 - 48 });
  enemySpawns.push({ type: 'ghost', x: 5020, y: 400 });
  // Boss di arena (x: 5800, y: GROUND_Y - 96)
  enemySpawns.push({ type: 'slime_king_boss', x: 5800, y: GROUND_Y - 96, isBoss: true });

  // 5. KOLEKTIBEL (KOIN, HATI, POWER CELL, AMMO)
  // Sebar koin di sepanjang platform & rahasia
  const coinPositions = [
    { x: 300, y: 460 }, { x: 340, y: 460 }, { x: 510, y: 380 },
    { x: 740, y: 480 }, { x: 840, y: 440 }, { x: 1120, y: 400 },
    { x: 1160, y: 400 }, { x: 1360, y: 320 },
    { x: 1800, y: 470 }, { x: 2000, y: 390 }, { x: 2280, y: 460 },
    { x: 2600, y: 340 }, { x: 2900, y: 420 },
    { x: 3400, y: 450 }, { x: 3600, y: 370 }, { x: 3800, y: 440 },
    { x: 4150, y: 330 }, { x: 4450, y: 420 }, { x: 4650, y: 350 },
    { x: 4970, y: 460 }, { x: 5550, y: 440 }, { x: 5740, y: 320 }, { x: 5950, y: 440 }
  ];

  coinPositions.forEach(cp => {
    collectibles.push({ type: 'coin', x: cp.x, y: cp.y, collected: false });
  });

  // Hati pemulih
  collectibles.push({ type: 'heart', x: 1400, y: 330, collected: false });
  collectibles.push({ type: 'heart', x: 3100, y: GROUND_Y - 60, collected: false });
  collectibles.push({ type: 'heart', x: 4750, y: GROUND_Y - 60, collected: false });

  // Power cell & ammo
  collectibles.push({ type: 'power_cell', x: 1080, y: 410, collected: false });
  collectibles.push({ type: 'ammo_pack', x: 2700, y: 350, collected: false });
  collectibles.push({ type: 'power_cell', x: 4250, y: 340, collected: false });
  collectibles.push({ type: 'star', x: 5750, y: 280, collected: false }); // Hadiah bintang di atas boss arena

  // 6. DEKORASI PROSEDURAL ALAM BERDASAR SEED
  let seed = 42;
  for (let x = 60; x < LEVEL_WIDTH - 200; x += 110) {
    // Jangan tumpang tindih dengan jurang
    const inChasm = chasms.some(c => x >= c.start - 40 && x <= c.end + 40);
    if (inChasm) continue;

    const r = pseudoRandom(seed++);
    const zone = getZoneAt(x);
    if (r > 0.35 && zone.decorations.length > 0) {
      const decIndex = Math.floor(pseudoRandom(seed++) * zone.decorations.length);
      const decAsset = zone.decorations[decIndex];
      const scale = 0.8 + pseudoRandom(seed++) * 0.45;
      const flipX = pseudoRandom(seed++) > 0.5;

      decorations.push({
        asset: decAsset,
        x: x + (pseudoRandom(seed++) * 40 - 20),
        y: GROUND_Y,
        scale,
        flipX,
        isForeground: pseudoRandom(seed++) > 0.85
      });
    }
  }

  return {
    width: LEVEL_WIDTH,
    height: LEVEL_HEIGHT,
    groundY: GROUND_Y,
    platforms,
    decorations,
    collectibles,
    checkpoints,
    enemySpawns,
    finishX: 6300
  };
}

export function getZoneAt(x) {
  for (let i = 0; i < ZONES.length; i++) {
    if (x >= ZONES[i].startX && x < ZONES[i].endX) {
      return ZONES[i];
    }
  }
  return ZONES[ZONES.length - 1];
}

export function getSkyColors(cameraX) {
  const currentZone = getZoneAt(cameraX);
  // Cek apakah mendekati transisi (jarak 200px sebelum batas zona)
  const nextZoneIndex = ZONES.indexOf(currentZone) + 1;
  if (nextZoneIndex < ZONES.length) {
    const nextZone = ZONES[nextZoneIndex];
    const distToBoundary = nextZone.startX - cameraX;
    if (distToBoundary > 0 && distToBoundary <= 300) {
      // Fade transisi
      const factor = 1 - (distToBoundary / 300);
      return {
        top: lerpColor(currentZone.skyTop, nextZone.skyTop, factor),
        bottom: lerpColor(currentZone.skyBottom, nextZone.skyBottom, factor),
        ambient: nextZone.ambientColor
      };
    }
  }
  return {
    top: currentZone.skyTop,
    bottom: currentZone.skyBottom,
    ambient: currentZone.ambientColor
  };
}

function lerpColor(a, b, t) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  if (!c1 || !c2) return a;
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const bl = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex) {
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}
