import React, { useEffect, useRef, useState } from 'react';
import { Star, Gem, Settings } from 'lucide-react';
import type { PlayerProfile } from '../../types/game';
import { AvatarRenderer } from '../Common/AvatarRenderer';
import './TopHeader.css';

interface TopHeaderProps {
  player: PlayerProfile;
  onOpenProfile: () => void;
  onAddStars: () => void;
  onAddDiamonds: () => void;
  onOpenSettings: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  player,
  onOpenProfile,
  onAddStars,
  onAddDiamonds,
  onOpenSettings,
}) => {
  const expPercentage = Math.min(100, Math.round((player.currentExp / player.maxExp) * 100));

  // Animasi peningkatan dinamis untuk koin & permata
  const prevStars = useRef(player.stars);
  const prevDiamonds = useRef(player.diamonds);
  const [starDiff, setStarDiff] = useState<number | null>(null);
  const [diamondDiff, setDiamondDiff] = useState<number | null>(null);
  const [starBouncing, setStarBouncing] = useState(false);
  const [diamondBouncing, setDiamondBouncing] = useState(false);

  useEffect(() => {
    const diff = player.stars - prevStars.current;
    prevStars.current = player.stars; // selalu sinkron agar diff tidak menumpuk
    if (diff > 0) {
      setStarDiff(diff);
      setStarBouncing(true);
      const timer = setTimeout(() => {
        setStarDiff(null);
        setStarBouncing(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [player.stars]);

  useEffect(() => {
    const diff = player.diamonds - prevDiamonds.current;
    prevDiamonds.current = player.diamonds; // selalu sinkron agar diff tidak menumpuk
    if (diff > 0) {
      setDiamondDiff(diff);
      setDiamondBouncing(true);
      const timer = setTimeout(() => {
        setDiamondDiff(null);
        setDiamondBouncing(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [player.diamonds]);

  return (
    <header className="top-header">
      {/* Player Profile Badge */}
      <div 
        className="player-badge"
        onClick={onOpenProfile}
        title="Lihat & Ubah Profil Siswa"
        role="button"
        tabIndex={0}
      >
        <div className="player-avatar-wrapper">
          <AvatarRenderer avatarId={player.avatarId} />
        </div>

        <div className="player-info">
          <span className="player-role">{player.role}</span>
          <span className="player-name">{player.name}</span>
          <div className="player-exp-container" title={`${player.currentExp} / ${player.maxExp} EXP`}>
            <div 
              className="player-exp-fill" 
              style={{ width: `${expPercentage}%` }}
            />
          </div>
          <span className="player-level-text">Level {player.level}</span>
        </div>
      </div>

      {/* Right Stats & Settings */}
      <div className="header-right">
        {/* Star Counter */}
        <div 
          className={`currency-pill ${starBouncing ? 'pulse-bounce' : ''}`} 
          onClick={onAddStars}
          title="Bintang Petualangan — Klik untuk Klaim Bonus!"
          role="button"
          tabIndex={0}
        >
          <div className="currency-icon">
            <Star size={16} fill="#facc15" color="#ca8a04" strokeWidth={1.5} />
          </div>
          <span className="currency-value">{player.stars}</span>
          <button 
            className="currency-add-btn" 
            aria-label="Tambah Bintang"
            onClick={(e) => {
              e.stopPropagation();
              onAddStars();
            }}
          >
            +
          </button>

          {/* Floating Particle Animasi Penambahan Bintang */}
          {starDiff !== null && (
            <div className="currency-floating-tag star-tag">
              +{starDiff} ⭐
            </div>
          )}
        </div>

        {/* Diamond Counter */}
        <div 
          className={`currency-pill ${diamondBouncing ? 'pulse-bounce' : ''}`} 
          onClick={onAddDiamonds}
          title="Permata Petualangan — Klik untuk Klaim Bonus!"
          role="button"
          tabIndex={0}
        >
          <div className="currency-icon">
            <Gem size={15} fill="#38bdf8" color="#0284c7" strokeWidth={1.5} />
          </div>
          <span className="currency-value">{player.diamonds}</span>
          <button 
            className="currency-add-btn" 
            aria-label="Tambah Permata"
            onClick={(e) => {
              e.stopPropagation();
              onAddDiamonds();
            }}
          >
            +
          </button>

          {/* Floating Particle Animasi Penambahan Permata */}
          {diamondDiff !== null && (
            <div className="currency-floating-tag gem-tag">
              +{diamondDiff} 💎
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button 
          className="settings-btn" 
          onClick={onOpenSettings} 
          aria-label="Pengaturan Game"
          title="Pengaturan Game"
        >
          <Settings size={18} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
};
