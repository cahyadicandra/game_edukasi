import React from 'react';
import { GameModal } from './GameModal';
import { Gem } from 'lucide-react';

interface DailyDiamondModalProps {
  isOpen: boolean;
  onClose: () => void;
  diamonds: number;
  isClaimedToday: boolean;
  onClaimBonus: (amount: number) => void;
}

export const DailyDiamondModal: React.FC<DailyDiamondModalProps> = ({
  isOpen,
  onClose,
  diamonds,
  isClaimedToday,
  onClaimBonus,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="💎 Permata Ajaib"
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
            background: '#cffafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
          }}
        >
          <Gem size={34} fill="#38bdf8" color="#0284c7" />
        </div>
        <h3 style={{ margin: '0', fontFamily: 'var(--font-game-title)', fontSize: '26px', color: '#0369a1' }}>
          {diamonds} Permata
        </h3>
        <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0', lineHeight: 1.4 }}>
          Permata ajaib digunakan untuk membuka petunjuk kuis saat kesulitan dan membuka lencana prestisius!
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
              ⏳ Hadiah permata harian akan di-reset besok hari!
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onClaimBonus(10)}
            style={{
              marginTop: '4px',
              background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '9999px',
              padding: '10px 22px',
              fontFamily: 'var(--font-game-title)',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
              transition: 'transform 0.15s ease',
            }}
          >
            🎁 Klaim Hadiah Harian +10 💎
          </button>
        )}
      </div>
    </GameModal>
  );
};
