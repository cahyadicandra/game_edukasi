import { useState, useEffect, lazy, Suspense } from 'react';
import type { PlayerProfile, DailyMission, NavTabId } from './types/game';
import { initialPlayer, initialMission } from './data/mockData';
import { worlds as initialWorlds, type WorldData, type LevelNodeData } from './data/worlds';
import { getQuestionsForLevel, computeResult, type LevelResult } from './data/questions';
import { HomeScreen } from './components/Screens/HomeScreen';
import { MapScreen } from './components/Screens/MapScreen';
import { MaterialScreen } from './components/Screens/MaterialScreen';
import { AchievementScreen } from './components/Screens/AchievementScreen';
import { ProfileScreen } from './components/Screens/ProfileScreen';
import { BottomNavbar } from './components/Navigation/BottomNavbar';
import { GameModal } from './components/Modals/GameModal';
import { ResultScreen } from './components/Quiz/ResultScreen';
import { AvatarRenderer, type AvatarKey } from './components/Common/AvatarRenderer';
import { getMonsterForLevel } from './data/monsters';
import { LocalDB } from './services/localDatabase';
import { Volume2, VolumeX, Shield, Info, Check, Sparkles, Star, Gem, RotateCcw, Database } from 'lucide-react';
import './styles/game-theme.css';

// Lazy-loaded Modals & Heavy Game Screens for Mobile Startup Performance
const LevelDetailModal = lazy(() => import('./components/Quiz/LevelDetailModal').then((m) => ({ default: m.LevelDetailModal })));
const GachaModal = lazy(() => import('./components/Gacha/GachaModal').then((m) => ({ default: m.GachaModal })));
const CustomizationModal = lazy(() => import('./components/Customization/CustomizationModal').then((m) => ({ default: m.CustomizationModal })));
const BattleScreen = lazy(() => import('./components/Quiz/BattleScreen').then((m) => ({ default: m.BattleScreen })));
const CampfireModal = lazy(() => import('./components/Adventure/CampfireModal').then((m) => ({ default: m.CampfireModal })));
const TangramPuzzleModal = lazy(() => import('./components/Adventure/TangramPuzzleModal').then((m) => ({ default: m.TangramPuzzleModal })));
const ShapeAlbumModal = lazy(() => import('./components/Adventure/ShapeAlbumModal').then((m) => ({ default: m.ShapeAlbumModal })));
const MascotPlaygroundModal = lazy(() => import('./components/Mascot/MascotPlaygroundModal').then((m) => ({ default: m.MascotPlaygroundModal })));
const RPGGameScreen = lazy(() => import('./components/RPG/RPGGameScreen').then((m) => ({ default: m.RPGGameScreen })));

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export default function App() {
  // Inisialisasi service database lokal sekali saat aplikasi dibuka
  useEffect(() => {
    LocalDB.init().catch((err) => {
      console.warn('Gagal menginisialisasi database lokal:', err);
    });
  }, []);

  // Profil pemain & inventaris dari Database Lokal
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    return LocalDB.loadPlayerProfile(initialPlayer);
  });

  // Misi harian dengan tanggal & batas klaim ketat 1x per hari dari Database Lokal
  const [mission, setMission] = useState<DailyMission>(() => {
    return LocalDB.loadDailyMission(initialMission, getTodayDateString());
  });

  const [activeTab, setActiveTab] = useState<NavTabId>('beranda');

  // Pelacakan klaim hadiah harian (1x per hari) dari Database Lokal
  const [lastClaimedStarDate, setLastClaimedStarDate] = useState<string | null>(() => {
    return LocalDB.loadDailyClaims().lastStarClaim;
  });

  const [lastClaimedDiamondDate, setLastClaimedDiamondDate] = useState<string | null>(() => {
    return LocalDB.loadDailyClaims().lastDiamondClaim;
  });

  const isStarClaimedToday = lastClaimedStarDate === getTodayDateString();
  const isDiamondClaimedToday = lastClaimedDiamondDate === getTodayDateString();

  // Alur permainan & progres level dari Database Lokal
  const [worldsState, setWorldsState] = useState<WorldData[]>(() => {
    return LocalDB.loadWorldsProgress(initialWorlds);
  });

  // Pengaturan game (suara & musik) dari Database Lokal
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return LocalDB.loadGameSettings().soundEnabled;
  });

  // Simpan data pemain otomatis ke Database Lokal setiap kali ada perubahan
  useEffect(() => {
    LocalDB.savePlayerProfile(player);
  }, [player]);

  // Simpan misi harian otomatis ke Database Lokal
  useEffect(() => {
    LocalDB.saveDailyMission(mission);
  }, [mission]);

  // Simpan progres peta dunia & level otomatis ke Database Lokal
  useEffect(() => {
    LocalDB.saveWorldsProgress(worldsState);
  }, [worldsState]);

  // Simpan pengaturan game otomatis ke Database Lokal
  useEffect(() => {
    LocalDB.saveGameSettings({ soundEnabled });
  }, [soundEnabled]);

  // Interactive Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isGachaModalOpen, setIsGachaModalOpen] = useState(false);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isShapesModalOpen, setIsShapesModalOpen] = useState(false);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);

  // Baca sesi game aktif (mencegah kembali ke lobi saat halaman di-reload di tengah permainan)
  const savedSession = LocalDB.loadActiveSession();
  const initialSessionData = (() => {
    if (savedSession && savedSession.quizPhase === 'rpg_game' && savedSession.selectedLevelNum) {
      for (const w of initialWorlds) {
        const found = w.levels.find((l) => l.num === savedSession.selectedLevelNum);
        if (found) {
          return { world: w, level: found, phase: 'rpg_game' as const };
        }
      }
    }
    return { world: null, level: null, phase: 'none' as const };
  })();

  const [selectedLevel, setSelectedLevel] = useState<LevelNodeData | null>(initialSessionData.level);
  const [selectedWorld, setSelectedWorld] = useState<WorldData | null>(initialSessionData.world);
  const [quizPhase, setQuizPhase] = useState<'none' | 'detail' | 'quiz' | 'battle' | 'result' | 'rpg_game'>(
    initialSessionData.phase
  );

  // Simpan status sesi aktif ke Database Lokal setiap kali ada perubahan fase/level
  useEffect(() => {
    if (quizPhase === 'rpg_game' && selectedLevel) {
      LocalDB.saveActiveSession({
        quizPhase: 'rpg_game',
        selectedLevelNum: selectedLevel.num,
        selectedWorldId: selectedWorld?.id || null,
        activeTab,
      });
    } else if (quizPhase === 'none') {
      LocalDB.clearActiveSession();
    }
  }, [quizPhase, selectedLevel, selectedWorld, activeTab]);
  const [lastResult, setLastResult] = useState<LevelResult | null>(null);
  const [isCampfireModalOpen, setIsCampfireModalOpen] = useState(false);
  const [isTangramModalOpen, setIsTangramModalOpen] = useState(false);
  const [isShapeAlbumOpen, setIsShapeAlbumOpen] = useState(false);
  const [isMascotPlaygroundOpen, setIsMascotPlaygroundOpen] = useState(false);

  // Currency & Progress Handlers Dinamis
  const handleAddStars = () => {
    setIsStarModalOpen(true);
  };

  const handleAddDiamonds = () => {
    setIsDiamondModalOpen(true);
  };

  const handleClaimStarsBonus = (amount = 20) => {
    if (isStarClaimedToday) return;
    const today = getTodayDateString();
    setPlayer((prev) => ({ ...prev, stars: prev.stars + amount }));
    setLastClaimedStarDate(today);
    LocalDB.saveDailyClaim('star', today);
  };

  const handleClaimDiamondsBonus = (amount = 10) => {
    if (isDiamondClaimedToday) return;
    const today = getTodayDateString();
    setPlayer((prev) => ({ ...prev, diamonds: prev.diamonds + amount }));
    setLastClaimedDiamondDate(today);
    LocalDB.saveDailyClaim('diamond', today);
  };

  // Mulai petualangan langsung masuk gameplay level aktif
  const handleStartAdventure = () => {
    for (const world of worldsState) {
      const activeLvl =
        world.levels.find((l) => l.state === 'active') ||
        world.levels.find((l) => l.state === 'completed') ||
        world.levels[0];
      if (activeLvl) {
        setSelectedLevel(activeLvl);
        setSelectedWorld(world);
        setQuizPhase('rpg_game');
        return;
      }
    }
    setActiveTab('peta');
  };

  const handleStartLevel = () => {
    setIsPlayModalOpen(false);
    setActiveTab('peta');
  };

  // Pilih level di peta: semua level langsung masuk gameplay mengumpulkan koin
  const handleSelectLevel = (level: LevelNodeData, world: WorldData) => {
    if (level.state === 'locked') return;
    setSelectedLevel(level);
    setSelectedWorld(world);
    setQuizPhase('rpg_game');
  };

  const handleStartNodeEncounter = () => {
    if (!selectedLevel) return;
    const nodeType = selectedLevel.nodeType || 'battle';

    if (nodeType === 'campfire') {
      setQuizPhase('none');
      setIsCampfireModalOpen(true);
    } else if (nodeType === 'puzzle') {
      setQuizPhase('none');
      setIsTangramModalOpen(true);
    } else {
      // Seluruh gameplay level kini pure RPG: Platformer Maskot Loncat + Bos Kuis
      setQuizPhase('rpg_game');
    }
  };

  const handleRPGLevelComplete = (awardedStars: number, earnedCoins: number, earnedExp: number) => {
    if (!selectedLevel) return;

    // Update status level & buka level berikutnya HANYA jika pemain berhasil menang (awardedStars > 0)
    if (awardedStars > 0) {
      setWorldsState((prevWorlds) => {
        return prevWorlds.map((world) => {
          const nextLevels = world.levels.map((lvl) => {
            if (lvl.num === selectedLevel.num) {
              return {
                ...lvl,
                state: 'completed' as const,
                stars: Math.max(lvl.stars || 0, awardedStars),
              };
            }
            if (lvl.num === selectedLevel.num + 1 && lvl.state === 'locked') {
              return {
                ...lvl,
                state: 'active' as const,
              };
            }
            return lvl;
          });
          return { ...world, levels: nextLevels };
        });
      });
    }

    // Berikan hadiah EXP, Koin, Bintang & Permata ke profil pemain dengan kalkulasi level-up presisi
    setPlayer((prev) => {
      let accumulatedExp = prev.currentExp + earnedExp;
      let nextLevel = prev.level;
      let nextMaxExp = prev.maxExp;

      // Loop selama accumulatedExp mencukupi untuk naik level (mendukung multi-level up)
      while (accumulatedExp >= nextMaxExp) {
        accumulatedExp -= nextMaxExp;
        nextLevel += 1;
        nextMaxExp = Math.round(nextMaxExp * 1.4);
      }

      return {
        ...prev,
        level: nextLevel,
        currentExp: accumulatedExp,
        maxExp: nextMaxExp,
        coins: (prev.coins || 0) + earnedCoins,
        stars: prev.stars + (awardedStars * 5),
        diamonds: prev.diamonds + (awardedStars === 3 ? 3 : awardedStars > 0 ? 1 : 0),
      };
    });

    // Catat rekor level ke database lokal
    LocalDB.saveLevelRecord({
      levelNum: selectedLevel.num,
      bestStars: awardedStars,
      bestCoins: earnedCoins,
      bestTimeSec: 0,
      bossDefeated: awardedStars > 0,
    });

    // Bersihkan sesi aktif saat level selesai
    LocalDB.clearActiveSession();
    setQuizPhase('none');
    setSelectedLevel(null);
    setSelectedWorld(null);
    setActiveTab('peta');
  };

  const handleBattleVictory = (dropReward: { exp: number; coins: number; stars: number; diamonds?: number }) => {
    const victoryResult: LevelResult = {
      correct: 5,
      total: 5,
      score: 500,
      coins: dropReward.coins || 20,
      xp: dropReward.exp || 50,
      stars: dropReward.stars || 3,
    };
    handleFinishQuiz(5);
    setLastResult(victoryResult);
  };

  const handleBattleDefeat = () => {
    alert('Karaktermu kehabisan darah! Mundur sejenak untuk memulihkan diri.');
    setQuizPhase('none');
    setSelectedLevel(null);
    setSelectedWorld(null);
  };

  const handleCampfireRestComplete = (healedHp: number, healedSp: number) => {
    setPlayer((prev) => ({
      ...prev,
      stars: prev.stars + 20,
      diamonds: prev.diamonds + 5,
      stats: {
        ...(prev.stats || { maxHp: 100, maxSp: 50, atk: 25, def: 15 }),
        hp: healedHp,
        sp: healedSp,
      },
    }));
    handleQuizContinue();
  };

  const handleTangramComplete = () => {
    setIsTangramModalOpen(false);
    const result: LevelResult = {
      correct: 3,
      total: 3,
      score: 300,
      coins: 15,
      xp: 40,
      stars: 3,
    };
    setLastResult(result);
    setQuizPhase('result');
    setPlayer((prev) => ({
      ...prev,
      stars: prev.stars + 15,
      diamonds: prev.diamonds + 3,
      currentExp: prev.currentExp + 40,
    }));
  };

  const handleFinishQuiz = (
    correctCount: number,
    firstTryCorrect?: number,
    retryCount?: number
  ) => {
    const totalQ = selectedLevel ? getQuestionsForLevel(selectedLevel.num).length : 5;
    const result = computeResult(correctCount, totalQ, firstTryCorrect, retryCount);
    setLastResult(result);
    setQuizPhase('result');

    // Terapkan hadiah EXP & Koin secara dinamis dengan pengecekan Level Up
    setPlayer((prev) => {
      let newStars = prev.stars + result.coins;
      let newExp = prev.currentExp + result.xp;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let newDiamonds = prev.diamonds;
      let leveledUp = false;

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.round(newMaxExp * 1.35);
        newStars += 50;
        newDiamonds += 10;
        leveledUp = true;
      }

      if (leveledUp) {
        setTimeout(() => setIsLevelUpModalOpen(true), 700);
      }

      return {
        ...prev,
        stars: newStars,
        diamonds: newDiamonds,
        level: newLevel,
        currentExp: newExp,
        maxExp: newMaxExp,
      };
    });
    // Tambah progres misi hari ini jika level diselesaikan dengan nilai sempurna (3 bintang)
    if (result.stars === 3) {
      setMission((prev) => {
        if (prev.current < prev.target && !prev.isCompleted) {
          return {
            ...prev,
            current: prev.current + 1,
          };
        }
        return prev;
      });
    }

    // Buka kartu bentuk geometri ke album jika belum dimiliki berdasarkan level yang diselesaikan
    const levelToCardMap: Record<number, string> = {
      1: 'card-tri-1',
      2: 'card-sq-1',
      3: 'card-rect-1',
      4: 'card-parallelogram-1',
      5: 'card-trapezoid-1',
      6: 'card-diamond-rhombus',
      7: 'card-circle-compass',
      8: 'card-kite-1',
    };

    if (selectedLevel) {
      const cardToUnlock = levelToCardMap[selectedLevel.num];
      if (cardToUnlock) {
        setPlayer((prev) => {
          const currentCards = prev.inventory?.collectedCards || [];
          if (!currentCards.includes(cardToUnlock)) {
            return {
              ...prev,
              inventory: {
                ...prev.inventory!,
                collectedCards: [...currentCards, cardToUnlock],
              },
            };
          }
          return prev;
        });
      }
    }
  };

  const handleResetGameData = async () => {
    if (window.confirm('Yakin ingin mereset profil petualang ke awal?')) {
      setPlayer(initialPlayer);
      setLastClaimedStarDate(null);
      setLastClaimedDiamondDate(null);
      setMission({ ...initialMission, current: 0, isCompleted: false, date: getTodayDateString() });
      setWorldsState(initialWorlds);

      try {
        await LocalDB.resetAllData();
      } catch (e) {
        console.error('Gagal reset database lokal:', e);
      }
      setIsSettingsModalOpen(false);
    }
  };

  const handleQuizContinue = () => {
    // Tandai level selesai dan buka level berikutnya (pada pulau yang sama atau pulau berikutnya)
    if (selectedWorld && selectedLevel) {
      setWorldsState((prev) => {
        const currentWorldIdx = prev.findIndex((w) => w.id === selectedWorld.id);
        const currentLevelIdx = selectedWorld.levels.findIndex((l) => l.num === selectedLevel.num);

        return prev.map((w, wIdx) => {
          if (wIdx === currentWorldIdx) {
            return {
              ...w,
              levels: w.levels.map((l, i) => {
                if (i === currentLevelIdx) {
                  return { ...l, state: 'completed' as const, stars: lastResult?.stars ?? 3 };
                }
                if (i === currentLevelIdx + 1 && l.state === 'locked') {
                  return { ...l, state: 'active' as const };
                }
                return l;
              }),
            };
          }
          // Jika menyelesaikan level terakhir di pulau ini, buka level 1 di pulau berikutnya!
          if (
            currentLevelIdx === selectedWorld.levels.length - 1 &&
            wIdx === currentWorldIdx + 1
          ) {
            return {
              ...w,
              levels: w.levels.map((l, i) =>
                i === 0 && l.state === 'locked' ? { ...l, state: 'active' as const } : l
              ),
            };
          }
          return w;
        });
      });
    }
    setQuizPhase('none');
    setSelectedLevel(null);
    setSelectedWorld(null);
  };

  const handleQuizQuit = () => {
    setQuizPhase('none');
    setSelectedLevel(null);
    setSelectedWorld(null);
  };

  const handleUseFiftyFifty = (): boolean => {
    let success = false;
    setPlayer((prev) => {
      const tickets = prev.inventory?.fiftyFiftyTickets || 0;
      if (tickets > 0) {
        success = true;
        return {
          ...prev,
          inventory: {
            ...prev.inventory!,
            fiftyFiftyTickets: tickets - 1,
          },
        };
      }
      // Tiket habis, gunakan 5 permata jika saldo mencukupi
      if (prev.diamonds >= 5) {
        success = true;
        return {
          ...prev,
          diamonds: prev.diamonds - 5,
        };
      }
      return prev;
    });
    return success;
  };

  const handleUseHint = (): boolean => {
    let success = false;
    setPlayer((prev) => {
      const tickets = prev.inventory?.hintTickets || 0;
      if (tickets > 0) {
        success = true;
        return {
          ...prev,
          inventory: {
            ...prev.inventory!,
            hintTickets: tickets - 1,
          },
        };
      }
      // Tiket habis, gunakan 3 permata jika saldo mencukupi
      if (prev.diamonds >= 3) {
        success = true;
        return {
          ...prev,
          diamonds: prev.diamonds - 3,
        };
      }
      return prev;
    });
    return success;
  };

  // Konsumsi Ramuan HP / Eliksir SP saat pertarungan (potong stok, fallback 2 permata)
  const handleConsumeBattleItem = (kind: 'potion' | 'elixir'): boolean => {
    const itemKey = kind === 'potion' ? 'potions' : 'spElixirs';
    let success = false;
    setPlayer((prev) => {
      const stock = prev.inventory?.[itemKey] || 0;
      if (stock > 0) {
        success = true;
        return {
          ...prev,
          inventory: {
            ...prev.inventory!,
            [itemKey]: stock - 1,
          },
        };
      }
      // Stok habis, beli dengan 2 permata jika saldo mencukupi
      if (prev.diamonds >= 2) {
        success = true;
        return {
          ...prev,
          diamonds: prev.diamonds - 2,
        };
      }
      return prev;
    });
    return success;
  };

  return (
    <div className="game-viewport">
      <main className="game-scene-container">
        {/* Active Screen rendering */}
        {activeTab === 'beranda' && (
          <HomeScreen
            player={player}
            mission={mission}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onAddStars={handleAddStars}
            onAddDiamonds={handleAddDiamonds}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenMission={() => setIsMissionModalOpen(true)}
            onOpenGacha={() => setIsGachaModalOpen(true)}
            onOpenCustomization={() => setIsCustomizationModalOpen(true)}
            onStartAdventure={handleStartAdventure}
            onOpenMascotPlayground={() => setIsMascotPlaygroundOpen(true)}
          />
        )}

        {activeTab === 'peta' && (
          <MapScreen
            player={player}
            worlds={worldsState}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onAddStars={handleAddStars}
            onAddDiamonds={handleAddDiamonds}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onSelectLevel={handleSelectLevel}
            onOpenCollection={() => setIsShapeAlbumOpen(true)}
          />
        )}

        {activeTab === 'prestasi' && (
          <AchievementScreen
            player={player}
            worlds={worldsState}
            onUpdatePlayer={setPlayer}
          />
        )}

        {activeTab === 'materi' && <MaterialScreen />}

        {activeTab === 'profil' && (
          <ProfileScreen
            player={player}
            worlds={worldsState}
            mission={mission}
            onUpdatePlayer={(updated) => setPlayer((prev) => ({ ...prev, ...updated }))}
            onOpenCustomization={() => setIsCustomizationModalOpen(true)}
          />
        )}

        {/* Floating Bottom Navigation Bar */}
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </main>

      {/* --- ALUR KUIS & PERTARUNGAN RPG: Detail Level -> Kuis/Battle -> Hasil --- */}
      <Suspense fallback={null}>
        {quizPhase === 'detail' && (
          <LevelDetailModal
            isOpen
            world={selectedWorld}
            level={selectedLevel}
            onClose={handleQuizQuit}
            onStart={handleStartNodeEncounter}
          />
        )}

        {/* --- GAMEPLAY UTAMA: RPG PLATFORMER LONCAT-LONCAT + BOS KUIS --- */}
        {quizPhase === 'rpg_game' && selectedLevel && (
          <RPGGameScreen
            levelNum={selectedLevel.num}
            player={player}
            onFinishLevel={handleRPGLevelComplete}
            onUpdatePlayer={setPlayer}
            onQuit={() => {
              LocalDB.clearActiveSession();
              setQuizPhase('none');
              setSelectedLevel(null);
              setSelectedWorld(null);
            }}
          />
        )}

        {/* MODE PERTARUNGAN RPG TURN-BASED MELAWAN MONSTER GEOMETRI */}
        {quizPhase === 'battle' && selectedLevel && (
          <BattleScreen
            monster={getMonsterForLevel(selectedLevel.num)}
            player={player}
            questions={getQuestionsForLevel(selectedLevel.num)}
            onVictory={handleBattleVictory}
            onDefeat={handleBattleDefeat}
            onQuit={handleQuizQuit}
            onUseFiftyFifty={handleUseFiftyFifty}
            onUseHint={handleUseHint}
            onConsumeItem={handleConsumeBattleItem}
          />
        )}
      </Suspense>

      {quizPhase === 'result' && lastResult && selectedLevel && (
        <ResultScreen
          result={lastResult}
          levelTitle={`Level ${selectedLevel.num} — ${selectedWorld?.name ?? ''}`}
          onContinue={handleQuizContinue}
          onRetry={handleStartNodeEncounter}
        />
      )}

      {/* --- MODAL: Mulai Petualangan --- */}
      <GameModal
        isOpen={isPlayModalOpen}
        title="🎮 Mulai Petualangan!"
        onClose={() => setIsPlayModalOpen(false)}
        footerActionLabel="Buka Peta Petualangan 🚀"
        onFooterAction={handleStartLevel}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <img
            src="/assets/mascot_triangle.png"
            alt="Petualang Segitiga"
            style={{
              width: '85px',
              height: 'auto',
              marginBottom: '10px',
              filter: 'drop-shadow(0 8px 14px rgba(15, 23, 42, 0.2))',
            }}
          />
          <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--font-game-title)', color: '#0f172a' }}>
            Siap Menjelajah Dunia Geometri?
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
            Temani si <strong>Kuning Segitiga</strong> menaklukkan tantangan dan mengumpulkan semua bintang di Lembah Geometri!
          </p>
        </div>
      </GameModal>

      {/* --- MODAL: Kenali Bangun Datar --- */}
      <GameModal
        isOpen={isShapesModalOpen}
        title="🔺 Kenali Bangun Datar"
        onClose={() => setIsShapesModalOpen(false)}
        footerActionLabel="Pelajari Selengkapnya 📖"
        onFooterAction={() => {
          setIsShapesModalOpen(false);
          setActiveTab('materi');
        }}
      >
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
          Sentuh bentuk untuk memahami karakteristik utamanya:
        </p>
        <div className="shape-grid">
          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <polygon points="50,15 90,85 10,85" fill="#facc15" stroke="#ca8a04" strokeWidth="6" />
            </svg>
            <span className="shape-name">Segitiga</span>
            <span className="shape-desc">3 sisi & 3 sudut</span>
          </div>

          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect x="15" y="15" width="70" height="70" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
            </svg>
            <span className="shape-name">Persegi</span>
            <span className="shape-desc">4 sisi sama panjang</span>
          </div>

          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="#f87171" stroke="#dc2626" strokeWidth="6" />
            </svg>
            <span className="shape-name">Lingkaran</span>
            <span className="shape-desc">1 sisi lengkung, tanpa sudut</span>
          </div>

          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect x="10" y="25" width="80" height="50" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="6" />
            </svg>
            <span className="shape-name">Persegi Panjang</span>
            <span className="shape-desc">2 pasang sisi sejajar</span>
          </div>
        </div>
      </GameModal>

      {/* --- MODAL: Misi Hari Ini Dinamis --- */}
      <GameModal
        isOpen={isMissionModalOpen}
        title="📋 Misi Hari Ini"
        onClose={() => setIsMissionModalOpen(false)}
        footerActionLabel={
          mission.isCompleted
            ? 'Tutup'
            : mission.current >= mission.target
            ? `🎁 Klaim Hadiah (+${mission.rewardDiamonds} 💎)`
            : 'Mainkan Level di Peta 🗺️'
        }
        onFooterAction={() => {
          if (mission.isCompleted) {
            setIsMissionModalOpen(false);
          } else if (mission.current >= mission.target) {
            setPlayer((p) => ({ ...p, diamonds: p.diamonds + mission.rewardDiamonds }));
            setMission((m) => ({ ...m, isCompleted: true }));
          } else {
            setIsMissionModalOpen(false);
            setActiveTab('peta');
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              background: mission.isCompleted ? '#f0fdf4' : '#f8fafc',
              padding: '14px',
              borderRadius: '16px',
              border: mission.isCompleted ? '1.5px solid #86efac' : '1.5px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(15, 35, 75, 0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, color: '#0f172a', fontFamily: 'var(--font-game-title)', fontSize: '15px' }}>
                {mission.title}
              </h4>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-game-title)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: mission.isCompleted ? '#dcfce7' : mission.current >= mission.target ? '#fef08a' : '#e0f2fe',
                  color: mission.isCompleted ? '#166534' : mission.current >= mission.target ? '#854d0e' : '#0369a1',
                  border: mission.isCompleted ? '1px solid #86efac' : mission.current >= mission.target ? '1px solid #facc15' : '1px solid #bae6fd',
                }}
              >
                {mission.isCompleted ? '✓ Selesai & Diklaim' : mission.current >= mission.target ? 'Siap Diklaim!' : 'Sedang Berjalan'}
              </span>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
              {mission.description}
            </p>

            {/* Visual Progress Bar Misi */}
            <div style={{ width: '100%', height: '9px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.round((mission.current / mission.target) * 100))}%`,
                  height: '100%',
                  background: mission.isCompleted
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                    : 'linear-gradient(90deg, #38bdf8, #0284c7)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
                Progres: {mission.current} dari {mission.target} Level Sempurna
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={14} /> +{mission.rewardDiamonds} Permata
              </span>
            </div>
          </div>

          {/* Keterangan Status Edukatif */}
          <div style={{ textAlign: 'center', padding: '0 4px' }}>
            {mission.isCompleted ? (
              <p style={{ margin: 0, fontSize: '11.5px', color: '#16a34a', fontWeight: 700 }}>
                🎉 Kamu sudah mengklaim hadiah misi hari ini. Misi baru akan diperbarui besok hari!
              </p>
            ) : mission.current >= mission.target ? (
              <p style={{ margin: 0, fontSize: '11.5px', color: '#b45309', fontWeight: 700 }}>
                ✨ Kerja bagus! 3 level sempurna telah tercapai. Klik tombol di bawah untuk mengklaim permata!
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b' }}>
                💡 Selesaikan {mission.target - mission.current} level lagi dengan nilai sempurna (3 bintang) untuk membuka hadiah permata!
              </p>
            )}
          </div>
        </div>
      </GameModal>

      {/* --- MODAL: Pengaturan --- */}
      <GameModal
        isOpen={isSettingsModalOpen}
        title="⚙️ Pengaturan"
        onClose={() => setIsSettingsModalOpen(false)}
        footerActionLabel="Simpan"
        onFooterAction={() => setIsSettingsModalOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {soundEnabled ? <Volume2 size={18} color="#0284c7" /> : <VolumeX size={18} color="#94a3b8" />}
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Suara & Musik Game</span>
            </div>
            <button
              style={{
                background: soundEnabled ? '#22c55e' : '#cbd5e1',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <Shield size={16} color="#0284c7" />
            <span>Mode Aman Anak & Edukasi Aktif</span>
            <Check size={16} color="#16a34a" style={{ marginLeft: 'auto' }} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <Database size={16} color="#0284c7" />
            <span>Database Lokal: Terhubung Aktif (100% Offline)</span>
            <Check size={16} color="#16a34a" style={{ marginLeft: 'auto' }} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <Info size={16} color="#0284c7" />
            <span>Versi Game: 1.0.0 (Capacitor Mobile)</span>
          </div>

          <button
            onClick={handleResetGameData}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Data Petualangan</span>
          </button>
        </div>
      </GameModal>

      {/* --- MODAL: Profil & Kustomisasi Siswa --- */}
      <GameModal
        isOpen={isProfileModalOpen}
        title="🎒 Profil Petualang Siswa"
        onClose={() => setIsProfileModalOpen(false)}
        footerActionLabel="Buka Profil Lengkap"
        onFooterAction={() => {
          setIsProfileModalOpen(false);
          setActiveTab('profil');
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          {/* Avatar Preview */}
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              border: '3.5px solid #38bdf8',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #a5f3fc, #38bdf8)',
              boxShadow: '0 6px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            <AvatarRenderer avatarId={player.avatarId} />
          </div>

          {/* Pilih Karakter Avatar */}
          <div style={{ width: '100%', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
              Pilih Karakter Siswa (Termasuk Avatar Khusus Gacha):
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {(['boy', 'girl', 'adventurer', 'scientist', 'wizard', 'princess'] as AvatarKey[]).map((avId) => {
                const isUnlocked =
                  avId === 'boy' ||
                  avId === 'girl' ||
                  avId === 'adventurer' ||
                  avId === 'scientist' ||
                  (player.inventory?.unlockedAvatars || []).includes(avId);

                const isSelected = (player.avatarId || 'boy') === avId;

                return (
                  <button
                    key={avId}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        setPlayer((p) => ({ ...p, avatarId: avId }));
                      }
                    }}
                    title={
                      isUnlocked
                        ? `Pilih Avatar ${avId}`
                        : `Terkunci! Dapatkan avatar ${avId === 'wizard' ? 'Penyihir' : 'Putri'} dari Peti Gacha Permata!`
                    }
                    style={{
                      position: 'relative',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: isSelected
                        ? '3px solid #0284c7'
                        : isUnlocked
                        ? '2px solid #bae6fd'
                        : '2px dashed #cbd5e1',
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 0.15s ease',
                      background: isUnlocked ? '#f8fafc' : '#f1f5f9',
                      padding: '2px',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.45,
                      boxShadow: isSelected ? '0 4px 10px rgba(2, 132, 199, 0.35)' : 'none',
                    }}
                  >
                    <AvatarRenderer avatarId={avId} />
                    {!isUnlocked && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          fontSize: '11px',
                          background: '#475569',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        🔒
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ubah Nama Siswa Dinamis */}
          <div style={{ width: '100%' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f2942', display: 'block', marginBottom: '4px' }}>
              Nama Siswa Petualang:
            </label>
            <input
              type="text"
              value={player.name}
              onChange={(e) => setPlayer((p) => ({ ...p, name: e.target.value || 'Siswa' }))}
              maxLength={15}
              placeholder="Ketik nama siswa..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '2px solid #bae6fd',
                fontSize: '14px',
                fontFamily: 'var(--font-game-title)',
                fontWeight: 700,
                color: '#0f2942',
                outline: 'none',
                background: '#f0f9ff',
              }}
            />
          </div>

          {/* Statistik Kemajuan Level & EXP */}
          <div
            style={{
              width: '100%',
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '10px 14px',
              border: '1.5px solid #e2e8f0',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
              <span style={{ color: '#0284c7' }}>Level {player.level}</span>
              <span style={{ color: '#16a34a' }}>{player.currentExp} / {player.maxExp} EXP</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.round((player.currentExp / player.maxExp) * 100))}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
      </GameModal>

      {/* --- MODAL: Bintang Petualangan Dinamis --- */}
      <GameModal
        isOpen={isStarModalOpen}
        title="⭐ Bintang Petualangan"
        onClose={() => setIsStarModalOpen(false)}
        footerActionLabel="Tutup"
        onFooterAction={() => setIsStarModalOpen(false)}
      >
        <div style={{ textAlign: 'center', padding: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
          >
            <Star size={36} fill="#facc15" color="#ca8a04" />
          </div>
          <h3 style={{ margin: '0', fontFamily: 'var(--font-game-title)', fontSize: '26px', color: '#b45309' }}>
            {player.stars} Bintang
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0', lineHeight: 1.4 }}>
            Kumpulkan bintang emas dengan menyelesaikan kuis bangun datar dengan nilai sempurna di setiap pulau!
          </p>

          {isStarClaimedToday ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <button
                disabled
                style={{
                  background: '#f1f5f9',
                  color: '#94a3b8',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontFamily: 'var(--font-game-title)',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'not-allowed',
                }}
              >
                ✓ Hadiah Hari Ini Sudah Diklaim
              </button>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                ⏳ Hadiah bintang harian akan di-reset besok hari!
              </span>
            </div>
          ) : (
            <button
              onClick={() => handleClaimStarsBonus(20)}
              style={{
                marginTop: '4px',
                background: 'linear-gradient(180deg, #facc15, #f59e0b)',
                color: '#78350f',
                border: '2px solid #ffffff',
                borderRadius: '9999px',
                padding: '10px 22px',
                fontFamily: 'var(--font-game-title)',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              🎁 Klaim Hadiah Harian +20 ⭐
            </button>
          )}
        </div>
      </GameModal>

      {/* --- MODAL: Permata Ajaib Dinamis --- */}
      <GameModal
        isOpen={isDiamondModalOpen}
        title="💎 Permata Ajaib"
        onClose={() => setIsDiamondModalOpen(false)}
        footerActionLabel="Tutup"
        onFooterAction={() => setIsDiamondModalOpen(false)}
      >
        <div style={{ textAlign: 'center', padding: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#cffafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Gem size={34} fill="#38bdf8" color="#0284c7" />
          </div>
          <h3 style={{ margin: '0', fontFamily: 'var(--font-game-title)', fontSize: '26px', color: '#0369a1' }}>
            {player.diamonds} Permata
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0', lineHeight: 1.4 }}>
            Permata ajaib digunakan untuk membuka petunjuk kuis saat kesulitan dan membuka lencana prestisius!
          </p>

          {isDiamondClaimedToday ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <button
                disabled
                style={{
                  background: '#f1f5f9',
                  color: '#94a3b8',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontFamily: 'var(--font-game-title)',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'not-allowed',
                }}
              >
                ✓ Hadiah Hari Ini Sudah Diklaim
              </button>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                ⏳ Hadiah permata harian akan di-reset besok hari!
              </span>
            </div>
          ) : (
            <button
              onClick={() => handleClaimDiamondsBonus(10)}
              style={{
                marginTop: '4px',
                background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '9999px',
                padding: '10px 22px',
                fontFamily: 'var(--font-game-title)',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              🎁 Klaim Hadiah Harian +10 💎
            </button>
          )}
        </div>
      </GameModal>

      {/* --- MODAL: Naik Level Dinamis --- */}
      <GameModal
        isOpen={isLevelUpModalOpen}
        title="🎉 NAIK LEVEL!"
        onClose={() => setIsLevelUpModalOpen(false)}
        footerActionLabel="Lanjutkan Petualangan 🚀"
        onFooterAction={() => setIsLevelUpModalOpen(false)}
      >
        <div style={{ textAlign: 'center', padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef08a, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(234, 179, 8, 0.4)',
              animation: 'gentleBob 2s ease-in-out infinite',
            }}
          >
            <Sparkles size={38} color="#78350f" />
          </div>
          <h3 style={{ margin: '0', fontFamily: 'var(--font-game-title)', fontSize: '22px', color: '#0f2942' }}>
            Hore! Kamu Mencapai Level {player.level}!
          </h3>
          <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>
            Kemampuan geometrimu makin hebat! Hadiah bonus kenaikan tingkat:
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '6px' }}>
            <span style={{ background: '#fef3c7', padding: '6px 14px', borderRadius: '9999px', fontWeight: 800, fontSize: '13px', color: '#b45309', border: '1px solid #fde68a' }}>
              ⭐ +50 Bintang
            </span>
            <span style={{ background: '#e0f2fe', padding: '6px 14px', borderRadius: '9999px', fontWeight: 800, fontSize: '13px', color: '#0369a1', border: '1px solid #bae6fd' }}>
              💎 +10 Permata
            </span>
          </div>
        </div>
      </GameModal>

      {/* --- MODAL LAZY LOADED: Gacha, Customization, Adventure & Playground --- */}
      <Suspense fallback={null}>
        {isGachaModalOpen && (
          <GachaModal
            isOpen={isGachaModalOpen}
            onClose={() => setIsGachaModalOpen(false)}
            player={player}
            onUpdatePlayer={setPlayer}
          />
        )}

        {isCustomizationModalOpen && (
          <CustomizationModal
            isOpen={isCustomizationModalOpen}
            onClose={() => setIsCustomizationModalOpen(false)}
            player={player}
            onUpdatePlayer={setPlayer}
          />
        )}

        {isCampfireModalOpen && (
          <CampfireModal
            isOpen={isCampfireModalOpen}
            onClose={() => setIsCampfireModalOpen(false)}
            player={player}
            onRestComplete={handleCampfireRestComplete}
          />
        )}

        {isTangramModalOpen && (
          <TangramPuzzleModal
            isOpen={isTangramModalOpen}
            onClose={() => setIsTangramModalOpen(false)}
            onComplete={handleTangramComplete}
          />
        )}

        {isShapeAlbumOpen && (
          <ShapeAlbumModal
            isOpen={isShapeAlbumOpen}
            onClose={() => setIsShapeAlbumOpen(false)}
            collectedCardIds={player.inventory?.collectedCards || []}
            onClaimReward={(bonusStars, bonusGems) => {
              setPlayer((p) => ({
                ...p,
                stars: p.stars + bonusStars,
                diamonds: p.diamonds + bonusGems,
              }));
            }}
          />
        )}

        {isMascotPlaygroundOpen && (
          <MascotPlaygroundModal
            isOpen={isMascotPlaygroundOpen}
            onClose={() => setIsMascotPlaygroundOpen(false)}
            onRewardCollected={(stars) => {
              setPlayer((p) => ({
                ...p,
                stars: p.stars + stars,
              }));
            }}
          />
        )}
      </Suspense>
    </div>
  );
}