import React from 'react';
import type { PlayerProfile } from '../../types/game';
import { GameModal } from './GameModal';
import { AvatarRenderer, type AvatarKey } from '../Common/AvatarRenderer';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdatePlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  onOpenFullProfile: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
  onOpenFullProfile,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="🎒 Profil Petualang Siswa"
      onClose={onClose}
      footerActionLabel="Buka Profil Lengkap"
      onFooterAction={onOpenFullProfile}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        {/* Avatar Preview */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            border: '3.5px solid #38bdf8',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #a5f3fc, #38bdf8)',
            boxShadow: '0 6px 14px rgba(2, 132, 199, 0.3)',
          }}
        >
          <AvatarRenderer avatarId={player.avatarId} />
        </div>

        {/* Pilih Karakter Avatar */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
            Pilih Karakter Siswa (Termasuk Avatar Khusus Gacha):
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {(['boy', 'girl', 'adventurer', 'scientist', 'wizard', 'princess'] as AvatarKey[]).map((avId) => {
              const isUnlocked =
                avId === 'boy' ||
                avId === 'girl' ||
                avId === 'adventurer' ||
                avId === 'scientist' ||
                (player.inventory?.unlockedAvatars || []).includes(avId);

              const isSelected = (player.avatarId || 'boy') === avId;

              return (
                <button
                  key={avId}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      onUpdatePlayer((p) => ({ ...p, avatarId: avId }));
                    }
                  }}
                  title={
                    isUnlocked
                      ? `Pilih Avatar ${avId}`
                      : `Terkunci! Dapatkan avatar ${avId === 'wizard' ? 'Penyihir' : 'Putri'} dari Peti Gacha Permata!`
                  }
                  style={{
                    position: 'relative',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: isSelected
                      ? '3px solid #0284c7'
                      : isUnlocked
                      ? '2px solid #bae6fd'
                      : '2px dashed #cbd5e1',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                    background: isUnlocked ? '#f8fafc' : '#f1f5f9',
                    padding: '2px',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    opacity: isUnlocked ? 1 : 0.45,
                    boxShadow: isSelected ? '0 4px 10px rgba(2, 132, 199, 0.35)' : 'none',
                  }}
                >
                  <AvatarRenderer avatarId={avId} />
                  {!isUnlocked && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        fontSize: '11px',
                        background: '#475569',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      🔒
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ubah Nama Siswa Dinamis */}
        <div style={{ width: '100%' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f2942', display: 'block', marginBottom: '4px' }}>
            Nama Siswa Petualang:
          </label>
          <input
            type="text"
            value={player.name}
            onChange={(e) => onUpdatePlayer((p) => ({ ...p, name: e.target.value || 'Siswa' }))}
            maxLength={15}
            placeholder="Ketik nama siswa..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '2px solid #bae6fd',
              fontSize: '14px',
              fontFamily: 'var(--font-game-title)',
              fontWeight: 700,
              color: '#0f2942',
              outline: 'none',
              background: '#f0f9ff',
            }}
          />
        </div>

        {/* Statistik Kemajuan Level & EXP */}
        <div
          style={{
            width: '100%',
            background: '#f8fafc',
            borderRadius: '14px',
            padding: '10px 14px',
            border: '1.5px solid #e2e8f0',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
            <span style={{ color: '#0284c7' }}>Level {player.level}</span>
            <span style={{ color: '#16a34a' }}>{player.currentExp} / {player.maxExp} EXP</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, Math.round((player.currentExp / player.maxExp) * 100))}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>
    </GameModal>
  );
};
