/**
 * gacha.js - Sistem Gacha, Banner, Rate, dan Koleksi untuk Triangle Quest
 */

import { SAVE, saveGame, hasItem, unlockItem } from './save.js';

export const GACHA_RATES = {
  common: 0.60,
  rare: 0.28,
  epic: 0.10,
  legendary: 0.02
};

export const SHARD_CONVERSION = {
  common: 10,
  rare: 25,
  epic: 75,
  legendary: 250
};

export const RARITY_COLORS = {
  common: '#9E9E9E',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FFD700'
};

export const GACHA_POOLS = {
  weapons: [
    // Common
    { id: 'barrel_std', type: 'part', name: 'Laras Standar', rarity: 'common', icon: 'barrel_std' },
    { id: 'grip_std', type: 'part', name: 'Grip Standar', rarity: 'common', icon: 'grip_std' },
    { id: 'core_orb', type: 'part', name: 'Inti Orb Bulat', rarity: 'common', icon: 'bullet_orb' },
    { id: 'barrel_short', type: 'part', name: 'Laras Pendek CQB', rarity: 'common', icon: 'barrel_short' },
    { id: 'grip_tactical', type: 'part', name: 'Grip Taktis Ringan', rarity: 'common', icon: 'grip_tactical' },
    // Rare
    { id: 'barrel_long', type: 'part', name: 'Laras Jarak Jauh', rarity: 'rare', icon: 'barrel_long' },
    { id: 'core_star', type: 'part', name: 'Inti Bintang Pantul', rarity: 'rare', icon: 'bullet_star' },
    { id: 'grip_rapid', type: 'part', name: 'Grip Pemantik Cepat', rarity: 'rare', icon: 'grip_rapid' },
    { id: 'charm_speed', type: 'part', name: 'Jimat Kecepatan Angin', rarity: 'rare', icon: 'charm_speed' },
    // Epic
    { id: 'core_fire', type: 'part', name: 'Inti Api Membara', rarity: 'epic', icon: 'bullet_fire' },
    { id: 'core_ice', type: 'part', name: 'Inti Es Kristal', rarity: 'epic', icon: 'bullet_ice' },
    { id: 'barrel_sniper', type: 'part', name: 'Laras Penembak Runduk', rarity: 'epic', icon: 'barrel_sniper' },
    { id: 'charm_lucky', type: 'part', name: 'Jimat Keberuntungan', rarity: 'epic', icon: 'charm_lucky' },
    { id: 'charm_tank', type: 'part', name: 'Jimat Perisai Baja', rarity: 'epic', icon: 'charm_tank' },
    // Legendary
    { id: 'core_laser', type: 'part', name: 'Inti Sinar Laser Penembus', rarity: 'legendary', icon: 'bullet_laser' },
    { id: 'charm_vampire', type: 'part', name: 'Jimat Penghisap Jiwa', rarity: 'legendary', icon: 'charm_vampire' }
  ],

  character: [
    // Common
    { id: 'skin_lime', type: 'skin', name: 'Warna Hijau Jeruk', rarity: 'common', icon: 'player_idle', color: '#8BC34A' },
    { id: 'skin_cyan', type: 'skin', name: 'Warna Sian Es', rarity: 'common', icon: 'player_idle', color: '#00BCD4' },
    { id: 'skin_orange', type: 'skin', name: 'Warna Jingga Terang', rarity: 'common', icon: 'player_idle', color: '#FF9800' },
    // Rare
    { id: 'acc_glasses', type: 'hat', name: 'Kacamata Hitam Keren', rarity: 'rare', icon: 'sunglasses' },
    { id: 'acc_scout_cap', type: 'hat', name: 'Topi Petualang Pramuka', rarity: 'rare', icon: 'scout_hat' },
    { id: 'skin_purple', type: 'skin', name: 'Warna Violet Mistik', rarity: 'rare', icon: 'player_idle', color: '#9C27B0' },
    // Epic
    { id: 'acc_cowboy_hat', type: 'hat', name: 'Topi Koboi Gurun', rarity: 'epic', icon: 'cowboy_hat' },
    { id: 'acc_wizard_hat', type: 'hat', name: 'Topi Penyihir Bintang', rarity: 'epic', icon: 'wizard_hat' },
    { id: 'skin_crimson', type: 'skin', name: 'Warna Ksatria Merah Bara', rarity: 'epic', icon: 'player_idle', color: '#E91E63' },
    // Legendary
    { id: 'acc_golden_crown', type: 'hat', name: 'Mahkota Emas Geometri', rarity: 'legendary', icon: 'crown' },
    { id: 'skin_golden_hero', type: 'skin', name: 'Segitiga Emas Legendaris', rarity: 'legendary', icon: 'player_idle', color: '#FFD700' }
  ],

  effects: [
    // Common
    { id: 'trail_smoke', type: 'trail', name: 'Jejak Asap Tipis', rarity: 'common', icon: 'smoke' },
    { id: 'spark_white', type: 'spark', name: 'Percikan Perak Murni', rarity: 'common', icon: 'hit_spark_1' },
    // Rare
    { id: 'trail_sparkles', type: 'trail', name: 'Jejak Bintang Berpendar', rarity: 'rare', icon: 'star' },
    { id: 'burst_plasma', type: 'explosion', name: 'Ledakan Plasma Ungu', rarity: 'rare', icon: 'explosion_1' },
    // Epic
    { id: 'trail_rainbow', type: 'trail', name: 'Jejak Pelangi Spektrum', rarity: 'epic', icon: 'rainbow' },
    { id: 'spark_gold', type: 'spark', name: 'Percikan Kilau Emas', rarity: 'epic', icon: 'hit_spark_2' },
    // Legendary
    { id: 'burst_supernova', type: 'explosion', name: 'Ledakan Kosmik Supernova', rarity: 'legendary', icon: 'explosion_4' },
    { id: 'trail_fire', type: 'trail', name: 'Jejak Kobaran Api', rarity: 'legendary', icon: 'bullet_fire' }
  ]
};

export const BANNERS = {
  weapons: {
    id: 'weapons',
    name: 'Arsenal Senjata Modular',
    desc: 'Dapatkan Part modular: Core peluru elemen, Barrel presisi tinggi, dan Charm legendaris.',
    featured: 'core_laser',
    currency: 'coins',
    costSingle: 100,
    costTen: 900,
    ticketAllowed: true
  },
  character: {
    id: 'character',
    name: 'Gaya & Penampilan Petualang',
    desc: 'Buka topi unik, mahkota raja, kacamata gaya, dan warna tubuh segitiga!',
    featured: 'acc_golden_crown',
    currency: 'tickets',
    costSingle: 1,
    costTen: 10,
    ticketAllowed: true
  },
  effects: {
    id: 'effects',
    name: 'Visual & Efek Spesial',
    desc: 'Koleksi jejak peluru pelangi, percikan berkilau, dan animasi ledakan supernova.',
    featured: 'burst_supernova',
    currency: 'coins',
    costSingle: 150,
    costTen: 1350,
    ticketAllowed: true
  }
};

export const SET_BONUSES = [
  {
    id: 'set_fire',
    name: 'Set Penguasa Api (3 Item Api/Merah)',
    parts: ['core_fire', 'skin_crimson', 'trail_fire'],
    bonus: '+10% Efek Bakar (Burn Damage)',
    active: () => hasItem('core_fire') && hasItem('skin_crimson') && hasItem('trail_fire')
  },
  {
    id: 'set_sniper',
    name: 'Set Penembak Jitu (3 Item Akurasi)',
    parts: ['barrel_sniper', 'acc_glasses', 'spark_gold'],
    bonus: '+15% Peluang Serangan Kritis',
    active: () => hasItem('barrel_sniper') && hasItem('acc_glasses') && hasItem('spark_gold')
  },
  {
    id: 'set_royalty',
    name: 'Set Mahkota Emas Legendaris',
    parts: ['acc_golden_crown', 'skin_golden_hero', 'burst_supernova'],
    bonus: '+25% Drop Koin & Shard dari Musuh',
    active: () => hasItem('acc_golden_crown') && hasItem('skin_golden_hero') && hasItem('burst_supernova')
  }
];

export function getPity(bannerId) {
  if (!SAVE.pity[bannerId]) {
    SAVE.pity[bannerId] = { epic: 0, legendary: 0 };
  }
  return SAVE.pity[bannerId];
}

export function rollRarity(bannerId) {
  const p = getPity(bannerId);

  // Legendary pity: tarikan ke-50 dijamin legendary
  if (p.legendary >= 49) {
    return 'legendary';
  }
  // Epic pity: tarikan ke-10 dijamin minimal epic
  if (p.epic >= 9) {
    return Math.random() < 0.15 ? 'legendary' : 'epic';
  }

  const rand = Math.random();
  if (rand < GACHA_RATES.legendary) return 'legendary';
  if (rand < GACHA_RATES.legendary + GACHA_RATES.epic) return 'epic';
  if (rand < GACHA_RATES.legendary + GACHA_RATES.epic + GACHA_RATES.rare) return 'rare';
  return 'common';
}

export function pullSingle(bannerId, isGuaranteedRare = false) {
  const banner = BANNERS[bannerId];
  if (!banner) throw new Error('Banner tidak dikenal: ' + bannerId);

  let rarity = rollRarity(bannerId);
  if (isGuaranteedRare && rarity === 'common') {
    rarity = 'rare';
  }

  const p = getPity(bannerId);
  if (rarity === 'legendary') {
    p.legendary = 0;
    p.epic = 0;
  } else if (rarity === 'epic') {
    p.epic = 0;
    p.legendary += 1;
  } else {
    p.epic += 1;
    p.legendary += 1;
  }

  const pool = GACHA_POOLS[bannerId].filter(item => item.rarity === rarity);
  let pickedItem = null;

  // Featured 50% boost jika legendary
  if (rarity === 'legendary' && banner.featured) {
    const feat = pool.find(item => item.id === banner.featured);
    if (feat && Math.random() < 0.5) {
      pickedItem = feat;
    }
  }

  if (!pickedItem) {
    if (pool.length > 0) {
      pickedItem = pool[Math.floor(Math.random() * pool.length)];
    } else {
      pickedItem = GACHA_POOLS[bannerId][0];
    }
  }

  const isNew = !hasItem(pickedItem.id);
  let shardsGained = 0;

  if (isNew) {
    unlockItem(pickedItem);
  } else {
    shardsGained = SHARD_CONVERSION[pickedItem.rarity] || 10;
    SAVE.shards = (SAVE.shards || 0) + shardsGained;
  }

  saveGame();

  return {
    item: pickedItem,
    rarity: pickedItem.rarity,
    isNew,
    shardsGained,
    pity: { ...p }
  };
}

export function pullTen(bannerId) {
  const results = [];
  let hasRareOrBetter = false;

  for (let i = 0; i < 9; i++) {
    const res = pullSingle(bannerId, false);
    if (res.rarity !== 'common') hasRareOrBetter = true;
    results.push(res);
  }

  // Tarikan ke-10 dijamin minimal Rare bila 9 sebelumnya common
  const last = pullSingle(bannerId, !hasRareOrBetter);
  results.push(last);

  return results;
}

export function canAfford(bannerId, count) {
  const banner = BANNERS[bannerId];
  const isTen = count === 10;

  if (banner.currency === 'tickets') {
    const cost = isTen ? banner.costTen : banner.costSingle;
    return SAVE.tickets >= cost;
  } else {
    const costCoins = isTen ? banner.costTen : banner.costSingle;
    const costTickets = isTen ? 10 : 1;
    return SAVE.coins >= costCoins || (banner.ticketAllowed && SAVE.tickets >= costTickets);
  }
}

export function deductCost(bannerId, count) {
  const banner = BANNERS[bannerId];
  const isTen = count === 10;

  if (banner.currency === 'tickets') {
    const cost = isTen ? banner.costTen : banner.costSingle;
    SAVE.tickets -= cost;
  } else {
    const costCoins = isTen ? banner.costTen : banner.costSingle;
    const costTickets = isTen ? 10 : 1;
    if (SAVE.tickets >= costTickets && banner.ticketAllowed) {
      SAVE.tickets -= costTickets;
    } else {
      SAVE.coins -= costCoins;
    }
  }
  saveGame();
}

export function getAllItems() {
  const list = [];
  Object.keys(GACHA_POOLS).forEach(bKey => {
    GACHA_POOLS[bKey].forEach(item => {
      list.push({ ...item, banner: bKey });
    });
  });
  return list;
}

export function getCollectionStats() {
  const all = getAllItems();
  const owned = all.filter(item => hasItem(item.id));
  return {
    total: all.length,
    owned: owned.length,
    percent: Math.round((owned.length / all.length) * 100)
  };
}

if (typeof window !== 'undefined') {
  window.GachaSystem = {
    RATES: GACHA_RATES,
    COLORS: RARITY_COLORS,
    SHARD_CONVERSION,
    POOLS: GACHA_POOLS,
    BANNERS,
    SET_BONUSES,
    pullSingle,
    pullTen,
    canAfford,
    deductCost,
    getAllItems,
    getCollectionStats,
    getPity
  };
}
