import React from 'react';
import { Star, Gem, Settings } from 'lucide-react';
import type { PlayerProfile } from '../../types/game';
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

  return (
    <header className="top-header">
      {/* Player Profile Badge */}
      <div 
        className="player-badge"
        onClick={onOpenProfile}
        title="Lihat Profil Siswa"
      >
        <div className="player-avatar-wrapper">
          {/* Avatar SVG/Image matching the school kid character */}
          <svg viewBox="0 0 36 36" className="player-avatar-img">
            {/* Soft background */}
            <circle cx="18" cy="18" r="18" fill="#a5f3fc" />
            {/* Hair back */}
            <path d="M7 16 C7 7, 29 7, 29 16 C29 18, 28 20, 27 21 C27 21, 26 25, 24 26 C22 27, 14 27, 12 26 C10 25, 9 21, 9 21 C8 20, 7 18, 7 16 Z" fill="#1e293b" />
            {/* Face */}
            <circle cx="18" cy="19" r="9" fill="#ffedd5" />
            {/* Hair bangs */}
            <path d="M10 13 C12 9, 24 9, 26 13 C24 12, 21 14, 18 13 C15 14, 12 12, 10 13 Z" fill="#1e293b" />
            {/* Eyes */}
            <circle cx="15" cy="18.5" r="1.3" fill="#0f172a" />
            <circle cx="21" cy="18.5" r="1.3" fill="#0f172a" />
            <circle cx="15.4" cy="18" r="0.4" fill="#ffffff" />
            <circle cx="21.4" cy="18" r="0.4" fill="#ffffff" />
            {/* Smile */}
            <path d="M16 22 Q18 24 20 22" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
            {/* Cheeks */}
            <circle cx="13.5" cy="20.5" r="1" fill="#fca5a5" opacity="0.6" />
            <circle cx="22.5" cy="20.5" r="1" fill="#fca5a5" opacity="0.6" />
            {/* Collar/Shirt */}
            <path d="M13 28 C13 25, 23 25, 23 28 L25 36 L11 36 Z" fill="#0284c7" />
            <path d="M16 27 L18 29 L20 27 Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="player-info">
          <span className="player-role">{player.role}</span>
          <span className="player-name">{player.name}</span>
          <div className="player-exp-container">
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
          className="currency-pill" 
          onClick={onAddStars}
          title="Bintang Petualangan"
        >
          <div className="currency-icon">
            <Star size={16} fill="#facc15" color="#ca8a04" strokeWidth={1.5} />
          </div>
          <span className="currency-value">{player.stars}</span>
          <button className="currency-add-btn" aria-label="Tambah Bintang">+</button>
        </div>

        {/* Diamond Counter */}
        <div 
          className="currency-pill" 
          onClick={onAddDiamonds}
          title="Permata Petualangan"
        >
          <div className="currency-icon">
            <Gem size={15} fill="#38bdf8" color="#0284c7" strokeWidth={1.5} />
          </div>
          <span className="currency-value">{player.diamonds}</span>
          <button className="currency-add-btn" aria-label="Tambah Permata">+</button>
        </div>

        {/* Settings Button */}
        <button 
          className="settings-btn" 
          onClick={onOpenSettings} 
          aria-label="Pengaturan Game"
          title="Pengaturan"
        >
          <Settings size={18} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
};
