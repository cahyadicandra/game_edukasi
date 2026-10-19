import React from 'react';
import { Star, Lock, CheckCircle2, Play } from 'lucide-react';
import './ScreenCommon.css';

interface MapScreenProps {
  onSelectLevel: (levelNum: number) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onSelectLevel }) => {
  const levels = [
    { num: 1, name: 'Lembah Segitiga', stars: 3, unlocked: true, completed: true },
    { num: 2, name: 'Hutan Persegi', stars: 3, unlocked: true, completed: true },
    { num: 3, name: 'Danau Lingkaran', stars: 2, unlocked: true, completed: false },
    { num: 4, name: 'Benteng Persegi Panjang', stars: 0, unlocked: false, completed: false },
    { num: 5, name: 'Puncak Jajar Genjang', stars: 0, unlocked: false, completed: false },
    { num: 6, name: 'Kastil Trapesium', stars: 0, unlocked: false, completed: false },
  ];

  return (
    <div className="sub-screen-container">
      <div className="sub-screen-header">
        <h1 className="sub-screen-title">🗺️ Peta Petualangan</h1>
        <p className="sub-screen-subtitle">Pilih pulau bangun datar untuk dijelajahi</p>
      </div>

      <div className="level-list">
        {levels.map((lvl) => (
          <div
            key={lvl.num}
            className={`level-card ${lvl.unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => lvl.unlocked && onSelectLevel(lvl.num)}
          >
            <div className="level-badge">
              {lvl.completed ? (
                <CheckCircle2 size={24} color="#22c55e" />
              ) : lvl.unlocked ? (
                <div className="level-num">{lvl.num}</div>
              ) : (
                <Lock size={20} color="#94a3b8" />
              )}
            </div>

            <div className="level-info">
              <span className="level-name">Level {lvl.num}: {lvl.name}</span>
              <div className="level-stars">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    fill={s <= lvl.stars ? '#facc15' : '#cbd5e1'}
                    color={s <= lvl.stars ? '#eab308' : '#94a3b8'}
                  />
                ))}
              </div>
            </div>

            {lvl.unlocked && (
              <button className="level-play-btn">
                <Play size={14} fill="#ffffff" color="#ffffff" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
