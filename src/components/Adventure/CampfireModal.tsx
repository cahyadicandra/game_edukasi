import React, { useState } from 'react';
import { Flame, Heart, Zap, CheckCircle2 } from 'lucide-react';
import type { PlayerProfile } from '../../types/game';
import './CampfireModal.css';

interface CampfireModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onRestComplete: (healedHp: number, healedSp: number) => void;
}

export const CampfireModal: React.FC<CampfireModalProps> = ({
  isOpen,
  onClose,
  player,
  onRestComplete,
}) => {
  const [isRested, setIsRested] = useState(false);

  if (!isOpen) return null;

  const maxHp = player.stats?.maxHp || 100;
  const currentHp = player.stats?.hp || 100;
  const maxSp = player.stats?.maxSp || 50;
  const currentSp = player.stats?.sp || 50;

  const handleRest = () => {
    setIsRested(true);
    setTimeout(() => {
      onRestComplete(maxHp, maxSp);
      onClose();
    }, 1500);
  };

  return (
    <div className="campfire-modal-backdrop" onClick={onClose}>
      <div className="campfire-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="campfire-header">
          <div className="campfire-header-title">
            <Flame size={20} color="#f97316" />
            <h3>Pos Perkemahan Petualang</h3>
          </div>
        </div>

        {/* Visual Api Unggun Hangat */}
        <div className="campfire-visual-stage">
          <div className="campfire-glow" />
          <div className="campfire-wood">🪵🔥🪵</div>
          <p className="campfire-greeting">
            &ldquo;Selamat datang, petualang muda! Hangatkan tubuhmu di sini sebelum menghadapi monster berikutnya.&rdquo;
          </p>
          <span className="campfire-npc">— Kakek Archimedes</span>
        </div>

        {/* Status yang akan dipulihkan */}
        <div className="campfire-status-box">
          <div className="campfire-stat-item">
            <Heart size={18} color="#ef4444" fill="#f87171" />
            <div className="stat-text-col">
              <strong>Kesehatan (HP)</strong>
              <span>
                {currentHp} / {maxHp} {currentHp < maxHp && '-> 100%'}
              </span>
            </div>
          </div>

          <div className="campfire-stat-item">
            <Zap size={18} color="#38bdf8" fill="#38bdf8" />
            <div className="stat-text-col">
              <strong>Stamina Magis (SP)</strong>
              <span>
                {currentSp} / {maxSp} {currentSp < maxSp && '-> 100%'}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Beristirahat */}
        <div className="campfire-actions">
          {!isRested ? (
            <button className="campfire-btn-rest" onClick={handleRest}>
              <Flame size={18} />
              <span>Beristirahat & Pulihkan Diri (+Bonus Bekal 💎)</span>
            </button>
          ) : (
            <div className="campfire-rest-success animate-pop">
              <CheckCircle2 size={20} color="#22c55e" />
              <span>Tubuh & Staminamu Pulih Sepenuhnya! ✨</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
