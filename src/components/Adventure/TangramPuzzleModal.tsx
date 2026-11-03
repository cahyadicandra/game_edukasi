import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, CheckCircle2, RotateCw, Hand } from 'lucide-react';
import './TangramPuzzleModal.css';

interface TangramPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type PieceKey = 'triangleRoof' | 'squareBody' | 'rectDoor';

interface PieceInfo {
  key: PieceKey;
  name: string;
  sub: string;
  color: string;
}

const PIECES: PieceInfo[] = [
  { key: 'triangleRoof', name: 'Atap Segitiga', sub: '3 Sisi', color: '#facc15' },
  { key: 'squareBody', name: 'Dinding Persegi', sub: '4 Sisi', color: '#38bdf8' },
  { key: 'rectDoor', name: 'Pintu Persegi Panjang', sub: 'Sejajar', color: '#4ade80' },
];

export const TangramPuzzleModal: React.FC<TangramPuzzleModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  // Potongan yang sudah berhasil ditempatkan
  const [placedPieces, setPlacedPieces] = useState<Record<PieceKey, boolean>>({
    triangleRoof: false,
    squareBody: false,
    rectDoor: false,
  });

  // State untuk Drag and Drop
  const [draggingPiece, setDraggingPiece] = useState<PieceKey | null>(null);
  const [dragCoords, setDragCoords] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<PieceKey | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  // Refs untuk slot target siluet rumah
  const roofSlotRef = useRef<HTMLDivElement>(null);
  const bodySlotRef = useRef<HTMLDivElement>(null);
  const doorSlotRef = useRef<HTMLDivElement>(null);

  // Fungsi cek apakah koordinat berada di dalam bounding box elemen slot dengan toleransi luas (pad = 40px)
  const isInsideSlot = useCallback((ref: React.RefObject<HTMLDivElement | null>, clientX: number, clientY: number): boolean => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    const pad = 40; // Toleransi area sentuh luas agar ramah layar sentuh mobile
    return (
      clientX >= rect.left - pad &&
      clientX <= rect.right + pad &&
      clientY >= rect.top - pad &&
      clientY <= rect.bottom + pad
    );
  }, []);

  // Fungsi memasang potongan ke slot yang tepat
  const snapPiece = useCallback((key: PieceKey) => {
    setPlacedPieces((prev) => {
      if (prev[key]) return prev;
      const nextState = { ...prev, [key]: true };

      // Cek apakah seluruh rumah selesai dirakit
      if (nextState.triangleRoof && nextState.squareBody && nextState.rectDoor) {
        setCelebrating(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
      return nextState;
    });
  }, [onComplete]);

  // Global pointer move & up listeners ketika sedang dragging
  useEffect(() => {
    if (!draggingPiece) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      setDragCoords({ x: e.clientX, y: e.clientY });

      // Deteksi slot mana yang sedang di-hover
      if (isInsideSlot(roofSlotRef, e.clientX, e.clientY)) {
        setHoveredSlot('triangleRoof');
      } else if (isInsideSlot(bodySlotRef, e.clientX, e.clientY)) {
        setHoveredSlot('squareBody');
      } else if (isInsideSlot(doorSlotRef, e.clientX, e.clientY)) {
        setHoveredSlot('rectDoor');
      } else {
        setHoveredSlot(null);
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      let droppedCorrectly = false;
      if (draggingPiece === 'triangleRoof' && isInsideSlot(roofSlotRef, e.clientX, e.clientY)) {
        snapPiece('triangleRoof');
        droppedCorrectly = true;
      } else if (draggingPiece === 'squareBody' && isInsideSlot(bodySlotRef, e.clientX, e.clientY)) {
        snapPiece('squareBody');
        droppedCorrectly = true;
      } else if (draggingPiece === 'rectDoor' && isInsideSlot(doorSlotRef, e.clientX, e.clientY)) {
        snapPiece('rectDoor');
        droppedCorrectly = true;
      }

      // Jika pemain hanya mengetuk cepat tanpa menggeser jauh, bantu auto-snap
      if (!droppedCorrectly && dragCoords) {
        const dx = Math.abs(e.clientX - dragCoords.x);
        const dy = Math.abs(e.clientY - dragCoords.y);
        if (dx < 10 && dy < 10) {
          snapPiece(draggingPiece);
        }
      }

      setDraggingPiece(null);
      setDragCoords(null);
      setHoveredSlot(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [draggingPiece, dragCoords, isInsideSlot, snapPiece]);

  if (!isOpen) return null;

  // Memulai Drag dari potongan di rak
  const startDrag = (e: React.PointerEvent, key: PieceKey) => {
    if (placedPieces[key]) return;
    e.preventDefault();
    setDraggingPiece(key);
    setDragCoords({ x: e.clientX, y: e.clientY });
  };

  const handleReset = () => {
    setPlacedPieces({
      triangleRoof: false,
      squareBody: false,
      rectDoor: false,
    });
    setCelebrating(false);
  };

  return (
    <div className="tangram-backdrop" onClick={onClose}>
      <div className="tangram-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tangram-header">
          <div className="tangram-title-wrap">
            <Sparkles size={18} color="#f59e0b" />
            <h3 className="tangram-title">Teka-Teki Tangram Kuno</h3>
          </div>
          <button className="tangram-close-btn" onClick={onClose} aria-label="Tutup Teka-Teki">
            <X size={17} />
          </button>
        </div>

        <div className="tangram-body">
          <div className="tangram-instruction-badge">
            <Hand size={15} color="#facc15" className="animate-bounce" />
            <span>Tarik (Drag) potongan ke dalam siluet rumah di atas!</span>
          </div>

          {/* Canvas Siluet Target Rumah Geometri */}
          <div className={`tangram-silhouette-canvas ${draggingPiece ? 'drag-active' : ''}`}>
            {/* Slot 1: Atap Segitiga */}
            <div
              ref={roofSlotRef}
              className={`silhouette-slot roof ${placedPieces.triangleRoof ? 'filled' : ''} ${
                hoveredSlot === 'triangleRoof' ? 'highlight-drop' : ''
              }`}
              onClick={() => snapPiece('triangleRoof')}
              onDragOver={(e) => { e.preventDefault(); setHoveredSlot('triangleRoof'); }}
              onDragLeave={() => setHoveredSlot(null)}
              onDrop={(e) => {
                e.preventDefault();
                const key = e.dataTransfer.getData('text/plain') as PieceKey;
                if (key === 'triangleRoof') snapPiece('triangleRoof');
                setHoveredSlot(null);
              }}
              title="Slot Atap Segitiga (Sentuh atau Jatuhkan di sini)"
            >
              <svg width="130" height="65" viewBox="0 0 130 65">
                <polygon
                  points="65,5 125,60 5,60"
                  fill={placedPieces.triangleRoof ? '#facc15' : hoveredSlot === 'triangleRoof' ? 'rgba(250, 204, 21, 0.35)' : 'rgba(255, 255, 255, 0.12)'}
                  stroke={placedPieces.triangleRoof ? '#ca8a04' : hoveredSlot === 'triangleRoof' ? '#facc15' : '#94a3b8'}
                  strokeWidth={hoveredSlot === 'triangleRoof' ? '4' : '2.5'}
                  strokeDasharray={placedPieces.triangleRoof ? 'none' : '5,5'}
                />
              </svg>
              {!placedPieces.triangleRoof && (
                <span className={`slot-label ${hoveredSlot === 'triangleRoof' ? 'glow' : ''}`}>
                  {hoveredSlot === 'triangleRoof' ? 'Lepas Di Sini!' : 'Atap Segitiga'}
                </span>
              )}
            </div>

            {/* Slot 2: Dinding Persegi */}
            <div
              ref={bodySlotRef}
              className={`silhouette-slot body ${placedPieces.squareBody ? 'filled' : ''} ${
                hoveredSlot === 'squareBody' ? 'highlight-drop' : ''
              }`}
              onClick={() => snapPiece('squareBody')}
              onDragOver={(e) => { e.preventDefault(); setHoveredSlot('squareBody'); }}
              onDragLeave={() => setHoveredSlot(null)}
              onDrop={(e) => {
                e.preventDefault();
                const key = e.dataTransfer.getData('text/plain') as PieceKey;
                if (key === 'squareBody') snapPiece('squareBody');
                setHoveredSlot(null);
              }}
              title="Slot Dinding Persegi (Sentuh atau Jatuhkan di sini)"
            >
              <svg width="96" height="86" viewBox="0 0 96 86">
                <rect
                  x="6"
                  y="6"
                  width="84"
                  height="74"
                  rx="6"
                  fill={placedPieces.squareBody ? '#38bdf8' : hoveredSlot === 'squareBody' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.12)'}
                  stroke={placedPieces.squareBody ? '#0284c7' : hoveredSlot === 'squareBody' ? '#38bdf8' : '#94a3b8'}
                  strokeWidth={hoveredSlot === 'squareBody' ? '4' : '2.5'}
                  strokeDasharray={placedPieces.squareBody ? 'none' : '5,5'}
                />
              </svg>
              {!placedPieces.squareBody && (
                <span className={`slot-label ${hoveredSlot === 'squareBody' ? 'glow' : ''}`}>
                  {hoveredSlot === 'squareBody' ? 'Lepas Di Sini!' : 'Dinding Persegi'}
                </span>
              )}
            </div>

            {/* Slot 3: Pintu Persegi Panjang */}
            <div
              ref={doorSlotRef}
              className={`silhouette-slot door ${placedPieces.rectDoor ? 'filled' : ''} ${
                hoveredSlot === 'rectDoor' ? 'highlight-drop' : ''
              }`}
              onClick={() => snapPiece('rectDoor')}
              onDragOver={(e) => { e.preventDefault(); setHoveredSlot('rectDoor'); }}
              onDragLeave={() => setHoveredSlot(null)}
              onDrop={(e) => {
                e.preventDefault();
                const key = e.dataTransfer.getData('text/plain') as PieceKey;
                if (key === 'rectDoor') snapPiece('rectDoor');
                setHoveredSlot(null);
              }}
              title="Slot Pintu Persegi Panjang (Sentuh atau Jatuhkan di sini)"
            >
              <svg width="44" height="54" viewBox="0 0 44 54">
                <rect
                  x="5"
                  y="5"
                  width="34"
                  height="44"
                  rx="4"
                  fill={placedPieces.rectDoor ? '#4ade80' : hoveredSlot === 'rectDoor' ? 'rgba(74, 222, 128, 0.35)' : 'rgba(255, 255, 255, 0.12)'}
                  stroke={placedPieces.rectDoor ? '#16a34a' : hoveredSlot === 'rectDoor' ? '#4ade80' : '#94a3b8'}
                  strokeWidth={hoveredSlot === 'rectDoor' ? '3.5' : '2.5'}
                  strokeDasharray={placedPieces.rectDoor ? 'none' : '4,4'}
                />
              </svg>
              {!placedPieces.rectDoor && (
                <span className={`slot-label small ${hoveredSlot === 'rectDoor' ? 'glow' : ''}`}>
                  {hoveredSlot === 'rectDoor' ? 'Lepas!' : 'Pintu'}
                </span>
              )}
            </div>
          </div>

          {celebrating && (
            <div className="tangram-complete-banner animate-pop">
              <CheckCircle2 size={20} color="#22c55e" />
              <span>Sempurna! Rumah Geometri Berhasil Dirakit! 🎉</span>
            </div>
          )}

          {/* Rak Potongan Bentuk di Bawah dengan Dukungan Drag and Drop Penuh */}
          <div className="tangram-tray">
            <div className="tray-header-row">
              <span className="tray-label">Pilih & Tarik Potongan ke Siluet:</span>
              <span className="tray-count">
                {[placedPieces.triangleRoof, placedPieces.squareBody, placedPieces.rectDoor].filter(Boolean).length}/3 Terpasang
              </span>
            </div>

            <div className="tray-pieces-row">
              {PIECES.map((p) => {
                const isPlaced = placedPieces[p.key];
                const isDraggingThis = draggingPiece === p.key;

                return (
                  <div
                    key={p.key}
                    className={`tray-piece-btn ${isPlaced ? 'used' : ''} ${isDraggingThis ? 'is-dragging-origin' : ''}`}
                    onPointerDown={(e) => startDrag(e, p.key)}
                    draggable={!isPlaced}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', p.key);
                      setDraggingPiece(p.key);
                    }}
                    onDragEnd={() => setDraggingPiece(null)}
                    onClick={() => !isPlaced && snapPiece(p.key)}
                    title={isPlaced ? 'Sudah terpasang' : `Tarik ${p.name}`}
                  >
                    {p.key === 'triangleRoof' && (
                      <svg width="38" height="28" viewBox="0 0 100 80">
                        <polygon points="50,10 90,75 10,75" fill="#facc15" stroke="#ca8a04" strokeWidth="6" />
                      </svg>
                    )}
                    {p.key === 'squareBody' && (
                      <svg width="30" height="30" viewBox="0 0 100 100">
                        <rect x="15" y="15" width="70" height="70" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
                      </svg>
                    )}
                    {p.key === 'rectDoor' && (
                      <svg width="22" height="32" viewBox="0 0 60 90">
                        <rect x="10" y="10" width="40" height="70" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="6" />
                      </svg>
                    )}
                    <span className="piece-title">{p.name}</span>
                    <span className="piece-sub">({p.sub})</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="tangram-reset-btn" onClick={handleReset} type="button">
            <RotateCw size={13} />
            <span>Tata Ulang Potongan</span>
          </button>
        </div>
      </div>

      {/* Ghost Element Mengikuti Kursor / Jari saat Dragging */}
      {draggingPiece && dragCoords && (
        <div
          className="tangram-floating-ghost"
          style={{
            left: `${dragCoords.x}px`,
            top: `${dragCoords.y}px`,
          }}
        >
          {draggingPiece === 'triangleRoof' && (
            <svg width="70" height="45" viewBox="0 0 100 80">
              <polygon points="50,10 90,75 10,75" fill="#facc15" stroke="#ca8a04" strokeWidth="6" />
            </svg>
          )}
          {draggingPiece === 'squareBody' && (
            <svg width="55" height="55" viewBox="0 0 100 100">
              <rect x="15" y="15" width="70" height="70" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
            </svg>
          )}
          {draggingPiece === 'rectDoor' && (
            <svg width="38" height="55" viewBox="0 0 60 90">
              <rect x="10" y="10" width="40" height="70" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="6" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};
