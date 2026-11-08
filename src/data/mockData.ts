import type { PlayerProfile, DailyMission } from '../types/game';

export const initialPlayer: PlayerProfile = {
  name: 'Petualang Muda',
  role: 'Siswa',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=RizkiBoy&backgroundColor=b6e3f4',
  avatarId: 'boy',
  level: 1,
  currentExp: 0,
  maxExp: 100,
  stars: 0,
  diamonds: 20,
  coins: 1000,
  schoolGrade: 'SD Kelas 4',
  bio: 'Siap menjelajah dunia geometri dan menaklukkan semua bos bangun datar!',
  title: 'Petualang Pemula',
  inventory: {
    hintTickets: 3,
    fiftyFiftyTickets: 2,
    collectedCards: [],
    unlockedAvatars: ['boy', 'girl'],
    unlockedAccessories: [],
    potions: 3,
    spElixirs: 2,
  },
  stats: {
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    atk: 20,
    def: 10,
  },
  equipment: {
    unlockedParts: ['blaster_std', 'core_orb', 'barrel_std', 'grip_std', 'charm_none'],
    blasterColor: 'blue',
    blasterCore: 'bullet_orb',
    skinColor: 'default',
    hat: 'none',
    shards: 150,
  },
};

export const initialMission: DailyMission = {
  id: 'mission-1',
  title: 'Misi Hari Ini',
  description: 'Selesaikan 3 level dengan nilai sempurna',
  current: 0,
  target: 3,
  rewardDiamonds: 10,
  isCompleted: false,
};
