import type { MapNodeType } from '../types/game';

// Data dunia & level menggunakan aset pulau dari folder castle
// Hierarki menurun: Level 1 paling atas -> Level 5 paling bawah.

export type LevelState = 'completed' | 'active' | 'locked';

export interface LevelNodeData {
  num: number;          // nomor level global (1-25)
  state: LevelState;
  nodeType?: MapNodeType;
  x: number;            // posisi horizontal (% dari lebar gambar pulau)
  y: number;            // posisi vertikal (% dari tinggi gambar pulau)
  stars?: number;       // bintang diperoleh (0-3)
}

export interface WorldData {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  image: string;        // gambar pulau 3D dari folder castle
  banner: string;
  hint: string;
  align: 'left' | 'right' | 'center';
  levels: LevelNodeData[];
}

export const worlds: WorldData[] = [
  {
    id: 'pulau-bentuk',
    number: 1,
    name: 'Pulau Bentuk',
    subtitle: 'Mengenal bentuk dasar geometri',
    image: '/assets/islands/island-1.png',
    banner: '/assets/ui/banner-world-01.png',
    hint: 'Lembah Air Terjun Segitiga',
    align: 'left',
    levels: [
      { num: 1, state: 'active', nodeType: 'regular', x: 48, y: 34, stars: 0 },
      { num: 2, state: 'locked', nodeType: 'regular', x: 28, y: 46, stars: 0 },
      { num: 3, state: 'locked', nodeType: 'regular', x: 55, y: 56, stars: 0 },
      { num: 4, state: 'locked', nodeType: 'regular', x: 75, y: 65, stars: 0 },
      { num: 5, state: 'locked', nodeType: 'boss', x: 38, y: 74, stars: 0 },
    ],
  },
  {
    id: 'hutan-segi-empat',
    number: 2,
    name: 'Hutan Segi Empat',
    subtitle: 'Sisi, sudut dan jenis segi empat',
    image: '/assets/islands/island-2.png',
    banner: '/assets/ui/banner-world-02.png',
    hint: 'Reruntuhan Segi Empat Kuno',
    align: 'right',
    levels: [
      { num: 6, state: 'locked', nodeType: 'regular', x: 46, y: 32, stars: 0 },
      { num: 7, state: 'locked', nodeType: 'regular', x: 26, y: 44, stars: 0 },
      { num: 8, state: 'locked', nodeType: 'regular', x: 64, y: 54, stars: 0 },
      { num: 9, state: 'locked', nodeType: 'regular', x: 34, y: 64, stars: 0 },
      { num: 10, state: 'locked', nodeType: 'boss', x: 58, y: 74, stars: 0 },
    ],
  },
  {
    id: 'pegunungan-segitiga',
    number: 3,
    name: 'Pegunungan Segitiga',
    subtitle: 'Jenis segitiga dan keliling',
    image: '/assets/islands/island-3.png',
    banner: '/assets/ui/banner-world-03.png',
    hint: 'Puncak Salju Abadi',
    align: 'left',
    levels: [
      { num: 11, state: 'locked', nodeType: 'regular', x: 48, y: 30, stars: 0 },
      { num: 12, state: 'locked', nodeType: 'regular', x: 70, y: 42, stars: 0 },
      { num: 13, state: 'locked', nodeType: 'regular', x: 36, y: 52, stars: 0 },
      { num: 14, state: 'locked', nodeType: 'regular', x: 66, y: 63, stars: 0 },
      { num: 15, state: 'locked', nodeType: 'boss', x: 38, y: 72, stars: 0 },
    ],
  },
  {
    id: 'danau-lingkaran',
    number: 4,
    name: 'Danau Lingkaran',
    subtitle: 'Jari-jari, diameter dan luas',
    image: '/assets/islands/island-4.png',
    banner: '/assets/ui/banner-world-04.png',
    hint: 'Arena Fantasi Mengambang',
    align: 'right',
    levels: [
      { num: 16, state: 'locked', nodeType: 'regular', x: 46, y: 32, stars: 0 },
      { num: 17, state: 'locked', nodeType: 'regular', x: 24, y: 44, stars: 0 },
      { num: 18, state: 'locked', nodeType: 'regular', x: 65, y: 54, stars: 0 },
      { num: 19, state: 'locked', nodeType: 'regular', x: 32, y: 64, stars: 0 },
      { num: 20, state: 'locked', nodeType: 'boss', x: 56, y: 73, stars: 0 },
    ],
  },
  {
    id: 'kastil-geometri',
    number: 5,
    name: 'Kastil Geometri',
    subtitle: 'Gabungan bentuk dan luas',
    image: '/assets/islands/island-5.png',
    banner: '/assets/ui/banner-world-05.png',
    hint: 'Istana Terapung Nan Ceria',
    align: 'center',
    levels: [
      { num: 21, state: 'locked', nodeType: 'regular', x: 48, y: 26, stars: 0 },
      { num: 22, state: 'locked', nodeType: 'regular', x: 28, y: 38, stars: 0 },
      { num: 23, state: 'locked', nodeType: 'regular', x: 68, y: 50, stars: 0 },
      { num: 24, state: 'locked', nodeType: 'regular', x: 35, y: 62, stars: 0 },
      { num: 25, state: 'locked', nodeType: 'boss', x: 55, y: 73, stars: 0 },
    ],
  },
];
