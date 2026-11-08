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

export interface WeaponPart {
  id: string;
  slot: 'body' | 'core' | 'barrel' | 'grip' | 'charm';
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  projectile?: 'bullet_orb' | 'bullet_star' | 'bullet_fire' | 'bullet_ice' | 'bullet_laser';
  effect?: 'burn' | 'freeze' | 'shock' | 'pierce' | 'bounce' | null;
  description: string;
  icon: string;
  iconAsset?: string;
  unlockCostCoins?: number;
  mods?: {
    damage?: number;
    fireRate?: number;
    range?: number;
    projectileSpeed?: number;
    spread?: number;
    critChance?: number;
  };
}

export interface WeaponLoadout {
  name: string;
  body: string;
  core: string;
  barrel: string;
  grip: string;
  charm?: string;
  color: string;
}

export interface PlayerEquipment {
  weapon?: string;
  shield?: string;
  accessory?: string;
  // Kustomisasi Senjata Modular
  blasterColor?: string;
  blasterCore?: 'bullet_orb' | 'bullet_star' | 'bullet_fire' | 'bullet_ice' | 'bullet_laser';
  blasterBarrel?: string;
  blasterGrip?: string;
  blasterCharm?: string;
  activeLoadoutIndex?: number;
  loadouts?: WeaponLoadout[];
  unlockedParts?: string[];
  partLevels?: Record<string, number>;
  shards?: number;
  // Kustomisasi Karakter Maskot
  skinColor?: string;
  hat?: string;
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
