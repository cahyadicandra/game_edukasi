/**
 * save.js - Penyimpanan Lokal Berversi & RNG Terkendali untuk Triangle Quest
 */

export const SAVE_KEY = 'triangle_quest_save_v2';

// 8 Pilihan Palet Warna Kustomisasi Blaster
export const BLASTER_PALETTES = [
  { id: 'classic', name: 'Klasik Emas', hex: '#f59e0b' },
  { id: 'crimson', name: 'Merah Bara', hex: '#ef4444' },
  { id: 'ocean',   name: 'Biru Samudra', hex: '#0284c7' },
  { id: 'emerald', name: 'Hijau Zamrud', hex: '#10b981' },
  { id: 'amethyst',name: 'Ungu Mistis', hex: '#8b5cf6' },
  { id: 'obsidian',name: 'Hitam Bayangan', hex: '#334155' },
  { id: 'bubblegum',name:'Merah Muda', hex: '#ec4899' },
  { id: 'cyan',    name: 'Neon Cyan', hex: '#06b6d4' },
];

export const DEFAULT_SAVE = {
  version: 2,
  coins: 200,
  tickets: 5,
  shards: 30,
  highScore: 0,
  activeLoadoutIndex: 0,
  blasterColor: '#f59e0b',
  pity: {
    weapons: { epic: 0, legendary: 0 },
    character: { epic: 0, legendary: 0 },
    effects: { epic: 0, legendary: 0 },
  },
  // Inventaris part senjata: key = partId, value = { level: 1..5, count: number }
  parts: {
    core_orb:    { level: 1, count: 1 },
    barrel_std:  { level: 1, count: 1 },
    grip_std:    { level: 1, count: 1 },
  },
  // 3 Loadout yang tersimpan
  loadouts: [
    { name: 'Loadout 1', body: 'blaster', core: 'core_orb', barrel: 'barrel_std', grip: 'grip_std', charm: null },
    { name: 'Loadout 2', body: 'blaster', core: 'core_orb', barrel: 'barrel_std', grip: 'grip_std', charm: null },
    { name: 'Loadout 3', body: 'blaster', core: 'core_orb', barrel: 'barrel_std', grip: 'grip_std', charm: null },
  ],
  cosmetics: {
    unlockedSkins: ['default'],
    activeSkin: 'default',
    unlockedAccessories: [],
    activeAccessory: null,
    unlockedEffects: ['default'],
    activeEffect: 'default',
  },
  dailyMissions: [
    { id: 'm1', desc: 'Kalahkan 15 Slime Hijau', target: 15, current: 0, rewardTickets: 1, claimed: false },
    { id: 'm2', desc: 'Kumpulkan 80 Koin', target: 80, current: 0, rewardTickets: 1, claimed: false },
    { id: 'm3', desc: 'Selesaikan 1 Putaran Level', target: 1, current: 0, rewardTickets: 2, claimed: false },
  ],
  settings: {
    sfx: true,
    music: true,
    haptics: true,
  },
  rngSeed: 123456789,
};

export let SAVE = JSON.parse(JSON.stringify(DEFAULT_SAVE));

/**
 * Seeded PRNG Mulberry32 untuk RNG tersimpan
 */
export function seededRandom() {
  SAVE.rngSeed |= 0;
  SAVE.rngSeed = (SAVE.rngSeed + 0x6d2b79f5) | 0;
  let t = Math.imul(SAVE.rngSeed ^ (SAVE.rngSeed >>> 15), 1 | SAVE.rngSeed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t >>> 0) / 4294967296);
}

/**
 * Muat data simpanan dari localStorage
 */
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        SAVE = {
          ...DEFAULT_SAVE,
          ...parsed,
          parts: { ...DEFAULT_SAVE.parts, ...(parsed.parts || {}) },
          pity: { ...DEFAULT_SAVE.pity, ...(parsed.pity || {}) },
          cosmetics: { ...DEFAULT_SAVE.cosmetics, ...(parsed.cosmetics || {}) },
          settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) },
          loadouts: parsed.loadouts || DEFAULT_SAVE.loadouts,
        };
      }
    }
  } catch (err) {
    console.warn('[Save] Gagal membaca data simpanan, menggunakan data awal:', err);
    SAVE = JSON.parse(JSON.stringify(DEFAULT_SAVE));
  }

  // Dukungan mode debug (?debug=1 di URL)
  if (typeof window !== 'undefined' && window.location.search.includes('debug=1')) {
    SAVE.coins = 9999;
    SAVE.tickets = 9999;
    SAVE.shards = 9999;
    console.log('⚡ [Debug Mode Aktif]: Saldo 9999 Koin, 9999 Tiket, 9999 Shard ditambahkan!');
  }

  return SAVE;
}

/**
 * Simpan data permainan ke localStorage
 */
export function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE));
  } catch (err) {
    console.warn('[Save] Gagal menyimpan ke localStorage:', err);
  }
}

/**
 * Reset seluruh data simpanan ke awal
 */
export function resetSave() {
  SAVE = JSON.parse(JSON.stringify(DEFAULT_SAVE));
  saveGame();
}

/**
 * Ekspor data simpanan sebagai JSON
 */
export function exportSaveJSON() {
  return JSON.stringify(SAVE, null, 2);
}

/**
 * Impor data simpanan dari teks JSON
 */
export function importSaveJSON(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.version) {
      SAVE = { ...DEFAULT_SAVE, ...parsed };
      saveGame();
      return true;
    }
  } catch {
    // Format JSON tidak valid
  }
  return false;
}

export function hasItem(itemId) {
  if (SAVE.parts[itemId]) return true;
  if (SAVE.cosmetics.unlockedSkins.includes(itemId)) return true;
  if (SAVE.cosmetics.unlockedAccessories.includes(itemId)) return true;
  if (SAVE.cosmetics.unlockedEffects.includes(itemId)) return true;
  return false;
}

export function unlockItem(item) {
  if (item.type === 'part') {
    if (!SAVE.parts[item.id]) {
      SAVE.parts[item.id] = { level: 1, count: 1 };
    } else {
      SAVE.parts[item.id].count += 1;
    }
  } else if (item.type === 'skin') {
    if (!SAVE.cosmetics.unlockedSkins.includes(item.id)) {
      SAVE.cosmetics.unlockedSkins.push(item.id);
    }
  } else if (item.type === 'hat') {
    if (!SAVE.cosmetics.unlockedAccessories.includes(item.id)) {
      SAVE.cosmetics.unlockedAccessories.push(item.id);
    }
  } else if (item.type === 'trail' || item.type === 'spark' || item.type === 'explosion') {
    if (!SAVE.cosmetics.unlockedEffects.includes(item.id)) {
      SAVE.cosmetics.unlockedEffects.push(item.id);
    }
  }
  saveGame();
}

// Global hookup
if (typeof window !== 'undefined') {
  window.SaveSystem = {
    get: () => SAVE,
    load: loadSave,
    save: saveGame,
    reset: resetSave,
    hasItem,
    unlockItem,
    exportJSON: exportSaveJSON,
    importJSON: importSaveJSON
  };
}
