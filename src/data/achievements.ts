import type { PlayerProfile } from '../types/game';
import type { WorldData } from './worlds';
import type { LevelRecordItem } from '../services/localDatabase';

export type AchievementCategory = 'adventure' | 'battle' | 'collection' | 'economy';

export interface AchievementDef {
  id: string;
  category: AchievementCategory;
  title: string;
  desc: string;
  iconName: 'award' | 'zap' | 'flame' | 'shield' | 'compass' | 'crown' | 'swords' | 'gem' | 'star' | 'book';
  badgeColor: string;
  targetValue: number;
  reward: {
    type: 'star' | 'gem' | 'coin';
    amount: number;
  };
  getCurrentValue: (ctx: {
    player: PlayerProfile;
    worlds: WorldData[];
    levelRecords: Record<number, LevelRecordItem>;
  }) => number;
}

export const ACHIEVEMENTS_DATA: AchievementDef[] = [
  // 1. PETUALANGAN & LEVEL
  {
    id: 'ach-first-step',
    category: 'adventure',
    title: 'Langkah Pertama Petualang',
    desc: 'Selesaikan level pertama di Pulau Bentuk',
    iconName: 'award',
    badgeColor: '#38bdf8',
    targetValue: 1,
    reward: { type: 'star', amount: 30 },
    getCurrentValue: ({ worlds }) => {
      let count = 0;
      worlds.forEach((w) => {
        w.levels.forEach((l) => {
          if (l.num === 1 && (l.state === 'completed' || (l.stars || 0) > 0)) count++;
        });
      });
      return count;
    },
  },
  {
    id: 'ach-world-1-clear',
    category: 'adventure',
    title: 'Penakluk Pulau Bentuk',
    desc: 'Selesaikan semua level 1 - 5 di Pulau Bentuk',
    iconName: 'compass',
    badgeColor: '#0284c7',
    targetValue: 5,
    reward: { type: 'gem', amount: 15 },
    getCurrentValue: ({ worlds }) => {
      const w1 = worlds.find((w) => w.id === 'pulau-bentuk');
      if (!w1) return 0;
      return w1.levels.filter((l) => l.state === 'completed' || (l.stars || 0) > 0).length;
    },
  },
  {
    id: 'ach-levels-completed-10',
    category: 'adventure',
    title: 'Penjelajah Tangguh',
    desc: 'Selesaikan total 10 level berbeda di peta petualangan',
    iconName: 'compass',
    badgeColor: '#10b981',
    targetValue: 10,
    reward: { type: 'coin', amount: 150 },
    getCurrentValue: ({ worlds }) => {
      let total = 0;
      worlds.forEach((w) => {
        total += w.levels.filter((l) => l.state === 'completed' || (l.stars || 0) > 0).length;
      });
      return total;
    },
  },
  {
    id: 'ach-perfect-stars-5',
    category: 'adventure',
    title: 'Bintang Gemilang',
    desc: 'Raih 3 bintang emas di 5 level berbeda',
    iconName: 'crown',
    badgeColor: '#facc15',
    targetValue: 5,
    reward: { type: 'gem', amount: 20 },
    getCurrentValue: ({ worlds }) => {
      let threeStars = 0;
      worlds.forEach((w) => {
        threeStars += w.levels.filter((l) => (l.stars || 0) >= 3).length;
      });
      return threeStars;
    },
  },
  {
    id: 'ach-perfect-stars-15',
    category: 'adventure',
    title: 'Jawara Tiga Bintang',
    desc: 'Raih 3 bintang emas di 15 level berbeda',
    iconName: 'crown',
    badgeColor: '#f59e0b',
    targetValue: 15,
    reward: { type: 'gem', amount: 40 },
    getCurrentValue: ({ worlds }) => {
      let threeStars = 0;
      worlds.forEach((w) => {
        threeStars += w.levels.filter((l) => (l.stars || 0) >= 3).length;
      });
      return threeStars;
    },
  },

  // 2. PERTARUNGAN BOS & KUIS
  {
    id: 'ach-first-boss',
    category: 'battle',
    title: 'Penumpas Bos Pertama',
    desc: 'Kalahkan bos monster geometri pertama di arena kuis',
    iconName: 'swords',
    badgeColor: '#ef4444',
    targetValue: 1,
    reward: { type: 'star', amount: 50 },
    getCurrentValue: ({ levelRecords }) => {
      return Object.values(levelRecords).filter((r) => r.bossDefeated).length >= 1 ? 1 : 0;
    },
  },
  {
    id: 'ach-boss-slayer-5',
    category: 'battle',
    title: 'Ksatria Pembasmi Monster',
    desc: 'Kalahkan 5 bos monster geometri yang berbeda',
    iconName: 'swords',
    badgeColor: '#dc2626',
    targetValue: 5,
    reward: { type: 'gem', amount: 25 },
    getCurrentValue: ({ levelRecords }) => {
      return Object.values(levelRecords).filter((r) => r.bossDefeated).length;
    },
  },

  // 3. KOLEKSI & GACHA
  {
    id: 'ach-cards-3',
    category: 'collection',
    title: 'Kolektor Pemula',
    desc: 'Kumpulkan 3 kartu bangun datar di Index Koleksi',
    iconName: 'book',
    badgeColor: '#8b5cf6',
    targetValue: 3,
    reward: { type: 'coin', amount: 80 },
    getCurrentValue: ({ player }) => {
      return player.inventory?.collectedCards?.length || 0;
    },
  },
  {
    id: 'ach-cards-7',
    category: 'collection',
    title: 'Kurator Geometri',
    desc: 'Kumpulkan 7 kartu bangun datar di Index Koleksi',
    iconName: 'book',
    badgeColor: '#a855f7',
    targetValue: 7,
    reward: { type: 'gem', amount: 20 },
    getCurrentValue: ({ player }) => {
      return player.inventory?.collectedCards?.length || 0;
    },
  },
  {
    id: 'ach-cards-13',
    category: 'collection',
    title: 'Mahaguru Bangun Datar',
    desc: 'Kumpulkan seluruh 13 kartu bangun datar geometri',
    iconName: 'crown',
    badgeColor: '#d946ef',
    targetValue: 13,
    reward: { type: 'gem', amount: 50 },
    getCurrentValue: ({ player }) => {
      return player.inventory?.collectedCards?.length || 0;
    },
  },

  // 4. EKONOMI & KEKAYAAN
  {
    id: 'ach-coins-150',
    category: 'economy',
    title: 'Pundi-Pundi Petualang',
    desc: 'Kumpulkan akumulasi 150 koin di saku karakter',
    iconName: 'zap',
    badgeColor: '#f59e0b',
    targetValue: 150,
    reward: { type: 'star', amount: 60 },
    getCurrentValue: ({ player }) => {
      return player.coins || 0;
    },
  },
  {
    id: 'ach-diamonds-30',
    category: 'economy',
    title: 'Sultan Berlian Geometri',
    desc: 'Miliki minimal 30 permata berkilau',
    iconName: 'gem',
    badgeColor: '#06b6d4',
    targetValue: 30,
    reward: { type: 'coin', amount: 200 },
    getCurrentValue: ({ player }) => {
      return player.diamonds || 0;
    },
  },

  // 5. KARAKTER & LEVEL RPG
  {
    id: 'ach-player-level-3',
    category: 'adventure',
    title: 'Petualang Berkembang',
    desc: 'Tingkatkan level karakter RPG hingga Level 3',
    iconName: 'flame',
    badgeColor: '#f97316',
    targetValue: 3,
    reward: { type: 'star', amount: 50 },
    getCurrentValue: ({ player }) => {
      return player.level || 1;
    },
  },
  {
    id: 'ach-player-level-5',
    category: 'adventure',
    title: 'Pendekar Tangguh',
    desc: 'Tingkatkan level karakter RPG hingga Level 5',
    iconName: 'shield',
    badgeColor: '#ec4899',
    targetValue: 5,
    reward: { type: 'gem', amount: 30 },
    getCurrentValue: ({ player }) => {
      return player.level || 1;
    },
  },
];
