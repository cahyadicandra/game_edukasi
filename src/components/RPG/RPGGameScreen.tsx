import React, { useState } from 'react';
import type { PlayerProfile } from '../../types/game';
import { getRPGLevelConfig, type RPGLevelConfig } from '../../data/rpgLevelConfigs';
import { getMonsterForLevel, type GeometryMonster } from '../../data/monsters';
import { getQuestionsForLevel, type QuizQuestion } from '../../data/questions';
import { RPGPlatformerEngine } from './RPGPlatformerEngine';
import { RPGBossBattleView } from './RPGBossBattleView';
import { RPGLevelResultModal } from './RPGLevelResultModal';

export interface RPGGameScreenProps {
  levelNum: number;
  player: PlayerProfile;
  onFinishLevel: (awardedStars: number, earnedCoins: number, earnedExp: number) => void;
  onQuit: () => void;
  onUpdatePlayer?: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

type RPGStagePhase = 'platformer' | 'boss_battle' | 'result';

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

  // Konsumsi bekal item RPG saat melawan bos (Ramuan HP, Tiket Rumus, Tiket 50:50)
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

  // Callback ketika maskot mencapai gerbang bos di ujung platformer
  const handleReachBoss = (stats: { coins: number; timeSec: number; heartsRemaining: number }) => {
    setCoinsCollected(stats.coins);
    setTimeSec(stats.timeSec);
    setPhase('boss_battle'); // Masuk arena pertarungan kuis vs bos!
  };

  // Callback ketika pemain berhasil mengalahkan bos melalui kuis
  const handleBossVictory = () => {
    setBossDefeated(true);
    setPhase('result');
  };

  // Callback ketika pemain kehabisan HP saat melawan bos
  const handleBossDefeat = () => {
    setBossDefeated(false);
    setPhase('result');
  };

  // Ulangi Level dari awal
  const handleRetry = () => {
    setCoinsCollected(0);
    setTimeSec(0);
    setBossDefeated(false);
    setPhase('platformer');
  };

  return (
    <div className="rpg-game-screen-root" style={{ width: '100%', height: '100%' }}>
      {/* 1. TAHAP PLATFORMER: LONCAT-LONCAT & KOLEKSI KOIN */}
      {phase === 'platformer' && (
        <RPGPlatformerEngine
          levelConfig={levelConfig}
          boss={boss}
          player={player}
          onReachBoss={handleReachBoss}
          onQuit={onQuit}
        />
      )}

      {/* 2. TAHAP PERTARUNGAN BOS: KUIS SOAL GEOMETRI */}
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

      {/* 3. TAHAP EVALUASI 3 BINTANG & RINGKASAN HASIL */}
      {phase === 'result' && (
        <RPGLevelResultModal
          levelConfig={levelConfig}
          boss={boss}
          coinsCollected={coinsCollected}
          timeSec={timeSec}
          bossDefeated={bossDefeated}
          onContinue={onFinishLevel}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};
