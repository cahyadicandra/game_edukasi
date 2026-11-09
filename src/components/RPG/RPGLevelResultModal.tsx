import React from 'react';
import { Star, Trophy, Coins, Check, X, RotateCcw, ArrowRight, Skull, BookOpen } from 'lucide-react';
import type { RPGLevelConfig } from '../../data/rpgLevelConfigs';
import type { GeometryMonster } from '../../data/monsters';
import './RPGLevelResultModal.css';

export interface RPGLevelResultModalProps {
  levelConfig: RPGLevelConfig;
  boss: GeometryMonster;
  coinsCollected: number;
  timeSec: number;
  bossDefeated: boolean;
  quizScore?: { correct: number; total: number };
  onContinue: (awardedStars: number, earnedCoins: number, earnedExp: number) => void;
  onRetry: () => void;
}

export const RPGLevelResultModal: React.FC<RPGLevelResultModalProps> = ({
  levelConfig,
  boss,
  coinsCollected,
  timeSec,
  bossDefeated,
  quizScore,
  onContinue,
  onRetry,
}) => {
  const isBoss = levelConfig.isBossLevel ?? (levelConfig.levelNum % 5 === 0);
  const isVictory = isBoss ? bossDefeated : (quizScore ? quizScore.correct >= 1 : bossDefeated);

  // Evaluasi Bintang 1, 2, 3:
  const star1 = isVictory;
  const star2 = isVictory && coinsCollected >= levelConfig.targetCoins;
  const star3 = isVictory && timeSec <= levelConfig.targetTimeSec;

  const totalStars = isVictory ? (star1 ? 1 : 0) + (star2 ? 1 : 0) + (star3 ? 1 : 0) : 0;

  // Perhitungan Hadiah
  const baseRewardCoins = isBoss ? boss.dropReward.coins : 15;
  const earnedCoins = isVictory
    ? coinsCollected + baseRewardCoins
    : Math.floor(coinsCollected / 2);
  const earnedExp = isVictory
    ? (isBoss ? boss.dropReward.exp : 30)
    : 15;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rpg-result-modal-overlay">
      <div className={`rpg-result-card ${!isVictory ? 'result-card-defeat' : ''}`}>
        {/* Lencana Tropi / Banner Atas */}
        <div className="result-trophy-banner">
          {isVictory ? (
            <Trophy size={42} className="trophy-gold-icon" />
          ) : isBoss ? (
            <Skull size={42} className="trophy-gold-icon" style={{ color: '#ef4444' }} />
          ) : (
            <BookOpen size={42} className="trophy-gold-icon" style={{ color: '#ef4444' }} />
          )}
          <h2 className="result-main-title" style={{ color: isVictory ? '#facc15' : '#f87171' }}>
            {isVictory
              ? isBoss
                ? 'BOS PULAU TERKALAHKAN! 👑'
                : 'LEVEL SELESAI! 🎉'
              : isBoss
              ? 'KAMU KALAH DARI BOS! 💀'
              : 'BELUM BERHASIL! 📚'}
          </h2>
          <p className="result-level-subtitle">
            {isVictory
              ? `${levelConfig.title} — ${levelConfig.worldName}`
              : isBoss
              ? `HP Pemain habis diserang ${boss.name}. Coba lagi untuk mengalahkannya!`
              : 'Belum berhasil menyelesaikan kuis. Coba lagi dengan lebih teliti!'}
          </p>
        </div>

        {/* 3 Bintang Bersinar */}
        <div className="result-stars-row">
          <div className={`result-star-wrap ${star1 ? 'earned' : 'locked'}`}>
            <Star size={44} className="star-icon s1" />
          </div>
          <div className={`result-star-wrap big ${star2 ? 'earned' : 'locked'}`}>
            <Star size={54} className="star-icon s2" />
          </div>
          <div className={`result-star-wrap ${star3 ? 'earned' : 'locked'}`}>
            <Star size={44} className="star-icon s3" />
          </div>
        </div>

        {/* Evaluasi Syarat 3 Bintang */}
        <div className="star-criteria-list">
          {/* Syarat 1: Capai Garis Akhir & Kuis/Bos */}
          <div className={`criteria-item ${star1 ? 'success' : 'failed'}`}>
            <div className="criteria-icon-box">
              {star1 ? <Check size={18} /> : <X size={18} />}
            </div>
            <div className="criteria-text">
              <span className="criteria-title">
                {isBoss ? `Kalahkan Bos ${boss.name}` : 'Selesaikan Kuis Konsep'}
              </span>
              <span className="criteria-sub">
                {isBoss
                  ? bossDefeated
                    ? 'Bos Berhasil Dikalahkan! ⚔️'
                    : 'Bos Belum Terkalahkan 💀'
                  : quizScore
                  ? `${quizScore.correct} dari ${quizScore.total} soal terjawab benar 🎉`
                  : 'Kuis Berhasil Diselesaikan!'}
              </span>
            </div>
            <Star size={18} className={`criteria-star ${star1 ? 'active' : ''}`} />
          </div>

          {/* Syarat 2: Target Koin */}
          <div className={`criteria-item ${star2 ? 'success' : 'failed'}`}>
            <div className="criteria-icon-box">
              {star2 ? <Check size={18} /> : <X size={18} />}
            </div>
            <div className="criteria-text">
              <span className="criteria-title">Kumpulkan Minimal {levelConfig.targetCoins} Koin</span>
              <span className="criteria-sub">{coinsCollected} / {levelConfig.targetCoins} koin terkumpul</span>
            </div>
            <Star size={18} className={`criteria-star ${star2 ? 'active' : ''}`} />
          </div>

          {/* Syarat 3: Waktu Tempuh */}
          <div className={`criteria-item ${star3 ? 'success' : 'failed'}`}>
            <div className="criteria-icon-box">
              {star3 ? <Check size={18} /> : <X size={18} />}
            </div>
            <div className="criteria-text">
              <span className="criteria-title">Selesai dalam {levelConfig.targetTimeSec} Detik</span>
              <span className="criteria-sub">Waktumu: {formatTime(timeSec)}</span>
            </div>
            <Star size={18} className={`criteria-star ${star3 ? 'active' : ''}`} />
          </div>
        </div>

        {/* Kotak Ringkasan Perolehan Hadiah */}
        <div className="result-rewards-box">
          <div className="reward-chip">
            <Coins size={20} className="reward-coin-icon" />
            <div className="reward-info">
              <span className="reward-label">Total Koin</span>
              <span className="reward-val">+{earnedCoins}</span>
            </div>
          </div>
          <div className="reward-chip">
            <span className="reward-exp-badge">EXP</span>
            <div className="reward-info">
              <span className="reward-label">Pengalaman</span>
              <span className="reward-val">+{earnedExp} XP</span>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="result-actions-row">
          <button className="result-btn btn-retry" onClick={onRetry}>
            <RotateCcw size={18} />
            <span>Coba Lagi</span>
          </button>
          <button
            className={`result-btn btn-continue ${!isVictory ? 'btn-disabled' : ''}`}
            onClick={() => onContinue(totalStars, earnedCoins, earnedExp)}
          >
            <span>Lanjut</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
