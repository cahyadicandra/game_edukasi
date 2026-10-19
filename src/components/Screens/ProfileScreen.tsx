import React from 'react';
import type { PlayerProfile } from '../../types/game';
import { Star, Gem, Trophy, Sparkles, BookOpen } from 'lucide-react';
import './ScreenCommon.css';

interface ProfileScreenProps {
  player: PlayerProfile;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ player }) => {
  return (
    <div className="sub-screen-container">
      <div className="sub-screen-header">
        <h1 className="sub-screen-title">👤 Profil Siswa</h1>
        <p className="sub-screen-subtitle">Data akun dan riwayat belajar</p>
      </div>

      <div className="profile-hero-card">
        <div className="profile-avatar-large">
          <svg viewBox="0 0 36 36" className="player-avatar-img">
            <circle cx="18" cy="18" r="18" fill="#a5f3fc" />
            <path d="M7 16 C7 7, 29 7, 29 16 C29 18, 28 20, 27 21 C27 21, 26 25, 24 26 C22 27, 14 27, 12 26 C10 25, 9 21, 9 21 C8 20, 7 18, 7 16 Z" fill="#1e293b" />
            <circle cx="18" cy="19" r="9" fill="#ffedd5" />
            <path d="M10 13 C12 9, 24 9, 26 13 C24 12, 21 14, 18 13 C15 14, 12 12, 10 13 Z" fill="#1e293b" />
            <circle cx="15" cy="18.5" r="1.3" fill="#0f172a" />
            <circle cx="21" cy="18.5" r="1.3" fill="#0f172a" />
            <circle cx="15.4" cy="18" r="0.4" fill="#ffffff" />
            <circle cx="21.4" cy="18" r="0.4" fill="#ffffff" />
            <path d="M16 22 Q18 24 20 22" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
            <circle cx="13.5" cy="20.5" r="1" fill="#fca5a5" opacity="0.6" />
            <circle cx="22.5" cy="20.5" r="1" fill="#fca5a5" opacity="0.6" />
            <path d="M13 28 C13 25, 23 25, 23 28 L25 36 L11 36 Z" fill="#0284c7" />
          </svg>
        </div>

        <h2 className="profile-name-text">{player.name}</h2>
        <span className="profile-role-badge">{player.role} - SD Kelas 4</span>

        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <Sparkles size={18} color="#0284c7" />
            <span className="stat-num">Level {player.level}</span>
            <span className="stat-label">Tingkat</span>
          </div>
          <div className="profile-stat-box">
            <Star size={18} fill="#facc15" color="#ca8a04" />
            <span className="stat-num">{player.stars}</span>
            <span className="stat-label">Bintang</span>
          </div>
          <div className="profile-stat-box">
            <Gem size={18} fill="#38bdf8" color="#0284c7" />
            <span className="stat-num">{player.diamonds}</span>
            <span className="stat-label">Permata</span>
          </div>
        </div>
      </div>

      <div className="profile-summary-card">
        <h3 className="card-heading">Statistik Pembelajaran</h3>
        <div className="summary-row">
          <div className="summary-item">
            <Trophy size={16} color="#eab308" />
            <span>Misi Terselesaikan:</span>
            <strong>12 Misi</strong>
          </div>
          <div className="summary-item">
            <BookOpen size={16} color="#3b82f6" />
            <span>Materi Dikuasai:</span>
            <strong>4 Bentuk</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
