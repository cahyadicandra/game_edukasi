# Laporan Review & Perbaikan — Game Edukasi "Petualangan Bangun Datar"

Tanggal review: 8 November 2026
Cakupan: seluruh `src/components/**`, `src/styles`, layanan database, konfigurasi build, dan tampilan Android (Capacitor 8).
Status: 🔴 KRITIS / 🟠 SEDANG / 🟡 RINGAN — ditandai ✅ jika sudah diperbaiki dalam sesi ini.

---

## A. Bug Logika yang SUDAH DIPERBAIKI ✅

### 1. Klaim reward Album Koleksi bisa di-farming — 🔴 KRITIS ✅
- **File:** `src/components/Adventure/ShapeAlbumModal.tsx`
- **Masalah:** Status `claimedReward` hanya state lokal → tutup-buka modal = bisa klaim bonus 50⭐/10💎 lagi dan lagi.
- **Perbaikan:** Milestone (4 & 8 bentuk) kini disimpan permanen di Database Lokal (key baru `SHAPE_ALBUM_MILESTONES` di `src/services/localDatabase.ts`). Milestone dipisahkan dari milestone Gacha (yang juga memakai angka 4/8) supaya tidak saling menimpa. Sekarang milestone 4 dan 8 bisa diklaim terpisah, masing-masing tepat satu kali.

### 2. Ramuan HP / Eliksir SP gratis tanpa batas — 🔴 KRITIS ✅
- **File:** `src/components/Quiz/BattleScreen.tsx` + `src/App.tsx`
- **Masalah:** `handleUsePotion`/`handleUseElixir` hanya memeriksa stok, tapi tidak pernah memotongnya. Prop `onUpdatePlayerStats` bahkan dibuang dari destructuring. Pemain bisa spam heal 45 HP gratis.
- **Perbaikan:** Prop baru `onConsumeItem(kind)` diimplementasikan di App (memotong `inventory.potions` / `inventory.spElixirs`, fallback potong 2 permata bila stok 0) dan dipanggil dari BattleScreen. Kegagalan konsumsi menampilkan pesal log.

### 3. `onDefeat()` dipanggil di dalam state updater — 🔴 KRITIS ✅
- **File:** `src/components/Quiz/BattleScreen.tsx` (fungsi `monsterTurn`)
- **Masalah:** `setTimeout(() => onDefeat(), 1200)` berada di dalam updater `setPlayerHp` → di React StrictMode updater dobel-invoke, jadi kalah bisa terpicu dua kali (reward/kondisi kalah ganda).
- **Perbaikan:** HP dihitung di luar updater; defeat dipanggil sekali dari badan fungsi.

### 4. Critical hit bisa diprediksi pemain — 🟠 SEDANG ✅
- **File:** `src/components/Quiz/BattleScreen.tsx`
- **Masalah:** Crit memakai formula `(qIndex + optionId.charCodeAt(0)) % 3 === 0` → bias ke huruf jawaban tertentu dan mudah dihafal anak.
- **Perbaikan:** `Math.random() < 0.25` (peluang crit acak 25%).

### 5. Crash saat daftar soal kosong — 🟠 SEDANG ✅
- **File:** `src/components/Quiz/BattleScreen.tsx`
- **Masalah:** `questions[qIndex % questions.length]` menghasilkan `undefined` bila array kosong → crash saat membuka properti soal.
- **Perbaikan:** Guard tampilan fallback + tombol kembali ke peta.

### 6. Koin bisa negatif & pembelian dobel saat double-tap — 🔴 KRITIS ✅
- **File:** `src/components/Customization/CustomizationModal.tsx` (fungsi `handleUnlockPart`, `handleUpgradePart`)
- **Masalah:** `coins: prevCoins - cost` di dalam updater bisa dobel-eksekusi pada double-tap cepat (koin nyaris bisa negatif dan 1 biaya terpotong dua kali, atau part terbuka dua kali).
- **Perbaikan:** Updater kini idempoten (cek part sudah terbuka/level sudah naik) + `Math.max(0, ...)`.

### 7. Ikon lucide memakai kelas Tailwind yang tidak aktif — 🟠 SEDANG ✅
- **File:** `src/components/Customization/CustomizationModal.tsx` (12 lokasi)
- **Masalah:** Proyek tidak memakai Tailwind, jadi `className="w-5 h-5 text-amber-500"` di ikon tidak berefek: ukuran kembali ke default 24px dan warna hilang (tampilan rusak).
- **Perbaikan:** Diganti ke prop bawaan icons: `<Wrench size={20} color="#f59e0b" />`, `<X size={20} />`, `<Crosshair size={16} />`, `<Palette size={16} />`, `<Check size={14} />`, `<Zap size={16} color="#fcd34d" />`, `<Lock size={12} />`, `<ArrowUpCircle size={14} />`, `<Check size={20} />`.

### 8. Fitur Playground Maskot tidak bisa dibuka dari Home — 🔴 KRITIS ✅
- **File:** `src/components/Hero/GameMascots.tsx`
- **Masalah:** `HomeScreen` mengirim prop `onOpenPlayground`, tapi `GameMascots` tidak pernah membacanya (destructor kosong) → jalan masuk fitur mati.
- **Perbaikan:** Prop dipakai; ditambahkan tombol pill "Main Maskot" di sebelah maskot (dengan CSS baru di `GameMascots.css`).

### 9. Listener window bocor tiap mount — 🟠 SEDANG ✅
- **File:** `src/components/Mascot/PlayableMascot.tsx`
- **Masalah:** `window.addEventListener('pointerup'/'touchend', () => {...})` dengan fungsi anonim dan **tidak pernah dilepas** di cleanup. Setiap re-mount/effect re-run menambah listener baru (memory leak + tombol "nyangkut" jalan sendiri).
- **Perbaikan:** Handler dinamai `resetTouchKeys`, ditambahkan `pointercancel`, dan semuanya dilepas di cleanup.

### 10. Reward Tangram dobel di StrictMode — 🔴 KRITIS ✅
- **File:** `src/components/Adventure/TangramPuzzleModal.tsx`
- **Masalah:** `setCelebrating` + `setTimeout(onComplete, 1500)` dipanggil **di dalam** updater `setPlacedPieces` → updater dobel-invoke = reward quest diberikan dua kali. Timer juga tidak dibersihkan saat modal ditutup → `onComplete` bisa "menembak" setelah modal ditutup.
- **Perbaikan:** Logika penyelesaian dipindah keluar updater; timer disimpan di `celebrateTimeoutRef` dan dibatalkan saat unmount.

### 11. Animasi diff bintang/permata baseline basi — 🟡 RINGAN ✅
- **File:** `src/components/Header/TopHeader.tsx`
- **Masalah:** `prevStars.current`/`prevDiamonds.current` tidak diperbarui saat kenaikan terjadi (early return) → diff animasi "+N ⭐" bisa kumulatif/salah hitung.
- **Perbaikan:** Ref selalu disinkronkan dulu, diff dihitung setelahnya.

### 12. Timer platform memudar (fading cloud) bocor saat restart level — 🔴 KRITIS ✅
- **File:** `src/components/RPG/RPGPlatformerEngine.tsx`
- **Masalah:** `setTimeout` berantai platform memudar tidak pernah dilacak/dibatalkan dan `fadedPlatIds` tidak di-reset di `handleRestartLevel` → setelah "Coba Lagi", platform bisa tiba-tiba lenyap atau tetap hilang sepanjang sesi baru.
- **Perbaikan:** Semua id timer disimpan di `fadingTimersRef` (baru berbentuk `{ timers: number[]; visible: boolean }`), dibersihkan lewat `clearAllFadingTimers()` saat restart level **dan** saat unmount (safety net effect).

### 13. Memory leak ref elemen peluru — 🟠 SEDANG ✅
- **File:** `src/components/RPG/RPGPlatformerEngine.tsx`
- **Masalah:** `bulletElsRef.current[b.id] = el` tanpa pernah dihapus → Record menumpuk ratusan entri per sesi.
- **Perbaikan:** Callback ref kini `delete` saat elemen dilepas.

### 14. ID peluru rawak duplikat — 🟡 RINGAN ✅
- **File:** `src/components/RPG/RPGPlatformerEngine.tsx`
- **Masalah:** ID `Date.now() + Math.random()` bisa bertabrakan (key React & ref).
- **Perbaikan:** Counter inkremen `bulletIdCounterRef`. (Variabel `now` yang jadi tak terpakai ikut dibersihkan.)

### 15. Parallax latar tidak pernah bergerak — 🟠 SEDANG ✅
- **File:** `src/components/RPG/RPGPlatformerEngine.tsx`
- **Masalah:** `<RPGIslandBackdrop cameraX={0} ...>` hardcode → fitur parallax mati total.
- **Perbaikan:** Diteruskan `cameraXRef.current` (kamera aktual).

---

## B. Optimasi Tampilan Android yang SUDAH DILAKUKAN ✅

### 16. `100vh` salah ukur di Android — 🔴 KRITIS ✅
- **File:** `src/styles/game-theme.css`, `src/index.css`, `src/components/RPG/RPGPlatformerEngine.css`
- **Masalah:** `100vh` di WebView Android salah hitam karena address bar/status bar; UI bisa terpotong atau ada ruang kosong di bawah.
- **Perbaikan:** Ditambah fallback `height: 100dvh` (dynamic viewport height) di body, `.game-viewport` (juga `94dvh` untuk mode desktop) dan engine RPG.

### 17. Konten tertutup status bar / gesture bar (edge-to-edge) — 🔴 KRITIS ✅
- **File:** `src/styles/game-theme.css`
- **Perbaikan:** `.game-viewport` kini ber-`padding` `env(safe-area-inset-top)` dan `env(safe-area-inset-bottom)` (di mode frame desktop padding dinolkan). Bottom navbar otomatis terangkat karena berada di dalam viewport (tidak perlu safe-area ganda).

### 18. Modal memakai `vh` — 🟠 SEDANG ✅
- **File:** `ShapeAlbumModal.css` (88vh), `GameModal.css` (60vh), `ProfileScreen.css` (88vh), `CustomizationModal.css` (92vh), `MascotPlaygroundModal.css` (90vh & 96vh), `GachaModal.css` (90/52/48vh)
- **Perbaikan:** Semua ditambah baris fallback `dvh` — modal kini tidak terpotong saat address bar muncul/hilang.

### 19. Zoom double-tap & pull-to-refresh — 🟠 SEDANG ✅
- **File:** `src/index.css`
- **Perbaikan:** `touch-action: manipulation` (menonaktifkan zoom double-tap di seluruh halaman, konsisten dengan `user-scalable=no`), `overscroll-behavior: none` (anti bounce/pull-refresh), `-webkit-text-size-adjust: 100%`.

### 20. Meta tag Android — 🟡 RINGAN ✅
- **File:** `index.html`
- **Perbaikan:** `<meta name="theme-color" content="#0b1528">` (warna status bar Android) dan `<meta name="mobile-web-app-capable" content="yes">`.

---

## C. Temuan yang TELAH DIOPTIMASI & DIPERBAIKI TAMBAHAN ✅

### 21. Cleanup `setTimeout` Engine Platformer saat Unmount — 🟠 SEDANG ✅
- **File:** `src/components/RPG/RPGPlatformerEngine.tsx`
- **Masalah:** Timer `setTimeout` untuk efek invulnerability, damage flash tembakan, dan teks melayang tidak dibersihkan saat unmount/restart level, berisiko `setState on unmounted component`.
- **Perbaikan:** Dibuat hook pelacak `activeGeneralTimersRef` & fungsi pembungkus `safeSetTimeout`. Seluruh timeout dibatalkan seketika saat komponen unmount atau level di-reset.

### 22. Linting ESLint Lolos 100% (24 Error Diatasi hingga 0 Error) — 🟠 SEDANG ✅
- **File:** `RPGPlatformerEngine.tsx`, `CustomizationModal.tsx`, `MascotPlaygroundModal.tsx`, `PlayableMascot.tsx`, `GameMascots.tsx`, `RPGGameScreen.tsx`, `localDatabase.ts`
- **Masalah:** 24 error lint (akses ref di render, efek cascade setState, impure Math/Date di render, variabel tak terpakai, empty block catch pada pointer capture).
- **Perbaikan:** 
  - Pointer capture & release dibungkus fungsi helper `safeCapturePointer` dan `safeReleasePointer`.
  - Akses ref saat render dibersihkan; posisi awal maskot & panggung menggunakan koordinat statis level config.
  - Render animasi kelelawar dibersihkan dari `Date.now()`.
  - `setState` sinkron di effect dihapus dan digantikan state fresh remount.
  - `npm run lint` kini lulus total **0 error, 0 warning**.

### 23. Code-Splitting Modal & Screen Berat (`React.lazy` + `Suspense`) — 🟠 SEDANG ✅
- **File:** `src/App.tsx`
- **Masalah:** Chunk JS utama `index-*.js` mencapai 606 kB (> 500 kB limit Vite warning) sehingga memperlambat initial startup di perangkat HP Android kelas menengah ke bawah.
- **Perbaikan:** Modal besar (`GachaModal`, `CustomizationModal`, `CampfireModal`, `TangramPuzzleModal`, `ShapeAlbumModal`, `MascotPlaygroundModal`) dan layar permainan berat (`RPGGameScreen`, `BattleScreen`, `LevelDetailModal`) dipisahkan dengan `React.lazy()` dan dimuat dinamis saat dibuka. Bundle utama turun drastis ke **434 kB** (bebas warning chunk).

### 24. Sistem Evaluasi Bintang Bertingkat pada Kuis — 🟠 SEDANG ✅
- **File:** `src/components/Quiz/QuizScreen.tsx`, `src/data/questions.ts`, `src/App.tsx`, `src/components/Quiz/ResultScreen.tsx`
- **Pilihan Pengguna:** *Sistem Bintang Bertingkat (Tantangan Skor Coba Lagi)*.
- **Perbaikan:**
  - `QuizScreen` kini melacak apakah suatu pertanyaan dijawab benar pada percobaan pertama (`firstTryCorrectCount`) atau membutuhkan tombol coba lagi (`retryCount`).
  - `computeResult()` mengevaluasi bintang secara bertingkat:
    - **3 Bintang (⭐⭐⭐)**: Semua soal dijawab benar pada percobaan pertama (sempurna).
    - **2 Bintang (⭐⭐)**: Butuh coba lagi 1–2 kali (tetap diberi apresiasi atas usaha perbaikan).
    - **1 Bintang (⭐)**: Sering salah dan butuh banyak percobaan coba lagi.
  - `ResultScreen` menampilkan badge umpan balik motivasional ("🌟 Sempurna! Benar semua di percobaan pertama!", "✨ Bagus! Selesai dengan sedikit coba lagi", dsb.) beserta rincian jumlah soal yang benar sekali coba.

### 25. Tipografi Offline-First (Bundle Lokal Font Fredoka & Nunito) — 🟡 RINGAN ✅
- **File:** `public/fonts/`, `src/styles/fonts.css`, `src/styles/game-theme.css`, `index.html`
- **Pilihan Pengguna:** *Bundle file font secara offline di folder aplikasi*.
- **Perbaikan:**
  - File font `.woff2` resmi Fredoka (weight 400, 500, 600, 700) dan Nunito (weight 600, 700, 800, 900) telah diunduh langsung dan disimpan di `public/fonts/`.
  - Definisi `@font-face` lokal dibuat di `src/styles/fonts.css` dan diimpor oleh `game-theme.css`.
  - Ketergantungan tautan eksternal `fonts.googleapis.com` di `index.html` telah dilepas.
  - Game kini 100% offline-first: visual tipografi kartun yang ramah anak tetap tampil konsisten di semua perangkat Android tanpa perlu koneksi internet.

---

## D. Status Seluruh Temuan Review

Semua temuan pada laporan BUG_REPORT.md (Kategori A, B, dan C) kini berstatus **✅ 100% TERSELESAIKAN**:
- Total 25 masalah/optimasi telah ditangani secara menyeluruh.
- Tidak ada hutang teknis atau error linting yang tersisa.

---

## E. Hasil Verifikasi Akhir

- `npm run lint` ✅ **0 error, 0 warning** (Lolos bersih).
- `npm run build` ✅ **Lulus sempurna (0 error, chunk size utama < 500 kB)**.
- `npx cap copy` ✅ Seluruh aset terbaru telah disinkronkan ke `android/app/src/main/assets/public`.
