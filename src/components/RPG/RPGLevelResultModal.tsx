import React from 'react';
import { Star, Trophy, Coins, Check, X, RotateCcw, ArrowRight, Skull } from 'lucide-react';
import type { RPGLevelConfig } from '../../data/rpgLevelConfigs';
import type { GeometryMonster } from '../../data/monsters';
import './RPGLevelResultModal.css';

export interface RPGLevelResultModalProps {
  levelConfig: RPGLevelConfig;
  boss: GeometryMonster;
  coinsCollected: number;
  timeSec: number;
  bossDefeated: boolean;
  onContinue: (awardedStars: number, earnedCoins: number, earnedExp: number) => void;
  onRetry: () => void;
}

export const RPGLevelResultModal: React.FC<RPGLevelResultModalProps> = ({
  levelConfig,
  boss,
  coinsCollected,
  timeSec,
  bossDefeated,
  onContinue,
  onRetry,
}) => {
  // Evaluasi Bintang 1, 2, 3: Bintang HANYA bisa diperoleh jika Bos Berhasil Dikalahkan!
  const star1 = bossDefeated;
  const star2 = bossDefeated && coinsCollected >= levelConfig.targetCoins;
  const star3 = bossDefeated && timeSec <= levelConfig.targetTimeSec;

  const totalStars = bossDefeated ? (star1 ? 1 : 0) + (star2 ? 1 : 0) + (star3 ? 1 : 0) : 0;

  // Perhitungan Hadiah
  const earnedCoins = bossDefeated
    ? coinsCollected + boss.dropReward.coins
    : Math.floor(coinsCollected / 2);
  const earnedExp = bossDefeated ? boss.dropReward.exp : 15;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rpg-result-modal-overlay">
      <div className={`rpg-result-card ${!bossDefeated ? 'result-card-defeat' : ''}`}>
        {/* Lencana Tropi / Banner Atas */}
        <div className="result-trophy-banner">
          {bossDefeated ? (
            <Trophy size={42} className="trophy-gold-icon" />
          ) : (
            <Skull size={42} className="trophy-gold-icon" style={{ color: '#ef4444' }} />
          )}
          <h2 className="result-main-title" style={{ color: bossDefeated ? '#facc15' : '#f87171' }}>
            {bossDefeated ? 'LEVEL SELESAI!' : 'KAMU KALAH DARI BOS! 💀'}
          </h2>
          <p className="result-level-subtitle">
            {bossDefeated
              ? `${levelConfig.title} — ${levelConfig.worldName}`
              : `HP Pemain habis diserang ${boss.name}. Coba lagi untuk mengalahkannya!`}
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
          {/* Syarat 1: Capai Garis Akhir */}
          <div className={`criteria-item ${star1 ? 'success' : 'failed'}`}>
            <div className="criteria-icon-box">
              {star1 ? <Check size={18} /> : <X size={18} />}
            </div>
            <div className="criteria-text">
              <span className="criteria-title">Kalahkan Bos {boss.name}</span>
              <span className="criteria-sub">{bossDefeated ? 'Bos Berhasil Dikalahkan! ⚔️' : 'Bos Belum Terkalahkan 💀'}</span>
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

          {/* Syarat 3: Batas Waktu */}
          <div className={`criteria-item ${star3 ? 'success' : 'failed'}`}>
            <div className="criteria-icon-box">
              {star3 ? <Check size={18} /> : <X size={18} />}
            </div>
            <div className="criteria-text">
              <span className="criteria-title">Selesai dalam {formatTime(levelConfig.targetTimeSec)}</span>
              <span className="criteria-sub">Waktumu: {formatTime(timeSec)}</span>
            </div>
            <Star size={18} className={`criteria-star ${star3 ? 'active' : ''}`} />
          </div>
        </div>

        {/* Ringkasan Hadiah EXP & Koin */}
        <div className="result-rewards-summary">
          <div className="reward-pill">
            <Coins size={18} className="reward-coin" />
            <span>+{earnedCoins} Koin</span>
          </div>
          <div className="reward-pill">
            <span className="reward-xp-badge">EXP</span>
            <span>+{earnedExp} XP</span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="result-actions-row">
          <button
            type="button"
            className="result-btn btn-retry"
            onClick={onRetry}
          >
            <RotateCcw size={18} />
            <span>Ulangi</span>
          </button>

          <button
            type="button"
            className="result-btn btn-next"
            onClick={() => onContinue(totalStars, earnedCoins, earnedExp)}
          >
            <span>Lanjut ke Peta</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
