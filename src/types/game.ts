export interface CharacterStats {
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  atk: number;
  def: number;
}

export type MapNodeType = 'battle' | 'boss' | 'puzzle' | 'campfire' | 'treasure';

export interface PlayerInventory {
  hintTickets: number;
  fiftyFiftyTickets: number;
  collectedCards: string[];
  unlockedAvatars: string[];
  unlockedAccessories: string[];
  potions?: number;
  spElixirs?: number;
}

export interface PlayerEquipment {
  weapon?: string;
  shield?: string;
  accessory?: string;
}

export interface PlayerProfile {
  name: string;
  role: string;
  avatarUrl: string;
  avatarId?: 'boy' | 'girl' | 'adventurer' | 'scientist' | 'wizard' | 'princess';
  level: number;
  currentExp: number;
  maxExp: number;
  stars: number;
  diamonds: number;
  coins?: number;
  schoolGrade?: string;
  bio?: string;
  title?: string;
  inventory?: PlayerInventory;
  stats?: CharacterStats;
  equipment?: PlayerEquipment;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardDiamonds: number;
  isCompleted: boolean;
  date?: string;
}

export type NavTabId = 'beranda' | 'peta' | 'prestasi' | 'materi' | 'profil';

export interface NavTabItem {
  id: NavTabId;
  label: string;
  iconName: string;
}
