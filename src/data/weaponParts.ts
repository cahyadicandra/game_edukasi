import type { WeaponPart, WeaponLoadout } from '../types/game';

// ─── 0. TIPE DATA KHUSUS SKIN SENJATA & PROYEKTIL ANIMASI ───
export interface WeaponSkinBulletDef {
  bulletFrames: string[];
  bulletStrip: string;
  hitFrames: string[];
  hitStrip: string;
  muzzleFrames: string[];
  muzzleStrip: string;
  sfx: 'fire' | 'ice' | 'lightning' | 'plasma' | 'laser' | 'pop' | 'heavy' | 'crystal' | 'scout';
}

export interface WeaponSkinDef {
  id: string;
  name: string;
  tagline: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  lore: string;
  assetPng: string;
  assetSvg: string;
  bulletDir: string;
  bullets: WeaponSkinBulletDef;
  element: 'plasma' | 'fire' | 'ice' | 'lightning' | 'lava' | 'cosmic' | 'cyber' | 'rainbow' | 'candy' | 'scout' | 'royal' | 'wood' | 'camo';
  elementLabel: string;
  elementColor: string;
  elementBadgeBg: string;
  unlockCostCoins: number;
  bonusStats: {
    damage?: number;
    fireRate?: number;
    range?: number;
    projectileSpeed?: number;
    critChance?: number;
    bounce?: number;
    pierce?: number;
  };
  specialEffect: string;
}

// ─── 1. KATALOG 13 SKIN SENJATA DENGAN ASET ANIMASI LENGKAP ───
export const WEAPON_SKINS_CATALOG: Record<string, WeaponSkinDef> = {
  blaster_klasik: {
    id: 'blaster_klasik',
    name: 'Blaster Klasik Samudra',
    tagline: 'Andalan Utama Petualang',
    rarity: 'common',
    description: 'Blaster standar geometri berbahan alloy biru samudra. Sangat seimbang dan mudah dikendalikan di segala medan.',
    lore: 'Senjata pertama yang dirakit oleh penjelajah Kepulauan Geometri.',
    assetPng: '/weapons/png/blaster_klasik.png',
    assetSvg: '/weapons/svg/blaster_klasik.svg',
    bulletDir: '/weapons/Bullet/blaster_klasik',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_klasik/bullet_f1.png',
        '/weapons/Bullet/blaster_klasik/bullet_f2.png',
        '/weapons/Bullet/blaster_klasik/bullet_f3.png',
        '/weapons/Bullet/blaster_klasik/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_klasik/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_klasik/hit_f1.png',
        '/weapons/Bullet/blaster_klasik/hit_f2.png',
        '/weapons/Bullet/blaster_klasik/hit_f3.png',
        '/weapons/Bullet/blaster_klasik/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_klasik/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_klasik/muzzle_f1.png',
        '/weapons/Bullet/blaster_klasik/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_klasik/muzzle_strip.png',
      sfx: 'plasma',
    },
    element: 'plasma',
    elementLabel: 'Plasma Stabil',
    elementColor: '#38bdf8',
    elementBadgeBg: 'rgba(56, 189, 248, 0.15)',
    unlockCostCoins: 0,
    bonusStats: { damage: 0, fireRate: 0, range: 0, projectileSpeed: 0, critChance: 0 },
    specialEffect: 'Tembakan energi plasma stabil dengan hentakan minim.',
  },

  blaster_api: {
    id: 'blaster_api',
    name: 'Blaster Api Membara',
    tagline: 'Kobaran Api Gunung Berapi',
    rarity: 'rare',
    description: 'Laras termal bersuhu ribuan derajat. Melontarkan proyektil bola api berkobar dengan efek luka bakar berkala pada musuh.',
    lore: 'Ditempa di kawah gunung berapi aktif di ujung selatan pulau.',
    assetPng: '/weapons/png/blaster_api.png',
    assetSvg: '/weapons/svg/blaster_api.svg',
    bulletDir: '/weapons/Bullet/blaster_api',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_api/bullet_f1.png',
        '/weapons/Bullet/blaster_api/bullet_f2.png',
        '/weapons/Bullet/blaster_api/bullet_f3.png',
        '/weapons/Bullet/blaster_api/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_api/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_api/hit_f1.png',
        '/weapons/Bullet/blaster_api/hit_f2.png',
        '/weapons/Bullet/blaster_api/hit_f3.png',
        '/weapons/Bullet/blaster_api/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_api/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_api/muzzle_f1.png',
        '/weapons/Bullet/blaster_api/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_api/muzzle_strip.png',
      sfx: 'fire',
    },
    element: 'fire',
    elementLabel: 'Bakar (Burn)',
    elementColor: '#ef4444',
    elementBadgeBg: 'rgba(239, 68, 68, 0.15)',
    unlockCostCoins: 300,
    bonusStats: { damage: 1.2, fireRate: -0.2, range: 30, projectileSpeed: 60, critChance: 4 },
    specialEffect: 'Membakar musuh yang terkena tembakan secara berkala!',
  },

  blaster_es: {
    id: 'blaster_es',
    name: 'Blaster Es Kristal',
    tagline: 'Gletser Beku Arktik',
    rarity: 'rare',
    description: 'Memancarkan embun beku dingin yang membekukan monster dan memperlambat langkah gerak mereka hingga 50%.',
    lore: 'Diukir dari pecahan gletser abadi puncak pegunungan es geometri.',
    assetPng: '/weapons/png/blaster_es.png',
    assetSvg: '/weapons/svg/blaster_es.svg',
    bulletDir: '/weapons/Bullet/blaster_es',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_es/bullet_f1.png',
        '/weapons/Bullet/blaster_es/bullet_f2.png',
        '/weapons/Bullet/blaster_es/bullet_f3.png',
        '/weapons/Bullet/blaster_es/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_es/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_es/hit_f1.png',
        '/weapons/Bullet/blaster_es/hit_f2.png',
        '/weapons/Bullet/blaster_es/hit_f3.png',
        '/weapons/Bullet/blaster_es/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_es/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_es/muzzle_f1.png',
        '/weapons/Bullet/blaster_es/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_es/muzzle_strip.png',
      sfx: 'ice',
    },
    element: 'ice',
    elementLabel: 'Beku (Slow 50%)',
    elementColor: '#06b6d4',
    elementBadgeBg: 'rgba(6, 182, 212, 0.15)',
    unlockCostCoins: 350,
    bonusStats: { damage: 0.8, fireRate: 0.3, range: 40, projectileSpeed: 40, critChance: 3 },
    specialEffect: 'Memperlambat gerakan musuh hingga 50% selama 2.5 detik!',
  },

  blaster_petir: {
    id: 'blaster_petir',
    name: 'Blaster Petir Halilintar',
    tagline: 'Sengatan Kilat Badai',
    rarity: 'rare',
    description: 'Kapasitor ionik melepaskan busur kilat berkecepatan tinggi dengan frekuensi tembakan sangat gesit.',
    lore: 'Menyimpan daya dari badai halilintar Pulau Segitiga Langit.',
    assetPng: '/weapons/png/blaster_petir.png',
    assetSvg: '/weapons/svg/blaster_petir.svg',
    bulletDir: '/weapons/Bullet/blaster_petir',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_petir/bullet_f1.png',
        '/weapons/Bullet/blaster_petir/bullet_f2.png',
        '/weapons/Bullet/blaster_petir/bullet_f3.png',
        '/weapons/Bullet/blaster_petir/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_petir/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_petir/hit_f1.png',
        '/weapons/Bullet/blaster_petir/hit_f2.png',
        '/weapons/Bullet/blaster_petir/hit_f3.png',
        '/weapons/Bullet/blaster_petir/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_petir/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_petir/muzzle_f1.png',
        '/weapons/Bullet/blaster_petir/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_petir/muzzle_strip.png',
      sfx: 'lightning',
    },
    element: 'lightning',
    elementLabel: 'Kilat (Turbo)',
    elementColor: '#eab308',
    elementBadgeBg: 'rgba(234, 179, 8, 0.15)',
    unlockCostCoins: 400,
    bonusStats: { damage: 0.6, fireRate: 0.8, range: 60, projectileSpeed: 220, critChance: 6 },
    specialEffect: 'Laju tembak ekstra cepat dan proyektil kilat ultra gesit.',
  },

  blaster_kamuflase: {
    id: 'blaster_kamuflase',
    name: 'Blaster Taktis Kamuflase',
    tagline: 'Operasi Senyap Rimba',
    rarity: 'rare',
    description: 'Corak loreng militer matte anti-refleksi cahaya. Dirancang untuk serangan presisi tak terdeteksi dari jarak jauh.',
    lore: 'Digunakan oleh skuadron intai taktis pulau geometri.',
    assetPng: '/weapons/png/blaster_kamuflase.png',
    assetSvg: '/weapons/svg/blaster_kamuflase.svg',
    bulletDir: '/weapons/Bullet/blaster_kamuflase',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_kamuflase/bullet_f1.png',
        '/weapons/Bullet/blaster_kamuflase/bullet_f2.png',
        '/weapons/Bullet/blaster_kamuflase/bullet_f3.png',
        '/weapons/Bullet/blaster_kamuflase/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_kamuflase/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_kamuflase/hit_f1.png',
        '/weapons/Bullet/blaster_kamuflase/hit_f2.png',
        '/weapons/Bullet/blaster_kamuflase/hit_f3.png',
        '/weapons/Bullet/blaster_kamuflase/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_kamuflase/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_kamuflase/muzzle_f1.png',
        '/weapons/Bullet/blaster_kamuflase/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_kamuflase/muzzle_strip.png',
      sfx: 'scout',
    },
    element: 'camo',
    elementLabel: 'Taktis Senyap',
    elementColor: '#15803d',
    elementBadgeBg: 'rgba(21, 128, 61, 0.15)',
    unlockCostCoins: 450,
    bonusStats: { damage: 1.3, fireRate: 0.2, range: 120, projectileSpeed: 140, critChance: 14 },
    specialEffect: 'Peluang serangan kritikal tinggi dari jarak tembak jauh!',
  },

  blaster_pramuka: {
    id: 'blaster_pramuka',
    name: 'Blaster Rimba Pramuka',
    tagline: 'Penjelajah Rimba Raya',
    rarity: 'common',
    description: 'Dibuat untuk penjelajah rimba tangguh. Lapisan khaki tahan banting dengan akurasi dan jangkauan tembak prima.',
    lore: 'Standar perlengkapan regu penjelajah hutan rimba geometri.',
    assetPng: '/weapons/png/blaster_pramuka.png',
    assetSvg: '/weapons/svg/blaster_pramuka.svg',
    bulletDir: '/weapons/Bullet/blaster_pramuka',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_pramuka/bullet_f1.png',
        '/weapons/Bullet/blaster_pramuka/bullet_f2.png',
        '/weapons/Bullet/blaster_pramuka/bullet_f3.png',
        '/weapons/Bullet/blaster_pramuka/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_pramuka/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_pramuka/hit_f1.png',
        '/weapons/Bullet/blaster_pramuka/hit_f2.png',
        '/weapons/Bullet/blaster_pramuka/hit_f3.png',
        '/weapons/Bullet/blaster_pramuka/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_pramuka/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_pramuka/muzzle_f1.png',
        '/weapons/Bullet/blaster_pramuka/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_pramuka/muzzle_strip.png',
      sfx: 'scout',
    },
    element: 'scout',
    elementLabel: 'Rimba Presisi',
    elementColor: '#84cc16',
    elementBadgeBg: 'rgba(132, 204, 22, 0.15)',
    unlockCostCoins: 150,
    bonusStats: { damage: 0.5, fireRate: 0.1, range: 140, projectileSpeed: 100, critChance: 4 },
    specialEffect: 'Jarak tembak panjang dan kestabilan laras sempurna.',
  },

  blaster_retro_kayu: {
    id: 'blaster_retro_kayu',
    name: 'Blaster Retro Kayu Antik',
    tagline: 'Sentuhan Klasik Abadi',
    rarity: 'rare',
    description: 'Pahat kayu jati berpolitur mengilap dengan ornamen kuningan antik. Hantaman kinetik mantap dengan daya tolak kuat.',
    lore: 'Koleksi antik dari masa awal eksplorasi pulau geometri.',
    assetPng: '/weapons/png/blaster_retro_kayu.png',
    assetSvg: '/weapons/svg/blaster_retro_kayu.svg',
    bulletDir: '/weapons/Bullet/blaster_retro_kayu',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_retro_kayu/bullet_f1.png',
        '/weapons/Bullet/blaster_retro_kayu/bullet_f2.png',
        '/weapons/Bullet/blaster_retro_kayu/bullet_f3.png',
        '/weapons/Bullet/blaster_retro_kayu/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_retro_kayu/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_retro_kayu/hit_f1.png',
        '/weapons/Bullet/blaster_retro_kayu/hit_f2.png',
        '/weapons/Bullet/blaster_retro_kayu/hit_f3.png',
        '/weapons/Bullet/blaster_retro_kayu/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_retro_kayu/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_retro_kayu/muzzle_f1.png',
        '/weapons/Bullet/blaster_retro_kayu/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_retro_kayu/muzzle_strip.png',
      sfx: 'heavy',
    },
    element: 'wood',
    elementLabel: 'Kinetik Antik',
    elementColor: '#b45309',
    elementBadgeBg: 'rgba(180, 83, 9, 0.15)',
    unlockCostCoins: 380,
    bonusStats: { damage: 1.1, fireRate: -0.1, range: 50, projectileSpeed: 80, critChance: 6 },
    specialEffect: 'Hantaman peluru padat memberikan tolakan mundur mantap pada musuh.',
  },

  blaster_permen: {
    id: 'blaster_permen',
    name: 'Blaster Permen Manis',
    tagline: 'Semarak Gula Karamel',
    rarity: 'rare',
    description: 'Berbalut warna manis permen gulali. Menembakkan bola gula warna-warni yang meledak riang dan menghasilkan bonus koin.',
    lore: 'Hadiah istimewa dari festival pesta geometri musim semi.',
    assetPng: '/weapons/png/blaster_permen.png',
    assetSvg: '/weapons/svg/blaster_permen.svg',
    bulletDir: '/weapons/Bullet/blaster_permen',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_permen/bullet_f1.png',
        '/weapons/Bullet/blaster_permen/bullet_f2.png',
        '/weapons/Bullet/blaster_permen/bullet_f3.png',
        '/weapons/Bullet/blaster_permen/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_permen/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_permen/hit_f1.png',
        '/weapons/Bullet/blaster_permen/hit_f2.png',
        '/weapons/Bullet/blaster_permen/hit_f3.png',
        '/weapons/Bullet/blaster_permen/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_permen/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_permen/muzzle_f1.png',
        '/weapons/Bullet/blaster_permen/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_permen/muzzle_strip.png',
      sfx: 'pop',
    },
    element: 'candy',
    elementLabel: 'Gula Manis (+Koin)',
    elementColor: '#f43f5e',
    elementBadgeBg: 'rgba(244, 63, 94, 0.15)',
    unlockCostCoins: 500,
    bonusStats: { damage: 0.9, fireRate: 0.5, range: 60, projectileSpeed: 120, critChance: 7 },
    specialEffect: 'Musuh yang kalah menjatuhkan +25% bonus koin ekstra!',
  },

  blaster_cyber: {
    id: 'blaster_cyber',
    name: 'Blaster Cyber Neon',
    tagline: 'Teknologi Masa Depan',
    rarity: 'epic',
    description: 'Ditenagai sirkuit kuantum neon cyan. Menembakkan sinar pulsa cyber terfokus dengan presisi elektromagnetik mutlak.',
    lore: 'Teknologi prototipe laboratorium sains masa depan pulau geometri.',
    assetPng: '/weapons/png/blaster_cyber.png',
    assetSvg: '/weapons/svg/blaster_cyber.svg',
    bulletDir: '/weapons/Bullet/blaster_cyber',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_cyber/bullet_f1.png',
        '/weapons/Bullet/blaster_cyber/bullet_f2.png',
        '/weapons/Bullet/blaster_cyber/bullet_f3.png',
        '/weapons/Bullet/blaster_cyber/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_cyber/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_cyber/hit_f1.png',
        '/weapons/Bullet/blaster_cyber/hit_f2.png',
        '/weapons/Bullet/blaster_cyber/hit_f3.png',
        '/weapons/Bullet/blaster_cyber/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_cyber/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_cyber/muzzle_f1.png',
        '/weapons/Bullet/blaster_cyber/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_cyber/muzzle_strip.png',
      sfx: 'laser',
    },
    element: 'cyber',
    elementLabel: 'Cyber Pulse',
    elementColor: '#00f2fe',
    elementBadgeBg: 'rgba(0, 242, 254, 0.15)',
    unlockCostCoins: 700,
    bonusStats: { damage: 1.4, fireRate: 0.6, range: 140, projectileSpeed: 320, critChance: 9 },
    specialEffect: 'Kecepatan peluru ultra tinggi meluncur lurus tanpa deviasi.',
  },

  blaster_pelangi: {
    id: 'blaster_pelangi',
    name: 'Blaster Pelangi Spektrum',
    tagline: 'Pantulan Prisma Spektrum',
    rarity: 'epic',
    description: 'Lensa kristal prisma holografik. Menembakkan proyektil warna-warni yang memantul di permukaan platform.',
    lore: 'Terbentuk saat sinar fajar pertama menyinari air terjun prisma geometri.',
    assetPng: '/weapons/png/blaster_pelangi.png',
    assetSvg: '/weapons/svg/blaster_pelangi.svg',
    bulletDir: '/weapons/Bullet/blaster_pelangi',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_pelangi/bullet_f1.png',
        '/weapons/Bullet/blaster_pelangi/bullet_f2.png',
        '/weapons/Bullet/blaster_pelangi/bullet_f3.png',
        '/weapons/Bullet/blaster_pelangi/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_pelangi/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_pelangi/hit_f1.png',
        '/weapons/Bullet/blaster_pelangi/hit_f2.png',
        '/weapons/Bullet/blaster_pelangi/hit_f3.png',
        '/weapons/Bullet/blaster_pelangi/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_pelangi/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_pelangi/muzzle_f1.png',
        '/weapons/Bullet/blaster_pelangi/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_pelangi/muzzle_strip.png',
      sfx: 'crystal',
    },
    element: 'rainbow',
    elementLabel: 'Prisma Pantul',
    elementColor: '#ec4899',
    elementBadgeBg: 'rgba(236, 72, 153, 0.15)',
    unlockCostCoins: 750,
    bonusStats: { damage: 1.1, fireRate: 0.4, range: 100, projectileSpeed: 150, critChance: 8, bounce: 1 },
    specialEffect: 'Peluru dapat memantul di platform untuk mengenai musuh tersembunyi!',
  },

  blaster_lava: {
    id: 'blaster_lava',
    name: 'Blaster Magma Vulkanik',
    tagline: 'Pelebur Batu Magma',
    rarity: 'epic',
    description: 'Bodi lava cair terlapis obsidian hitam. Meluncurkan bom magma cair padat berdaya ledak penghancur.',
    lore: 'Ditempa oleh pandai besi legendaris dari lelehan magma terdalam.',
    assetPng: '/weapons/png/blaster_lava.png',
    assetSvg: '/weapons/svg/blaster_lava.svg',
    bulletDir: '/weapons/Bullet/blaster_lava',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_lava/bullet_f1.png',
        '/weapons/Bullet/blaster_lava/bullet_f2.png',
        '/weapons/Bullet/blaster_lava/bullet_f3.png',
        '/weapons/Bullet/blaster_lava/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_lava/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_lava/hit_f1.png',
        '/weapons/Bullet/blaster_lava/hit_f2.png',
        '/weapons/Bullet/blaster_lava/hit_f3.png',
        '/weapons/Bullet/blaster_lava/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_lava/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_lava/muzzle_f1.png',
        '/weapons/Bullet/blaster_lava/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_lava/muzzle_strip.png',
      sfx: 'fire',
    },
    element: 'lava',
    elementLabel: 'Magma Pijar',
    elementColor: '#f97316',
    elementBadgeBg: 'rgba(249, 115, 22, 0.15)',
    unlockCostCoins: 800,
    bonusStats: { damage: 2.2, fireRate: -0.4, range: 80, projectileSpeed: 100, critChance: 8 },
    specialEffect: 'Ledakan magma dahsyat melumat pertahanan monster!',
  },

  blaster_galaksi: {
    id: 'blaster_galaksi',
    name: 'Blaster Galaksi Kosmik',
    tagline: 'Cahaya Gugus Bintang',
    rarity: 'legendary',
    description: 'Berintikan miniatur nebula antariksa. Menembakkan proyektil bintang kosmik yang menembus barisan monster.',
    lore: 'Peninggalan arsitek geometri kuno yang menatap luasnya cakrawala semesta.',
    assetPng: '/weapons/png/blaster_galaksi.png',
    assetSvg: '/weapons/svg/blaster_galaksi.svg',
    bulletDir: '/weapons/Bullet/blaster_galaksi',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_galaksi/bullet_f1.png',
        '/weapons/Bullet/blaster_galaksi/bullet_f2.png',
        '/weapons/Bullet/blaster_galaksi/bullet_f3.png',
        '/weapons/Bullet/blaster_galaksi/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_galaksi/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_galaksi/hit_f1.png',
        '/weapons/Bullet/blaster_galaksi/hit_f2.png',
        '/weapons/Bullet/blaster_galaksi/hit_f3.png',
        '/weapons/Bullet/blaster_galaksi/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_galaksi/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_galaksi/muzzle_f1.png',
        '/weapons/Bullet/blaster_galaksi/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_galaksi/muzzle_strip.png',
      sfx: 'laser',
    },
    element: 'cosmic',
    elementLabel: 'Kosmik Tembus',
    elementColor: '#a855f7',
    elementBadgeBg: 'rgba(168, 85, 247, 0.15)',
    unlockCostCoins: 1200,
    bonusStats: { damage: 2.0, fireRate: 0.2, range: 180, projectileSpeed: 280, critChance: 15, pierce: 2 },
    specialEffect: 'Peluru bintang menembus hingga 2 lapis barisan monster!',
  },

  blaster_raja_emas: {
    id: 'blaster_raja_emas',
    name: 'Blaster Mahkota Raja Emas',
    tagline: 'Kemegahan Sang Juara',
    rarity: 'legendary',
    description: 'Dilapisi emas murni 24 karat bertahtakan permata rubi kerajaan. Daya hancur tertinggi dengan kilau aura kemegahan penakluk pulau.',
    lore: 'Dianugerahkan hanya kepada penguasa yang berhasil menaklukkan seluruh pulau geometri.',
    assetPng: '/weapons/png/blaster_raja_emas.png',
    assetSvg: '/weapons/svg/blaster_raja_emas.svg',
    bulletDir: '/weapons/Bullet/blaster_raja_emas',
    bullets: {
      bulletFrames: [
        '/weapons/Bullet/blaster_raja_emas/bullet_f1.png',
        '/weapons/Bullet/blaster_raja_emas/bullet_f2.png',
        '/weapons/Bullet/blaster_raja_emas/bullet_f3.png',
        '/weapons/Bullet/blaster_raja_emas/bullet_f4.png',
      ],
      bulletStrip: '/weapons/Bullet/blaster_raja_emas/bullet_strip.png',
      hitFrames: [
        '/weapons/Bullet/blaster_raja_emas/hit_f1.png',
        '/weapons/Bullet/blaster_raja_emas/hit_f2.png',
        '/weapons/Bullet/blaster_raja_emas/hit_f3.png',
        '/weapons/Bullet/blaster_raja_emas/hit_f4.png',
      ],
      hitStrip: '/weapons/Bullet/blaster_raja_emas/hit_strip.png',
      muzzleFrames: [
        '/weapons/Bullet/blaster_raja_emas/muzzle_f1.png',
        '/weapons/Bullet/blaster_raja_emas/muzzle_f2.png',
      ],
      muzzleStrip: '/weapons/Bullet/blaster_raja_emas/muzzle_strip.png',
      sfx: 'heavy',
    },
    element: 'royal',
    elementLabel: 'Arkana Emas',
    elementColor: '#fbbf24',
    elementBadgeBg: 'rgba(251, 191, 36, 0.2)',
    unlockCostCoins: 1500,
    bonusStats: { damage: 2.6, fireRate: 0.2, range: 160, projectileSpeed: 250, critChance: 20, pierce: 1 },
    specialEffect: 'Kerusakan sangat dahsyat, menembus musuh, dan kritikal +20%!',
  },
};

export const DEFAULT_UNLOCKED_SKINS: string[] = ['blaster_klasik'];

export function getWeaponSkin(skinId?: string): WeaponSkinDef {
  if (!skinId) return WEAPON_SKINS_CATALOG.blaster_klasik;
  return WEAPON_SKINS_CATALOG[skinId] || WEAPON_SKINS_CATALOG.blaster_klasik;
}

// ─── 2. KATALOG BAGIAN SENJATA MODULAR (BODY, CORE, BARREL, GRIP, CHARM) ───
export const WEAPON_PARTS_CATALOG: Record<string, WeaponPart> = {
  // --- BODY (Bodi Rangka Blaster) ---
  blaster_std: {
    id: 'blaster_std',
    slot: 'body',
    name: 'Rangka Standar Petualang',
    rarity: 'common',
    level: 1,
    description: 'Rangka blaster seimbang dari aluminium tembaga. Sangat andal di segala medan.',
    icon: '🔫',
    iconAsset: '/weapons/png/blaster_klasik.png',
    unlockCostCoins: 0,
    mods: { damage: 0, fireRate: 0, range: 0, projectileSpeed: 0, critChance: 0 },
  },
  blaster_heavy: {
    id: 'blaster_heavy',
    slot: 'body',
    name: 'Rangka Delta Berat',
    rarity: 'rare',
    level: 1,
    description: 'Rangka tebal dengan daya hantam tinggi, namun sedikit memperlambat kecepatan tembak.',
    icon: '🛡️',
    iconAsset: '/weapons/png/blaster_api.png',
    unlockCostCoins: 350,
    mods: { damage: 1, fireRate: -0.5, range: 40, projectileSpeed: -50, critChance: 2 },
  },
  blaster_compact: {
    id: 'blaster_compact',
    slot: 'body',
    name: 'Rangka Cepat Prisma',
    rarity: 'epic',
    level: 1,
    description: 'Rangka seringan kristal dengan laju tembak sangat gesit dan lincah.',
    icon: '⚡',
    iconAsset: '/weapons/png/blaster_cyber.png',
    unlockCostCoins: 750,
    mods: { damage: -0.2, fireRate: 1.2, range: -30, projectileSpeed: 100, critChance: 5 },
  },

  // --- CORE (Inti Peluru) ---
  core_skin_native: {
    id: 'core_skin_native',
    slot: 'core',
    name: 'Peluru Bawaan Skin (Animasi)',
    rarity: 'common',
    level: 1,
    projectile: 'bullet_skin',
    description: 'Menembakkan peluru animasi spesial berstatus elemen murni bawaan dari skin senjata ini!',
    icon: '✨',
    iconAsset: '/weapons/Bullet/blaster_klasik/bullet_f1.png',
    unlockCostCoins: 0,
    mods: { damage: 0, fireRate: 0, projectileSpeed: 0 },
  },
  core_orb: {
    id: 'core_orb',
    slot: 'core',
    name: 'Inti Orb Plasma (Standar)',
    rarity: 'common',
    level: 1,
    projectile: 'bullet_orb',
    description: 'Peluru plasma orb standar, laju stabil dan hentakan seimbang.',
    icon: '🔵',
    iconAsset: '/assets/png/attack/bullet_orb.png',
    unlockCostCoins: 0,
    mods: { damage: 1, fireRate: 0, projectileSpeed: 750 },
  },
  core_fire: {
    id: 'core_fire',
    slot: 'core',
    name: 'Inti Api Membara (Burn)',
    rarity: 'rare',
    level: 1,
    projectile: 'bullet_fire',
    effect: 'burn',
    description: 'Peluru bola api berkobar. Memberikan efek bakar berkala pada monster!',
    icon: '🔥',
    iconAsset: '/weapons/Bullet/blaster_api/bullet_f1.png',
    unlockCostCoins: 300,
    mods: { damage: 2, fireRate: -0.3, range: -50, projectileSpeed: 680, critChance: 3 },
  },
  core_ice: {
    id: 'core_ice',
    slot: 'core',
    name: 'Inti Es Kristal (Freeze)',
    rarity: 'rare',
    level: 1,
    projectile: 'bullet_ice',
    effect: 'freeze',
    description: 'Peluru es salju kristal. Membekukan dan melambatkan pergerakan monster!',
    icon: '❄️',
    iconAsset: '/weapons/Bullet/blaster_es/bullet_f1.png',
    unlockCostCoins: 450,
    mods: { damage: 1.2, fireRate: 0.2, projectileSpeed: 720 },
  },
  core_star: {
    id: 'core_star',
    slot: 'core',
    name: 'Inti Bintang Pantul (Bounce)',
    rarity: 'epic',
    level: 1,
    projectile: 'bullet_star',
    effect: 'bounce',
    description: 'Bintang berpendar yang memantul di permukaan platform dan mengenai musuh tersembunyi.',
    icon: '⭐',
    iconAsset: '/weapons/Bullet/blaster_pelangi/bullet_f1.png',
    unlockCostCoins: 600,
    mods: { damage: 1.5, fireRate: 0.4, projectileSpeed: 820, critChance: 8 },
  },
  core_laser: {
    id: 'core_laser',
    slot: 'core',
    name: 'Inti Laser Tembus (Pierce)',
    rarity: 'legendary',
    level: 1,
    projectile: 'bullet_laser',
    effect: 'pierce',
    description: 'Sinar laser berkekuatan tinggi yang menembus barisan banyak musuh sekaligus!',
    icon: '⚡',
    iconAsset: '/weapons/Bullet/blaster_galaksi/bullet_f1.png',
    unlockCostCoins: 1000,
    mods: { damage: 3, fireRate: -0.8, range: 150, projectileSpeed: 1100, critChance: 12 },
  },

  // --- BARREL (Laras) ---
  barrel_std: {
    id: 'barrel_std',
    slot: 'barrel',
    name: 'Laras Standar 100mm',
    rarity: 'common',
    level: 1,
    description: 'Laras standar dengan akurasi terkalibrasi lurus tanpa getaran berlebih.',
    icon: '📏',
    iconAsset: '/weapons/Bullet/blaster_klasik/muzzle_f1.png',
    unlockCostCoins: 0,
    mods: { range: 0, projectileSpeed: 0, spread: 0 },
  },
  barrel_long: {
    id: 'barrel_long',
    slot: 'barrel',
    name: 'Laras Panjang Presisi',
    rarity: 'rare',
    level: 1,
    description: 'Menambah jangkauan tembakan jauh dan laju peluru lebih lurus.',
    icon: '🔭',
    iconAsset: '/weapons/Bullet/blaster_pramuka/muzzle_f1.png',
    unlockCostCoins: 250,
    mods: { range: 120, projectileSpeed: 100, spread: -2, fireRate: -0.2 },
  },
  barrel_short: {
    id: 'barrel_short',
    slot: 'barrel',
    name: 'Laras Pendek CQB',
    rarity: 'rare',
    level: 1,
    description: 'Laras ringkas untuk pertarungan jarak dekat, meningkatkan kecepatan menembak.',
    icon: '📐',
    iconAsset: '/weapons/Bullet/blaster_cyber/muzzle_f1.png',
    unlockCostCoins: 400,
    mods: { range: -60, fireRate: 0.8, spread: 3 },
  },
  barrel_sniper: {
    id: 'barrel_sniper',
    slot: 'barrel',
    name: 'Laras Prisma Sniper',
    rarity: 'legendary',
    level: 1,
    description: 'Laras optik lensa kuarsa prismatik. Jangkauan ultra jauh dengan bonus critical!',
    icon: '🎯',
    iconAsset: '/weapons/Bullet/blaster_galaksi/muzzle_f1.png',
    unlockCostCoins: 800,
    mods: { range: 250, projectileSpeed: 250, critChance: 15, fireRate: -0.5 },
  },

  // --- GRIP (Grip / Pemicu) ---
  grip_std: {
    id: 'grip_std',
    slot: 'grip',
    name: 'Grip Polimer Klasik',
    rarity: 'common',
    level: 1,
    description: 'Genggaman nyaman dari bahan polimer bertekstur anti-selip.',
    icon: '🖐️',
    iconAsset: '/assets/png/attack/ammo_pack.png',
    unlockCostCoins: 0,
    mods: { fireRate: 0 },
  },
  grip_rapid: {
    id: 'grip_rapid',
    slot: 'grip',
    name: 'Pemicu Otomatis Cepat',
    rarity: 'rare',
    level: 1,
    description: 'Sistem pegas mekanis yang meningkatkan frekuensi tembakan per detik.',
    icon: '⏱️',
    iconAsset: '/assets/png/attack/ammo_pack.png',
    unlockCostCoins: 300,
    mods: { fireRate: 0.9, damage: -0.1 },
  },
  grip_tactical: {
    id: 'grip_tactical',
    slot: 'grip',
    name: 'Grip Taktis Ergonomis',
    rarity: 'epic',
    level: 1,
    description: 'Peredam getaran maksimal, tembakan menjadi stabil dan peluang kritikal naik.',
    icon: '🦾',
    iconAsset: '/assets/png/attack/power_cell.png',
    unlockCostCoins: 500,
    mods: { fireRate: 0.4, critChance: 6, projectileSpeed: 40 },
  },

  // --- CHARM (Jimat Pasif) ---
  charm_none: {
    id: 'charm_none',
    slot: 'charm',
    name: 'Tanpa Jimat',
    rarity: 'common',
    level: 1,
    description: 'Slot jimat kosong.',
    icon: '⚪',
    iconAsset: '',
    unlockCostCoins: 0,
    mods: {},
  },
  charm_lucky: {
    id: 'charm_lucky',
    slot: 'charm',
    name: 'Jimat Daun Keberuntungan',
    rarity: 'epic',
    level: 1,
    description: 'Meningkatkan peluang drop koin dan shard emas sebesar +25%!',
    icon: '🍀',
    iconAsset: '/assets/png/nature/crystal_blue.png',
    unlockCostCoins: 400,
    mods: { critChance: 5 },
  },
  charm_heart: {
    id: 'charm_heart',
    slot: 'charm',
    name: 'Jimat Detak Jantung Ruby',
    rarity: 'rare',
    level: 1,
    description: 'Menambah daya tahan dan regenerasi energi maskot petualang.',
    icon: '💖',
    iconAsset: '/assets/png/nature/mushroom_red.png',
    unlockCostCoins: 450,
    mods: { damage: 0.3 },
  },
  charm_speed: {
    id: 'charm_speed',
    slot: 'charm',
    name: 'Jimat Sayap Hermes',
    rarity: 'rare',
    level: 1,
    description: 'Peluru melesat lebih cepat dan lincah menembus angin!',
    icon: '🪶',
    iconAsset: '/assets/png/nature/flowers.png',
    unlockCostCoins: 500,
    mods: { projectileSpeed: 150, fireRate: 0.3 },
  },
  charm_crit: {
    id: 'charm_crit',
    slot: 'charm',
    name: 'Jimat Percikan Ledakan',
    rarity: 'legendary',
    level: 1,
    description: 'Meningkatkan serangan kritikal +20% dan ledakan percikan mematikan!',
    icon: '👁️',
    iconAsset: '/weapons/Bullet/blaster_api/hit_f1.png',
    unlockCostCoins: 900,
    mods: { critChance: 20, damage: 0.5 },
  },
};

export const DEFAULT_UNLOCKED_PARTS: string[] = [
  'blaster_std',
  'core_skin_native',
  'core_orb',
  'barrel_std',
  'grip_std',
  'charm_none',
];

export const SLOT_INFO: Record<string, { label: string; iconAsset: string }> = {
  skin: { label: 'Skin Blaster', iconAsset: '/weapons/png/blaster_klasik.png' },
  body: { label: 'Rangka', iconAsset: '/weapons/png/blaster_klasik.png' },
  core: { label: 'Inti Peluru', iconAsset: '/weapons/Bullet/blaster_klasik/bullet_f1.png' },
  barrel: { label: 'Laras', iconAsset: '/weapons/Bullet/blaster_klasik/muzzle_f1.png' },
  grip: { label: 'Grip', iconAsset: '/assets/png/attack/power_cell.png' },
  charm: { label: 'Jimat', iconAsset: '/assets/png/nature/crystal_blue.png' },
};

// ─── 3. PALET WARNA & AURA TAMBAHAN BLASTER ───
export interface BlasterColorDef {
  id: string;
  name: string;
  hex: string;
  filter: string;
}

export const BLASTER_COLORS: BlasterColorDef[] = [
  { id: 'default', name: 'Warna Asli Skin', hex: '#38bdf8', filter: 'none' },
  { id: 'blue', name: 'Biru Samudra', hex: '#2563eb', filter: 'hue-rotate(20deg) saturate(1.2)' },
  { id: 'gold', name: 'Emas Kemilau', hex: '#f59e0b', filter: 'hue-rotate(195deg) saturate(2.5) brightness(1.15)' },
  { id: 'red', name: 'Merah Magma', hex: '#ef4444', filter: 'hue-rotate(145deg) saturate(2.3) brightness(1.05)' },
  { id: 'green', name: 'Hijau Zamrud', hex: '#10b981', filter: 'hue-rotate(285deg) saturate(2.2) brightness(1.1)' },
  { id: 'purple', name: 'Ungu Mistis', hex: '#a855f7', filter: 'hue-rotate(60deg) saturate(2.3) brightness(1.1)' },
  { id: 'orange', name: 'Jingga Surya', hex: '#f97316', filter: 'hue-rotate(170deg) saturate(2.4) brightness(1.1)' },
  { id: 'diamond', name: 'Putih Kristal Neon', hex: '#ffffff', filter: 'brightness(1.5) contrast(1.1)' },
];

// ─── 4. KUSTOMISASI KULIT MASKOT (SKIN) ───
export interface CharacterSkinDef {
  id: string;
  name: string;
  hex: string;
  filter: string;
}

export const CHARACTER_SKINS: CharacterSkinDef[] = [
  { id: 'default', name: 'Kuning Klasik', hex: '#facc15', filter: 'none' },
  { id: 'lime', name: 'Hijau Segar', hex: '#4ade80', filter: 'hue-rotate(85deg) saturate(1.2)' },
  { id: 'cyan', name: 'Sian Dingin', hex: '#38bdf8', filter: 'hue-rotate(175deg) saturate(1.3)' },
  { id: 'orange', name: 'Jingga Mentari', hex: '#fb923c', filter: 'hue-rotate(25deg) saturate(1.4)' },
  { id: 'purple', name: 'Violet Misteri', hex: '#c084fc', filter: 'hue-rotate(240deg) saturate(1.4)' },
  { id: 'crimson', name: 'Merah Berani', hex: '#f87171', filter: 'hue-rotate(330deg) saturate(1.5)' },
  { id: 'golden', name: 'Emas Kejayaan', hex: '#fde047', filter: 'brightness(1.15) saturate(2)' },
];

// ─── 5. KUSTOMISASI TOPI & AKSESORI MASKOT ───
export interface CharacterHatDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const CHARACTER_HATS: CharacterHatDef[] = [
  { id: 'none', name: 'Tanpa Aksesori', icon: '🧢', description: 'Tampilan alami sang segitiga petualang.', rarity: 'common' },
  { id: 'crown', name: 'Mahkota Emas Raja Geometri', icon: '👑', description: 'Mahkota megah penakluk pulau dan raja bentuk!', rarity: 'legendary' },
  { id: 'glasses', name: 'Kacamata Petualang Keren', icon: '🕶️', description: 'Kacamata trendi anti-silau cahaya padang pasir.', rarity: 'rare' },
  { id: 'scout', name: 'Topi Pramuka Rimba', icon: '🤠', description: 'Topi penjelajah rimba untuk menghadapi angin kencang.', rarity: 'rare' },
  { id: 'wizard', name: 'Topi Penyihir Bintang', icon: '🧙‍♂️', description: 'Topi bertabur rasi bintang magis peninggalan arkana.', rarity: 'epic' },
  { id: 'cap', name: 'Topi Sport Merah', icon: '🧢', description: 'Topi kasual merah untuk lari cepat melompati jurang.', rarity: 'common' },
];

// ─── 6. LOADOUT BAWAAN (3 PRESET LENGKAP & RAPI DENGAN SKIN) ───
export const DEFAULT_LOADOUTS: WeaponLoadout[] = [
  {
    id: 'loadout-1',
    name: 'Loadout 1: Petualang Klasik',
    skinId: 'blaster_klasik',
    body: 'blaster_std',
    core: 'core_skin_native',
    barrel: 'barrel_std',
    grip: 'grip_std',
    charm: 'charm_none',
    color: 'default',
  },
  {
    id: 'loadout-2',
    name: 'Loadout 2: Kobar Api Magma',
    skinId: 'blaster_api',
    body: 'blaster_heavy',
    core: 'core_skin_native',
    barrel: 'barrel_short',
    grip: 'grip_rapid',
    charm: 'charm_lucky',
    color: 'default',
  },
  {
    id: 'loadout-3',
    name: 'Loadout 3: Bintang Kosmik',
    skinId: 'blaster_galaksi',
    body: 'blaster_compact',
    core: 'core_skin_native',
    barrel: 'barrel_long',
    grip: 'grip_tactical',
    charm: 'charm_speed',
    color: 'default',
  },
];

/**
 * Normalisasi objek loadout agar selalu lengkap, valid, dan kompatibel mundur.
 */
export function normalizeLoadout(loadout?: Partial<WeaponLoadout>, index: number = 0): WeaponLoadout {
  const fallback = DEFAULT_LOADOUTS[index] || DEFAULT_LOADOUTS[0];
  if (!loadout) return { ...fallback };

  // Migrasi skinId dari body atau fallback
  let skinId = loadout.skinId;
  if (!skinId || !WEAPON_SKINS_CATALOG[skinId]) {
    if (loadout.body === 'blaster_heavy') skinId = 'blaster_api';
    else if (loadout.body === 'blaster_compact') skinId = 'blaster_cyber';
    else if (loadout.body && WEAPON_SKINS_CATALOG[loadout.body]) skinId = loadout.body;
    else skinId = fallback.skinId || 'blaster_klasik';
  }

  return {
    id: loadout.id || `loadout-${index + 1}`,
    name: loadout.name || `Loadout ${index + 1}`,
    skinId,
    body: loadout.body || fallback.body || 'blaster_std',
    core: loadout.core || fallback.core || 'core_skin_native',
    barrel: loadout.barrel || fallback.barrel || 'barrel_std',
    grip: loadout.grip || fallback.grip || 'grip_std',
    charm: loadout.charm ?? fallback.charm ?? 'charm_none',
    color: loadout.color || 'default',
  };
}

// ─── 7. BIAYA UPGRADE PART (Level 1–5 MENGGUNAKAN KOIN) ───
export const UPGRADE_REQUIREMENTS: Record<number, { coins: number; shards: number; statBonusDesc: string }> = {
  1: { coins: 150, shards: 0, statBonusDesc: '+15% Kekuatan' },
  2: { coins: 350, shards: 0, statBonusDesc: '+30% Kekuatan' },
  3: { coins: 700, shards: 0, statBonusDesc: '+50% Kekuatan' },
  4: { coins: 1200, shards: 0, statBonusDesc: '+75% Kekuatan Maksimal' },
  5: { coins: 0, shards: 0, statBonusDesc: 'Level Maksimum' },
};

export function getPartUpgradeDiff(part: WeaponPart, curLevel: number): string {
  if (curLevel >= 5) return 'Maks (Lv.5)';
  const nextLevel = curLevel + 1;
  const currentMult = 1 + (curLevel - 1) * 0.15;
  const nextMult = 1 + (nextLevel - 1) * 0.15;

  const diffs: string[] = [];
  if (part.mods?.damage) {
    const diff = Math.round((part.mods.damage * nextMult - part.mods.damage * currentMult) * 10) / 10;
    if (diff > 0) diffs.push(`+${diff} ATK`);
  }
  if (part.mods?.range) {
    const diff = Math.round(part.mods.range * nextMult - part.mods.range * currentMult);
    if (diff > 0) diffs.push(`+${diff}px Jarak`);
  }
  if (part.mods?.fireRate && part.mods.fireRate > 0) {
    diffs.push(`+0.2 Laju`);
  }
  if (part.mods?.critChance && part.mods.critChance > 0) {
    diffs.push(`+3% Krit`);
  }
  if (diffs.length === 0) {
    diffs.push(`+15% Stat`);
  }
  return `Lv.${nextLevel}: ${diffs.join(', ')}`;
}

// ─── 8. PERHITUNGAN STAT GABUNGAN SENJATA (computeWeaponStats) ───
export interface ComputedWeaponStats {
  damage: number;
  fireRate: number; // tembakan per detik
  range: number; // pixel jangkauan
  projectileSpeed: number; // pixel per detik
  critChance: number; // persentase 0 - 100
  critMult: number;
  bulletType: string;
  effectName: string;
  effectType: string;
  skinId: string;
  skinName: string;
  skinAsset: string;
  bulletFrames: string[];
  hitFrames: string[];
  muzzleFrames: string[];
  sfx: string;
  bounce: number;
  pierce: number;
  specialEffect?: string;
  elementColor: string;
}

export function computeWeaponStats(
  loadoutInput: WeaponLoadout,
  partLevels: Record<string, number> = {}
): ComputedWeaponStats {
  const loadout = normalizeLoadout(loadoutInput);
  const skin = getWeaponSkin(loadout.skinId);

  const body = WEAPON_PARTS_CATALOG[loadout.body] || WEAPON_PARTS_CATALOG.blaster_std;
  const core = WEAPON_PARTS_CATALOG[loadout.core] || WEAPON_PARTS_CATALOG.core_skin_native;
  const barrel = WEAPON_PARTS_CATALOG[loadout.barrel] || WEAPON_PARTS_CATALOG.barrel_std;
  const grip = WEAPON_PARTS_CATALOG[loadout.grip] || WEAPON_PARTS_CATALOG.grip_std;
  const charm = loadout.charm ? WEAPON_PARTS_CATALOG[loadout.charm] : null;

  const parts = [body, core, barrel, grip, charm].filter(Boolean) as WeaponPart[];

  // Nilai Dasar Seimbang
  let damage = 1.0;
  let fireRate = 3.2; // 3.2 peluru per detik
  let range = 520;
  let projectileSpeed = 750;
  let critChance = 5;
  let critMult = 1.6;
  let bounce = skin.bonusStats.bounce || 0;
  let pierce = skin.bonusStats.pierce || 0;

  // Terapkan Bonus Stat dari Skin Senjata Terpilih
  if (skin.bonusStats) {
    if (skin.bonusStats.damage) damage += skin.bonusStats.damage;
    if (skin.bonusStats.fireRate) fireRate += skin.bonusStats.fireRate;
    if (skin.bonusStats.range) range += skin.bonusStats.range;
    if (skin.bonusStats.projectileSpeed) projectileSpeed += skin.bonusStats.projectileSpeed;
    if (skin.bonusStats.critChance) critChance += skin.bonusStats.critChance;
  }

  // Terapkan Modifier dari Tiap Bagian Modular & Level Upgradenya
  for (const part of parts) {
    const lvl = partLevels[part.id] || 1;
    const levelMult = 1 + (lvl - 1) * 0.15; // +15% per level

    if (part.mods) {
      if (part.mods.damage) damage += part.mods.damage * levelMult;
      if (part.mods.fireRate) fireRate += part.mods.fireRate;
      if (part.mods.range) range += part.mods.range * levelMult;
      if (part.mods.projectileSpeed) projectileSpeed += part.mods.projectileSpeed;
      if (part.mods.critChance) critChance += part.mods.critChance;
    }
  }

  // Clamping Stat ke Batas Logis & Aman
  damage = Math.max(0.5, Math.round(damage * 10) / 10);
  fireRate = Math.max(1.0, Math.min(8.0, Math.round(fireRate * 10) / 10));
  range = Math.max(250, Math.min(950, Math.round(range)));
  projectileSpeed = Math.max(500, Math.min(1400, Math.round(projectileSpeed)));
  critChance = Math.max(0, Math.min(80, Math.round(critChance)));

  // Menentukan Proyektil & Efek: Jika core_skin_native, pakai aset bawaan skin!
  let bulletType = 'bullet_skin';
  let effectName = skin.elementLabel;
  let effectType = skin.element;
  let bulletFrames = [...skin.bullets.bulletFrames];
  let hitFrames = [...skin.bullets.hitFrames];
  let muzzleFrames = [...skin.bullets.muzzleFrames];

  if (core.id !== 'core_skin_native' && core.projectile) {
    bulletType = core.projectile;
    if (core.effect === 'burn') {
      effectName = 'Api (Burn)';
      effectType = 'fire';
    } else if (core.effect === 'freeze') {
      effectName = 'Es (Freeze)';
      effectType = 'ice';
    } else if (core.effect === 'bounce') {
      effectName = 'Pantul (Bounce)';
      effectType = 'rainbow';
      bounce += 1;
    } else if (core.effect === 'pierce') {
      effectName = 'Laser Tembus';
      effectType = 'cosmic';
      pierce += 2;
    } else if (core.id === 'core_orb') {
      effectName = 'Plasma Orb';
      effectType = 'plasma';
    }
  }

  return {
    damage,
    fireRate,
    range,
    projectileSpeed,
    critChance,
    critMult,
    bulletType,
    effectName,
    effectType,
    skinId: skin.id,
    skinName: skin.name,
    skinAsset: skin.assetPng,
    bulletFrames,
    hitFrames,
    muzzleFrames,
    sfx: skin.bullets.sfx,
    bounce,
    pierce,
    specialEffect: skin.specialEffect,
    elementColor: skin.elementColor,
  };
}
