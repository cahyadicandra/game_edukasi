import React from 'react';
import { GameModal } from './GameModal';

interface PlayIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const PlayIntroModal: React.FC<PlayIntroModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="🎮 Mulai Petualangan!"
      onClose={onClose}
      footerActionLabel="Buka Peta Petualangan 🚀"
      onFooterAction={onStart}
    >
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <img
          src="/assets/mascot_triangle.png"
          alt="Petualang Segitiga"
          style={{
            width: '85px',
            height: 'auto',
            marginBottom: '10px',
            filter: 'drop-shadow(0 8px 14px rgba(15, 23, 42, 0.2))',
          }}
        />
        <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--font-game-title)', color: '#0f172a' }}>
          Siap Menjelajah Dunia Geometri?
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
          Temani si <strong>Kuning Segitiga</strong> menaklukkan tantangan dan mengumpulkan semua bintang di Lembah Geometri!
        </p>
      </div>
    </GameModal>
  );
};
