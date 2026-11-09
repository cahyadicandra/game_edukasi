import React from 'react';
import type { DailyMission } from '../../types/game';
import { GameModal } from './GameModal';
import { Sparkles } from 'lucide-react';

interface DailyMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: DailyMission;
  onClaimReward: () => void;
  onGoToMap: () => void;
}

export const DailyMissionModal: React.FC<DailyMissionModalProps> = ({
  isOpen,
  onClose,
  mission,
  onClaimReward,
  onGoToMap,
}) => {
  const isReadyToClaim = !mission.isCompleted && mission.current >= mission.target;

  const footerActionLabel = mission.isCompleted
    ? 'Tutup'
    : isReadyToClaim
    ? `🎁 Klaim Hadiah (+${mission.rewardDiamonds} 💎)`
    : 'Mainkan Level di Peta 🗺️';

  const handleAction = () => {
    if (mission.isCompleted) {
      onClose();
    } else if (isReadyToClaim) {
      onClaimReward();
    } else {
      onGoToMap();
    }
  };

  return (
    <GameModal
      isOpen={isOpen}
      title="📋 Misi Hari Ini"
      onClose={onClose}
      footerActionLabel={footerActionLabel}
      onFooterAction={handleAction}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            background: mission.isCompleted ? '#f0fdf4' : '#f8fafc',
            padding: '14px',
            borderRadius: '16px',
            border: mission.isCompleted ? '1.5px solid #86efac' : '1.5px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(15, 35, 75, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h4 style={{ margin: 0, color: '#0f172a', fontFamily: 'var(--font-game-title)', fontSize: '15px' }}>
              {mission.title}
            </h4>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: 'var(--font-game-title)',
                padding: '3px 8px',
                borderRadius: '9999px',
                background: mission.isCompleted
                  ? '#dcfce7'
                  : isReadyToClaim
                  ? '#fef08a'
                  : '#e0f2fe',
                color: mission.isCompleted
                  ? '#166534'
                  : isReadyToClaim
                  ? '#854d0e'
                  : '#0369a1',
                border: mission.isCompleted
                  ? '1px solid #86efac'
                  : isReadyToClaim
                  ? '1px solid #facc15'
                  : '1px solid #bae6fd',
              }}
            >
              {mission.isCompleted ? '✓ Selesai & Diklaim' : isReadyToClaim ? 'Siap Diklaim!' : 'Sedang Berjalan'}
            </span>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
            {mission.description}
          </p>

          {/* Visual Progress Bar Misi */}
          <div style={{ width: '100%', height: '9px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
            <div
              style={{
                width: `${Math.min(100, Math.round((mission.current / mission.target) * 100))}%`,
                height: '100%',
                background: mission.isCompleted
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #38bdf8, #0284c7)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
              Progres: {mission.current} dari {mission.target} Level Sempurna
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Sparkles size={14} /> +{mission.rewardDiamonds} Permata
            </span>
          </div>
        </div>

        {/* Keterangan Status Edukatif */}
        <div style={{ textAlign: 'center', padding: '0 4px' }}>
          {mission.isCompleted ? (
            <p style={{ margin: 0, fontSize: '11.5px', color: '#16a34a', fontWeight: 700 }}>
              🎉 Kamu sudah mengklaim hadiah misi hari ini. Misi baru akan diperbarui besok hari!
            </p>
          ) : isReadyToClaim ? (
            <p style={{ margin: 0, fontSize: '11.5px', color: '#b45309', fontWeight: 700 }}>
              ✨ Kerja bagus! 3 level sempurna telah tercapai. Klik tombol di bawah untuk mengklaim permata!
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b' }}>
              💡 Selesaikan {mission.target - mission.current} level lagi dengan nilai sempurna (3 bintang) untuk membuka hadiah permata!
            </p>
          )}
        </div>
      </div>
    </GameModal>
  );
};
