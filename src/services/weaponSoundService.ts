/**
 * weaponSoundService.ts
 * Layanan Audio Efek Suara (SFX) Senjata Blaster Modular Triangle Quest
 * 
 * Mengelola pemutaran audio Web Audio API dengan buffer caching berkursi rendah,
 * pemilihan variasi tembakan acak (shoot_1 / shoot_2), pitch randomizer,
 * dan volume proporsional sesuai sfx_manifest.json.
 */

// Volume bawaan per senjata dari sfx_manifest.json
const WEAPON_VOLUMES: Record<string, number> = {
  blaster_klasik: 0.8,
  blaster_api: 0.9,
  blaster_es: 0.7,
  blaster_kamuflase: 0.9,
  blaster_permen: 0.8,
  blaster_raja_emas: 0.8,
  blaster_cyber: 0.75,
  blaster_galaksi: 0.75,
  blaster_retro_kayu: 0.9,
  blaster_pramuka: 0.8,
  blaster_pelangi: 0.8,
  blaster_petir: 0.85,
  blaster_lava: 0.9,
};

export type WeaponSoundType = 'shoot_1' | 'shoot_2' | 'hit' | 'equip';
export type CommonSoundType = 'kosong_klik' | 'isi_ulang_amunisi' | 'power_up';

class WeaponSoundService {
  private ctx: AudioContext | null = null;
  private bufferCache = new Map<string, AudioBuffer>();
  private pendingLoads = new Map<string, Promise<AudioBuffer | null>>();
  private activeVoices: AudioBufferSourceNode[] = [];
  private maxConcurrentVoices = 8;
  private isMuted = false;

  constructor() {
    // Lazy AudioContext initialization on first interaction
    if (typeof window !== 'undefined') {
      const initAudioOnUserInteraction = () => {
        this.getAudioContext();
        window.removeEventListener('pointerdown', initAudioOnUserInteraction);
        window.removeEventListener('keydown', initAudioOnUserInteraction);
      };
      window.addEventListener('pointerdown', initAudioOnUserInteraction, { once: true });
      window.addEventListener('keydown', initAudioOnUserInteraction, { once: true });
    }
  }

  /**
   * Mengambil atau menginisialisasi singleton AudioContext
   */
  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Mengambil URL asset file audio (memprioritaskan OGG, fallback WAV)
   */
  private getSoundUrls(folder: string, name: string): string[] {
    return [
      `/weapons/sfx/${folder}/${name}.ogg`,
      `/weapons/sfx/${folder}/${name}.wav`,
      // Jalur cadangan jika running under subdirectory
      `/triangle_quest/assets/weapons/sfx/${folder}/${name}.ogg`,
      `/triangle_quest/assets/weapons/sfx/${folder}/${name}.wav`,
    ];
  }

  /**
   * Memuat dan mendecode AudioBuffer dari URL dengan caching
   */
  public async loadBuffer(folder: string, name: string): Promise<AudioBuffer | null> {
    const cacheKey = `${folder}/${name}`;
    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!;
    }

    if (this.pendingLoads.has(cacheKey)) {
      return this.pendingLoads.get(cacheKey)!;
    }

    const loadPromise = (async () => {
      const ctx = this.getAudioContext();
      if (!ctx) return null;

      const urls = this.getSoundUrls(folder, name);
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const arrayBuf = await res.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuf);
          this.bufferCache.set(cacheKey, audioBuffer);
          return audioBuffer;
        } catch {
          // Coba URL berikutnya di daftar fallback
        }
      }
      return null;
    })();

    this.pendingLoads.set(cacheKey, loadPromise);
    const result = await loadPromise;
    this.pendingLoads.delete(cacheKey);
    return result;
  }

  /**
   * Memainkan AudioBuffer dengan kontrol volume, variasi pitch, dan limit polyphony
   */
  private playBuffer(
    buffer: AudioBuffer,
    baseVolume = 0.8,
    pitchVariation = 0.08,
    isHit = false
  ) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Batasi jumlah suara bersamaan (max 8) agar tidak menumpuk saat tembakan cepat
      if (this.activeVoices.length >= this.maxConcurrentVoices) {
        const oldest = this.activeVoices.shift();
        try {
          oldest?.stop();
        } catch {}
      }

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();

      source.buffer = buffer;
      source.onended = () => {
        this.activeVoices = this.activeVoices.filter((v) => v !== source);
      };

      // Variasi pitch alami agar tidak monoton (seperti di README)
      if (pitchVariation > 0) {
        source.playbackRate.value = 1.0 - pitchVariation + Math.random() * (pitchVariation * 2);
      }

      // Hit sedikit lebih pelan dari tembakan
      const finalVol = isHit ? baseVolume * 0.75 : baseVolume;
      gain.gain.value = Math.max(0, Math.min(1.5, finalVol));

      source.connect(gain);
      gain.connect(ctx.destination);

      source.start(0);
      this.activeVoices.push(source);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Memutar suara tembakan senjata (memilih acak antara shoot_1 dan shoot_2)
   */
  public async playWeaponShoot(weaponId = 'blaster_klasik', volumeMult = 1.0) {
    const shootVariant = Math.random() < 0.5 ? 'shoot_1' : 'shoot_2';
    const volume = (WEAPON_VOLUMES[weaponId] ?? 0.8) * volumeMult;

    // Load and play
    const buf = await this.loadBuffer(weaponId, shootVariant);
    if (buf) {
      this.playBuffer(buf, volume, 0.08, false);
    } else {
      // Fallback sintetis jika file belum termuat
      this.playSynthesizedFallback('shoot', weaponId);
    }
  }

  /**
   * Memutar suara peluru mengenai musuh/objek (hit.ogg)
   */
  public async playWeaponHit(weaponId = 'blaster_klasik', volumeMult = 1.0) {
    const volume = (WEAPON_VOLUMES[weaponId] ?? 0.8) * volumeMult;

    const buf = await this.loadBuffer(weaponId, 'hit');
    if (buf) {
      this.playBuffer(buf, volume, 0.05, true);
    } else {
      this.playSynthesizedFallback('hit', weaponId);
    }
  }

  /**
   * Memutar suara saat senjata dipasang / loadout diganti (equip.ogg)
   */
  public async playWeaponEquip(weaponId = 'blaster_klasik', volumeMult = 1.0) {
    const volume = (WEAPON_VOLUMES[weaponId] ?? 0.8) * volumeMult;

    const buf = await this.loadBuffer(weaponId, 'equip');
    if (buf) {
      this.playBuffer(buf, volume, 0, false);
    } else {
      this.playSynthesizedFallback('equip', weaponId);
    }
  }

  /**
   * Memutar suara efek umum (kosong_klik, isi_ulang_amunisi, power_up)
   */
  public async playCommonSfx(type: CommonSoundType, volumeMult = 1.0) {
    const buf = await this.loadBuffer('umum', type);
    if (buf) {
      this.playBuffer(buf, 0.85 * volumeMult, 0.04, false);
    }
  }

  /**
   * Preload audio untuk senjata tertentu (misal saat dipasang atau saat masuk level)
   */
  public preloadWeapon(weaponId: string) {
    this.loadBuffer(weaponId, 'shoot_1');
    this.loadBuffer(weaponId, 'shoot_2');
    this.loadBuffer(weaponId, 'hit');
    this.loadBuffer(weaponId, 'equip');
  }

  /**
   * Fallback sintetis cepat jika browser belum sempat mendecode file audio
   */
  private playSynthesizedFallback(type: 'shoot' | 'hit' | 'equip', weaponId: string) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'shoot') {
        const isCosmic = weaponId.includes('galaksi') || weaponId.includes('cyber');
        osc.type = isCosmic ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.13);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'hit') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'equip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.09);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      }
    } catch {}
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }
}

export const weaponSoundService = new WeaponSoundService();
