import type { PlayerProfile, DailyMission } from '../types/game';

export const initialPlayer: PlayerProfile = {
  name: 'Rizki',
  role: 'Siswa',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=RizkiBoy&backgroundColor=b6e3f4',
  level: 3,
  currentExp: 65,
  maxExp: 100,
  stars: 120,
  diamonds: 45,
};

export const initialMission: DailyMission = {
  id: 'mission-1',
  title: 'Misi Hari Ini',
  description: 'Selesaikan 3 level dengan nilai sempurna',
  current: 1,
  target: 3,
  rewardDiamonds: 10,
  isCompleted: false,
};
