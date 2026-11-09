import React from 'react';
import { GameModal } from './GameModal';
import { Volume2, VolumeX, Shield, Info, Check, Database, RotateCcw } from 'lucide-react';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGameData: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  onResetGameData,
}) => {
  return (
    <GameModal
      isOpen={isOpen}
      title="⚙️ Pengaturan"
      onClose={onClose}
      footerActionLabel="Simpan"
      onFooterAction={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {soundEnabled ? <Volume2 size={18} color="#0284c7" /> : <VolumeX size={18} color="#94a3b8" />}
            <span style={{ fontWeight: 700, fontSize: '13px' }}>Suara & Musik Game</span>
          </div>
          <button
            type="button"
            style={{
              background: soundEnabled ? '#22c55e' : '#cbd5e1',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
            onClick={onToggleSound}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#475569',
          }}
        >
          <Shield size={16} color="#0284c7" />
          <span>Mode Aman Anak & Edukasi Aktif</span>
          <Check size={16} color="#16a34a" style={{ marginLeft: 'auto' }} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#475569',
          }}
        >
          <Database size={16} color="#0284c7" />
          <span>Database Lokal: Terhubung Aktif (100% Offline)</span>
          <Check size={16} color="#16a34a" style={{ marginLeft: 'auto' }} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#475569',
          }}
        >
          <Info size={16} color="#0284c7" />
          <span>Versi Game: 1.0.0 (Capacitor Mobile)</span>
        </div>

        <button
          type="button"
          onClick={onResetGameData}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Data Petualangan</span>
        </button>
      </div>
    </GameModal>
  );
};
