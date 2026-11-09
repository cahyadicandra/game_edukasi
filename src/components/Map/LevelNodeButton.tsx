import React, { useState } from 'react';
import { Lock, Star, Check } from 'lucide-react';
import type { LevelNodeData } from '../../data/worlds';
import './LevelNodeButton.css';

interface LevelNodeButtonProps {
  level: LevelNodeData;
  onSelect: () => void;
}

export const LevelNodeButton: React.FC<LevelNodeButtonProps> = ({ level, onSelect }) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (level.state === 'locked') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    onSelect();
  };

  const starsCount = level.stars ?? (level.state === 'completed' ? 3 : 0);

  return (
    <div
      className={`level-node-wrapper state-${level.state} ${isShaking ? 'shaking' : ''}`}
      style={{ left: `${level.x}%`, top: `${level.y}%` }}
    >
      {/* Indikator karakter/panah di atas level yang sedang aktif */}
      {level.state === 'active' && (
        <div className="active-level-indicator" title="Level Saat Ini">
          <div className="active-indicator-pin">
            <span className="pin-text">MAIN</span>
            <div className="pin-triangle" />
          </div>
        </div>
      )}

      {/* Tombol Node Level Utama */}
      <button
        type="button"
        className={`level-node-btn state-${level.state}`}
        onClick={handleClick}
        aria-label={
          level.state === 'locked'
            ? `Level ${level.num} Terkunci`
            : level.state === 'completed'
            ? `Level ${level.num} Selesai (${starsCount} Bintang)`
            : `Level ${level.num} Siap Dimainkan`
        }
        title={`Level ${level.num}`}
      >
        {/* Glow halo efek untuk level aktif */}
        {level.state === 'active' && <div className="node-active-halo" />}

        {/* Lingkaran dalam tombol */}
        <div className="node-inner-circle">
          {level.state === 'locked' ? (
            <div className="locked-content">
              <Lock size={15} color="#e2e8f0" strokeWidth={2.6} />
              <span className="locked-num">{level.num}</span>
            </div>
          ) : (
            <span className="node-number">{level.num}</span>
          )}
        </div>

        {/* Lencana Tipe Node RPG Petualangan */}
        {level.nodeType && (
          <div
            className={`node-type-badge ${level.nodeType}`}
            title={`Tipe Misi: ${level.nodeType.toUpperCase()}`}
          >
            {level.nodeType === 'boss' && '👑'}
            {level.nodeType === 'regular' && '📐'}
            {level.nodeType === 'battle' && '⚔️'}
            {level.nodeType === 'puzzle' && '🧩'}
            {level.nodeType === 'campfire' && '🏕️'}
            {level.nodeType === 'treasure' && '💎'}
          </div>
        )}

        {/* Lencana ceklis untuk level yang sudah selesai */}
        {level.state === 'completed' && (
          <div className="completed-badge" title="Selesai">
            <Check size={11} color="#ffffff" strokeWidth={3.2} />
          </div>
        )}
      </button>

      {/* 3 Bintang di bawah/atas tombol untuk level selesai */}
      {level.state === 'completed' && (
        <div className="node-stars-row">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={12}
              fill={s <= starsCount ? '#facc15' : '#cbd5e1'}
              color={s <= starsCount ? '#ca8a04' : '#94a3b8'}
              strokeWidth={1.5}
            />
          ))}
        </div>
      )}

      {/* Tooltip sementara jika menekan level terkunci */}
      {isShaking && (
        <div className="locked-tooltip">
          <span>Terkunci! 🔒</span>
        </div>
      )}
    </div>
  );
};
