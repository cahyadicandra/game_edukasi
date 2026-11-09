TRIANGLE QUEST - PAKET SOUND EFFECT SENJATA

Semua suara dibuat dari nol lewat sintesis (bebas hak cipta, aman dipakai di game).
Format: WAV (mono, 44,1 kHz, 16-bit) dan OGG (lebih kecil, untuk web).

ISI TIAP FOLDER SENJATA (nama folder = id skin senjata, sama dengan paket skin dan paket bullet)
shoot_1   suara tembak
shoot_2   variasi tembak (pitch sedikit berbeda) agar tidak monoton
hit       peluru kena musuh/medan
equip     saat senjata dipasang / ganti loadout

umum/
kosong_klik          amunisi habis / tidak bisa menembak
isi_ulang_amunisi    ambil ammo pack
power_up             ambil power cell

KARAKTER SUARA
klasik       "pew" sederhana, pitch menurun
api          semburan api dengan letupan kecil, hit seperti ledakan lembut
es           denting kristal, hit seperti kaca pecah
kamuflase    letusan tembakan tajam, hit tumpul
permen       "bloop" memantul, hit seperti boing + kilau
raja_emas    denting kerajaan, hit seperti koin
cyber        laser digital, hit seperti glitch
galaksi      whoosh kosmik dengan gema, hit seperti bintang berkelip
retro_kayu   dentum meriam kecil, hit seperti ketukan kayu
pramuka      siulan peluit dengan desir angin, hit seperti gemerisik daun
pelangi      arpeggio naik 6 nada, hit seperti kilau pelangi
petir        sengatan listrik, hit seperti guntur
lava         dentum berat, hit seperti ledakan mendesis

CARA PAKAI (Web Audio)
  const ctx = new AudioContext();
  async function load(url){ const r=await fetch(url); return ctx.decodeAudioData(await r.arrayBuffer()); }
  function play(buf, vol=0.8){
    const s=ctx.createBufferSource(), g=ctx.createGain();
    s.buffer=buf; s.playbackRate.value=0.92+Math.random()*0.16;  // variasi pitch
    g.gain.value=vol; s.connect(g).connect(ctx.destination); s.start();
  }
  // tembak: pilih acak antara shoot_1 dan shoot_2

TIPS
- Browser baru boleh memutar suara setelah ada interaksi pengguna (ketuk/klik pertama). Panggil ctx.resume() saat itu.
- Batasi suara yang diputar bersamaan (misalnya 8) supaya tidak menumpuk saat menembak cepat.
- suggested_volume per senjata ada di sfx_manifest.json. Hit lebih pelan dari tembak, atur lewat volume.
- preview/spektrogram.png = gambar visual semua suara (untuk memeriksa cepat, bukan untuk didengar).
