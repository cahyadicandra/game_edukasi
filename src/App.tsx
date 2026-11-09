import { useState, useEffect, lazy, Suspense } from 'react';
import type { PlayerProfile, DailyMission, NavTabId } from './types/game';
import { initialPlayer, initialMission } from './data/mockData';
import { worlds as initialWorlds, type WorldData, type LevelNodeData } from './data/worlds';
import { getQuestionsForLevel, computeResult, type LevelResult } from './data/questions';
import { HomeScreen } from './components/Screens/HomeScreen';
import { MapScreen } from './components/Screens/MapScreen';
import { ProfileScreen, type ProfileSubTab } from './components/Screens/ProfileScreen';
import { WorkshopScreen, type WorkshopSubTab } from './components/Screens/WorkshopScreen';
import { BottomNavbar } from './components/Navigation/BottomNavbar';
import {
  ProfileModal,
  PlayIntroModal,
  ShapesGuideModal,
  DailyMissionModal,
  DailyStarModal,
  DailyDiamondModal,
  LevelUpCelebrationModal,
  GameSettingsModal,
} from './components/Modals';
import { ResultScreen } from './components/Quiz/ResultScreen';
import { getMonsterForLevel } from './data/monsters';
import { LocalDB } from './services/localDatabase';
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
  const [workshopSubTab, setWorkshopSubTab] = useState<WorkshopSubTab>('weapon');
  const [profileSubTab, setProfileSubTab] = useState<ProfileSubTab>('profile');

  const handleOpenCustomization = () => {
    setWorkshopSubTab('weapon');
    setActiveTab('bengkel');
  };

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
            onStartAdventure={handleStartAdventure}
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

        {activeTab === 'bengkel' && (
          <WorkshopScreen
            player={player}
            onUpdatePlayer={setPlayer}
            initialSubTab={workshopSubTab}
            onSubTabChange={setWorkshopSubTab}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileScreen
            player={player}
            worlds={worldsState}
            mission={mission}
            onUpdatePlayer={(updated) => setPlayer((prev) => ({ ...prev, ...updated }))}
            onSetPlayerFull={setPlayer}
            onOpenCustomization={handleOpenCustomization}
            initialSubTab={profileSubTab}
            onSubTabChange={setProfileSubTab}
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

      {/* --- POPUP MODALS UTAMA (TERMODULARISASI) --- */}
      <PlayIntroModal
        isOpen={isPlayModalOpen}
        onClose={() => setIsPlayModalOpen(false)}
        onStart={handleStartLevel}
      />

      <ShapesGuideModal
        isOpen={isShapesModalOpen}
        onClose={() => setIsShapesModalOpen(false)}
        onLearnMore={() => {
          setIsShapesModalOpen(false);
          setProfileSubTab('materials');
          setActiveTab('profil');
        }}
      />

      <DailyMissionModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        mission={mission}
        onClaimReward={() => {
          setPlayer((p) => ({ ...p, diamonds: p.diamonds + mission.rewardDiamonds }));
          setMission((m) => ({ ...m, isCompleted: true }));
        }}
        onGoToMap={() => {
          setIsMissionModalOpen(false);
          setActiveTab('peta');
        }}
      />

      <GameSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onResetGameData={handleResetGameData}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        player={player}
        onUpdatePlayer={setPlayer}
        onOpenFullProfile={() => {
          setIsProfileModalOpen(false);
          setActiveTab('profil');
        }}
      />

      <DailyStarModal
        isOpen={isStarModalOpen}
        onClose={() => setIsStarModalOpen(false)}
        stars={player.stars}
        isClaimedToday={isStarClaimedToday}
        onClaimBonus={handleClaimStarsBonus}
      />

      <DailyDiamondModal
        isOpen={isDiamondModalOpen}
        onClose={() => setIsDiamondModalOpen(false)}
        diamonds={player.diamonds}
        isClaimedToday={isDiamondClaimedToday}
        onClaimBonus={handleClaimDiamondsBonus}
      />

      <LevelUpCelebrationModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        level={player.level}
      />

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