import React from 'react';
import { GameModal } from './GameModal';
import { Star } from 'lucide-react';

interface DailyStarModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  isClaimedToday: boolean;
  onClaimBonus: (amount: number) => void;
}

export const DailyStarModal: React.FC<DailyStarModalProps> = ({
  isOpen,
  onClose,
  stars,
  isClaimedToday,
  onClaimBonus,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="⭐ Bintang Petualangan"
      onClose={onClose}
      footerActionLabel="Tutup"
      onFooterAction={onClose}
    >
      <div style={{ textAlign: 'center', padding: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          }}
        >
          <Star size={36} fill="#facc15" color="#ca8a04" />
        </div>
        <h3 style={{ margin: '0', fontFamily: 'var(--font-game-title)', fontSize: '26px', color: '#b45309' }}>
          {stars} Bintang
        </h3>
        <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0', lineHeight: 1.4 }}>
          Kumpulkan bintang emas dengan menyelesaikan kuis bangun datar dengan nilai sempurna di setiap pulau!
        </p>

        {isClaimedToday ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
            <button
              type="button"
              disabled
              style={{
                background: '#f1f5f9',
                color: '#94a3b8',
                border: '1.5px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '10px 22px',
                fontFamily: 'var(--font-game-title)',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'not-allowed',
              }}
            >
              ✓ Hadiah Hari Ini Sudah Diklaim
            </button>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              ⏳ Hadiah bintang harian akan di-reset besok hari!
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onClaimBonus(20)}
            style={{
              marginTop: '4px',
              background: 'linear-gradient(180deg, #facc15, #f59e0b)',
              color: '#78350f',
              border: '2px solid #ffffff',
              borderRadius: '9999px',
              padding: '10px 22px',
              fontFamily: 'var(--font-game-title)',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.15s ease',
            }}
          >
            🎁 Klaim Hadiah Harian +20 ⭐
          </button>
        )}
      </div>
    </GameModal>
  );
};
