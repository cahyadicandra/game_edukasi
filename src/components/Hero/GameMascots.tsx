import React from 'react';
import './GameMascots.css';

export const GameMascots: React.FC = () => {
  return (
    <div className="mascots-container">
      {/* Secondary Shapes in background cliffs */}
      <div className="secondary-mascots">
        {/* Red Circle */}
        <div className="friend-circle" title="Lingkaran">
          <svg viewBox="0 0 30 30" width="20" height="20">
            <line x1="6" y1="10" x2="11" y2="12" stroke="#450a0a" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="24" y1="10" x2="19" y2="12" stroke="#450a0a" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="9" cy="14" r="2" fill="#450a0a" />
            <circle cx="21" cy="14" r="2" fill="#450a0a" />
            <path d="M12 20 Q15 18 18 20" stroke="#450a0a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Blue Square */}
        <div className="friend-square" title="Persegi">
          <svg viewBox="0 0 30 30" width="20" height="20">
            <circle cx="9" cy="13" r="2" fill="#082f49" />
            <circle cx="21" cy="13" r="2" fill="#082f49" />
            <circle cx="10" cy="12" r="0.6" fill="#ffffff" />
            <circle cx="22" cy="12" r="0.6" fill="#ffffff" />
            <line x1="12" y1="19" x2="18" y2="19" stroke="#082f49" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Purple Prism */}
        <div className="friend-purple" title="Prisma">
          <svg viewBox="0 0 40 45" width="100%" height="100%">
            <polygon points="20,5 38,40 2,40" fill="#a855f7" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="14" cy="24" r="1.8" fill="#3b0764" />
            <circle cx="26" cy="24" r="1.8" fill="#3b0764" />
            <path d="M17 30 Q20 28 23 30" stroke="#3b0764" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* Main Mascot: Yellow Triangle Adventurer from user asset */}
      <div className="main-mascot-wrapper" title="Petualang Segitiga">
        <img
          src="/assets/mascot_triangle.png"
          alt="Maskot Petualang Segitiga"
          className="main-mascot-img"
        />
        <div className="mascot-ground-shadow" />
      </div>
    </div>
  );
};
