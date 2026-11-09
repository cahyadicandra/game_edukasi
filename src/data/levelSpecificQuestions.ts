// Bank Soal Spesifik & Unik untuk Setiap Level (Level 1 sampai 25)
// Disesuaikan dengan Kurikulum 5 Pulau Geometri:
// Pulau 1: Pulau Bentuk (Level 1 - 5, Bos: Golem Tri-Shape Purba)
// Pulau 2: Hutan Segi Empat (Level 6 - 10, Bos: Kuadraton Penjaga Rimba)
// Pulau 3: Pegunungan Segitiga (Level 11 - 15, Bos: Naga Trigon Puncak Salju)
// Pulau 4: Danau Lingkaran (Level 16 - 20, Bos: Kraken Sirkular Samudra)
// Pulau 5: Kastil Geometri (Level 21 - 25, Bos: Kaisar Agung Poly-Apex)

import type { QuizQuestion } from './questions';

export const LEVEL_SPECIFIC_QUESTIONS: Record<number, QuizQuestion[]> = {
  // ==========================================================================
  // PULAU 1: PULAU BENTUK (Fokus: Pengenalan Bentuk Bangun Datar)
  // ==========================================================================

  // Level 1: Mengenal Segitiga, Persegi, dan Lingkaran
  1: [
    {
      id: 'l1-q1',
      prompt: 'Bangun datar manakah yang memiliki 3 buah sisi dan 3 titik sudut?',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: 'Persegi', color: '#3b82f6' },
        { id: 'b', label: 'Segitiga', color: '#f59e0b' },
        { id: 'c', label: 'Lingkaran', color: '#ec4899' },
        { id: 'd', label: 'Persegi Panjang', color: '#10b981' },
      ],
      correctId: 'b',
      explanation: 'Segitiga adalah bangun datar yang dibatasi oleh 3 sisi lurus dan memiliki 3 titik sudut.',
      formulaHint: '💡 Ciri Segitiga: Memiliki tepat 3 sisi lurus dan 3 titik sudut.',
      difficulty: 'easy',
    },
    {
      id: 'l1-q2',
      prompt: 'Roda sepeda dan uang koin memiliki bentuk yang menyerupai bangun datar...',
      visual: 'coin',
      options: [
        { id: 'a', label: 'Lingkaran', color: '#ec4899' },
        { id: 'b', label: 'Segitiga', color: '#f59e0b' },
        { id: 'c', label: 'Persegi', color: '#3b82f6' },
        { id: 'd', label: 'Trapesium', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Roda sepeda dan uang koin memiliki garis lengkung tanpa sudut, yaitu lingkaran.',
      formulaHint: '💡 Lingkaran: Satu kurva lengkung tertutup sempurna tanpa sudut.',
      difficulty: 'easy',
    },
    {
      id: 'l1-q3',
      prompt: 'Permukaan papan catur memiliki 4 sisi yang panjangnya sama persis. Bentuk apakah itu?',
      visual: 'chessboard',
      options: [
        { id: 'a', label: 'Persegi', color: '#3b82f6' },
        { id: 'b', label: 'Segitiga', color: '#f59e0b' },
        { id: 'c', label: 'Lingkaran', color: '#ec4899' },
        { id: 'd', label: 'Oval', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Persegi memiliki 4 sisi yang sama panjang dan 4 sudut siku-siku.',
      formulaHint: '💡 Persegi: 4 sisi sama panjang dan 4 sudut siku-siku 90°.',
      difficulty: 'easy',
    },
  ],

  // Level 2: Mengenal Persegi Panjang & Menghitung Sisi
  2: [
    {
      id: 'l2-q1',
      prompt: 'Berapakah jumlah sisi pada sebuah bangun persegi panjang?',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: '3 sisi', color: '#f59e0b' },
        { id: 'b', label: '4 sisi', color: '#10b981' },
        { id: 'c', label: '5 sisi', color: '#3b82f6' },
        { id: 'd', label: '6 sisi', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Semua jenis bangun segi empat, termasuk persegi panjang, memiliki 4 sisi.',
      formulaHint: '💡 Persegi Panjang memiliki 4 sisi (2 panjang dan 2 lebar).',
      difficulty: 'easy',
    },
    {
      id: 'l2-q2',
      prompt: 'Permukaan pintu kelas dan layar buku tulis biasanya berbentuk bangun...',
      visual: 'door',
      options: [
        { id: 'a', label: 'Persegi Panjang', color: '#10b981' },
        { id: 'b', label: 'Lingkaran', color: '#ec4899' },
        { id: 'c', label: 'Segitiga', color: '#f59e0b' },
        { id: 'd', label: 'Bintang', color: '#eab308' },
      ],
      correctId: 'a',
      explanation: 'Pintu dan buku memiliki sepasang sisi panjang dan sepasang sisi lebar: Persegi Panjang.',
      formulaHint: '💡 Benda dengan sisi panjang dan lebar yang berbeda adalah persegi panjang.',
      difficulty: 'easy',
    },
    {
      id: 'l2-q3',
      prompt: 'Apa perbedaan utama antara bangun persegi dan persegi panjang?',
      visual: 'shape_square',
      options: [
        { id: 'a', label: 'Persegi hanya memiliki 3 sisi', color: '#ef4444' },
        { id: 'b', label: 'Persegi 4 sisinya sama panjang, persegi panjang sisi berhadapan yang sama', color: '#10b981' },
        { id: 'c', label: 'Persegi panjang tidak memiliki sudut', color: '#f59e0b' },
        { id: 'd', label: 'Persegi bentuknya melengkung', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Persegi memiliki 4 sisi sama panjang, sedangkan persegi panjang memiliki sisi berhadapan yang sama panjang.',
      formulaHint: '💡 Persegi: semua sisi sama. Persegi panjang: sisi berhadapan sama.',
      difficulty: 'easy',
    },
  ],

  // Level 3: Mengenal Titik Sudut & Sudut Siku-Siku
  3: [
    {
      id: 'l3-q1',
      prompt: 'Pertemuan antara dua ruas garis lurus pada sebuah bangun datar disebut...',
      visual: 'shape_triangle_right',
      options: [
        { id: 'a', label: 'Luas', color: '#3b82f6' },
        { id: 'b', label: 'Titik Sudut', color: '#10b981' },
        { id: 'c', label: 'Keliling', color: '#f59e0b' },
        { id: 'd', label: 'Garis Tengah', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Titik pertemuan antara dua garis yang membentuk pojokan disebut titik sudut.',
      formulaHint: '💡 Pojokan pada bangun datar tempat bertemunya dua sisi disebut titik sudut.',
      difficulty: 'easy',
    },
    {
      id: 'l3-q2',
      prompt: 'Berapakah jumlah titik sudut pada bangun lingkaran?',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: '0 titik sudut', color: '#10b981' },
        { id: 'b', label: '1 titik sudut', color: '#3b82f6' },
        { id: 'c', label: '2 titik sudut', color: '#f59e0b' },
        { id: 'd', label: '4 titik sudut', color: '#ef4444' },
      ],
      correctId: 'a',
      explanation: 'Lingkaran dibentuk oleh satu kurva tertutup melengkung halus tanpa pertemuan dua garis lurus, sehingga memiliki 0 titik sudut.',
      formulaHint: '💡 Lingkaran tidak memiliki sudut maupun titik sudut.',
      difficulty: 'easy',
    },
    {
      id: 'l3-q3',
      prompt: 'Sudut yang terbentuk di pojok meja berbentuk buku (tegak lurus 90°) disebut sudut...',
      visual: 'book',
      options: [
        { id: 'a', label: 'Sudut Lancip', color: '#f59e0b' },
        { id: 'b', label: 'Sudut Siku-siku', color: '#10b981' },
        { id: 'c', label: 'Sudut Tumpul', color: '#ec4899' },
        { id: 'd', label: 'Sudut Lurus', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Sudut pojokan tegak lurus berukuran 90° disebut sudut siku-siku.',
      formulaHint: '💡 Sudut siku-siku = tepat 90° (berbentuk huruf L).',
      difficulty: 'easy',
    },
  ],

  // Level 4: Benda Nyata & Pengelompokan Bangun Datar
  4: [
    {
      id: 'l4-q1',
      prompt: 'Potongan pizza, rambu lalu lintas bahaya, dan gantungan baju umumnya berbentuk...',
      visual: 'pizza',
      options: [
        { id: 'a', label: 'Persegi', color: '#3b82f6' },
        { id: 'b', label: 'Segitiga', color: '#f59e0b' },
        { id: 'c', label: 'Lingkaran', color: '#ec4899' },
        { id: 'd', label: 'Jajar Genjang', color: '#10b981' },
      ],
      correctId: 'b',
      explanation: 'Gantungan baju dan potongan pizza memiliki 3 sisi dan 3 sudut, menyerupai segitiga.',
      formulaHint: '💡 Perhatikan jumlah pojokan benda: 3 pojokan = segitiga.',
      difficulty: 'easy',
    },
    {
      id: 'l4-q2',
      prompt: 'Benda berikut ini yang memiliki permukaan berbentuk lingkaran adalah...',
      visual: 'clock',
      options: [
        { id: 'a', label: 'Papan tulis kelas', color: '#3b82f6' },
        { id: 'b', label: 'Jam dinding bundar', color: '#10b981' },
        { id: 'c', label: 'Pintu kamar', color: '#f59e0b' },
        { id: 'd', label: 'Penggaris lurus 30 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Jam dinding bundar memiliki bentuk permukaan lingkaran sempurna.',
      formulaHint: '💡 Jam dinding bulat tidak memiliki pojokan.',
      difficulty: 'easy',
    },
    {
      id: 'l4-q3',
      prompt: 'Jika sebuah bentuk memiliki 4 sisi sama panjang dan 4 sudut siku-siku, maka benda itu adalah...',
      visual: 'shape_square',
      options: [
        { id: 'a', label: 'Kertas origami persegi', color: '#10b981' },
        { id: 'b', label: 'Uang kertas Rp 50.000', color: '#3b82f6' },
        { id: 'c', label: 'Keping koin logam', color: '#ec4899' },
        { id: 'd', label: 'Atap rumah joglo', color: '#f59e0b' },
      ],
      correctId: 'a',
      explanation: 'Kertas origami lipat standar adalah contoh nyata bangun persegi dengan 4 sisi sama panjang.',
      formulaHint: '💡 Kertas origami standar memiliki 4 sisi yang sama panjang.',
      difficulty: 'easy',
    },
  ],

  // Level 5: UJIAN PULAU BENTUK (BOS: GOLEM TRI-SHAPE PURBA)
  5: [
    {
      id: 'l5-q1',
      prompt: 'Golem bertanya: "Aku adalah bangun datar dengan 4 sisi. Dua sisiku berhadapan 8 cm, dan dua sisi lainnya 4 cm. Siapakah aku?"',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: 'Segitiga', color: '#f59e0b' },
        { id: 'b', label: 'Persegi Panjang', color: '#10b981' },
        { id: 'c', label: 'Lingkaran', color: '#ec4899' },
        { id: 'd', label: 'Persegi', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Memiliki sepasang sisi 8 cm dan sepasang sisi 4 cm adalah sifat khas bangun persegi panjang.',
      formulaHint: '💡 Sisi berhadapan sama panjang = Persegi Panjang.',
      difficulty: 'boss',
    },
    {
      id: 'l5-q2',
      prompt: 'Jika sebuah segitiga memiliki 3 sisi dan sebuah persegi memiliki 4 sisi, berapa total jumlah sisi kedua bangun tersebut?',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: '6 sisi', color: '#ef4444' },
        { id: 'b', label: '7 sisi', color: '#10b981' },
        { id: 'c', label: '8 sisi', color: '#3b82f6' },
        { id: 'd', label: '9 sisi', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Jumlah sisi segitiga (3) ditambah jumlah sisi persegi (4) adalah 3 + 4 = 7 sisi.',
      formulaHint: '💡 3 (segitiga) + 4 (persegi) = 7.',
      difficulty: 'boss',
    },
    {
      id: 'l5-q3',
      prompt: 'Golem Tri-Shape menembakkan teka-teki: "Berapa banyak titik sudut yang dimiliki oleh 2 buah bangun lingkaran?"',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: '0 titik sudut', color: '#10b981' },
        { id: 'b', label: '2 titik sudut', color: '#3b82f6' },
        { id: 'c', label: '4 titik sudut', color: '#f59e0b' },
        { id: 'd', label: 'Tak terhingga', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Lingkaran tidak memiliki titik sudut sama sekali (0 + 0 = 0 titik sudut).',
      formulaHint: '💡 Lingkaran = 0 titik sudut. Berapapun jumlah lingkaran, total sudut tetap 0.',
      difficulty: 'boss',
    },
  ],

  // ==========================================================================
  // PULAU 2: HUTAN SEGI EMPAT (Fokus: Jenis-Jenis Segi Empat & Sifatnya)
  // ==========================================================================

  // Level 6: Mengenal Sifat Persegi (Sisi Sama, Sudut Siku-Siku)
  6: [
    {
      id: 'l6-q1',
      prompt: 'Jika panjang satu sisi persegi adalah 5 cm, berapakah panjang ketiga sisi lainnya?',
      visual: 'shape_square',
      options: [
        { id: 'a', label: 'Semuanya masing-masing 5 cm', color: '#10b981' },
        { id: 'b', label: '10 cm', color: '#3b82f6' },
        { id: 'c', label: '2,5 cm', color: '#f59e0b' },
        { id: 'd', label: 'Berbeda-beda ukurannya', color: '#ef4444' },
      ],
      correctId: 'a',
      explanation: 'Semua sisi pada bangun datar persegi memiliki ukuran yang sama panjang.',
      formulaHint: '💡 Pada persegi: sisi 1 = sisi 2 = sisi 3 = sisi 4.',
      difficulty: 'easy',
    },
    {
      id: 'l6-q2',
      prompt: 'Berapakah besar masing-masing sudut pada sebuah persegi?',
      visual: 'shape_square',
      options: [
        { id: 'a', label: '45°', color: '#f59e0b' },
        { id: 'b', label: '60°', color: '#3b82f6' },
        { id: 'c', label: '90° (Siku-siku)', color: '#10b981' },
        { id: 'd', label: '180°', color: '#8b5cf6' },
      ],
      correctId: 'c',
      explanation: 'Keempat sudut persegi adalah sudut siku-siku yang berukuran 90°.',
      formulaHint: '💡 Keempat sudut persegi berbentuk siku-siku (90°).',
      difficulty: 'easy',
    },
    {
      id: 'l6-q3',
      prompt: 'Jumlah seluruh sudut dalam sebuah bangun persegi adalah...',
      visual: 'shape_square',
      options: [
        { id: 'a', label: '180°', color: '#f59e0b' },
        { id: 'b', label: '270°', color: '#ec4899' },
        { id: 'c', label: '360°', color: '#10b981' },
        { id: 'd', label: '100°', color: '#8b5cf6' },
      ],
      correctId: 'c',
      explanation: 'Persegi memiliki 4 sudut siku-siku: 4 × 90° = 360°.',
      formulaHint: '💡 Total sudut segi empat = 4 × 90° = 360°.',
      difficulty: 'easy',
    },
  ],

  // Level 7: Mengenal Persegi Panjang & Keliling Dasarnya
  7: [
    {
      id: 'l7-q1',
      prompt: 'Persegi panjang memiliki panjang p = 6 cm dan lebar l = 3 cm. Berapakah panjang sisi yang berhadapan dengan panjang?',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: '3 cm', color: '#f59e0b' },
        { id: 'b', label: '6 cm', color: '#10b981' },
        { id: 'c', label: '9 cm', color: '#3b82f6' },
        { id: 'd', label: '18 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Pada persegi panjang, sisi-sisi yang saling berhadapan berukuran sama panjang (6 cm).',
      formulaHint: '💡 Sisi berhadapan pada persegi panjang sama panjang.',
      difficulty: 'easy',
    },
    {
      id: 'l7-q2',
      prompt: 'Rumus untuk menghitung keliling bangun persegi panjang adalah...',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: 'p + l', color: '#ef4444' },
        { id: 'b', label: '2 × (p + l)', color: '#10b981' },
        { id: 'c', label: 'p × l', color: '#3b82f6' },
        { id: 'd', label: 'p - l', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling persegi panjang adalah jumlah seluruh sisi luarnya: p + l + p + l = 2 × (p + l).',
      formulaHint: '💡 Keliling = 2 × (panjang + lebar).',
      difficulty: 'easy',
    },
    {
      id: 'l7-q3',
      prompt: 'Sebuah permukaan meja memiliki panjang 10 cm dan lebar 4 cm. Berapakah kelilingnya?',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: '14 cm', color: '#ef4444' },
        { id: 'b', label: '28 cm', color: '#10b981' },
        { id: 'c', label: '40 cm', color: '#3b82f6' },
        { id: 'd', label: '20 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'K = 2 × (10 + 4) = 2 × 14 = 28 cm.',
      formulaHint: '💡 K = 2 × (10 + 4) = 2 × 14 = 28 cm.',
      difficulty: 'medium',
    },
  ],

  // Level 8: Jajar Genjang (Sisi Sejajar & Sudut Berhadapan)
  8: [
    {
      id: 'l8-q1',
      prompt: 'Bangun segi empat yang memiliki dua pasang sisi sejajar dan sudut berhadapan sama besar adalah...',
      visual: 'shape_parallelogram',
      options: [
        { id: 'a', label: 'Segitiga', color: '#f59e0b' },
        { id: 'b', label: 'Jajar Genjang', color: '#10b981' },
        { id: 'c', label: 'Lingkaran', color: '#ec4899' },
        { id: 'd', label: 'Trapesium Sembarang', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Ciri utama jajar genjang adalah memiliki 2 pasang sisi sejajar dan sudut berhadapan sama besar.',
      formulaHint: '💡 Jajar genjang memiliki 2 pasang sisi sejajar yang miring searah.',
      difficulty: 'easy',
    },
    {
      id: 'l8-q2',
      prompt: 'Apakah sudut-sudut pada bangun jajar genjang selalu berupa sudut siku-siku (90°)?',
      visual: 'shape_parallelogram',
      options: [
        { id: 'a', label: 'Ya, selalu siku-siku', color: '#ef4444' },
        { id: 'b', label: 'Tidak, terdiri dari sepasang sudut lancip dan sepasang sudut tumpul', color: '#10b981' },
        { id: 'c', label: 'Jajar genjang tidak punya sudut', color: '#f59e0b' },
        { id: 'd', label: 'Hanya punya 1 sudut', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Sudut jajar genjang umum tidak siku-siku, melainkan memiliki 2 sudut lancip dan 2 sudut tumpul.',
      formulaHint: '💡 Sudut jajar genjang terdiri dari sudut lancip dan tumpul yang saling berhadapan.',
      difficulty: 'easy',
    },
    {
      id: 'l8-q3',
      prompt: 'Sebuah jajar genjang memiliki sisi alas 8 cm dan sisi miring 5 cm. Berapakah kelilingnya?',
      visual: 'shape_parallelogram',
      options: [
        { id: 'a', label: '13 cm', color: '#f59e0b' },
        { id: 'b', label: '26 cm', color: '#10b981' },
        { id: 'c', label: '40 cm', color: '#3b82f6' },
        { id: 'd', label: '20 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling jajar genjang = 2 × (sisi alas + sisi miring) = 2 × (8 + 5) = 2 × 13 = 26 cm.',
      formulaHint: '💡 K = 2 × (alas + sisi miring) = 2 × 13 = 26 cm.',
      difficulty: 'medium',
    },
  ],

  // Level 9: Belah Ketupat & Layang-Layang
  9: [
    {
      id: 'l9-q1',
      prompt: 'Makanan tradisional ketupat saat hari raya lebaran memiliki permukaan berbentuk...',
      visual: 'shape_rhombus',
      options: [
        { id: 'a', label: 'Lingkaran', color: '#ec4899' },
        { id: 'b', label: 'Belah Ketupat', color: '#10b981' },
        { id: 'c', label: 'Segitiga Sama Kaki', color: '#f59e0b' },
        { id: 'd', label: 'Persegi Panjang', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Bentuk bungkus ketupat menyerupai bangun datar belah ketupat dengan 4 sisi sama panjang.',
      formulaHint: '💡 Bungkus ketupat adalah asal nama bangun belah ketupat.',
      difficulty: 'easy',
    },
    {
      id: 'l9-q2',
      prompt: 'Bangun layang-layang memiliki dua garis diagonal yang saling berpotongan secara...',
      visual: 'shape_rhombus',
      options: [
        { id: 'a', label: 'Sejajar', color: '#ef4444' },
        { id: 'b', label: 'Tegak Lurus (90°)', color: '#10b981' },
        { id: 'c', label: 'Tidak bertemu', color: '#f59e0b' },
        { id: 'd', label: 'Melengkung', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Kedua diagonal pada bangun layang-layang berpotongan tegak lurus membentuk sudut siku-siku 90°.',
      formulaHint: '💡 Diagonal layang-layang berpotongan tegak lurus (90°).',
      difficulty: 'easy',
    },
    {
      id: 'l9-q3',
      prompt: 'Sebuah belah ketupat memiliki panjang satu sisinya 7 cm. Berapakah kelilingnya?',
      visual: 'shape_rhombus',
      options: [
        { id: 'a', label: '14 cm', color: '#f59e0b' },
        { id: 'b', label: '21 cm', color: '#3b82f6' },
        { id: 'c', label: '28 cm', color: '#10b981' },
        { id: 'd', label: '49 cm', color: '#8b5cf6' },
      ],
      correctId: 'c',
      explanation: 'Karena keempat sisi belah ketupat sama panjang, Keliling = 4 × 7 cm = 28 cm.',
      formulaHint: '💡 Keliling belah ketupat = 4 × sisi = 4 × 7 = 28 cm.',
      difficulty: 'medium',
    },
  ],

  // Level 10: UJIAN HUTAN SEGI EMPAT (BOS: KUADRATON PENJAGA RIMBA)
  10: [
    {
      id: 'l10-q1',
      prompt: 'Kuadraton menguji: "Bangun datar segi empat yang hanya memiliki tepat SATU pasang sisi sejajar disebut..."',
      visual: 'shape_trapezoid',
      options: [
        { id: 'a', label: 'Persegi', color: '#3b82f6' },
        { id: 'b', label: 'Trapesium', color: '#10b981' },
        { id: 'c', label: 'Jajar Genjang', color: '#f59e0b' },
        { id: 'd', label: 'Persegi Panjang', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Ciri khas trapesium adalah hanya memiliki sepasang sisi yang saling sejajar.',
      formulaHint: '💡 Bangun datar dengan tepat 1 pasang sisi sejajar = Trapesium.',
      difficulty: 'boss',
    },
    {
      id: 'l10-q2',
      prompt: 'Sebuah persegi memiliki keliling 36 cm. Berapakah panjang masing-masing sisinya?',
      visual: 'shape_square',
      options: [
        { id: 'a', label: '6 cm', color: '#ef4444' },
        { id: 'b', label: '8 cm', color: '#f59e0b' },
        { id: 'c', label: '9 cm', color: '#10b981' },
        { id: 'd', label: '12 cm', color: '#3b82f6' },
      ],
      correctId: 'c',
      explanation: 'Sisi persegi = Keliling ÷ 4 = 36 ÷ 4 = 9 cm.',
      formulaHint: '💡 Sisi = Keliling ÷ 4 = 36 ÷ 4 = 9 cm.',
      difficulty: 'boss',
    },
    {
      id: 'l10-q3',
      prompt: 'Manakah pernyataan berikut yang BENAR tentang keluarga bangun segi empat?',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: 'Belah ketupat selalu memiliki 4 sudut siku-siku', color: '#ef4444' },
        { id: 'b', label: 'Persegi adalah persegi panjang khusus yang keempat sisinya sama panjang', color: '#10b981' },
        { id: 'c', label: 'Jajar genjang hanya memiliki 3 sisi', color: '#f59e0b' },
        { id: 'd', label: 'Trapesium tidak memiliki sudut', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Persegi memenuhi semua sifat persegi panjang, dengan keistimewaan 4 sisi yang sama panjang.',
      formulaHint: '💡 Persegi merupakan persegi panjang dengan sisi sama panjang.',
      difficulty: 'boss',
    },
  ],

  // ==========================================================================
  // PULAU 3: PEGUNUNGAN SEGITIGA (Fokus: Jenis Segitiga & Sudut)
  // ==========================================================================

  // Level 11: Segitiga Berdasarkan Sisi
  11: [
    {
      id: 'l11-q1',
      prompt: 'Segitiga yang ketiga sisinya berukuran sama panjang disebut segitiga...',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: 'Sama Sisi', color: '#10b981' },
        { id: 'b', label: 'Sama Kaki', color: '#3b82f6' },
        { id: 'c', label: 'Sembarang', color: '#f59e0b' },
        { id: 'd', label: 'Siku-siku', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Segitiga sama sisi memiliki 3 sisi sama panjang dan 3 sudut yang sama besar (60°).',
      formulaHint: '💡 Sama sisi: ketiga sisinya berukuran sama.',
      difficulty: 'easy',
    },
    {
      id: 'l11-q2',
      prompt: 'Segitiga yang hanya memiliki dua sisi yang sama panjang dinamakan segitiga...',
      visual: 'shape_triangle_isosceles',
      options: [
        { id: 'a', label: 'Sama Sisi', color: '#3b82f6' },
        { id: 'b', label: 'Sama Kaki', color: '#10b981' },
        { id: 'c', label: 'Sembarang', color: '#f59e0b' },
        { id: 'd', label: 'Tumpul', color: '#ec4899' },
      ],
      correctId: 'b',
      explanation: 'Segitiga sama kaki memiliki sepasang (dua) sisi yang sama panjang sebagai kakinya.',
      formulaHint: '💡 Sama kaki: 2 sisi sama panjang menyerupai sepasang kaki.',
      difficulty: 'easy',
    },
    {
      id: 'l11-q3',
      prompt: 'Sebuah segitiga memiliki sisi 4 cm, 7 cm, dan 9 cm. Karena semua sisinya berbeda, maka disebut segitiga...',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: 'Sama Sisi', color: '#ef4444' },
        { id: 'b', label: 'Sama Kaki', color: '#f59e0b' },
        { id: 'c', label: 'Sembarang', color: '#10b981' },
        { id: 'd', label: 'Rata', color: '#8b5cf6' },
      ],
      correctId: 'c',
      explanation: 'Segitiga yang ketiga sisinya memiliki panjang berbeda disebut segitiga sembarang.',
      formulaHint: '💡 Segitiga dengan panjang sisi berbeda-beda = segitiga sembarang.',
      difficulty: 'easy',
    },
  ],

  // Level 12: Segitiga Berdasarkan Sudut
  12: [
    {
      id: 'l12-q1',
      prompt: 'Segitiga yang salah satu sudutnya tepat berukuran 90° disebut segitiga...',
      visual: 'shape_triangle_right',
      options: [
        { id: 'a', label: 'Segitiga Lancip', color: '#f59e0b' },
        { id: 'b', label: 'Segitiga Siku-siku', color: '#10b981' },
        { id: 'c', label: 'Segitiga Tumpul', color: '#ec4899' },
        { id: 'd', label: 'Segitiga Sama Sisi', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Segitiga dengan salah satu sudut siku-siku (90°) adalah segitiga siku-siku.',
      formulaHint: '💡 Sudut 90° = sudut siku-siku.',
      difficulty: 'easy',
    },
    {
      id: 'l12-q2',
      prompt: 'Jika sebuah segitiga memiliki salah satu sudut sebesar 110°, segitiga tersebut termasuk jenis...',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: 'Segitiga Lancip', color: '#f59e0b' },
        { id: 'b', label: 'Segitiga Tumpul', color: '#10b981' },
        { id: 'c', label: 'Segitiga Siku-siku', color: '#3b82f6' },
        { id: 'd', label: 'Segitiga Lurus', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Sudut 110° lebih besar dari 90°, sehingga termasuk sudut tumpul.',
      formulaHint: '💡 Sudut > 90° = sudut tumpul.',
      difficulty: 'easy',
    },
    {
      id: 'l12-q3',
      prompt: 'Segitiga sama sisi memiliki tiga sudut yang besarnya masing-masing...',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: '45°', color: '#f59e0b' },
        { id: 'b', label: '60°', color: '#10b981' },
        { id: 'c', label: '90°', color: '#3b82f6' },
        { id: 'd', label: '180°', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Karena ketiga sudutnya sama besar dan totalnya 180°, maka 180° ÷ 3 = 60°.',
      formulaHint: '💡 180° ÷ 3 sudut sama besar = 60°.',
      difficulty: 'medium',
    },
  ],

  // Level 13: Jumlah Sudut Segitiga Selalu 180°
  13: [
    {
      id: 'l13-q1',
      prompt: 'Berapakah jumlah seluruh sudut di dalam bangun datar segitiga apa pun?',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: '90°', color: '#ef4444' },
        { id: 'b', label: '180°', color: '#10b981' },
        { id: 'c', label: '270°', color: '#f59e0b' },
        { id: 'd', label: '360°', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Total jumlah ketiga sudut dalam setiap segitiga selalu sama dengan 180°.',
      formulaHint: '💡 Sudut A + Sudut B + Sudut C = 180°.',
      difficulty: 'easy',
    },
    {
      id: 'l13-q2',
      prompt: 'Sebuah segitiga memiliki dua sudut berukuran 50° dan 70°. Berapakah besar sudut yang ketiga?',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: '50°', color: '#3b82f6' },
        { id: 'b', label: '60°', color: '#10b981' },
        { id: 'c', label: '70°', color: '#f59e0b' },
        { id: 'd', label: '80°', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Sudut ketiga = 180° - (50° + 70°) = 180° - 120° = 60°.',
      formulaHint: '💡 180° - (50° + 70°) = 180° - 120° = 60°.',
      difficulty: 'medium',
    },
    {
      id: 'l13-q3',
      prompt: 'Pada segitiga siku-siku, satu sudutnya bernilai 90° dan sudut kedua 35°. Berapa sudut ketiga?',
      visual: 'shape_triangle_right',
      options: [
        { id: 'a', label: '45°', color: '#f59e0b' },
        { id: 'b', label: '55°', color: '#10b981' },
        { id: 'c', label: '65°', color: '#3b82f6' },
        { id: 'd', label: '90°', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Sudut ketiga = 180° - (90° + 35°) = 180° - 125° = 55°.',
      formulaHint: '💡 180° - 125° = 55°.',
      difficulty: 'medium',
    },
  ],

  // Level 14: Keliling Segitiga & Konsep Alas-Tinggi
  14: [
    {
      id: 'l14-q1',
      prompt: 'Rumus menghitung keliling segitiga dengan sisi a, b, dan c adalah...',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: 'a × b × c', color: '#ef4444' },
        { id: 'b', label: 'a + b + c', color: '#10b981' },
        { id: 'c', label: '(a + b) ÷ c', color: '#f59e0b' },
        { id: 'd', label: '2 × (a + b)', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Keliling adalah jumlah panjang seluruh sisi luarnya: a + b + c.',
      formulaHint: '💡 Keliling segitiga = jumlah ketiga sisinya.',
      difficulty: 'easy',
    },
    {
      id: 'l14-q2',
      prompt: 'Sebuah segitiga sama sisi memiliki panjang sisi 8 cm. Berapakah kelilingnya?',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: '16 cm', color: '#f59e0b' },
        { id: 'b', label: '24 cm', color: '#10b981' },
        { id: 'c', label: '32 cm', color: '#3b82f6' },
        { id: 'd', label: '64 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling = 8 + 8 + 8 = 3 × 8 = 24 cm.',
      formulaHint: '💡 Keliling = 3 × 8 cm = 24 cm.',
      difficulty: 'medium',
    },
    {
      id: 'l14-q3',
      prompt: 'Garis tinggi pada segitiga selalu ditarik dari titik sudut menuju sisi alas secara...',
      visual: 'shape_triangle_right',
      options: [
        { id: 'a', label: 'Miring', color: '#f59e0b' },
        { id: 'b', label: 'Tegak lurus (90°)', color: '#10b981' },
        { id: 'c', label: 'Sejajar', color: '#3b82f6' },
        { id: 'd', label: 'Melingkar', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Tinggi segitiga adalah garis tegak lurus yang membentuk sudut siku-siku 90° dengan sisi alas.',
      formulaHint: '💡 Tinggi segitiga selalu tegak lurus terhadap alas.',
      difficulty: 'easy',
    },
  ],

  // Level 15: UJIAN PEGUNUNGAN SEGITIGA (BOS: NAGA TRIGON PUNCAK SALJU)
  15: [
    {
      id: 'l15-q1',
      prompt: 'Naga Trigon bertanya: "Sebuah segitiga sama kaki memiliki keliling 26 cm. Jika alasnya 6 cm, berapa panjang salah satu sisi kakinya?"',
      visual: 'shape_triangle_isosceles',
      options: [
        { id: 'a', label: '8 cm', color: '#f59e0b' },
        { id: 'b', label: '10 cm', color: '#10b981' },
        { id: 'c', label: '12 cm', color: '#3b82f6' },
        { id: 'd', label: '14 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Kedua sisi kaki sama panjang: (26 - 6) ÷ 2 = 20 ÷ 2 = 10 cm.',
      formulaHint: '💡 (Keliling - alas) ÷ 2 = (26 - 6) ÷ 2 = 10 cm.',
      difficulty: 'boss',
    },
    {
      id: 'l15-q2',
      prompt: 'Jika sebuah segitiga memiliki sudut 60°, 60°, dan 60°, bangun tersebut PASTI merupakan segitiga...',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: 'Segitiga Sama Sisi', color: '#10b981' },
        { id: 'b', label: 'Segitiga Siku-siku', color: '#3b82f6' },
        { id: 'c', label: 'Segitiga Sembarang', color: '#f59e0b' },
        { id: 'd', label: 'Segitiga Tumpul', color: '#ec4899' },
      ],
      correctId: 'a',
      explanation: 'Segitiga dengan ketiga sudut sama (60°) pasti merupakan segitiga sama sisi.',
      formulaHint: '💡 Tiga sudut 60° = Segitiga Sama Sisi.',
      difficulty: 'boss',
    },
    {
      id: 'l15-q3',
      prompt: 'Sebuah segitiga siku-siku memiliki sisi tegak 3 cm, sisi mendatar 4 cm, dan sisi miring 5 cm. Berapakah keliling segitiga tersebut?',
      visual: 'shape_triangle_right',
      options: [
        { id: 'a', label: '12 cm', color: '#10b981' },
        { id: 'b', label: '15 cm', color: '#f59e0b' },
        { id: 'c', label: '20 cm', color: '#3b82f6' },
        { id: 'd', label: '60 cm', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Keliling = 3 + 4 + 5 = 12 cm.',
      formulaHint: '💡 K = 3 + 4 + 5 = 12 cm.',
      difficulty: 'boss',
    },
  ],

  // ==========================================================================
  // PULAU 4: DANAU LINGKARAN (Fokus: Unsur Lingkaran & Keliling)
  // ==========================================================================

  // Level 16: Unsur Lingkaran (Titik Pusat, Jari-Jari, Diameter)
  16: [
    {
      id: 'l16-q1',
      prompt: 'Titik yang berada tepat di tengah-tengah bangun lingkaran disebut...',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: 'Titik Sudut', color: '#ef4444' },
        { id: 'b', label: 'Titik Pusat', color: '#10b981' },
        { id: 'c', label: 'Jari-jari', color: '#f59e0b' },
        { id: 'd', label: 'Tali Busur', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Titik pusat adalah titik yang berjarak sama ke semua titik pada tepi lingkaran.',
      formulaHint: '💡 Titik di pusat/tengah lingkaran = titik pusat.',
      difficulty: 'easy',
    },
    {
      id: 'l16-q2',
      prompt: 'Garis lurus yang menghubungkan titik pusat ke garis tepi lingkaran disebut...',
      visual: 'shape_circle_radius',
      options: [
        { id: 'a', label: 'Diameter', color: '#3b82f6' },
        { id: 'b', label: 'Jari-jari (r)', color: '#10b981' },
        { id: 'c', label: 'Busur', color: '#f59e0b' },
        { id: 'd', label: 'Sudut', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Jari-jari (r) adalah jarak dari titik pusat ke tepi lingkaran.',
      formulaHint: '💡 Pusat ke tepi = jari-jari (radius).',
      difficulty: 'easy',
    },
    {
      id: 'l16-q3',
      prompt: 'Garis lurus yang menghubungkan dua titik tepi lingkaran dan melewati titik pusat disebut...',
      visual: 'shape_circle_diameter',
      options: [
        { id: 'a', label: 'Jari-jari', color: '#f59e0b' },
        { id: 'b', label: 'Diameter (d)', color: '#10b981' },
        { id: 'c', label: 'Keliling', color: '#3b82f6' },
        { id: 'd', label: 'Busur', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Diameter membelah lingkaran menjadi dua bagian sama besar melewati titik pusat.',
      formulaHint: '💡 Garis tepi ke tepi melewati pusat = Diameter.',
      difficulty: 'easy',
    },
  ],

  // Level 17: Hubungan Diameter & Jari-Jari (d = 2r)
  17: [
    {
      id: 'l17-q1',
      prompt: 'Jika panjang jari-jari sebuah lingkaran adalah 7 cm, berapakah panjang diameternya?',
      visual: 'shape_circle_diameter',
      options: [
        { id: 'a', label: '7 cm', color: '#f59e0b' },
        { id: 'b', label: '14 cm', color: '#10b981' },
        { id: 'c', label: '21 cm', color: '#3b82f6' },
        { id: 'd', label: '28 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Diameter = 2 × jari-jari = 2 × 7 = 14 cm.',
      formulaHint: '💡 d = 2 × r = 2 × 7 = 14 cm.',
      difficulty: 'easy',
    },
    {
      id: 'l17-q2',
      prompt: 'Sebuah lingkaran memiliki diameter sebesar 20 cm. Berapakah panjang jari-jarinya?',
      visual: 'shape_circle_radius',
      options: [
        { id: 'a', label: '5 cm', color: '#ef4444' },
        { id: 'b', label: '10 cm', color: '#10b981' },
        { id: 'c', label: '15 cm', color: '#f59e0b' },
        { id: 'd', label: '40 cm', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Jari-jari = Diameter ÷ 2 = 20 ÷ 2 = 10 cm.',
      formulaHint: '💡 r = d ÷ 2 = 20 ÷ 2 = 10 cm.',
      difficulty: 'easy',
    },
    {
      id: 'l17-q3',
      prompt: 'Pernyataan manakah yang selalu BENAR tentang unsur lingkaran?',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: 'Panjang jari-jari dua kali panjang diameter', color: '#ef4444' },
        { id: 'b', label: 'Panjang diameter selalu dua kali panjang jari-jari', color: '#10b981' },
        { id: 'c', label: 'Diameter tidak melewati titik pusat', color: '#f59e0b' },
        { id: 'd', label: 'Jari-jari lebih panjang dari diameter', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Diameter terbentuk dari 2 jari-jari yang berlawanan arah lurus (d = 2r).',
      formulaHint: '💡 Diameter = 2 × jari-jari.',
      difficulty: 'easy',
    },
  ],

  // Level 18: Unsur Lanjutan (Busur, Tali Busur, Juring, Tembereng)
  18: [
    {
      id: 'l18-q1',
      prompt: 'Garis lengkung pada tepi lingkaran disebut...',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: 'Busur', color: '#10b981' },
        { id: 'b', label: 'Tali Busur', color: '#3b82f6' },
        { id: 'c', label: 'Juring', color: '#f59e0b' },
        { id: 'd', label: 'Diameter', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Busur adalah garis lengkung bagian dari keliling lingkaran.',
      formulaHint: '💡 Garis tepi lengkung lingkaran = Busur.',
      difficulty: 'easy',
    },
    {
      id: 'l18-q2',
      prompt: 'Daerah di dalam lingkaran yang dibatasi oleh dua jari-jari dan satu busur (seperti sepotong pizza) disebut...',
      visual: 'shape_circle_sector',
      options: [
        { id: 'a', label: 'Juring', color: '#10b981' },
        { id: 'b', label: 'Tembereng', color: '#3b82f6' },
        { id: 'c', label: 'Sudut', color: '#f59e0b' },
        { id: 'd', label: 'Pusat', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Potongan kue atau pizza dibatasi oleh dua jari-jari dan satu busur, dinamakan juring.',
      formulaHint: '💡 Potongan kue/pizza berbentuk juring lingkaran.',
      difficulty: 'easy',
    },
    {
      id: 'l18-q3',
      prompt: 'Daerah di dalam lingkaran yang dibatasi oleh tali busur dan busur lingkaran disebut...',
      visual: 'shape_circle_sector',
      options: [
        { id: 'a', label: 'Juring', color: '#f59e0b' },
        { id: 'b', label: 'Tembereng', color: '#10b981' },
        { id: 'c', label: 'Titik Pusat', color: '#3b82f6' },
        { id: 'd', label: 'Diameter', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Tembereng adalah ruang antara busur tepi dan tali busur lurus.',
      formulaHint: '💡 Daerah tali busur + busur = Tembereng.',
      difficulty: 'medium',
    },
  ],

  // Level 19: Mengenal Bilangan Pi (π) & Keliling Lingkaran
  19: [
    {
      id: 'l19-q1',
      prompt: 'Berapakah nilai pecahan pendekatan π (pi) yang biasa digunakan untuk bilangan kelipatan 7?',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: '22/7', color: '#10b981' },
        { id: 'b', label: '7/22', color: '#ef4444' },
        { id: 'c', label: '3,41', color: '#f59e0b' },
        { id: 'd', label: '20/7', color: '#3b82f6' },
      ],
      correctId: 'a',
      explanation: 'Nilai pecahan pendekatan pi yang paling umum adalah 22/7 (atau desimal 3,14).',
      formulaHint: '💡 Nilai pi = 22/7 atau 3,14.',
      difficulty: 'easy',
    },
    {
      id: 'l19-q2',
      prompt: 'Rumus untuk menghitung keliling lingkaran berdasarkan diameter d adalah...',
      visual: 'shape_circle_diameter',
      options: [
        { id: 'a', label: 'K = π × d', color: '#10b981' },
        { id: 'b', label: 'K = π + d', color: '#ef4444' },
        { id: 'c', label: 'K = π ÷ d', color: '#f59e0b' },
        { id: 'd', label: 'K = 2 × π × d', color: '#3b82f6' },
      ],
      correctId: 'a',
      explanation: 'Keliling lingkaran = π × d (atau 2 × π × r).',
      formulaHint: '💡 K = π × d atau K = 2 × π × r.',
      difficulty: 'easy',
    },
    {
      id: 'l19-q3',
      prompt: 'Sebuah lingkaran memiliki diameter 14 cm. Berapakah kelilingnya? (Gunakan π = 22/7)',
      visual: 'shape_circle_diameter',
      options: [
        { id: 'a', label: '22 cm', color: '#f59e0b' },
        { id: 'b', label: '44 cm', color: '#10b981' },
        { id: 'c', label: '88 cm', color: '#3b82f6' },
        { id: 'd', label: '154 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'K = 22/7 × 14 = 22 × 2 = 44 cm.',
      formulaHint: '💡 K = 22/7 × 14 = 44 cm.',
      difficulty: 'medium',
    },
  ],

  // Level 20: UJIAN DANAU LINGKARAN (BOS: KRAKEN SIRKULAR SAMUDRA)
  20: [
    {
      id: 'l20-q1',
      prompt: 'Kraken bertanya: "Roda gerobak berputar menempuh lintasan. Jika jari-jarinya 7 cm, berapa jarak untuk 1 putaran penuh (keliling)?"',
      visual: 'coin',
      options: [
        { id: 'a', label: '22 cm', color: '#f59e0b' },
        { id: 'b', label: '44 cm', color: '#10b981' },
        { id: 'c', label: '88 cm', color: '#3b82f6' },
        { id: 'd', label: '14 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'K = 2 × 22/7 × 7 = 44 cm.',
      formulaHint: '💡 K = 2 × π × r = 2 × 22/7 × 7 = 44 cm.',
      difficulty: 'boss',
    },
    {
      id: 'l20-q2',
      prompt: 'Jika keliling sebuah lingkaran adalah 88 cm, berapakah diameter lingkaran tersebut? (Gunakan π = 22/7)',
      visual: 'shape_circle_diameter',
      options: [
        { id: 'a', label: '14 cm', color: '#f59e0b' },
        { id: 'b', label: '28 cm', color: '#10b981' },
        { id: 'c', label: '42 cm', color: '#3b82f6' },
        { id: 'd', label: '7 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'd = K ÷ π = 88 ÷ (22/7) = 88 × 7/22 = 4 × 7 = 28 cm.',
      formulaHint: '💡 d = 88 ÷ (22/7) = 28 cm.',
      difficulty: 'boss',
    },
    {
      id: 'l20-q3',
      prompt: 'Setengah lingkaran memiliki diameter 14 cm. Berapakah panjang garis lengkung setengah lingkarannya saja?',
      visual: 'shape_circle_sector',
      options: [
        { id: 'a', label: '11 cm', color: '#f59e0b' },
        { id: 'b', label: '22 cm', color: '#10b981' },
        { id: 'c', label: '44 cm', color: '#3b82f6' },
        { id: 'd', label: '28 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling 1 lingkaran penuh = 44 cm, maka garis lengkung setengahnya = 44 ÷ 2 = 22 cm.',
      formulaHint: '💡 Lengkung setengah lingkaran = 44 ÷ 2 = 22 cm.',
      difficulty: 'boss',
    },
  ],

  // ==========================================================================
  // PULAU 5: KASTIL GEOMETRI (Fokus: Bangun Datar Gabungan & Pemecahan Masalah)
  // ==========================================================================

  // Level 21: Bangun Gabungan: Rumah Geometri (Persegi + Segitiga)
  21: [
    {
      id: 'l21-q1',
      prompt: 'Gambar rumah dibentuk dari dinding persegi dan atap segitiga. Yang dihitung sebagai keliling adalah...',
      visual: 'shape_composite_house',
      options: [
        { id: 'a', label: 'Seluruh garis tepi luar rumah', color: '#10b981' },
        { id: 'b', label: 'Hanya garis di dalam rumah', color: '#ef4444' },
        { id: 'c', label: 'Garis pemisah antara atap dan dinding', color: '#f59e0b' },
        { id: 'd', label: 'Hanya atapnya saja', color: '#3b82f6' },
      ],
      correctId: 'a',
      explanation: 'Keliling bangun gabungan adalah jumlah seluruh sisi-sisi batas luar saja.',
      formulaHint: '💡 Keliling hanya mengukur garis luar yang membungkus bangun.',
      difficulty: 'easy',
    },
    {
      id: 'l21-q2',
      prompt: 'Atap segitiga memiliki dua sisi miring 5 cm. Dinding persegi memiliki 3 sisi luar 6 cm. Berapa keliling luar rumah?',
      visual: 'shape_composite_house',
      options: [
        { id: 'a', label: '27 cm', color: '#f59e0b' },
        { id: 'b', label: '28 cm', color: '#10b981' },
        { id: 'c', label: '34 cm', color: '#3b82f6' },
        { id: 'd', label: '22 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling luar = 5 (atap kiri) + 5 (atap kanan) + 6 (dinding kiri) + 6 (bawah) + 6 (kanan) = 28 cm.',
      formulaHint: '💡 K = 5 + 5 + 6 + 6 + 6 = 28 cm.',
      difficulty: 'medium',
    },
    {
      id: 'l21-q3',
      prompt: 'Apakah garis batas dalam antara atap dan dinding ikut dihitung dalam keliling bangun gabungan?',
      visual: 'shape_composite_house',
      options: [
        { id: 'a', label: 'Ya, wajib dihitung', color: '#ef4444' },
        { id: 'b', label: 'Tidak, garis dalam tidak dihitung dalam keliling luar', color: '#10b981' },
        { id: 'c', label: 'Dihitung dua kali', color: '#f59e0b' },
        { id: 'd', label: 'Tergantung warna gambarnya', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling hanya mengukur batas tepi luar, garis sekat interior di dalam tidak dihitung.',
      formulaHint: '💡 Garis dalam bukan bagian dari keliling luar.',
      difficulty: 'easy',
    },
  ],

  // Level 22: Bangun Gabungan: Lapangan & Kapsul (Persegi Panjang + 2 Setengah Lingkaran)
  22: [
    {
      id: 'l22-q1',
      prompt: 'Dua buah setengah lingkaran dengan ukuran yang sama jika digabungkan akan membentuk...',
      visual: 'shape_circle',
      options: [
        { id: 'a', label: 'Satu lingkaran penuh', color: '#10b981' },
        { id: 'b', label: 'Satu persegi', color: '#3b82f6' },
        { id: 'c', label: 'Satu segitiga', color: '#f59e0b' },
        { id: 'd', label: 'Satu trapesium', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Setengah lingkaran ditambah setengah lingkaran sama dengan satu lingkaran utuh.',
      formulaHint: '💡 1/2 + 1/2 = 1 lingkaran penuh.',
      difficulty: 'easy',
    },
    {
      id: 'l22-q2',
      prompt: 'Lapangan lari berbentuk persegi panjang dengan 2 ujung setengah lingkaran berdiameter 14 m. Berapakah panjang 2 lengkungan itu? (π = 22/7)',
      visual: 'shape_composite_track',
      options: [
        { id: 'a', label: '22 m', color: '#f59e0b' },
        { id: 'b', label: '44 m', color: '#10b981' },
        { id: 'c', label: '88 m', color: '#3b82f6' },
        { id: 'd', label: '64 m', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Dua lengkung setengah lingkaran = 1 keliling lingkaran penuh: 22/7 × 14 = 44 m.',
      formulaHint: '💡 2 × lengkung 1/2 lingkaran = K lingkaran utuh = 44 m.',
      difficulty: 'medium',
    },
    {
      id: 'l22-q3',
      prompt: 'Berapakah keliling total lintasan lari tersebut jika panjang 2 sisi lurusnya masing-masing 20 m dan 2 lengkungannya 44 m?',
      visual: 'shape_composite_track',
      options: [
        { id: 'a', label: '64 m', color: '#f59e0b' },
        { id: 'b', label: '84 m', color: '#10b981' },
        { id: 'c', label: '104 m', color: '#3b82f6' },
        { id: 'd', label: '124 m', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling total = 20 + 20 + 44 = 84 meter.',
      formulaHint: '💡 K = 20 + 20 + 44 = 84 m.',
      difficulty: 'medium',
    },
  ],

  // Level 23: Keliling Bangun Berundak (Bentuk Huruf L)
  23: [
    {
      id: 'l23-q1',
      prompt: 'Bangun berbentuk huruf L memiliki 6 ruas sisi luar. Untuk menghitung kelilingnya, yang harus dilakukan adalah...',
      visual: 'shape_composite_l',
      options: [
        { id: 'a', label: 'Mengalikan seluruh sisi', color: '#ef4444' },
        { id: 'b', label: 'Menjumlahkan panjang keenam sisinya', color: '#10b981' },
        { id: 'c', label: 'Membagi sisi terpanjang dengan terpendek', color: '#f59e0b' },
        { id: 'd', label: 'Mengurangi sisi luar dengan dalam', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Keliling poligon apa pun diperoleh dengan menjumlahkan seluruh panjang sisi luarnya.',
      formulaHint: '💡 Keliling = jumlah seluruh sisi luar.',
      difficulty: 'easy',
    },
    {
      id: 'l23-q2',
      prompt: 'Bangun L memiliki tinggi total 10 cm dan lebar total 8 cm. Keliling luar bangun L tersebut adalah...',
      visual: 'shape_composite_l',
      options: [
        { id: 'a', label: '18 cm', color: '#f59e0b' },
        { id: 'b', label: '36 cm', color: '#10b981' },
        { id: 'c', label: '80 cm', color: '#3b82f6' },
        { id: 'd', label: '24 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Pada poligon berundak tegak lurus, keliling = 2 × (tinggi total + lebar total) = 2 × (10 + 8) = 36 cm.',
      formulaHint: '💡 K = 2 × (tinggi + lebar) = 2 × 18 = 36 cm.',
      difficulty: 'medium',
    },
    {
      id: 'l23-q3',
      prompt: 'Sebuah bingkai foto berundak memiliki sisi-sisi luar: 4 cm, 3 cm, 2 cm, 2 cm, 2 cm, 5 cm. Berapakah kelilingnya?',
      visual: 'shape_composite_l',
      options: [
        { id: 'a', label: '18 cm', color: '#10b981' },
        { id: 'b', label: '20 cm', color: '#f59e0b' },
        { id: 'c', label: '24 cm', color: '#3b82f6' },
        { id: 'd', label: '15 cm', color: '#8b5cf6' },
      ],
      correctId: 'a',
      explanation: 'Keliling = 4 + 3 + 2 + 2 + 2 + 5 = 18 cm.',
      formulaHint: '💡 Jumlahkan seluruh sisinya: 4 + 3 + 2 + 2 + 2 + 5 = 18 cm.',
      difficulty: 'easy',
    },
  ],

  // Level 24: Soal Cerita Pemecahan Masalah Nyata
  24: [
    {
      id: 'l24-q1',
      prompt: 'Pak Budi memiliki taman bunga berbentuk persegi dengan panjang sisi 6 meter. Di sekeliling taman dipasang pagar. Berapa meter panjang kawat pagar?',
      visual: 'shape_square',
      options: [
        { id: 'a', label: '12 meter', color: '#f59e0b' },
        { id: 'b', label: '24 meter', color: '#10b981' },
        { id: 'c', label: '36 meter', color: '#3b82f6' },
        { id: 'd', label: '18 meter', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling taman persegi = 4 × sisi = 4 × 6 = 24 meter.',
      formulaHint: '💡 Pagar sekeliling = Keliling = 4 × 6 = 24 m.',
      difficulty: 'medium',
    },
    {
      id: 'l24-q2',
      prompt: 'Siti memasang renda pita di sekeliling taplak meja persegi panjang berukuran 120 cm × 80 cm. Berapa cm panjang renda pita yang diperlukan?',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: '200 cm', color: '#f59e0b' },
        { id: 'b', label: '400 cm', color: '#10b981' },
        { id: 'c', label: '9600 cm', color: '#ef4444' },
        { id: 'd', label: '300 cm', color: '#3b82f6' },
      ],
      correctId: 'b',
      explanation: 'Keliling taplak = 2 × (120 + 80) = 2 × 200 = 400 cm.',
      formulaHint: '💡 K = 2 × (120 + 80) = 400 cm.',
      difficulty: 'medium',
    },
    {
      id: 'l24-q3',
      prompt: 'Seorang pelari mengelilingi lapangan segitiga sama sisi dengan sisi 50 meter sebanyak 2 kali putaran. Berapa meter total jarak larinya?',
      visual: 'shape_triangle',
      options: [
        { id: 'a', label: '150 meter', color: '#f59e0b' },
        { id: 'b', label: '300 meter', color: '#10b981' },
        { id: 'c', label: '450 meter', color: '#3b82f6' },
        { id: 'd', label: '600 meter', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: '1 putaran = 3 × 50 = 150 meter. 2 putaran = 2 × 150 = 300 meter.',
      formulaHint: '💡 Jarak = 2 putaran × (3 × 50 m) = 300 m.',
      difficulty: 'medium',
    },
  ],

  // Level 25: TANTANGAN TERAKHIR KASTIL GEOMETRI (BOS TERAKHIR: KAISAR AGUNG POLY-APEX)
  25: [
    {
      id: 'l25-q1',
      prompt: 'Kaisar Poly-Apex mengaum: "Taman kastil berukuran 14 m × 10 m. Setiap jarak 2 meter di sekeliling taman ditanami pohon cemara. Berapa pohon yang dibutuhkan?"',
      visual: 'shape_rectangle',
      options: [
        { id: 'a', label: '20 pohon', color: '#f59e0b' },
        { id: 'b', label: '24 pohon', color: '#10b981' },
        { id: 'c', label: '48 pohon', color: '#3b82f6' },
        { id: 'd', label: '12 pohon', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling taman = 2 × (14 + 10) = 48 m. Jumlah pohon = 48 ÷ 2 = 24 pohon.',
      formulaHint: '💡 Pohon = Keliling ÷ 2 = 48 ÷ 2 = 24 pohon.',
      difficulty: 'boss',
    },
    {
      id: 'l25-q2',
      prompt: '"Jendela kastil berbentuk persegi sisi 14 cm dan bagian atasnya setengah lingkaran berdiameter 14 cm. Berapakah keliling bingkai jendela? (π = 22/7)"',
      visual: 'shape_composite_house',
      options: [
        { id: 'a', label: '42 cm', color: '#f59e0b' },
        { id: 'b', label: '64 cm', color: '#10b981' },
        { id: 'c', label: '78 cm', color: '#3b82f6' },
        { id: 'd', label: '86 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: '3 sisi persegi = 3 × 14 = 42 cm. Lengkung setengah lingkaran = (22/7 × 14) ÷ 2 = 22 cm. Total = 42 + 22 = 64 cm.',
      formulaHint: '💡 K = (3 × 14) + (44 ÷ 2) = 42 + 22 = 64 cm.',
      difficulty: 'boss',
    },
    {
      id: 'l25-q3',
      prompt: '"Segitiga siku-siku memiliki sisi 6 cm, 8 cm, dan 10 cm. Jika sebuah persegi memiliki keliling yang SAMA DENGAN segitiga tersebut, berapa panjang sisi persegi?"',
      visual: 'shape_square',
      options: [
        { id: 'a', label: '4 cm', color: '#f59e0b' },
        { id: 'b', label: '6 cm', color: '#10b981' },
        { id: 'c', label: '8 cm', color: '#3b82f6' },
        { id: 'd', label: '12 cm', color: '#8b5cf6' },
      ],
      correctId: 'b',
      explanation: 'Keliling segitiga = 6 + 8 + 10 = 24 cm. Sisi persegi = Keliling ÷ 4 = 24 ÷ 4 = 6 cm.',
      formulaHint: '💡 Sisi persegi = (6 + 8 + 10) ÷ 4 = 24 ÷ 4 = 6 cm.',
      difficulty: 'boss',
    },
  ],
};
