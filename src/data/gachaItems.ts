export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'lifeline' | 'accessory' | 'card' | 'avatar' | 'currency' | 'potion' | 'equipment';
export type ChestType = 'coin' | 'star' | 'diamond';

export interface GachaItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  type: ItemType;
  description: string;
  icon: string;
  badgeText: string;
  value?: number; // Nilai koin/tiket tambahan/damage/heal
  formula?: string; // Rumus matematika untuk kartu bentuk
  geometryFact?: string; // Fakta sains geometri
}

export const GACHA_POOL: GachaItem[] = [
  // ─── 1. BIASA (COMMON - Peluang Besar) ───
  {
    id: 'item-potion-hp',
    name: 'Ramuan Merah Ruby (HP)',
    rarity: 'common',
    type: 'potion',
    description: 'Memulihkan 45 HP seketika dalam pertarungan kuis melawan bos!',
    icon: '🧪',
    badgeText: '+45 HP Heal',
    value: 1,
    geometryFact: 'Mengandung ekstrak kristal ruby pembelajar geometri.',
  },
  {
    id: 'item-hint-1',
    name: 'Tiket Petunjuk Rumus',
    rarity: 'common',
    type: 'lifeline',
    description: 'Membuka contekan rumus bangun datar saat kuis bos berlangsung',
    icon: '💡',
    badgeText: '+1 Bantuan',
    value: 1,
    geometryFact: 'Membuka kunci ingatan rumus geometri dasar.',
  },
  {
    id: 'item-hint-2',
    name: 'Paket 2x Petunjuk Rumus',
    rarity: 'common',
    type: 'lifeline',
    description: 'Dua tiket contekan rumus bangun datar matematika',
    icon: '📚',
    badgeText: '+2 Bantuan',
    value: 2,
    geometryFact: 'Memberikan dua petunjuk rumus sekaligus.',
  },
  {
    id: 'item-stars-25',
    name: 'Kantong Bintang Mini',
    rarity: 'common',
    type: 'currency',
    description: 'Bonus 25 bintang untuk tabungan petualangan',
    icon: '⭐',
    badgeText: '+25 ⭐',
    value: 25,
  },
  {
    id: 'item-coins-100',
    name: 'Kantong Koin Emas',
    rarity: 'common',
    type: 'currency',
    description: 'Bonus 100 koin emas untuk gacha dan belanja petualangan',
    icon: '🪙',
    badgeText: '+100 🪙',
    value: 100,
  },
  {
    id: 'card-tri-1',
    name: 'Kartu Segitiga Siku-Siku',
    rarity: 'common',
    type: 'card',
    description: 'Koleksi bentuk: Memiliki satu sudut tegak lurus tepat 90°',
    icon: '📐',
    badgeText: 'Koleksi Bentuk',
    formula: 'Luas = ½ × alas × tinggi | c² = a² + b²',
    geometryFact: 'Sudut siku-siku 90° ditemukan pada penggaris segitiga arsitek.',
  },
  {
    id: 'card-sq-1',
    name: 'Kartu Persegi Ubin',
    rarity: 'common',
    type: 'card',
    description: 'Koleksi bentuk: Empat sisi sama panjang dengan 4 sudut siku-siku',
    icon: '⬛',
    badgeText: 'Koleksi Bentuk',
    formula: 'Luas = sisi × sisi | Keliling = 4 × s',
    geometryFact: 'Persegi memiliki 4 sumbu simetri lipat dan 4 simetri putar.',
  },
  {
    id: 'card-rect-1',
    name: 'Kartu Persegi Panjang Zamrud',
    rarity: 'common',
    type: 'card',
    description: 'Koleksi bentuk: Dua pasang sisi sejajar yang berhadapan sama panjang',
    icon: '🟢',
    badgeText: 'Koleksi Bentuk',
    formula: 'Luas = p × l | Keliling = 2 × (p + l)',
    geometryFact: 'Pintu, layar gawai, dan buku tulis berbentuk persegi panjang.',
  },

  // ─── 2. LANGKA (RARE - Peluang Menengah) ───
  {
    id: 'item-5050-1',
    name: 'Tiket Bantuan 50:50',
    rarity: 'rare',
    type: 'lifeline',
    description: 'Menghapus 2 pilihan salah saat menghadapi pertanyaan bos sulit',
    icon: '🎯',
    badgeText: '50:50 Strike',
    value: 1,
    geometryFact: 'Menyingkirkan dua distorsi salah dalam kalkulasi geometri.',
  },
  {
    id: 'item-elixir-sp',
    name: 'Eliksir Biru Safir (SP)',
    rarity: 'rare',
    type: 'potion',
    description: 'Memulihkan 30 SP seketika untuk melancarkan serangan rumus magis',
    icon: '⚡',
    badgeText: '+30 SP Mana',
    value: 1,
    geometryFact: 'Ekstrak murni permata safir biru pegunungan geometri.',
  },
  {
    id: 'item-gems-10',
    name: 'Kantong Permata Murni',
    rarity: 'rare',
    type: 'currency',
    description: '10 Permata murni untuk membuka peti langka di toko',
    icon: '💎',
    badgeText: '+10 💎',
    value: 10,
  },
  {
    id: 'card-parallelogram-1',
    name: 'Kartu Jajar Genjang Emas',
    rarity: 'rare',
    type: 'card',
    description: 'Koleksi bentuk: Sisi miring sejajar dengan sudut berhadapan sama besar',
    icon: '🔶',
    badgeText: 'Koleksi Langka',
    formula: 'Luas = alas × tinggi | Keliling = 2 × (a + b)',
    geometryFact: 'Tinggi jajar genjang selalu tegak lurus dengan garis alas.',
  },
  {
    id: 'card-trapezoid-1',
    name: 'Kartu Trapesium Piramida',
    rarity: 'rare',
    type: 'card',
    description: 'Koleksi bentuk: Memiliki tepat sepasang sisi yang saling sejajar',
    icon: '⛺',
    badgeText: 'Koleksi Langka',
    formula: 'Luas = ½ × (a + b) × t',
    geometryFact: 'Trapesium sama kaki memiliki sepasang sisi miring yang simetris.',
  },
  {
    id: 'card-kite-1',
    name: 'Kartu Layang-Layang Pelangi',
    rarity: 'rare',
    type: 'card',
    description: 'Koleksi bentuk: Dua pasang sisi sama panjang dengan diagonal tegak lurus',
    icon: '🪁',
    badgeText: 'Koleksi Langka',
    formula: 'Luas = ½ × d1 × d2',
    geometryFact: 'Memiliki 1 sumbu simetri lipat sepanjang diagonal utamanya.',
  },
  {
    id: 'card-diamond-rhombus',
    name: 'Kartu Belah Ketupat Safir',
    rarity: 'rare',
    type: 'card',
    description: 'Koleksi bentuk: Keempat sisi sama panjang dengan diagonal saling tegak lurus',
    icon: '🔷',
    badgeText: 'Koleksi Langka',
    formula: 'Luas = ½ × d1 × d2 | Keliling = 4 × s',
    geometryFact: 'Bentuk ketupat khas tradisi nusantara berbasis bangun ini.',
  },
  {
    id: 'card-circle-compass',
    name: 'Kartu Lingkaran Sempurna',
    rarity: 'rare',
    type: 'card',
    description: 'Koleksi bentuk: Jarak dari titik pusat ke tepi selalu konstan (jari-jari r)',
    icon: '⚪',
    badgeText: 'Koleksi Langka',
    formula: 'Keliling = 2 × π × r | Luas = π × r²',
    geometryFact: 'Nilai perbandingan keliling terhadap diameter adalah bilangan irasional π ≈ 3,14.',
  },
  {
    id: 'acc-hat-adventurer',
    name: 'Topi Petualang Cilik',
    rarity: 'rare',
    type: 'accessory',
    description: 'Aksesoris avatar penjelajah lembah pulau geometri',
    icon: '🤠',
    badgeText: 'Aksesoris',
  },
  {
    id: 'acc-glasses-smart',
    name: 'Kacamata Cendekia Bulat',
    rarity: 'rare',
    type: 'accessory',
    description: 'Kacamata pintar membuat karakter tampak cerdas dan percaya diri',
    icon: '👓',
    badgeText: 'Aksesoris',
  },

  // ─── 3. EPIK (EPIC - Peluang Bernilai Tinggi) ───
  {
    id: 'item-ruler-crystal',
    name: 'Pedang Penggaris Kristal',
    rarity: 'epic',
    type: 'equipment',
    description: 'Senjata petualang: Memberi bonus serangan +15 ATK ekstra saat melawan bos!',
    icon: '🗡️',
    badgeText: '+15 ATK Bos',
    value: 15,
    geometryFact: 'Ditempa dari kristal pengukur sudut 30°, 60°, dan 90° yang presisi.',
  },
  {
    id: 'item-protractor-shield',
    name: 'Perisai Busur Derajat Sakti',
    rarity: 'epic',
    type: 'equipment',
    description: 'Perisai pelindung: Menahan serangan bos hingga -12 damage saat jawaban salah!',
    icon: '🛡️',
    badgeText: '+12 DEF Perisai',
    value: 12,
    geometryFact: 'Memantulkan serangan lawan dengan lengkungan busur 180° busur derajat.',
  },
  {
    id: 'item-combo-bundle',
    name: 'Peti Paket Bantuan Super',
    rarity: 'epic',
    type: 'lifeline',
    description: 'Mendapatkan langsung 2x Tiket 50:50 dan 3x Tiket Petunjuk Rumus',
    icon: '🎁',
    badgeText: 'Super Bundle',
    value: 5,
  },
  {
    id: 'acc-crown-gold',
    name: 'Mahkota Juara Geometri',
    rarity: 'epic',
    type: 'accessory',
    description: 'Hiasan kepala berkilau tanda penguasa seluruh bangun datar',
    icon: '👑',
    badgeText: 'Kostum Epik',
  },
  {
    id: 'acc-backpack-rainbow',
    name: 'Ransel Bintang Pelangi',
    rarity: 'epic',
    type: 'accessory',
    description: 'Ransel ceria untuk menampung seluruh rumus matematika geometri',
    icon: '🎒',
    badgeText: 'Kostum Epik',
  },
  {
    id: 'card-hexagon-honey',
    name: 'Kartu Heksagon Sarang Lebah',
    rarity: 'epic',
    type: 'card',
    description: 'Koleksi bentuk epik: Segi enam beraturan paling efisien di alam semesta',
    icon: '🐝',
    badgeText: 'Koleksi Epik',
    formula: 'Keliling = 6 × sisi',
    geometryFact: 'Lebah membangun sarang heksagon karena paling hemat lilin dan kuat menampung madu.',
  },
  {
    id: 'card-pentagon-shield',
    name: 'Kartu Pentagon Bintang Ungu',
    rarity: 'epic',
    type: 'card',
    description: 'Koleksi bentuk epik: Segi lima beraturan dengan sudut dalam masing-masing 108°',
    icon: '⭐',
    badgeText: 'Koleksi Epik',
    formula: 'Keliling = 5 × sisi',
    geometryFact: 'Gedung Pentagon dan motif bola sepak tradisional tersusun dari bangun ini.',
  },
  {
    id: 'card-pyramid-gold',
    name: 'Kartu Candi Segitiga Emas',
    rarity: 'epic',
    type: 'card',
    description: 'Koleksi bentuk epik: Monumen segitiga megah keajaiban dunia kuno',
    icon: '🏛️',
    badgeText: 'Koleksi Epik',
    geometryFact: 'Piramida Mesir kuno memiliki sisi segitiga yang kokoh selama ribuan tahun.',
  },
  {
    id: 'card-castle-geom',
    name: 'Kartu Kastil Geometri 3D',
    rarity: 'epic',
    type: 'card',
    description: 'Koleksi bentuk epik: Gabungan istana dari 6 bentuk geometri dasar',
    icon: '🏰',
    badgeText: 'Koleksi Epik',
    geometryFact: 'Bangunan arsitektur megah tersusun dari kombinasi balok, kubus, dan prisma.',
  },

  // ─── 4. LEGENDARIS (LEGENDARY - Peluang Eksklusif) ───
  {
    id: 'avatar-wizard',
    name: 'Avatar: Sang Penyihir Geometri',
    rarity: 'legendary',
    type: 'avatar',
    description: 'Karakter avatar legendaris berjanggut putih pemegang tongkat rumus ajaib',
    icon: '🧙‍♂️',
    badgeText: 'Karakter Legendaris!',
    geometryFact: 'Menguasai rahasia aljabar dan geometri kuno selama ribuan tahun.',
  },
  {
    id: 'avatar-princess',
    name: 'Avatar: Putri Mahkota Angka',
    rarity: 'legendary',
    type: 'avatar',
    description: 'Karakter avatar legendaris bermahkota emas penjaga kerajaan matematika',
    icon: '👸',
    badgeText: 'Karakter Legendaris!',
    geometryFact: 'Pelindung seluruh buku rumus dan perpustakaan geometri kerajaan.',
  },
  {
    id: 'card-ruler-crystal',
    name: 'Busur Derajat Pelangi Kristal',
    rarity: 'legendary',
    type: 'card',
    description: 'Pusaka legendaris pengukur sudut paling sakti dan bercahaya di dunia',
    icon: '🌈',
    badgeText: 'Pusaka Emas',
    geometryFact: 'Dapat membelokkan cahaya menjadi spektrum sudut pelangi 360° sempurna.',
  },

  // ─── 4. ITEM BARU UPDATE TRIANGLE QUEST (SENJATA MODULAR & KOSMETIK) ───
  {
    id: 'item-blaster-fire',
    name: 'Inti Api Membara (Fire Core)',
    rarity: 'epic',
    type: 'equipment',
    description: 'Modul peluru api berkobar yang membakar musuh dan bos geometri!',
    icon: '🔥',
    badgeText: 'Senjata Api',
    value: 30,
    geometryFact: 'Membakar musuh dengan sudut elevasi tembakan yang presisi.',
  },
  {
    id: 'item-blaster-ice',
    name: 'Inti Es Kristal (Ice Core)',
    rarity: 'epic',
    type: 'equipment',
    description: 'Peluru es kristal yang membekukan dan melambatkan gerakan slime!',
    icon: '❄️',
    badgeText: 'Senjata Es',
    value: 25,
    geometryFact: 'Struktur kristal es heksagonal memperlambat pergerakan lawan.',
  },
  {
    id: 'item-blaster-laser',
    name: 'Inti Sinar Laser Penembus',
    rarity: 'legendary',
    type: 'equipment',
    description: 'Sinar laser berkekuatan tinggi yang menembus barisan monster dan bola duri!',
    icon: '⚡',
    badgeText: 'Laser Legend',
    value: 50,
    geometryFact: 'Garis lurus tak berhingga yang mampu menembus rintangan terberat.',
  },
  {
    id: 'item-charm-lucky',
    name: 'Jimat Keberuntungan Emas',
    rarity: 'epic',
    type: 'accessory',
    description: 'Jimat sakti yang meningkatkan peluang drop koin dan shard dari monster!',
    icon: '🍀',
    badgeText: '+20% Drop',
    value: 20,
    geometryFact: 'Simetri sempurna membawa keberuntungan bagi penjelajah pulau.',
  },
  {
    id: 'item-acc-crown',
    name: 'Mahkota Emas Raja Geometri',
    rarity: 'legendary',
    type: 'accessory',
    description: 'Mahkota megah simbol penguasa seluruh pulau dan penakluk Raja Slime!',
    icon: '👑',
    badgeText: 'Raja Bentuk',
    value: 100,
    geometryFact: 'Terbuat dari perpaduan segitiga emas proporsi ilahi (Golden Ratio).',
  },
  {
    id: 'item-acc-glasses',
    name: 'Kacamata Petualang Keren',
    rarity: 'rare',
    type: 'accessory',
    description: 'Kacamata gaya yang meningkatkan fokus dan akurasi tembakan blaster.',
    icon: '🕶️',
    badgeText: 'Gaya +10',
    value: 15,
    geometryFact: 'Dua lingkaran sejajar dengan fokus lensa yang tajam.',
  },
  {
    id: 'item-acc-scout',
    name: 'Topi Petualang Pramuka',
    rarity: 'rare',
    type: 'accessory',
    description: 'Topi tangguh penjelajah untuk menghadapi terik matahari gurun dan angin salju.',
    icon: '🤠',
    badgeText: 'Penjelajah',
    value: 15,
    geometryFact: 'Bentuk kerucut terpancung melindungi kepala dari rintangan.',
  },
];

export const RARITY_CONFIG = {
  common: {
    label: 'Biasa',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    glowColor: 'rgba(16, 185, 129, 0.45)',
  },
  rare: {
    label: 'Langka',
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#7dd3fc',
    glowColor: 'rgba(2, 132, 199, 0.55)',
  },
  epic: {
    label: 'Epik',
    color: '#8b5cf6',
    bgColor: '#faf5ff',
    borderColor: '#c084fc',
    glowColor: 'rgba(139, 92, 246, 0.65)',
  },
  legendary: {
    label: 'Legendaris',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    glowColor: 'rgba(245, 158, 11, 0.85)',
  },
};

// Biaya dan Pengaturan Peti Gacha
export const CHEST_CONFIG: Record<
  ChestType,
  {
    title: string;
    subtitle: string;
    currencyType: 'coins' | 'stars' | 'diamonds';
    currencyIcon: string;
    currencyLabel: string;
    cost1: number;
    cost10: number;
    description: string;
    glowClass: string;
  }
> = {
  coin: {
    title: 'Peti Koin Petualang',
    subtitle: 'Didapat dari hasil lompat koin level platformer',
    currencyType: 'coins',
    currencyIcon: '🪙',
    currencyLabel: 'Koin',
    cost1: 50,
    cost10: 450,
    description: 'Buka peti dengan koin hasil petualangan! Hadiah ramuan HP, tiket bantuan kuis, dan kartu bentuk dasar.',
    glowClass: 'coin-chest-glow',
  },
  star: {
    title: 'Peti Bintang Geometri',
    subtitle: 'Didapat dari evaluasi 3 bintang penyelesaian level',
    currencyType: 'stars',
    currencyIcon: '⭐',
    currencyLabel: 'Bintang',
    cost1: 30,
    cost10: 250,
    description: 'Tukar bintang petualanganmu! Peluang lebih tinggi untuk kartu bentuk langka, ramuan, dan aksesoris.',
    glowClass: 'star-chest-glow',
  },
  diamond: {
    title: 'Peti Permata Kerajaan',
    subtitle: 'Harta paling berharga dari kemenangan bos besar',
    currencyType: 'diamonds',
    currencyIcon: '💎',
    currencyLabel: 'Permata',
    cost1: 10,
    cost10: 80,
    description: 'Peti permata mulia! Peluang tertinggi membuka karakter legendaris Penyihir & Putri Mahkota, serta senjata pedang kristal!',
    glowClass: 'diamond-chest-glow',
  },
};

// Milestone Index Koleksi
export interface CollectionMilestone {
  requiredCount: number;
  rewardType: 'coins' | 'diamonds';
  rewardAmount: number;
  label: string;
}

export const COLLECTION_MILESTONES: CollectionMilestone[] = [
  { requiredCount: 4, rewardType: 'coins', rewardAmount: 100, label: 'Kolektor Pemula (4 Item)' },
  { requiredCount: 8, rewardType: 'diamonds', rewardAmount: 5, label: 'Penjelajah Bentuk (8 Item)' },
  { requiredCount: 14, rewardType: 'coins', rewardAmount: 250, label: 'Ahli Geometri (14 Item)' },
  { requiredCount: 20, rewardType: 'diamonds', rewardAmount: 15, label: 'Kolektor Legendaris (20 Item)' },
  { requiredCount: 26, rewardType: 'diamonds', rewardAmount: 30, label: 'Master Mahkota Koleksi (Semua Item)' },
];

/**
 * Generator Gacha Acak Berbasis Bobot Probabilitas:
 * - Coin Chest: 60% Common, 28% Rare, 10% Epic, 2% Legendary
 * - Star Chest: 45% Common, 35% Rare, 16% Epic, 4% Legendary
 * - Diamond Chest: 20% Common, 45% Rare, 25% Epic, 10% Legendary
 */
export function rollGacha(chestType: ChestType, count: 1 | 10): GachaItem[] {
  const results: GachaItem[] = [];

  const commonItems = GACHA_POOL.filter((i) => i.rarity === 'common');
  const rareItems = GACHA_POOL.filter((i) => i.rarity === 'rare');
  const epicItems = GACHA_POOL.filter((i) => i.rarity === 'epic');
  const legendaryItems = GACHA_POOL.filter((i) => i.rarity === 'legendary');

  for (let c = 0; c < count; c++) {
    const roll = Math.random() * 100;
    let pool: GachaItem[];

    if (chestType === 'diamond') {
      if (roll < 10) pool = legendaryItems;
      else if (roll < 35) pool = epicItems;
      else if (roll < 80) pool = rareItems;
      else pool = commonItems;
    } else if (chestType === 'star') {
      if (roll < 4) pool = legendaryItems;
      else if (roll < 20) pool = epicItems;
      else if (roll < 55) pool = rareItems;
      else pool = commonItems;
    } else {
      // Coin Chest
      if (roll < 2) pool = legendaryItems;
      else if (roll < 12) pool = epicItems;
      else if (roll < 40) pool = rareItems;
      else pool = commonItems;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    results.push(pool[randomIndex]);
  }

  return results;
}
