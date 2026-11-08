import React, { useState } from 'react';
import { PlayableMascot } from './PlayableMascot';
import { X, Sparkles, Star, Gamepad2, Volume2, VolumeX } from 'lucide-react';
import './MascotPlaygroundModal.css';

interface CollectibleItem {
  id: number;
  x: number; // %
  y: number; // px from ground
  type: 'star' | 'diamond' | 'shape';
  shapeName: string;
  collected: boolean;
}

interface MascotPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardCollected?: (stars: number) => void;
}

export const MascotPlaygroundModal: React.FC<MascotPlaygroundModalProps> = ({
  isOpen,
  onClose,
  onRewardCollected,
}) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<CollectibleItem[]>([
    { id: 1, x: 20, y: 70, type: 'star', shapeName: 'Bintang Emas', collected: false },
    { id: 2, x: 38, y: 130, type: 'shape', shapeName: 'Segitiga Biru', collected: false },
    { id: 3, x: 50, y: 80, type: 'diamond', shapeName: 'Berlian Geometri', collected: false },
    { id: 4, x: 65, y: 140, type: 'shape', shapeName: 'Lingkaran Merah', collected: false },
    { id: 5, x: 82, y: 90, type: 'star', shapeName: 'Bintang Super', collected: false },
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingNotification, setFloatingNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  // Cek tabrakan / koleksi item ketika maskot bergerak
  const handlePositionChange = (posX: number, posY: number) => {
    // Hit box maskot
    items.forEach((item) => {
      if (!item.collected) {
        const dx = Math.abs(posX - item.x);
        const dy = Math.abs(posY - item.y);

        // Jika karakter menyentuh item
        if (dx < 7 && dy < 50) {
          item.collected = true;
          setScore((s) => s + 10);
          setFloatingNotification(`+10 ${item.shapeName}!`);

          if (onRewardCollected) {
            onRewardCollected(1);
          }

          setTimeout(() => {
            setFloatingNotification(null);
          }, 1200);
        }
      }
    });
  };

  const handleResetCollectibles = () => {
    setItems((prev) => prev.map((it) => ({ ...it, collected: false })));
    setScore(0);
  };

  return (
    <div className="mascot-modal-overlay">
      <div className="mascot-modal-container">
        {/* Header Modal */}
        <div className="mascot-modal-header">
          <div className="mascot-modal-title-group">
            <Gamepad2 className="title-icon" size={24} />
            <div>
              <h2 className="mascot-modal-title">Uji Karakter Maskot Petualang</h2>
              <p className="mascot-modal-subtitle">
                Kendalikkan karakter: Gerak Kiri / Kanan dan Loncat dengan animasi rig dinamis!
              </p>
            </div>
          </div>

          <div className="mascot-header-actions">
            {/* Skor Koleksi */}
            <div className="mascot-score-pill">
              <Star size={18} className="score-icon" />
              <span>{score} Poin</span>
            </div>

            {/* Tombol Suara */}
            <button
              type="button"
              className="mascot-tool-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Tombol Tutup */}
            <button
              type="button"
              className="mascot-close-btn"
              onClick={onClose}
              title="Tutup Arena"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Arena Bermain Karakter */}
        <div className="mascot-playground-stage">
          {/* Latar Belakang Pemandangan Fantasi */}
          <div className="stage-sky-bg" />
          <div className="stage-clouds-layer" />

          {/* Notifikasi Koleksi Mengambang */}
          {floatingNotification && (
            <div className="floating-collection-toast">
              <Sparkles size={16} />
              <span>{floatingNotification}</span>
            </div>
          )}

          {/* Item Geometri & Bintang yang Bisa Dikoleksi */}
          {items.map((item) => (
            <div
              key={item.id}
              className={`stage-collectible ${item.type} ${item.collected ? 'collected' : ''}`}
              style={{
                left: `${item.x}%`,
                bottom: `${item.y + 45}px`,
              }}
            >
              {item.type === 'star' && <Star size={28} className="item-icon-star" />}
              {item.type === 'diamond' && (
                <div className="item-diamond-shape" title="Berlian Geometri" />
              )}
              {item.type === 'shape' && (
                <div className="item-polygon-shape" title="Bentuk Geometri">
                  ▲
                </div>
              )}
            </div>
          ))}

          {/* Lantai / Tanah Tempat Maskot Berpijak */}
          <div className="stage-ground-layer">
            <div className="ground-grass-top" />
            <div className="ground-dirt-body" />
          </div>

          {/* Karakter Maskot Interaktif dengan Fisika & Animasi */}
          <PlayableMascot
            initialX={30}
            characterSize={180}
            minX={8}
            maxX={92}
            showControls={true}
            enableKeyboard={true}
            showInfoBadge={true}
            customGroundY={45}
            onPositionChange={handlePositionChange}
          />
        </div>

        {/* Footer Petunjuk & Tombol Bantuan */}
        <div className="mascot-modal-footer">
          <div className="footer-keyboard-guide">
            <span className="guide-chip">⬅️ / A : Gerak Kiri</span>
            <span className="guide-chip">➡️ / D : Gerak Kanan</span>
            <span className="guide-chip">⬆️ / Spasi / W : Loncat</span>
          </div>

          <button
            type="button"
            className="footer-reset-btn"
            onClick={handleResetCollectibles}
          >
            Reset Bintang
          </button>
        </div>
      </div>
    </div>
  );
};
