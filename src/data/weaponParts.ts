import type { WeaponPart, WeaponLoadout } from '../types/game';

// ─── 1. KATALOG BAGIAN SENJATA (5 SLOT MODULAR) ───
export const WEAPON_PARTS_CATALOG: Record<string, WeaponPart> = {
  // --- BODY (Bodi Blaster) ---
  blaster_std: {
    id: 'blaster_std',
    slot: 'body',
    name: 'Blaster Standar Petualang',
    rarity: 'common',
    level: 1,
    description: 'Bodi blaster seimbang dari aluminium tembaga. Sangat andal di segala medan.',
    icon: '🔫',
    iconAsset: '/assets/png/attack/blaster.png',
    unlockCostCoins: 0,
    mods: { damage: 0, fireRate: 0, range: 0, projectileSpeed: 0, critChance: 0 },
  },
  blaster_heavy: {
    id: 'blaster_heavy',
    slot: 'body',
    name: 'Blaster Delta Berat',
    rarity: 'rare',
    level: 1,
    description: 'Bodi tebal dengan daya hantam tinggi, namun sedikit memperlambat kecepatan tembak.',
    icon: '🛡️',
    iconAsset: '/assets/png/attack/blaster.png',
    unlockCostCoins: 350,
    mods: { damage: 1, fireRate: -0.5, range: 40, projectileSpeed: -50, critChance: 2 },
  },
  blaster_compact: {
    id: 'blaster_compact',
    slot: 'body',
    name: 'Blaster Cepat Prisma',
    rarity: 'epic',
    level: 1,
    description: 'Bodi seringan kristal dengan laju tembak sangat gesit dan lincah.',
    icon: '⚡',
    iconAsset: '/assets/png/attack/blaster.png',
    unlockCostCoins: 750,
    mods: { damage: -0.2, fireRate: 1.2, range: -30, projectileSpeed: 100, critChance: 5 },
  },

  // --- CORE (Inti Peluru) ---
  core_orb: {
    id: 'core_orb',
    slot: 'core',
    name: 'Inti Orb Energi (Standar)',
    rarity: 'common',
    level: 1,
    projectile: 'bullet_orb',
    description: 'Peluru plasma orb standar, laju stabil dan hentakan seimbang.',
    icon: '🔵',
    iconAsset: '/assets/png/attack/bullet_orb.png',
    unlockCostCoins: 0,
    mods: { damage: 1, fireRate: 0, projectileSpeed: 750 },
  },
  core_fire: {
    id: 'core_fire',
    slot: 'core',
    name: 'Inti Api Membara (Burn)',
    rarity: 'rare',
    level: 1,
    projectile: 'bullet_fire',
    effect: 'burn',
    description: 'Peluru bola api berkobar. Memberikan efek bakar berkala pada monster!',
    icon: '🔥',
    iconAsset: '/assets/png/attack/bullet_fire.png',
    unlockCostCoins: 300,
    mods: { damage: 2, fireRate: -0.3, range: -50, projectileSpeed: 680, critChance: 3 },
  },
  core_ice: {
    id: 'core_ice',
    slot: 'core',
    name: 'Inti Es Kristal (Freeze)',
    rarity: 'rare',
    level: 1,
    projectile: 'bullet_ice',
    effect: 'freeze',
    description: 'Peluru es salju kristal. Membekukan dan melambatkan pergerakan monster!',
    icon: '❄️',
    iconAsset: '/assets/png/attack/bullet_ice.png',
    unlockCostCoins: 450,
    mods: { damage: 1.2, fireRate: 0.2, projectileSpeed: 720 },
  },
  core_star: {
    id: 'core_star',
    slot: 'core',
    name: 'Inti Bintang Pantul (Bounce)',
    rarity: 'epic',
    level: 1,
    projectile: 'bullet_star',
    effect: 'bounce',
    description: 'Bintang berpendar yang memantul di permukaan platform dan mengenai musuh tersembunyi.',
    icon: '⭐',
    iconAsset: '/assets/png/attack/bullet_star.png',
    unlockCostCoins: 600,
    mods: { damage: 1.5, fireRate: 0.4, projectileSpeed: 820, critChance: 8 },
  },
  core_laser: {
    id: 'core_laser',
    slot: 'core',
    name: 'Inti Laser Tembus (Pierce)',
    rarity: 'legendary',
    level: 1,
    projectile: 'bullet_laser',
    effect: 'pierce',
    description: 'Sinar laser berkekuatan tinggi yang menembus barisan banyak musuh sekaligus!',
    icon: '⚡',
    iconAsset: '/assets/png/attack/bullet_laser.png',
    unlockCostCoins: 1000,
    mods: { damage: 3, fireRate: -0.8, range: 150, projectileSpeed: 1100, critChance: 12 },
  },

  // --- BARREL (Laras) ---
  barrel_std: {
    id: 'barrel_std',
    slot: 'barrel',
    name: 'Laras Standar 100mm',
    rarity: 'common',
    level: 1,
    description: 'Laras standar dengan akurasi terkalibrasi lurus tanpa getaran berlebih.',
    icon: '📏',
    iconAsset: '/assets/png/attack/muzzle_flash.png',
    unlockCostCoins: 0,
    mods: { range: 0, projectileSpeed: 0, spread: 0 },
  },
  barrel_long: {
    id: 'barrel_long',
    slot: 'barrel',
    name: 'Laras Panjang Presisi',
    rarity: 'rare',
    level: 1,
    description: 'Menambah jangkauan tembakan jauh dan laju peluru lebih lurus.',
    icon: '🔭',
    iconAsset: '/assets/png/attack/muzzle_flash.png',
    unlockCostCoins: 250,
    mods: { range: 120, projectileSpeed: 100, spread: -2, fireRate: -0.2 },
  },
  barrel_short: {
    id: 'barrel_short',
    slot: 'barrel',
    name: 'Laras Pendek CQB',
    rarity: 'rare',
    level: 1,
    description: 'Laras ringkas untuk pertarungan jarak dekat, meningkatkan kecepatan menembak.',
    icon: '📐',
    iconAsset: '/assets/png/attack/muzzle_flash.png',
    unlockCostCoins: 400,
    mods: { range: -60, fireRate: 0.8, spread: 3 },
  },
  barrel_sniper: {
    id: 'barrel_sniper',
    slot: 'barrel',
    name: 'Laras Prisma Sniper',
    rarity: 'legendary',
    level: 1,
    description: 'Laras optik lensa kuarsa prismatik. Jangkauan ultra jauh dengan bonus critical!',
    icon: '🎯',
    iconAsset: '/assets/png/nature/crystal_purple.png',
    unlockCostCoins: 800,
    mods: { range: 250, projectileSpeed: 250, critChance: 15, fireRate: -0.5 },
  },

  // --- GRIP (Grip / Pemicu) ---
  grip_std: {
    id: 'grip_std',
    slot: 'grip',
    name: 'Grip Polimer Klasik',
    rarity: 'common',
    level: 1,
    description: 'Genggaman nyaman dari bahan polimer bertekstur anti-selip.',
    icon: '🖐️',
    iconAsset: '/assets/png/attack/ammo_pack.png',
    unlockCostCoins: 0,
    mods: { fireRate: 0 },
  },
  grip_rapid: {
    id: 'grip_rapid',
    slot: 'grip',
    name: 'Pemicu Otomatis Cepat',
    rarity: 'rare',
    level: 1,
    description: 'Sistem pegas mekanis yang meningkatkan frekuensi tembakan per detik.',
    icon: '⏱️',
    iconAsset: '/assets/png/attack/ammo_pack.png',
    unlockCostCoins: 300,
    mods: { fireRate: 0.9, damage: -0.1 },
  },
  grip_tactical: {
    id: 'grip_tactical',
    slot: 'grip',
    name: 'Grip Taktis Ergonomis',
    rarity: 'epic',
    level: 1,
    description: 'Peredam getaran maksimal, tembakan menjadi stabil dan peluang kritikal naik.',
    icon: '🦾',
    iconAsset: '/assets/png/attack/power_cell.png',
    unlockCostCoins: 500,
    mods: { fireRate: 0.4, critChance: 6, projectileSpeed: 40 },
  },

  // --- CHARM (Jimat Pasif) ---
  charm_none: {
    id: 'charm_none',
    slot: 'charm',
    name: 'Tanpa Jimat',
    rarity: 'common',
    level: 1,
    description: 'Slot jimat kosong.',
    icon: '⚪',
    iconAsset: '',
    unlockCostCoins: 0,
    mods: {},
  },
  charm_lucky: {
    id: 'charm_lucky',
    slot: 'charm',
    name: 'Jimat Daun Keberuntungan',
    rarity: 'epic',
    level: 1,
    description: 'Meningkatkan peluang drop koin dan shard emas sebesar +25%!',
    icon: '🍀',
    iconAsset: '/assets/png/nature/crystal_blue.png',
    unlockCostCoins: 400,
    mods: { critChance: 5 },
  },
  charm_heart: {
    id: 'charm_heart',
    slot: 'charm',
    name: 'Jimat Detak Jantung Ruby',
    rarity: 'rare',
    level: 1,
    description: 'Menambah daya tahan dan regenerasi energi maskot petualang.',
    icon: '💖',
    iconAsset: '/assets/png/nature/mushroom_red.png',
    unlockCostCoins: 450,
    mods: { damage: 0.3 },
  },
  charm_speed: {
    id: 'charm_speed',
    slot: 'charm',
    name: 'Jimat Sayap Hermes',
    rarity: 'rare',
    level: 1,
    description: 'Peluru melesat lebih cepat dan lincah menembus angin!',
    icon: '🪶',
    iconAsset: '/assets/png/nature/flowers.png',
    unlockCostCoins: 500,
    mods: { projectileSpeed: 150, fireRate: 0.3 },
  },
  charm_crit: {
    id: 'charm_crit',
    slot: 'charm',
    name: 'Jimat Percikan Ledakan',
    rarity: 'legendary',
    level: 1,
    description: 'Meningkatkan serangan kritikal +20% dan ledakan percikan mematikan!',
    icon: '👁️',
    iconAsset: '/assets/png/attack/hit_spark_1.png',
    unlockCostCoins: 900,
    mods: { critChance: 20, damage: 0.5 },
  },
};

export const DEFAULT_UNLOCKED_PARTS: string[] = [
  'blaster_std',
  'core_orb',
  'barrel_std',
  'grip_std',
  'charm_none',
];

export const SLOT_INFO: Record<string, { label: string; iconAsset: string }> = {
  body: { label: 'Bodi', iconAsset: '/assets/png/attack/blaster.png' },
  core: { label: 'Inti Peluru', iconAsset: '/assets/png/attack/bullet_orb.png' },
  barrel: { label: 'Laras', iconAsset: '/assets/png/attack/muzzle_flash.png' },
  grip: { label: 'Grip', iconAsset: '/assets/png/attack/power_cell.png' },
  charm: { label: 'Jimat', iconAsset: '/assets/png/nature/crystal_blue.png' },
};

// ─── 2. PALET 8 WARNA BLASTER (TERKALIBRASI SESUAI WARNA DASAR BIRU ASET) ───
export interface BlasterColorDef {
  id: string;
  name: string;
  hex: string;
  filter: string; // CSS filter yang mengubah warna dasar biru (#2a74d8) ke warna target
}

export const BLASTER_COLORS: BlasterColorDef[] = [
  { id: 'blue', name: 'Biru Samudra (Asli)', hex: '#2563eb', filter: 'none' },
  { id: 'gold', name: 'Emas Petualang', hex: '#f59e0b', filter: 'hue-rotate(195deg) saturate(2.5) brightness(1.15)' },
  { id: 'red', name: 'Merah Magma', hex: '#ef4444', filter: 'hue-rotate(145deg) saturate(2.3) brightness(1.05)' },
  { id: 'green', name: 'Hijau Zamrud', hex: '#10b981', filter: 'hue-rotate(285deg) saturate(2.2) brightness(1.1)' },
  { id: 'purple', name: 'Ungu Mistis', hex: '#a855f7', filter: 'hue-rotate(60deg) saturate(2.3) brightness(1.1)' },
  { id: 'orange', name: 'Jingga Surya', hex: '#f97316', filter: 'hue-rotate(170deg) saturate(2.4) brightness(1.1)' },
  { id: 'black', name: 'Obsidian Gelap', hex: '#1e293b', filter: 'grayscale(1) brightness(0.35) contrast(1.3)' },
  { id: 'diamond', name: 'Putih Kristal Neon', hex: '#38bdf8', filter: 'brightness(2) contrast(1.1) saturate(0.3)' },
];

// ─── 3. KUSTOMISASI KULIT MASKOT (SKIN) ───
export interface CharacterSkinDef {
  id: string;
  name: string;
  hex: string;
  filter: string;
}

export const CHARACTER_SKINS: CharacterSkinDef[] = [
  { id: 'default', name: 'Kuning Klasik', hex: '#facc15', filter: 'none' },
  { id: 'lime', name: 'Hijau Segar', hex: '#4ade80', filter: 'hue-rotate(85deg) saturate(1.2)' },
  { id: 'cyan', name: 'Sian Dingin', hex: '#38bdf8', filter: 'hue-rotate(175deg) saturate(1.3)' },
  { id: 'orange', name: 'Jingga Mentari', hex: '#fb923c', filter: 'hue-rotate(25deg) saturate(1.4)' },
  { id: 'purple', name: 'Violet Misteri', hex: '#c084fc', filter: 'hue-rotate(240deg) saturate(1.4)' },
  { id: 'crimson', name: 'Merah Berani', hex: '#f87171', filter: 'hue-rotate(330deg) saturate(1.5)' },
  { id: 'golden', name: 'Emas Kejayaan', hex: '#fde047', filter: 'brightness(1.15) saturate(2)' },
];

// ─── 4. KUSTOMISASI TOPI & AKSESORI MASKOT ───
export interface CharacterHatDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const CHARACTER_HATS: CharacterHatDef[] = [
  { id: 'none', name: 'Tanpa Aksesori', icon: '🧢', description: 'Tampilan alami sang segitiga petualang.', rarity: 'common' },
  { id: 'crown', name: 'Mahkota Emas Raja Geometri', icon: '👑', description: 'Mahkota megah penakluk pulau dan raja bentuk!', rarity: 'legendary' },
  { id: 'glasses', name: 'Kacamata Petualang Keren', icon: '🕶️', description: 'Kacamata trendi anti-silau cahaya padang pasir.', rarity: 'rare' },
  { id: 'scout', name: 'Topi Pramuka Rimba', icon: '🤠', description: 'Topi penjelajah rimba untuk menghadapi angin kencang.', rarity: 'rare' },
  { id: 'wizard', name: 'Topi Penyihir Bintang', icon: '🧙‍♂️', description: 'Topi bertabur rasi bintang magis peninggalan arkana.', rarity: 'epic' },
  { id: 'cap', name: 'Topi Sport Merah', icon: '🧢', description: 'Topi kasual merah untuk lari cepat melompati jurang.', rarity: 'common' },
];

// ─── 5. LOADOUT BAWAAN (3 SLOT) ───
export const DEFAULT_LOADOUTS: WeaponLoadout[] = [
  {
    name: 'Loadout 1: Seimbang',
    body: 'blaster_std',
    core: 'core_orb',
    barrel: 'barrel_std',
    grip: 'grip_std',
    charm: 'charm_none',
    color: 'blue',
  },
  {
    name: 'Loadout 2: Api Membara',
    body: 'blaster_heavy',
    core: 'core_fire',
    barrel: 'barrel_short',
    grip: 'grip_rapid',
    charm: 'charm_lucky',
    color: 'red',
  },
  {
    name: 'Loadout 3: Bintang Pantul',
    body: 'blaster_compact',
    core: 'core_star',
    barrel: 'barrel_long',
    grip: 'grip_tactical',
    charm: 'charm_speed',
    color: 'gold',
  },
];

// ─── 6. BIAYA UPGRADE PART (Level 1–5: BISA MENGGUNAKAN KOIN) ───
export const UPGRADE_REQUIREMENTS: Record<number, { coins: number; shards: number; statBonusDesc: string }> = {
  1: { coins: 150, shards: 0, statBonusDesc: '+15% Kekuatan' }, // ke Lv 2
  2: { coins: 350, shards: 0, statBonusDesc: '+30% Kekuatan' }, // ke Lv 3
  3: { coins: 700, shards: 0, statBonusDesc: '+50% Kekuatan' }, // ke Lv 4
  4: { coins: 1200, shards: 0, statBonusDesc: '+75% Kekuatan Maksimal' }, // ke Lv 5
  5: { coins: 0, shards: 0, statBonusDesc: 'Level Maksimum' },
};

/**
 * Hitung perubahan stat yang didapat jika modul ini naik level
 */
export function getPartUpgradeDiff(part: WeaponPart, curLevel: number): string {
  if (curLevel >= 5) return 'Maks (Lv.5)';
  const nextLevel = curLevel + 1;
  const currentMult = 1 + (curLevel - 1) * 0.15;
  const nextMult = 1 + (nextLevel - 1) * 0.15;

  const diffs: string[] = [];
  if (part.mods?.damage) {
    const diff = Math.round((part.mods.damage * nextMult - part.mods.damage * currentMult) * 10) / 10;
    if (diff > 0) diffs.push(`+${diff} ATK`);
  }
  if (part.mods?.range) {
    const diff = Math.round(part.mods.range * nextMult - part.mods.range * currentMult);
    if (diff > 0) diffs.push(`+${diff}px Jarak`);
  }
  if (part.mods?.fireRate && part.mods.fireRate > 0) {
    diffs.push(`+0.2 Laju`);
  }
  if (part.mods?.critChance && part.mods.critChance > 0) {
    diffs.push(`+3% Krit`);
  }
  if (diffs.length === 0) {
    diffs.push(`+15% Stat`);
  }
  return `Lv.${nextLevel}: ${diffs.join(', ')}`;
}

// ─── 7. PERHITUNGAN STAT GABUNGAN SENJATA (computeStats) ───
export interface ComputedWeaponStats {
  damage: number;
  fireRate: number; // tembakan per detik
  range: number; // pixel jangkauan
  projectileSpeed: number; // pixel per detik
  critChance: number; // persentase 0 - 100
  bulletType: 'bullet_orb' | 'bullet_star' | 'bullet_fire' | 'bullet_ice' | 'bullet_laser';
  effectName: string;
}

export function computeWeaponStats(
  loadout: WeaponLoadout,
  partLevels: Record<string, number> = {}
): ComputedWeaponStats {
  const body = WEAPON_PARTS_CATALOG[loadout.body] || WEAPON_PARTS_CATALOG.blaster_std;
  const core = WEAPON_PARTS_CATALOG[loadout.core] || WEAPON_PARTS_CATALOG.core_orb;
  const barrel = WEAPON_PARTS_CATALOG[loadout.barrel] || WEAPON_PARTS_CATALOG.barrel_std;
  const grip = WEAPON_PARTS_CATALOG[loadout.grip] || WEAPON_PARTS_CATALOG.grip_std;
  const charm = loadout.charm ? WEAPON_PARTS_CATALOG[loadout.charm] : null;

  const parts = [body, core, barrel, grip, charm].filter(Boolean) as WeaponPart[];

  let damage = 1.0;
  let fireRate = 3.0; // 3 peluru per detik
  let range = 520;
  let projectileSpeed = 750;
  let critChance = 5;

  for (const part of parts) {
    const lvl = partLevels[part.id] || 1;
    const levelMult = 1 + (lvl - 1) * 0.15; // +15% stat per level tambahan

    if (part.mods) {
      if (part.mods.damage) damage += part.mods.damage * levelMult;
      if (part.mods.fireRate) fireRate += part.mods.fireRate;
      if (part.mods.range) range += part.mods.range * levelMult;
      if (part.mods.projectileSpeed) projectileSpeed += part.mods.projectileSpeed;
      if (part.mods.critChance) critChance += part.mods.critChance;
    }
  }

  // Clamping stat ke batas aman
  damage = Math.max(0.5, Math.round(damage * 10) / 10);
  fireRate = Math.max(1.0, Math.min(8.0, Math.round(fireRate * 10) / 10));
  range = Math.max(250, Math.min(900, Math.round(range)));
  projectileSpeed = Math.max(500, Math.min(1300, Math.round(projectileSpeed)));
  critChance = Math.max(0, Math.min(75, Math.round(critChance)));

  const bulletType = core.projectile || 'bullet_orb';
  let effectName = 'Standar';
  if (core.effect === 'burn') effectName = 'Bakar (Burn)';
  else if (core.effect === 'freeze') effectName = 'Beku (Freeze)';
  else if (core.effect === 'bounce') effectName = 'Pantul (Bounce)';
  else if (core.effect === 'pierce') effectName = 'Tembus (Pierce)';

  return {
    damage,
    fireRate,
    range,
    projectileSpeed,
    critChance,
    bulletType,
    effectName,
  };
}
