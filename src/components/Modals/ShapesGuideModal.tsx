import React from 'react';
import { GameModal } from './GameModal';

interface ShapesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLearnMore: () => void;
}

export const ShapesGuideModal: React.FC<ShapesGuideModalProps> = ({
  isOpen,
  onClose,
  onLearnMore,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="🔺 Kenali Bangun Datar"
      onClose={onClose}
      footerActionLabel="Pelajari Selengkapnya 📖"
      onFooterAction={onLearnMore}
    >
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
        Sentuh bentuk untuk memahami karakteristik utamanya:
      </p>
      <div className="shape-grid">
        <div className="shape-item">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <polygon points="50,15 90,85 10,85" fill="#facc15" stroke="#ca8a04" strokeWidth="6" />
          </svg>
          <span className="shape-name">Segitiga</span>
          <span className="shape-desc">3 sisi & 3 sudut</span>
        </div>

        <div className="shape-item">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
          </svg>
          <span className="shape-name">Persegi</span>
          <span className="shape-desc">4 sisi sama panjang</span>
        </div>

        <div className="shape-item">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="#f87171" stroke="#dc2626" strokeWidth="6" />
          </svg>
          <span className="shape-name">Lingkaran</span>
          <span className="shape-desc">1 sisi lengkung, tanpa sudut</span>
        </div>

        <div className="shape-item">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <rect x="10" y="25" width="80" height="50" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="6" />
          </svg>
          <span className="shape-name">Persegi Panjang</span>
          <span className="shape-desc">2 pasang sisi sejajar</span>
        </div>
      </div>
    </GameModal>
  );
};
