import React, { useState } from 'react';
import type { PlayerProfile } from '../../types/game';
import { getRPGLevelConfig, type RPGLevelConfig } from '../../data/rpgLevelConfigs';
import { getMonsterForLevel, type GeometryMonster } from '../../data/monsters';
import { getQuestionsForLevel, type QuizQuestion } from '../../data/questions';
import { RPGPlatformerEngine } from './RPGPlatformerEngine';
import { RPGBossBattleView } from './RPGBossBattleView';
import { RPGLevelResultModal } from './RPGLevelResultModal';
import { QuizScreen } from '../Quiz/QuizScreen';

export interface RPGGameScreenProps {
  levelNum: number;
  player: PlayerProfile;
  onFinishLevel: (awardedStars: number, earnedCoins: number, earnedExp: number) => void;
  onQuit: () => void;
  onUpdatePlayer?: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

type RPGStagePhase = 'platformer' | 'boss_battle' | 'regular_quiz' | 'result';

export const RPGGameScreen: React.FC<RPGGameScreenProps> = ({
  levelNum,
  player,
  onFinishLevel,
  onQuit,
  onUpdatePlayer,
}) => {
  const [phase, setPhase] = useState<RPGStagePhase>('platformer');

  // Konfigurasi Level & Data Terkait
  const levelConfig: RPGLevelConfig = getRPGLevelConfig(levelNum);
  const boss: GeometryMonster = getMonsterForLevel(levelNum);
  const questions: QuizQuestion[] = getQuestionsForLevel(levelNum);

  // Hasil Permainan
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [timeSec, setTimeSec] = useState(0);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | undefined>(undefined);

  // Konsumsi bekal item RPG saat melawan bos / kuis (Ramuan HP, Tiket Rumus, Tiket 50:50)
  const handleConsumeItem = (itemType: 'potion' | 'hint' | 'fiftyFifty') => {
    if (!onUpdatePlayer) return;
    onUpdatePlayer((prev) => {
      const inv = prev.inventory || {
        hintTickets: 2,
        fiftyFiftyTickets: 1,
        collectedCards: [],
        unlockedAvatars: [],
        unlockedAccessories: [],
        potions: 2,
      };

      if (itemType === 'potion') {
        return {
          ...prev,
          inventory: {
            ...inv,
            potions: Math.max(0, (inv.potions ?? 2) - 1),
          },
        };
      }
      if (itemType === 'hint') {
        return {
          ...prev,
          inventory: {
            ...inv,
            hintTickets: Math.max(0, (inv.hintTickets ?? 2) - 1),
          },
        };
      }
      if (itemType === 'fiftyFifty') {
        return {
          ...prev,
          inventory: {
            ...inv,
            fiftyFiftyTickets: Math.max(0, (inv.fiftyFiftyTickets ?? 1) - 1),
          },
        };
      }
      return prev;
    });
  };

  // Callback ketika maskot mencapai gerbang di ujung lintasan platformer
  const handleReachBoss = (stats: { coins: number; timeSec: number; heartsRemaining: number }) => {
    setCoinsCollected(stats.coins);
    setTimeSec(stats.timeSec);

    // Jika level bos (Level 5, 10, 15, 20, 25) -> masuk arena pertarungan bos RPG
    // Jika level reguler (Level 1-4, 6-9, 11-14, 16-19, 21-24) -> masuk kuis konsep tanpa bos
    if (levelConfig.isBossLevel) {
      setPhase('boss_battle');
    } else {
      setPhase('regular_quiz');
    }
  };

  // Callback ketika pemain berhasil mengalahkan bos melalui kuis pertarungan
  const handleBossVictory = () => {
    setBossDefeated(true);
    setPhase('result');
  };

  // Callback ketika pemain kehabisan HP saat melawan bos
  const handleBossDefeat = () => {
    setBossDefeated(false);
    setPhase('result');
  };

  // Callback ketika pemain menyelesaikan kuis reguler (tanpa bos)
  const handleRegularQuizFinish = (correctCount: number) => {
    const passed = correctCount >= 1; // Lulus level jika minimal 1 soal dijawab benar
    setBossDefeated(passed);
    setQuizScore({ correct: correctCount, total: questions.length });
    setPhase('result');
  };

  // Ulangi Level dari awal
  const handleRetry = () => {
    setCoinsCollected(0);
    setTimeSec(0);
    setBossDefeated(false);
    setQuizScore(undefined);
    setPhase('platformer');
  };

  return (
    <div className="rpg-game-screen-root" style={{ width: '100%', height: '100%' }}>
      {/* 1. TAHAP PLATFORMER: LONCAT-LONCAT & KOLEKSI KOIN + BANGUN DATAR */}
      {phase === 'platformer' && (
        <RPGPlatformerEngine
          levelConfig={levelConfig}
          boss={boss}
          player={player}
          onReachBoss={handleReachBoss}
          onQuit={onQuit}
        />
      )}

      {/* 2A. TAHAP PERTARUNGAN BOS RPG (HANYA LEVEL 5, 10, 15, 20, 25) */}
      {phase === 'boss_battle' && (
        <RPGBossBattleView
          boss={boss}
          questions={questions}
          player={player}
          onVictory={handleBossVictory}
          onDefeat={handleBossDefeat}
          onConsumeItem={handleConsumeItem}
        />
      )}

      {/* 2B. TAHAP KUIS REGULER TANPA BOS (LEVEL 1-4, 6-9, 11-14, 16-19, 21-24) */}
      {phase === 'regular_quiz' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0f172a' }}>
          <QuizScreen
            questions={questions}
            levelTitle={`${levelConfig.title} — ${levelConfig.worldName}`}
            onFinish={handleRegularQuizFinish}
            onQuit={() => setPhase('platformer')}
            inventory={player.inventory}
            diamonds={player.diamonds}
            onUseFiftyFifty={() => {
              if ((player.inventory?.fiftyFiftyTickets || 0) > 0) {
                handleConsumeItem('fiftyFifty');
                return true;
              }
              return false;
            }}
            onUseHint={() => {
              if ((player.inventory?.hintTickets || 0) > 0) {
                handleConsumeItem('hint');
                return true;
              }
              return false;
            }}
          />
        </div>
      )}

      {/* 3. TAHAP EVALUASI 3 BINTANG & RINGKASAN HASIL */}
      {phase === 'result' && (
        <RPGLevelResultModal
          levelConfig={levelConfig}
          boss={boss}
          coinsCollected={coinsCollected}
          timeSec={timeSec}
          bossDefeated={bossDefeated}
          quizScore={quizScore}
          onContinue={onFinishLevel}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};
