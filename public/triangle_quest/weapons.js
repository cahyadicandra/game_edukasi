/**
 * weapons.js - Sistem Senjata Modular & Komputasi Stat untuk Triangle Quest
 */

export const WEAPON_PARTS_DB = {
  // === 1. BODY (BLASTER DASAR) ===
  blaster: {
    id: 'blaster',
    name: 'Blaster Segitiga',
    slot: 'body',
    rarity: 'common',
    desc: 'Rangka blaster standar andalan penjelajah geometri.',
    baseStats: {
      damage: 1,
      fireRate: 3.5,       // tembakan per detik
      range: 480,          // jarak jangkauan piksel
      projectileSpeed: 620, // kecepatan peluru px/s
      spread: 0,           // sebaran sudut derajat
      ammoMax: 100,
      pierce: 0,
      bounce: 0,
      critChance: 0.05,
      critMult: 1.5,
    },
  },

  // === 2. CORE (PROYEKTIL & EFEK STATUS) ===
  core_orb: {
    id: 'core_orb',
    name: 'Inti Orb Bulat',
    slot: 'core',
    rarity: 'common',
    projectile: 'bullet_orb',
    desc: 'Menembakkan peluru energi bulat standar berkecepatan tinggi.',
    mods: { damage: 0, projectileSpeed: 40 },
    effect: null,
  },
  core_fire: {
    id: 'core_fire',
    name: 'Inti Api Membara',
    slot: 'core',
    rarity: 'rare',
    projectile: 'bullet_fire',
    desc: 'Peluru api bersuhu tinggi yang membakar musuh selama beberapa detik.',
    mods: { damage: 1, range: -60, fireRate: -0.4 },
    effect: 'burn',
  },
  core_ice: {
    id: 'core_ice',
    name: 'Inti Es Kristal',
    slot: 'core',
    rarity: 'rare',
    projectile: 'bullet_ice',
    desc: 'Peluru es beku yang memperlambat laju jalan musuh hingga 50% selama 2 detik.',
    mods: { projectileSpeed: -40, range: 40 },
    effect: 'freeze',
  },
  core_star: {
    id: 'core_star',
    name: 'Inti Bintang Pantul',
    slot: 'core',
    rarity: 'epic',
    projectile: 'bullet_star',
    desc: 'Bintang kinetik berputar yang dapat memantul sekali di permukaan platform.',
    mods: { bounce: 1, critChance: 0.1 },
    effect: 'bounce',
  },
  core_laser: {
    id: 'core_laser',
    name: 'Inti Laser Tembus',
    slot: 'core',
    rarity: 'legendary',
    projectile: 'bullet_laser',
    desc: 'Sinar laser berkecepatan cahaya yang menembus barisan musuh sekaligus.',
    mods: { damage: 2, pierce: 3, fireRate: -0.8, projectileSpeed: 300, range: 200 },
    effect: 'pierce',
  },

  // === 3. BARREL (LARAS PENENTU JARAK & SEBARAN) ===
  barrel_std: {
    id: 'barrel_std',
    name: 'Laras Standar',
    slot: 'barrel',
    rarity: 'common',
    desc: 'Laras presisi seimbang untuk segala situasi.',
    mods: {},
  },
  barrel_long: {
    id: 'barrel_long',
    name: 'Laras Panjang Rifled',
    slot: 'barrel',
    rarity: 'rare',
    desc: 'Meningkatkan jangkauan tembak dan akurasi, sedikit menurunkan kecepatan tembak.',
    mods: { range: 180, spread: -0.05, fireRate: -0.3, projectileSpeed: 100 },
  },
  barrel_wide: {
    id: 'barrel_wide',
    name: 'Laras Lebar Scatter',
    slot: 'barrel',
    rarity: 'epic',
    desc: 'Menyebarkan proyektil ganda untuk menjangkau area luas di depan.',
    mods: { spread: 12, damage: 0.5, fireRate: 0.5, range: -100 },
  },
  barrel_sniper: {
    id: 'barrel_sniper',
    name: 'Laras Sniper Rail',
    slot: 'barrel',
    rarity: 'legendary',
    desc: 'Laras elektromagnetik berdaya jangkau ekstrem dengan peluang critical tinggi.',
    mods: { range: 350, projectileSpeed: 250, critChance: 0.2, critMult: 0.5, fireRate: -0.9 },
  },

  // === 4. GRIP (PEGANGAN PENENTU FIRE RATE & RECOIL) ===
  grip_std: {
    id: 'grip_std',
    name: 'Grip Karet Standar',
    slot: 'grip',
    rarity: 'common',
    desc: 'Genggaman nyaman dan stabil.',
    mods: {},
  },
  grip_rapid: {
    id: 'grip_rapid',
    name: 'Pemicu Cepat Turbo',
    slot: 'grip',
    rarity: 'rare',
    desc: 'Menaikkan laju tembakan secara signifikan dengan sedikit pengurangan damage.',
    mods: { fireRate: 1.4, damage: -0.2 },
  },
  grip_steady: {
    id: 'grip_steady',
    name: 'Grip Peredam Getar',
    slot: 'grip',
    rarity: 'epic',
    desc: 'Meredam getaran dan menambah kestabilan lintasan tembakan.',
    mods: { fireRate: 0.5, range: 60, critChance: 0.08 },
  },

  // === 5. CHARM (AZIMAT BONUS PASIF) ===
  charm_lucky: {
    id: 'charm_lucky',
    name: 'Azimat Daun Semanggi',
    slot: 'charm',
    rarity: 'rare',
    desc: 'Meningkatkan perolehan koin +20% dari musuh yang dikalahkan.',
    mods: { critChance: 0.08 },
    passive: 'coinBonus:0.2',
  },
  charm_vitality: {
    id: 'charm_vitality',
    name: 'Azimat Kristal Nyawa',
    slot: 'charm',
    rarity: 'rare',
    desc: 'Peluang musuh menjatuhkan hati merah bertambah 15%.',
    mods: {},
    passive: 'heartDrop:0.15',
  },
  charm_bouncy: {
    id: 'charm_bouncy',
    name: 'Azimat Pegas Karet',
    slot: 'charm',
    rarity: 'epic',
    desc: 'Menambahkan 1x pantulan ekstra untuk semua proyektil.',
    mods: { bounce: 1 },
    passive: 'extraBounce:1',
  },
  charm_fury: {
    id: 'charm_fury',
    name: 'Azimat Api Geometri',
    slot: 'charm',
    rarity: 'legendary',
    desc: 'Tembakan critical memicu ledakan berantai kecil.',
    mods: { critChance: 0.15, critMult: 0.8, damage: 1 },
    passive: 'critExplosion:1',
  },
};

/**
 * Biaya upgrade part berdasarkan level tujuan (2 s/d 5)
 */
export function getUpgradeCost(targetLevel, rarity) {
  const baseCost = {
    common:    { coins: 50,  shards: 5 },
    rare:      { coins: 100, shards: 12 },
    epic:      { coins: 250, shards: 30 },
    legendary: { coins: 600, shards: 80 },
  }[rarity] || { coins: 50, shards: 5 };

  const multiplier = Math.pow(1.6, targetLevel - 2);
  return {
    coins: Math.round(baseCost.coins * multiplier),
    shards: Math.round(baseCost.shards * multiplier),
  };
}

/**
 * Komputasi stat gabungan dari susunan part senjata
 * @param {Object} weapon - { body, core, barrel, grip, charm }
 * @param {Object} partsInventory - Objek SAVE.parts untuk memperhitungkan level upgrade
 */
export function computeStats(weapon, partsInventory = {}) {
  const body = WEAPON_PARTS_DB[weapon.body] || WEAPON_PARTS_DB.blaster;
  const core = WEAPON_PARTS_DB[weapon.core] || WEAPON_PARTS_DB.core_orb;
  const barrel = WEAPON_PARTS_DB[weapon.barrel] || WEAPON_PARTS_DB.barrel_std;
  const grip = WEAPON_PARTS_DB[weapon.grip] || WEAPON_PARTS_DB.grip_std;
  const charm = WEAPON_PARTS_DB[weapon.charm] || null;

  // Base stats dari body
  const stats = { ...body.baseStats };

  // Helper apply modifier dengan perhitungkan level upgrade
  const applyMod = (part) => {
    if (!part || !part.mods) return;
    const invData = partsInventory[part.id] || { level: 1 };
    const levelBonus = 1 + (invData.level - 1) * 0.18; // +18% stat per level

    for (const [key, val] of Object.entries(part.mods)) {
      if (typeof val === 'number') {
        const scaledVal = val * (val > 0 ? levelBonus : 1);
        stats[key] = (stats[key] || 0) + scaledVal;
      }
    }
  };

  applyMod(core);
  applyMod(barrel);
  applyMod(grip);
  if (charm) applyMod(charm);

  // Minimal clamping agar tidak bernilai negatif/absurd
  stats.damage = Math.max(0.5, Math.round(stats.damage * 10) / 10);
  stats.fireRate = Math.max(1.0, Math.min(10.0, Math.round(stats.fireRate * 10) / 10));
  stats.range = Math.max(250, Math.round(stats.range));
  stats.projectileSpeed = Math.max(350, Math.round(stats.projectileSpeed));
  stats.spread = Math.max(0, Math.round(stats.spread * 10) / 10);
  stats.critChance = Math.max(0.01, Math.min(0.8, Math.round(stats.critChance * 100) / 100));
  stats.critMult = Math.max(1.2, Math.round(stats.critMult * 10) / 10);
  stats.pierce = Math.max(0, Math.floor(stats.pierce || 0));
  stats.bounce = Math.max(0, Math.floor(stats.bounce || 0));

  // Tipe proyektil dan efek
  stats.projectile = core.projectile || 'bullet_orb';
  stats.effect = core.effect || null;
  stats.passive = charm ? charm.passive : null;

  return stats;
}
