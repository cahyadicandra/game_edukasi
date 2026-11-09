import { Preferences } from '@capacitor/preferences';
import type { PlayerProfile, DailyMission } from '../types/game';
import type { WorldData } from '../data/worlds';

/**
 * Kunci penyimpanan database lokal
 */
export const DB_KEYS = {
  PLAYER_PROFILE: 'game_player_profile',
  WORLDS_PROGRESS: 'game_worlds_progress',
  DAILY_MISSION: 'game_daily_mission',
  DAILY_CLAIMS: 'game_daily_claims',
  GAME_SETTINGS: 'game_settings',
  LEVEL_RECORDS: 'game_level_records',
  ACTIVE_SESSION: 'game_active_session',
  CLAIMED_MILESTONES: 'game_claimed_milestones',
  CLAIMED_ACHIEVEMENTS: 'game_claimed_achievements',
  SHAPE_ALBUM_MILESTONES: 'game_shape_album_milestones',
} as const;

export interface ActiveSessionData {
  quizPhase: 'none' | 'rpg_game' | 'battle' | 'quiz' | 'detail';
  selectedLevelNum: number | null;
  selectedWorldId: string | null;
  activeTab?: string;
}

export interface DailyClaimsData {
  lastStarClaim: string | null;
  lastDiamondClaim: string | null;
}

export interface GameSettingsData {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface LevelRecordItem {
  levelNum: number;
  bestStars: number;
  bestCoins: number;
  bestTimeSec: number;
  bossDefeated: boolean;
  completedAt?: string;
}

export const CURRENT_DB_VERSION = 'v2026_11_fresh_v4';
export const DB_VERSION_KEY = 'game_db_clean_version';

/**
 * Layanan Database Lokal Game Edukasi Geometri
 * Menggunakan @capacitor/preferences (SQLite/SharedPreferences di Android & iOS)
 * dengan sinkronisasi ke Web Storage (localStorage) untuk persistensi data offline 100%.
 */
class LocalDatabaseService {
  private memoryCache: Map<string, string> = new Map();
  private isInitialized = false;

  constructor() {
    this.ensureFreshDatabaseSync();
  }

  /**
   * Pembersihan sinkron seketika saat bundle dimuat untuk menjamin database 100% fresh
   */
  private ensureFreshDatabaseSync(): void {
    if (typeof window === 'undefined') return;
    try {
      const existingVer = localStorage.getItem(DB_VERSION_KEY);
      if (existingVer !== CURRENT_DB_VERSION) {
        // Hapus seluruh data lama di localStorage
        const allKeysToPurge = [
          ...Object.values(DB_KEYS),
          'game_edukasi_player_profile',
          'game_edukasi_last_star_claim',
          'game_edukasi_last_diamond_claim',
          'game_edukasi_daily_mission',
          'game_active_session',
          'game_player_profile',
          'game_worlds_progress',
        ];
        allKeysToPurge.forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch {
            // Ignore
          }
        });
        localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
        this.memoryCache.clear();
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Inisialisasi awal database lokal: membaca data dari @capacitor/preferences
   * dan mengisi memory cache untuk pembacaan instan tanpa jeda rendering.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 1. Cek versi database di Preferences native
      let prefVer: string | null = null;
      try {
        const { value } = await Preferences.get({ key: DB_VERSION_KEY });
        prefVer = value;
      } catch {
        // Ignore
      }

      if (prefVer !== CURRENT_DB_VERSION) {
        // Bersihkan seluruh database lama di native Preferences
        const allKeysToPurge = [
          ...Object.values(DB_KEYS),
          'game_edukasi_player_profile',
          'game_edukasi_last_star_claim',
          'game_edukasi_last_diamond_claim',
          'game_edukasi_daily_mission',
          'game_active_session',
        ];
        await Promise.all(
          allKeysToPurge.map(async (key) => {
            try {
              await Preferences.remove({ key });
            } catch {
              // Ignore
            }
          })
        );
        try {
          await Preferences.set({ key: DB_VERSION_KEY, value: CURRENT_DB_VERSION });
        } catch {
          // Ignore
        }
        this.memoryCache.clear();
      }

      // 2. Baca data terkini ke memory cache
      const keys = Object.values(DB_KEYS);
      await Promise.all(
        keys.map(async (key) => {
          try {
            const { value } = await Preferences.get({ key });
            if (value !== null && value !== undefined) {
              this.memoryCache.set(key, value);
            } else {
              // Fallback ke localStorage jika Preferences belum terisi
              const localVal = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
              if (localVal) {
                this.memoryCache.set(key, localVal);
                await Preferences.set({ key, value: localVal });
              }
            }
          } catch {
            const localVal = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
            if (localVal) this.memoryCache.set(key, localVal);
          }
        })
      );
    } catch (e) {
      console.warn('Inisialisasi database lokal via Preferences gagal, menggunakan fallback localStorage:', e);
    } finally {
      this.isInitialized = true;
    }
  }

  /**
   * Helper membaca nilai dari cache atau fallback storage
   */
  private getRaw(key: string): string | null {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) || null;
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Helper menyimpan nilai secara asinkron ke Preferences & localStorage
   */
  private async setRaw(key: string, value: string): Promise<void> {
    this.memoryCache.set(key, value);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Kuota storage web penuh / private browsing
      }
    }
    try {
      await Preferences.set({ key, value });
    } catch (e) {
      console.warn(`Gagal menyimpan ke Preferences untuk key "${key}":`, e);
    }
  }

  // ========================================================
  // 1. PROFIL PEMAIN, INVENTARIS & SALDO (Koin, Bintang, Permata)
  // ========================================================
  public loadPlayerProfile(fallback: PlayerProfile): PlayerProfile {
    try {
      const raw = this.getRaw(DB_KEYS.PLAYER_PROFILE);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Pastikan modal awal tersedia jika data lama masih sisa testing (99999) atau null
        const coins =
          parsed.coins === 99999 || parsed.coins === undefined || parsed.coins === null
            ? fallback.coins ?? 1000
            : parsed.coins;
        const diamonds =
          parsed.diamonds === 9999 || parsed.diamonds === undefined || parsed.diamonds === null
            ? fallback.diamonds ?? 20
            : parsed.diamonds;
        const stars =
          parsed.stars === 9999 || parsed.stars === undefined || parsed.stars === null
            ? fallback.stars ?? 0
            : parsed.stars;

        return {
          ...fallback,
          ...parsed,
          coins,
          diamonds,
          stars,
          inventory: {
            ...fallback.inventory,
            ...(parsed.inventory || {}),
          },
          stats: {
            ...fallback.stats,
            ...(parsed.stats || {}),
          },
          equipment: {
            ...fallback.equipment,
            ...(parsed.equipment || {}),
            shards: parsed.equipment?.shards ?? fallback.equipment?.shards ?? 150,
            unlockedParts:
              parsed.equipment?.unlockedParts && parsed.equipment.unlockedParts.length > 0
                ? parsed.equipment.unlockedParts
                : fallback.equipment?.unlockedParts || [
                    'blaster_std',
                    'core_skin_native',
                    'core_orb',
                    'barrel_std',
                    'grip_std',
                    'charm_none',
                  ],
            unlockedSkins:
              parsed.equipment?.unlockedSkins && parsed.equipment.unlockedSkins.length > 0
                ? parsed.equipment.unlockedSkins
                : ['blaster_klasik'],
            blasterSkin: parsed.equipment?.blasterSkin || 'blaster_klasik',
            blasterCore: parsed.equipment?.blasterCore || 'bullet_skin',
          },
        };
      }
    } catch (e) {
      console.error('Error saat membaca profil pemain dari database lokal:', e);
    }
    return fallback;
  }

  public async savePlayerProfile(profile: PlayerProfile): Promise<void> {
    await this.setRaw(DB_KEYS.PLAYER_PROFILE, JSON.stringify(profile));
  }

  // ========================================================
  // 2. PROGRES PETA DUNIA & LEVEL (Level Unlock, Bintang)
  // ========================================================
  public loadWorldsProgress(fallback: WorldData[]): WorldData[] {
    try {
      const raw = this.getRaw(DB_KEYS.WORLDS_PROGRESS);
      if (raw) {
        const parsed: WorldData[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Gabungkan dengan data statis untuk memastikan tidak ada level/field baru yang hilang
          return fallback.map((fbWorld) => {
            const savedWorld = parsed.find((w) => w.id === fbWorld.id);
            if (!savedWorld) return fbWorld;

            return {
              ...fbWorld,
              levels: fbWorld.levels.map((fbLvl) => {
                const savedLvl = savedWorld.levels?.find((l) => l.num === fbLvl.num);
                if (!savedLvl) return fbLvl;
                return {
                  ...fbLvl,
                  state: savedLvl.state ?? fbLvl.state,
                  stars: savedLvl.stars ?? fbLvl.stars,
                };
              }),
            };
          });
        }
      }
    } catch (e) {
      console.error('Error saat membaca progres peta dunia dari database lokal:', e);
    }
    return fallback;
  }

  public async saveWorldsProgress(worlds: WorldData[]): Promise<void> {
    await this.setRaw(DB_KEYS.WORLDS_PROGRESS, JSON.stringify(worlds));
  }

  // ========================================================
  // 3. MISI HARIAN (Daily Missions)
  // ========================================================
  public loadDailyMission(fallback: DailyMission, todayStr: string): DailyMission {
    try {
      const raw = this.getRaw(DB_KEYS.DAILY_MISSION);
      if (raw) {
        const parsed: DailyMission = JSON.parse(raw);
        // Validasi apakah misi tersimpan masih di hari yang sama
        if (parsed.date === todayStr) {
          return { ...fallback, ...parsed };
        }
      }
    } catch (e) {
      console.error('Error saat membaca misi harian dari database lokal:', e);
    }
    return { ...fallback, date: todayStr };
  }

  public async saveDailyMission(mission: DailyMission): Promise<void> {
    await this.setRaw(DB_KEYS.DAILY_MISSION, JSON.stringify(mission));
  }

  // ========================================================
  // 4. KLAIM HARIAN (Bintang & Permata Harian)
  // ========================================================
  public loadDailyClaims(): DailyClaimsData {
    const defaultData: DailyClaimsData = {
      lastStarClaim: null,
      lastDiamondClaim: null,
    };
    try {
      const raw = this.getRaw(DB_KEYS.DAILY_CLAIMS);
      if (raw) {
        return { ...defaultData, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error('Error saat membaca klaim harian dari database lokal:', e);
    }
    return defaultData;
  }

  public async saveDailyClaim(type: 'star' | 'diamond', dateStr: string): Promise<void> {
    const current = this.loadDailyClaims();
    if (type === 'star') current.lastStarClaim = dateStr;
    if (type === 'diamond') current.lastDiamondClaim = dateStr;
    await this.setRaw(DB_KEYS.DAILY_CLAIMS, JSON.stringify(current));
  }

  // ========================================================
  // 5. PENGATURAN GAME (Suara, Musik, Getaran)
  // ========================================================
  public loadGameSettings(): GameSettingsData {
    const defaultSettings: GameSettingsData = {
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
    };
    try {
      const raw = this.getRaw(DB_KEYS.GAME_SETTINGS);
      if (raw) {
        return { ...defaultSettings, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error('Error saat membaca pengaturan game dari database lokal:', e);
    }
    return defaultSettings;
  }

  public async saveGameSettings(settings: Partial<GameSettingsData>): Promise<void> {
    const current = this.loadGameSettings();
    const updated = { ...current, ...settings };
    await this.setRaw(DB_KEYS.GAME_SETTINGS, JSON.stringify(updated));
  }

  // ========================================================
  // 6. CATATAN LEVEL & REKOR TERBAIK (Highscores)
  // ========================================================
  public loadLevelRecords(): Record<number, LevelRecordItem> {
    try {
      const raw = this.getRaw(DB_KEYS.LEVEL_RECORDS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error membaca rekor level:', e);
    }
    return {};
  }

  public async saveLevelRecord(record: LevelRecordItem): Promise<void> {
    const all = this.loadLevelRecords();
    const existing = all[record.levelNum];

    // Simpan pencapaian terbaik
    all[record.levelNum] = {
      levelNum: record.levelNum,
      bestStars: Math.max(existing?.bestStars || 0, record.bestStars),
      bestCoins: Math.max(existing?.bestCoins || 0, record.bestCoins),
      bestTimeSec: existing?.bestTimeSec ? Math.min(existing.bestTimeSec, record.bestTimeSec) : record.bestTimeSec,
      bossDefeated: existing?.bossDefeated || record.bossDefeated,
      completedAt: new Date().toISOString(),
    };

    await this.setRaw(DB_KEYS.LEVEL_RECORDS, JSON.stringify(all));
  }

  // ========================================================
  // 7. SESI AKTIF GAMEPLAY (Mencegah Kembali ke Lobi Saat Reload)
  // ========================================================
  public loadActiveSession(): ActiveSessionData | null {
    try {
      const raw = this.getRaw(DB_KEYS.ACTIVE_SESSION);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error saat membaca sesi game aktif:', e);
    }
    return null;
  }

  public async saveActiveSession(session: ActiveSessionData): Promise<void> {
    await this.setRaw(DB_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }

  public async clearActiveSession(): Promise<void> {
    this.memoryCache.delete(DB_KEYS.ACTIVE_SESSION);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DB_KEYS.ACTIVE_SESSION);
      } catch {
        // Ignore
      }
    }
    try {
      await Preferences.remove({ key: DB_KEYS.ACTIVE_SESSION });
    } catch {
      // Ignore
    }
  }

  // ========================================================
  // 8. KLAIM MILESTONE KOLEKSI
  // ========================================================
  public loadClaimedMilestones(): number[] {
    try {
      const raw = this.getRaw(DB_KEYS.CLAIMED_MILESTONES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error saat membaca milestone koleksi:', e);
    }
    return [];
  }

  public async saveClaimedMilestones(milestones: number[]): Promise<void> {
    await this.setRaw(DB_KEYS.CLAIMED_MILESTONES, JSON.stringify(milestones));
  }

  // Klaim milestone Album Koleksi Bangun Datar (terpisah dari milestone gacha agar tidak bentrok)
  public loadShapeAlbumMilestones(): number[] {
    try {
      const raw = this.getRaw(DB_KEYS.SHAPE_ALBUM_MILESTONES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error saat membaca milestone album bentuk:', e);
    }
    return [];
  }

  public async saveShapeAlbumMilestones(milestones: number[]): Promise<void> {
    await this.setRaw(DB_KEYS.SHAPE_ALBUM_MILESTONES, JSON.stringify(milestones));
  }

  // ========================================================
  // 9. KLAIM PRESTASI (ACHIEVEMENTS)
  // ========================================================
  public loadClaimedAchievements(): string[] {
    try {
      const raw = this.getRaw(DB_KEYS.CLAIMED_ACHIEVEMENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error saat membaca prestasi diklaim:', e);
    }
    return [];
  }

  public async saveClaimedAchievements(achIds: string[]): Promise<void> {
    await this.setRaw(DB_KEYS.CLAIMED_ACHIEVEMENTS, JSON.stringify(achIds));
  }

  // ========================================================
  // 10. MANAJEMEN DATABASE: RESET & BACKUP DATA
  // ========================================================
  /**
   * Menghapus seluruh data lokal permainan untuk memulai akun baru
   */
  public async resetAllData(): Promise<void> {
    this.memoryCache.clear();
    const keys = Object.values(DB_KEYS);

    if (typeof window !== 'undefined') {
      keys.forEach((key) => localStorage.removeItem(key));
    }

    await Promise.all(
      keys.map(async (key) => {
        try {
          await Preferences.remove({ key });
        } catch {
          // Ignore
        }
      })
    );
  }

  /**
   * Ekspor seluruh database lokal menjadi string JSON terenkapsulasi
   */
  public exportDataBackup(): string {
    const backup: Record<string, unknown> = {};
    Object.values(DB_KEYS).forEach((key) => {
      const raw = this.getRaw(key);
      if (raw) {
        try {
          backup[key] = JSON.parse(raw);
        } catch {
          backup[key] = raw;
        }
      }
    });
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Impor dan pulihkan data dari string JSON backup
   */
  public async importDataBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data !== 'object' || data === null) return false;

      for (const [key, val] of Object.entries(data)) {
        if ((Object.values(DB_KEYS) as string[]).includes(key)) {
          const stringVal = typeof val === 'string' ? val : JSON.stringify(val);
          await this.setRaw(key, stringVal);
        }
      }
      return true;
    } catch (e) {
      console.error('Gagal memulihkan backup data:', e);
      return false;
    }
  }
}

export const LocalDB = new LocalDatabaseService();
