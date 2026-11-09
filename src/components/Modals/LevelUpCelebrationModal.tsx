import React from 'react';
import { GameModal } from './GameModal';
import { Sparkles } from 'lucide-react';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  onClose,
  level,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="🎉 NAIK LEVEL!"
      onClose={onClose}
      footerActionLabel="Lanjutkan Petualangan 🚀"
      onFooterAction={onClose}
    >
      <div style={{ textAlign: 'center', padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef08a, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(234, 179, 8, 0.4)',
            animation: 'gentleBob 2s ease-in-out infinite',
          }}
        >
          <Sparkles size={38} color="#78350f" />
        </div>
        <h3 style={{ margin: '0', fontFamily: 'var(--font-game-title)', fontSize: '22px', color: '#0f2942' }}>
          Hore! Kamu Mencapai Level {level}!
        </h3>
        <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>
          Kemampuan geometrimu makin hebat! Hadiah bonus kenaikan tingkat:
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '6px' }}>
          <span style={{ background: '#fef3c7', padding: '6px 14px', borderRadius: '9999px', fontWeight: 800, fontSize: '13px', color: '#b45309', border: '1px solid #fde68a' }}>
            ⭐ +50 Bintang
          </span>
          <span style={{ background: '#e0f2fe', padding: '6px 14px', borderRadius: '9999px', fontWeight: 800, fontSize: '13px', color: '#0369a1', border: '1px solid #bae6fd' }}>
            💎 +10 Permata
          </span>
        </div>
      </div>
    </GameModal>
  );
};
