// Bank Soal Progresif & Bervariasi untuk Seluruh Dunia Geometri (Dunia 1 - 5)
// Setiap level memiliki tingkat kesulitan bertahap sesuai kurikulum geometri edukasi anak

export type VisualType =
  | 'house'
  | 'pizza'
  | 'door'
  | 'clock'
  | 'book'
  | 'shape_triangle'
  | 'shape_square'
  | 'shape_rectangle'
  | 'shape_circle'
  | 'shape_trapezoid'
  | 'shape_rhombus'
  | 'shape_parallelogram';

export interface QuizOption {
  id: string;
  label: string;
  shape?: 'triangle' | 'square' | 'rectangle' | 'circle';
  color: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  visual?: VisualType;
  options: QuizOption[];
  correctId: string;
  explanation: string;
  formulaHint?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'boss';
}

// ==========================================
// 1. BANK SOAL DUNIA 1: PULAU BENTUK (Level 1 - 5)
// Fokus: Pengenalan bentuk visual, jumlah sisi & sudut
// ==========================================
export const worldOneQuestions: QuizQuestion[] = [
  {
    id: 'w1-q1',
    prompt: 'Atap rumah pada gambar di bawah ini berbentuk bangun apa?',
    visual: 'house',
    options: [
      { id: 'a', label: 'Segitiga', shape: 'triangle', color: '#f59e0b' },
      { id: 'b', label: 'Persegi', shape: 'square', color: '#3b82f6' },
      { id: 'c', label: 'Persegi Panjang', shape: 'rectangle', color: '#22c55e' },
      { id: 'd', label: 'Lingkaran', shape: 'circle', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Atap rumah memiliki 3 sisi lurus yang bertemu di puncak: Segitiga.',
    formulaHint: '💡 Segitiga: Memiliki tepat 3 sisi lurus dan 3 titik sudut.',
    difficulty: 'easy',
  },
  {
    id: 'w1-q2',
    prompt: 'Potongan pizza lezat ini menyerupai bentuk bangun apa?',
    visual: 'pizza',
    options: [
      { id: 'a', label: 'Persegi Panjang', shape: 'rectangle', color: '#22c55e' },
      { id: 'b', label: 'Segitiga', shape: 'triangle', color: '#f59e0b' },
      { id: 'c', label: 'Lingkaran', shape: 'circle', color: '#ec4899' },
      { id: 'd', label: 'Persegi', shape: 'square', color: '#3b82f6' },
    ],
    correctId: 'b',
    explanation: 'Potongan pizza memiliki 3 tepi sudut sehingga berbentuk segitiga.',
    formulaHint: '💡 Ciri Segitiga: Bangun datar dengan 3 sudut dan 3 tepi garis.',
    difficulty: 'easy',
  },
  {
    id: 'w1-q3',
    prompt: 'Pintu rumah yang tinggi dan kokoh berbentuk bangun datar apa?',
    visual: 'door',
    options: [
      { id: 'a', label: 'Lingkaran', shape: 'circle', color: '#ec4899' },
      { id: 'b', label: 'Persegi', shape: 'square', color: '#3b82f6' },
      { id: 'c', label: 'Persegi Panjang', shape: 'rectangle', color: '#22c55e' },
      { id: 'd', label: 'Segitiga', shape: 'triangle', color: '#f59e0b' },
    ],
    correctId: 'c',
    explanation: 'Pintu memiliki 2 sisi panjang vertikal dan 2 sisi pendek horizontal: Persegi Panjang.',
    formulaHint: '💡 Persegi Panjang: Memiliki 2 pasang sisi sejajar yang berhadapan sama panjang.',
    difficulty: 'easy',
  },
  {
    id: 'w1-q4',
    prompt: 'Jam dinding di ruang kelas berputar tanpa sudut. Berbentuk apakah itu?',
    visual: 'clock',
    options: [
      { id: 'a', label: 'Segitiga', shape: 'triangle', color: '#f59e0b' },
      { id: 'b', label: 'Persegi', shape: 'square', color: '#3b82f6' },
      { id: 'c', label: 'Persegi Panjang', shape: 'rectangle', color: '#22c55e' },
      { id: 'd', label: 'Lingkaran', shape: 'circle', color: '#ec4899' },
    ],
    correctId: 'd',
    explanation: 'Jam dinding bulat sempurna tanpa sudut: Lingkaran.',
    formulaHint: '💡 Lingkaran: Garis lengkung tertutup sempurna tanpa titik sudut.',
    difficulty: 'easy',
  },
  {
    id: 'w1-q5',
    prompt: 'Berapakah jumlah titik sudut yang dimiliki oleh bangun persegi?',
    visual: 'shape_square',
    options: [
      { id: 'a', label: '3 Sudut', color: '#f59e0b' },
      { id: 'b', label: '4 Sudut Siku-Siku', color: '#3b82f6' },
      { id: 'c', label: '5 Sudut', color: '#22c55e' },
      { id: 'd', label: 'Tidak Punya Sudut', color: '#ec4899' },
    ],
    correctId: 'b',
    explanation: 'Persegi memiliki 4 sudut yang semuanya siku-siku (90 derajat).',
    formulaHint: '💡 Sudut Persegi: Semua 4 sudutnya tegak lurus sempurna (90°).',
    difficulty: 'easy',
  },
];

// Soal Khusus Level 4-5 (Uji Bos Titan Dunia 1)
export const worldOneBossQuestions: QuizQuestion[] = [
  {
    id: 'w1-b1',
    prompt: 'Bangun datar manakah yang sama sekali TIDAK memiliki titik sudut?',
    visual: 'shape_circle',
    options: [
      { id: 'a', label: 'Lingkaran', color: '#ec4899' },
      { id: 'b', label: 'Segitiga', color: '#f59e0b' },
      { id: 'c', label: 'Persegi', color: '#3b82f6' },
      { id: 'd', label: 'Trapesium', color: '#8b5cf6' },
    ],
    correctId: 'a',
    explanation: 'Lingkaran hanya dibentuk oleh 1 garis kurva melengkung tertutup tanpa sudut.',
    formulaHint: '💡 Ciri Lingkaran: 0 sudut, 1 sisi lengkung kontinu.',
    difficulty: 'medium',
  },
  {
    id: 'w1-b2',
    prompt: 'Berapakah jumlah seluruh sisi pada bangun datar segitiga?',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: '2 Sisi', color: '#ec4899' },
      { id: 'b', label: '3 Sisi', color: '#f59e0b' },
      { id: 'c', label: '4 Sisi', color: '#3b82f6' },
      { id: 'd', label: '5 Sisi', color: '#22c55e' },
    ],
    correctId: 'b',
    explanation: 'Segitiga selalu terdiri dari tepat 3 sisi garis lurus.',
    formulaHint: '💡 Kata "Segi-Tiga" berarti bangun dengan 3 buah sisi.',
    difficulty: 'medium',
  },
  {
    id: 'w1-b3',
    prompt: 'Persegi memiliki 4 sisi yang sifatnya...',
    visual: 'shape_square',
    options: [
      { id: 'a', label: 'Semuanya sama panjang', color: '#3b82f6' },
      { id: 'b', label: 'Panjangnya berbeda-beda', color: '#f59e0b' },
      { id: 'c', label: 'Melengkung seperti lingkaran', color: '#ec4899' },
      { id: 'd', label: 'Hanya 2 yang sama', color: '#22c55e' },
    ],
    correctId: 'a',
    explanation: 'Ciri khas utama persegi adalah keempat sisinya memiliki panjang yang sama persis.',
    formulaHint: '💡 Persegi: s1 = s2 = s3 = s4 (sama panjang).',
    difficulty: 'medium',
  },
  {
    id: 'w1-b4',
    prompt: 'Benda di kelas yang umumnya berbentuk persegi panjang adalah...',
    visual: 'book',
    options: [
      { id: 'a', label: 'Papan Tulis & Buku Tulis', color: '#22c55e' },
      { id: 'b', label: 'Bola Sepak', color: '#ec4899' },
      { id: 'c', label: 'Topi Ulang Tahun', color: '#f59e0b' },
      { id: 'd', label: 'Koin Logam', color: '#3b82f6' },
    ],
    correctId: 'a',
    explanation: 'Papan tulis dan buku memiliki dua sisi panjang dan dua sisi lebar: Persegi Panjang.',
    formulaHint: '💡 Persegi Panjang: Sisi berhadapan sama panjang dan sejajar.',
    difficulty: 'medium',
  },
  {
    id: 'w1-b5',
    prompt: '👑 BOS TITAN: Sebuah bangun segi empat memiliki sisi 4 cm, 4 cm, 4 cm, dan 4 cm. Bangun apakah itu?',
    visual: 'shape_square',
    options: [
      { id: 'a', label: 'Persegi', color: '#3b82f6' },
      { id: 'b', label: 'Segitiga', color: '#f59e0b' },
      { id: 'c', label: 'Lingkaran', color: '#ec4899' },
      { id: 'd', label: 'Bintang', color: '#eab308' },
    ],
    correctId: 'a',
    explanation: 'Bangun dengan 4 sisi yang semuanya bernilai sama (4 cm) adalah Persegi!',
    formulaHint: '💡 Keempat sisi sama panjang dan siku-siku = Persegi.',
    difficulty: 'boss',
  },
];

// ==========================================
// 2. BANK SOAL DUNIA 2: HUTAN SEGI EMPAT (Level 6 - 10)
// Fokus: Jenis-jenis segi empat, jajar genjang, belah ketupat, keliling & luas dasar
// ==========================================
export const worldTwoQuestions: QuizQuestion[] = [
  {
    id: 'w2-q1',
    prompt: 'Bangun segi empat dengan 2 pasang sisi sejajar tetapi TIDAK memiliki sudut siku-siku adalah...',
    visual: 'shape_parallelogram',
    options: [
      { id: 'a', label: 'Jajar Genjang', color: '#0284c7' },
      { id: 'b', label: 'Persegi', color: '#3b82f6' },
      { id: 'c', label: 'Persegi Panjang', color: '#22c55e' },
      { id: 'd', label: 'Lingkaran', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Jajar genjang memiliki sisi miring sejajar dan sudutnya bukan 90 derajat.',
    formulaHint: '💡 Jajar Genjang: Sisi sejajar berhadapan sama, sudut berhadapan sama besar.',
    difficulty: 'medium',
  },
  {
    id: 'w2-q2',
    prompt: 'Sebuah persegi memiliki panjang sisi 6 cm. Berapakah kelilingnya?',
    visual: 'shape_square',
    options: [
      { id: 'a', label: '24 cm (4 x 6 cm)', color: '#3b82f6' },
      { id: 'b', label: '36 cm', color: '#f59e0b' },
      { id: 'c', label: '12 cm', color: '#22c55e' },
      { id: 'd', label: '18 cm', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Keliling persegi dihitung dengan menjumlahkan ke-4 sisinya: 4 x 6 cm = 24 cm.',
    formulaHint: '💡 Keliling Persegi: K = 4 × sisi.',
    difficulty: 'medium',
  },
  {
    id: 'w2-q3',
    prompt: 'Bangun datar yang memiliki 4 sisi sama panjang dengan posisi menyerupai berlian adalah...',
    visual: 'shape_rhombus',
    options: [
      { id: 'a', label: 'Belah Ketupat', color: '#f97316' },
      { id: 'b', label: 'Segitiga', color: '#f59e0b' },
      { id: 'c', label: 'Lingkaran', color: '#ec4899' },
      { id: 'd', label: 'Persegi Panjang', color: '#22c55e' },
    ],
    correctId: 'a',
    explanation: 'Belah ketupat memiliki 4 sisi sama panjang dan diagonal yang berpotongan tegak lurus.',
    formulaHint: '💡 Belah Ketupat: Keempat sisinya sama panjang, diagonal berpotongan 90°.',
    difficulty: 'medium',
  },
  {
    id: 'w2-q4',
    prompt: 'Persegi panjang memiliki panjang 8 cm dan lebar 5 cm. Berapakah luasnya?',
    visual: 'shape_rectangle',
    options: [
      { id: 'a', label: '40 cm² (8 x 5)', color: '#16a34a' },
      { id: 'b', label: '26 cm²', color: '#3b82f6' },
      { id: 'c', label: '13 cm²', color: '#f59e0b' },
      { id: 'd', label: '48 cm²', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Luas persegi panjang dihitung dengan mengalikan panjang dan lebar: 8 x 5 = 40 cm².',
    formulaHint: '💡 Luas Persegi Panjang: L = panjang × lebar (p × l).',
    difficulty: 'medium',
  },
  {
    id: 'w2-q5',
    prompt: '👑 BOS KSATRIA SEGI EMPAT: Bangun segi empat yang memiliki sepasang sisi sejajar tetapi tidak sama panjang adalah...',
    visual: 'shape_trapezoid',
    options: [
      { id: 'a', label: 'Trapesium', color: '#8b5cf6' },
      { id: 'b', label: 'Persegi', color: '#3b82f6' },
      { id: 'c', label: 'Segitiga', color: '#f59e0b' },
      { id: 'd', label: 'Belah Ketupat', color: '#f97316' },
    ],
    correctId: 'a',
    explanation: 'Trapesium memiliki tepat 1 pasang sisi yang sejajar (atas dan bawah).',
    formulaHint: '💡 Trapesium: Memiliki sepasang sisi sejajar.',
    difficulty: 'boss',
  },
];

// ==========================================
// 3. BANK SOAL DUNIA 3: PEGUNUNGAN SEGITIGA (Level 11 - 15)
// Fokus: Jenis segitiga (sama sisi, sama kaki, siku-siku), sudut 180°, luas & keliling segitiga
// ==========================================
export const worldThreeQuestions: QuizQuestion[] = [
  {
    id: 'w3-q1',
    prompt: 'Segitiga yang ketiga sisinya sama panjang disebut segitiga...',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: 'Segitiga Sama Sisi', color: '#f59e0b' },
      { id: 'b', label: 'Segitiga Sama Kaki', color: '#3b82f6' },
      { id: 'c', label: 'Segitiga Siku-Siku', color: '#22c55e' },
      { id: 'd', label: 'Segitiga Sembarang', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Segitiga sama sisi memiliki 3 sisi sama panjang dan 3 sudut sama besar (masing-masing 60°).',
    formulaHint: '💡 Segitiga Sama Sisi: Ketiga sisinya sama panjang.',
    difficulty: 'medium',
  },
  {
    id: 'w3-q2',
    prompt: 'Sebuah segitiga memiliki alas 10 cm dan tinggi 6 cm. Berapakah luasnya?',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: '30 cm² (½ x 10 x 6)', color: '#eab308' },
      { id: 'b', label: '60 cm²', color: '#3b82f6' },
      { id: 'c', label: '16 cm²', color: '#22c55e' },
      { id: 'd', label: '20 cm²', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Luas segitiga = ½ x alas x tinggi = ½ x 10 x 6 = 30 cm².',
    formulaHint: '💡 Luas Segitiga: L = ½ × alas × tinggi.',
    difficulty: 'hard',
  },
  {
    id: 'w3-q3',
    prompt: 'Berapakah jumlah total seluruh sudut di dalam sebuah segitiga?',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: '180 Derajat', color: '#f59e0b' },
      { id: 'b', label: '90 Derajat', color: '#3b82f6' },
      { id: 'c', label: '360 Derajat', color: '#22c55e' },
      { id: 'd', label: '100 Derajat', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Jumlah ketiga sudut dalam segitiga apa pun selalu persis 180°.',
    formulaHint: '💡 Teorema Sudut Segitiga: Sudut A + B + C = 180°.',
    difficulty: 'hard',
  },
  {
    id: 'w3-q4',
    prompt: 'Segitiga sama sisi memiliki keliling 21 cm. Berapakah panjang masing-masing sisinya?',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: '7 cm (21 : 3)', color: '#10b981' },
      { id: 'b', label: '6 cm', color: '#3b82f6' },
      { id: 'c', label: '8 cm', color: '#f59e0b' },
      { id: 'd', label: '10 cm', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Karena ketiga sisinya sama panjang, maka panjang sisi = Keliling : 3 = 21 : 3 = 7 cm.',
    formulaHint: '💡 Keliling Segitiga Sama Sisi: K = 3 × sisi.',
    difficulty: 'hard',
  },
  {
    id: 'w3-q5',
    prompt: '👑 BOS HARPY SALJU: Segitiga siku-siku memiliki alas 8 cm dan tinggi 5 cm. Berapa luasnya?',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: '20 cm² (½ x 8 x 5)', color: '#f59e0b' },
      { id: 'b', label: '40 cm²', color: '#3b82f6' },
      { id: 'c', label: '13 cm²', color: '#22c55e' },
      { id: 'd', label: '26 cm²', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Luas segitiga = ½ x alas x tinggi = ½ x 8 x 5 = 20 cm².',
    formulaHint: '💡 Luas Segitiga: L = ½ × a × t.',
    difficulty: 'boss',
  },
];

// ==========================================
// 4. BANK SOAL DUNIA 4: DANAU LINGKARAN (Level 16 - 20)
// Fokus: Unsur lingkaran, jari-jari (r), diameter (d), keliling & luas lingkaran
// ==========================================
export const worldFourQuestions: QuizQuestion[] = [
  {
    id: 'w4-q1',
    prompt: 'Garis lurus yang menghubungkan titik pusat lingkaran dengan tepi lingkaran disebut...',
    visual: 'shape_circle',
    options: [
      { id: 'a', label: 'Jari-Jari (r)', color: '#ec4899' },
      { id: 'b', label: 'Diameter (d)', color: '#3b82f6' },
      { id: 'c', label: 'Tali Busur', color: '#22c55e' },
      { id: 'd', label: 'Keliling', color: '#f59e0b' },
    ],
    correctId: 'a',
    explanation: 'Jari-jari (r) adalah jarak dari titik pusat tepat ke tepi kurva lingkaran.',
    formulaHint: '💡 Jari-Jari (r): Garis dari titik pusat ke garis lengkung luar.',
    difficulty: 'hard',
  },
  {
    id: 'w4-q2',
    prompt: 'Jika sebuah lingkaran memiliki jari-jari 7 cm, berapakah panjang diameternya?',
    visual: 'shape_circle',
    options: [
      { id: 'a', label: '14 cm (2 x 7 cm)', color: '#0284c7' },
      { id: 'b', label: '21 cm', color: '#f59e0b' },
      { id: 'c', label: '49 cm', color: '#22c55e' },
      { id: 'd', label: '10 cm', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Diameter adalah dua kali panjang jari-jari: d = 2 x r = 2 x 7 cm = 14 cm.',
    formulaHint: '💡 Hubungan Diameter & Jari-jari: d = 2 × r.',
    difficulty: 'hard',
  },
  {
    id: 'w4-q3',
    prompt: 'Nilai perbandingan phi (π) yang umum digunakan untuk menghitung lingkaran berjari-jari 7 atau kelipatannya adalah...',
    visual: 'shape_circle',
    options: [
      { id: 'a', label: '22/7', color: '#ec4899' },
      { id: 'b', label: '3,14', color: '#3b82f6' },
      { id: 'c', label: '1/2', color: '#22c55e' },
      { id: 'd', label: '2/3', color: '#f59e0b' },
    ],
    correctId: 'a',
    explanation: '22/7 sangat memudahkan perhitungan jika jari-jari lingkaran merupakan kelipatan 7.',
    formulaHint: '💡 Nilai π = 22/7 atau 3,14.',
    difficulty: 'hard',
  },
  {
    id: 'w4-q4',
    prompt: 'Sebuah lingkaran berdiameter 20 cm. Berapakah panjang jari-jarinya?',
    visual: 'shape_circle',
    options: [
      { id: 'a', label: '10 cm (20 : 2)', color: '#10b981' },
      { id: 'b', label: '40 cm', color: '#3b82f6' },
      { id: 'c', label: '5 cm', color: '#f59e0b' },
      { id: 'd', label: '15 cm', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Jari-jari adalah setengah dari diameter: r = d : 2 = 20 : 2 = 10 cm.',
    formulaHint: '💡 Jari-Jari: r = d / 2.',
    difficulty: 'hard',
  },
  {
    id: 'w4-q5',
    prompt: '👑 BOS LEVIATHAN LINGKARAN: Lingkaran dengan jari-jari 7 cm memiliki keliling sebesar...',
    visual: 'shape_circle',
    options: [
      { id: 'a', label: '44 cm (2 x 22/7 x 7)', color: '#ec4899' },
      { id: 'b', label: '22 cm', color: '#3b82f6' },
      { id: 'c', label: '154 cm', color: '#22c55e' },
      { id: 'd', label: '88 cm', color: '#f59e0b' },
    ],
    correctId: 'a',
    explanation: 'Keliling lingkaran = 2 x π x r = 2 x (22/7) x 7 = 44 cm.',
    formulaHint: '💡 Keliling Lingkaran: K = 2 × π × r.',
    difficulty: 'boss',
  },
];

// ==========================================
// 5. BANK SOAL DUNIA 5: KASTIL GEOMETRI (Level 21 - 25)
// Fokus: Gabungan bangun datar, penalaran logika tingkat tinggi & Master Geometri
// ==========================================
export const worldFiveQuestions: QuizQuestion[] = [
  {
    id: 'w5-q1',
    prompt: 'Sebuah taman berbentuk persegi dengan sisi 10 meter. Di tengahnya dibuat kolam persegi dengan sisi 4 meter. Berapakah sisa luas taman rumputnya?',
    visual: 'shape_square',
    options: [
      { id: 'a', label: '84 m² (100 m² - 16 m²)', color: '#22c55e' },
      { id: 'b', label: '96 m²', color: '#3b82f6' },
      { id: 'c', label: '64 m²', color: '#f59e0b' },
      { id: 'd', label: '70 m²', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Luas taman = 10x10 = 100 m². Luas kolam = 4x4 = 16 m². Sisa rumput = 100 - 16 = 84 m².',
    formulaHint: '💡 Luas Daerah Bersisa = Luas Bangun Luar - Luas Bangun Dalam.',
    difficulty: 'hard',
  },
  {
    id: 'w5-q2',
    prompt: 'Sebuah bangun gabungan terdiri dari persegi (sisi 6 cm) dan atap segitiga (alas 6 cm, tinggi 4 cm). Berapakah total luas bangun rumah tersebut?',
    visual: 'house',
    options: [
      { id: 'a', label: '48 cm² (36 cm² + 12 cm²)', color: '#f59e0b' },
      { id: 'b', label: '60 cm²', color: '#3b82f6' },
      { id: 'c', label: '42 cm²', color: '#22c55e' },
      { id: 'd', label: '54 cm²', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Luas persegi = 6x6 = 36 cm². Luas segitiga = ½ x 6 x 4 = 12 cm². Total luas = 36 + 12 = 48 cm².',
    formulaHint: '💡 Luas Gabungan = Luas Persegi + Luas Segitiga.',
    difficulty: 'hard',
  },
  {
    id: 'w5-q3',
    prompt: 'Jika keliling sebuah persegi sama dengan keliling persegi panjang berukuran 10 cm x 6 cm, berapakah panjang sisi persegi tersebut?',
    visual: 'shape_square',
    options: [
      { id: 'a', label: '8 cm (Keliling 32 cm : 4)', color: '#3b82f6' },
      { id: 'b', label: '16 cm', color: '#f59e0b' },
      { id: 'c', label: '10 cm', color: '#22c55e' },
      { id: 'd', label: '6 cm', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Keliling persegi panjang = 2 x (10+6) = 32 cm. Sisi persegi = 32 : 4 = 8 cm.',
    formulaHint: '💡 K Persegi Panjang = 2(p + l), Sisi Persegi = K / 4.',
    difficulty: 'hard',
  },
  {
    id: 'w5-q4',
    prompt: 'Kakek memiliki kebun berbentuk segitiga siku-siku dengan alas 12 m dan tinggi 9 m. Berapakah luas kebun kakek?',
    visual: 'shape_triangle',
    options: [
      { id: 'a', label: '54 m² (½ x 12 x 9)', color: '#10b981' },
      { id: 'b', label: '108 m²', color: '#3b82f6' },
      { id: 'c', label: '42 m²', color: '#f59e0b' },
      { id: 'd', label: '63 m²', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Luas segitiga siku-siku = ½ x alas x tinggi = ½ x 12 x 9 = 54 m².',
    formulaHint: '💡 Luas Segitiga: L = ½ × a × t.',
    difficulty: 'hard',
  },
  {
    id: 'w5-q5',
    prompt: '👑 BOS AKHIR RAJA DISTORSI POLIGON: Bangun apakah yang memiliki 4 sisi berpasang sejajar sama panjang dan 4 sudut siku-siku 90°?',
    visual: 'shape_rectangle',
    options: [
      { id: 'a', label: 'Persegi Panjang', color: '#22c55e' },
      { id: 'b', label: 'Segitiga Sama Kaki', color: '#f59e0b' },
      { id: 'c', label: 'Trapesium Sembarang', color: '#8b5cf6' },
      { id: 'd', label: 'Lingkaran Elips', color: '#ec4899' },
    ],
    correctId: 'a',
    explanation: 'Persegi panjang memiliki 2 pasang sisi berhadapan sejajar sama panjang dan 4 sudut siku-siku 90°!',
    formulaHint: '💡 Persegi Panjang: 4 sudut 90°, sisi berhadapan sejajar dan sama.',
    difficulty: 'boss',
  },
];

import { LEVEL_SPECIFIC_QUESTIONS } from './levelSpecificQuestions';

/**
 * Mengambil paket soal unik & bertahap sesuai nomor level yang dipilih (Level 1 sampai 25 memiliki paket soal yang berbeda)
 */
export function getQuestionsForLevel(levelNum: number): QuizQuestion[] {
  // Cek apakah ada paket soal spesifik per level
  if (LEVEL_SPECIFIC_QUESTIONS[levelNum]) {
    return LEVEL_SPECIFIC_QUESTIONS[levelNum];
  }
  if (levelNum >= 1 && levelNum <= 3) {
    return worldOneQuestions;
  }
  if (levelNum >= 4 && levelNum <= 5) {
    return worldOneBossQuestions;
  }
  if (levelNum >= 6 && levelNum <= 10) {
    return worldTwoQuestions;
  }
  if (levelNum >= 11 && levelNum <= 15) {
    return worldThreeQuestions;
  }
  if (levelNum >= 16 && levelNum <= 20) {
    return worldFourQuestions;
  }
  // Level 21 - 25: Kastil Geometri
  return worldFiveQuestions;
}

export const levelOneQuestions = worldOneQuestions;

export interface LevelResult {
  correct: number;
  total: number;
  score: number;
  coins: number;
  xp: number;
  stars: number;
}

export function computeResult(correct: number, total: number): LevelResult {
  const score = correct * 100;
  const ratio = total === 0 ? 0 : correct / total;
  const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
  const coins = correct * 5;
  const xp = correct * 25;
  return { correct, total, score, coins, xp, stars };
}
