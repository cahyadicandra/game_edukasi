export interface PlayerProfile {
  name: string;
  role: string;
  avatarUrl: string;
  level: number;
  currentExp: number;
  maxExp: number;
  stars: number;
  diamonds: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardDiamonds: number;
  isCompleted: boolean;
}

export type NavTabId = 'beranda' | 'peta' | 'prestasi' | 'materi' | 'profil';

export interface NavTabItem {
  id: NavTabId;
  label: string;
  iconName: string;
}
