import React, { useState } from 'react';
import { X, Lock, Sparkles, CheckCircle2, ChevronRight, BookOpen, Award } from 'lucide-react';
import { LocalDB } from '../../services/localDatabase';
import './ShapeAlbumModal.css';

interface ShapeDefinition {
  id: string;
  name: string;
  category: string;
  color: string;
  accentColor: string;
  perimeterFormula: string;
  areaFormula: string;
  description: string;
  properties: string[];
  realWorldExample: string;
  worldHint: string;
  svgRender: (size?: number) => React.ReactNode;
}

const SHAPES_DATA: ShapeDefinition[] = [
  {
    id: 'card-tri-1',
    name: 'Segitiga Siku-Siku',
    category: 'Segitiga',
    color: '#f59e0b',
    accentColor: '#d97706',
    perimeterFormula: 'K = a + b + c',
    areaFormula: 'L = ½ × a × t',
    description: 'Bangun datar yang memiliki 3 sisi dan salah satu sudutnya tepat 90° (siku-siku).',
    properties: ['Memiliki 3 sisi dan 3 titik sudut', 'Jumlah seluruh sudut selalu 180°', 'Berlaku Teorema Pythagoras (a² + b² = c²)'],
    realWorldExample: 'Potongan pizza, penggaris segitiga, atap rumah',
    worldHint: 'Didapatkan dari Pulau Bentuk (Dunia 1)',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="20,80 80,80 20,20" fill="#facc15" stroke="#ca8a04" strokeWidth="5" />
        <rect x="20" y="70" width="10" height="10" fill="none" stroke="#ca8a04" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'card-sq-1',
    name: 'Persegi',
    category: 'Segi Empat',
    color: '#0284c7',
    accentColor: '#0369a1',
    perimeterFormula: 'K = 4 × s',
    areaFormula: 'L = s × s',
    description: 'Bangun datar segi empat beraturan dengan keempat sisi sama panjang dan semua sudut 90°.',
    properties: ['4 sisi sama panjang (s)', '4 sudut siku-siku (90°)', '4 simetri lipat dan 4 simetri putar'],
    realWorldExample: 'Ubin lantai, papan catur, jendela persegi',
    worldHint: 'Didapatkan dari Hutan Segi Empat (Dunia 2)',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'card-rect-1',
    name: 'Persegi Panjang',
    category: 'Segi Empat',
    color: '#10b981',
    accentColor: '#059669',
    perimeterFormula: 'K = 2 × (p + l)',
    areaFormula: 'L = p × l',
    description: 'Bangun datar dengan dua pasang sisi sejajar sama panjang dan empat sudut siku-siku.',
    properties: ['Sisi yang berhadapan sama panjang dan sejajar', 'Memiliki 2 simetri lipat dan 2 simetri putar', 'Panjang diagonal sama dan saling membagi dua'],
    realWorldExample: 'Layar HP, papan tulis, buku tulis, pintu',
    worldHint: 'Didapatkan dari Level Petualangan & Peti Gacha',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="12" y="28" width="76" height="44" rx="6" fill="#34d399" stroke="#059669" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'card-circle-compass',
    name: 'Lingkaran Sempurna',
    category: 'Kurva Lengkung',
    color: '#ec4899',
    accentColor: '#db2777',
    perimeterFormula: 'K = 2 × π × r',
    areaFormula: 'L = π × r²',
    description: 'Himpunan semua titik yang memiliki jarak sama (jari-jari r) terhadap satu titik pusat.',
    properties: ['Memiliki 1 sisi berupa kurva tertutup', 'Simetri lipat dan simetri putar tak terhingga', 'Nilai tetapan π ≈ 22/7 atau 3,14'],
    realWorldExample: 'Uang koin, roda sepeda, jam dinding, donat',
    worldHint: 'Didapatkan dari Danau Lingkaran (Dunia 4)',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="#f472b6" stroke="#db2777" strokeWidth="5" />
        <circle cx="50" cy="50" r="4" fill="#831843" />
        <line x1="50" y1="50" x2="84" y2="50" stroke="#831843" strokeWidth="2.5" strokeDasharray="3,3" />
      </svg>
    ),
  },
  {
    id: 'card-diamond-rhombus',
    name: 'Belah Ketupat',
    category: 'Segi Empat',
    color: '#8b5cf6',
    accentColor: '#7c3aed',
    perimeterFormula: 'K = 4 × s',
    areaFormula: 'L = ½ × d₁ × d₂',
    description: 'Segi empat yang memiliki empat sisi sama panjang dan diagonalnya berpotongan tegak lurus.',
    properties: ['4 sisi sama panjang', 'Sudut yang berhadapan sama besar', 'Kedua diagonal saling tegak lurus (90°)'],
    realWorldExample: 'Ketupat lebaran, rambu lalu lintas, motif batik',
    worldHint: 'Didapatkan dari Peti Misteri Geometri',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,15 85,50 50,85 15,50" fill="#a78bfa" stroke="#7c3aed" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'card-parallelogram-1',
    name: 'Jajar Genjang',
    category: 'Segi Empat',
    color: '#f97316',
    accentColor: '#ea580c',
    perimeterFormula: 'K = 2 × (a + b)',
    areaFormula: 'L = a × t',
    description: 'Segi empat yang sisi-sisi berhadapannya sejajar dan sama panjang.',
    properties: ['Sisi berhadapan sejajar dan sama panjang', 'Sudut yang berdekatan berjumlah 180°', 'Tidak memiliki simetri lipat, memiliki 2 simetri putar'],
    realWorldExample: 'Penghapus miring, motif taplak, jembatan truss',
    worldHint: 'Didapatkan dari Pegunungan Segitiga (Dunia 3)',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="30,25 90,25 70,75 10,75" fill="#fb923c" stroke="#ea580c" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'card-trapezoid-1',
    name: 'Trapesium Sama Kaki',
    category: 'Segi Empat',
    color: '#06b6d4',
    accentColor: '#0891b2',
    perimeterFormula: 'K = a + b + c + d',
    areaFormula: 'L = ½ × (a + b) × t',
    description: 'Segi empat yang memiliki tepat satu pasang sisi sejajar dengan panjang sisi miring sama.',
    properties: ['Memiliki sepasang sisi sejajar (a dan b)', 'Dua sudut di alas sama besar', 'Memiliki 1 simetri lipat'],
    realWorldExample: 'Atap perahu, kap lampu, pot bunga',
    worldHint: 'Didapatkan dari Level Boss Dunia 3',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="32,25 68,25 85,75 15,75" fill="#22d3ee" stroke="#0891b2" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'card-kite-1',
    name: 'Layang-Layang',
    category: 'Segi Empat',
    color: '#e11d48',
    accentColor: '#be123c',
    perimeterFormula: 'K = 2 × (a + b)',
    areaFormula: 'L = ½ × d₁ × d₂',
    description: 'Segi empat yang dibentuk oleh dua pasang sisi sama panjang yang saling bersebelahan.',
    properties: ['Memiliki 2 pasang sisi sama panjang', 'Diagonalnya saling berpotongan tegak lurus', 'Memiliki 1 simetri lipat'],
    realWorldExample: 'Mainan layangan di pantai, mata panah',
    worldHint: 'Didapatkan dari Kastil Geometri (Dunia 5)',
    svgRender: (size = 54) => (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,15 82,45 50,88 18,45" fill="#fb7185" stroke="#be123c" strokeWidth="5" />
      </svg>
    ),
  },
];

interface ShapeAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedCardIds: string[];
  onClaimReward?: (stars: number, diamonds: number) => void;
}

export const ShapeAlbumModal: React.FC<ShapeAlbumModalProps> = ({
  isOpen,
  onClose,
  collectedCardIds,
  onClaimReward,
}) => {
  const [selectedShape, setSelectedShape] = useState<ShapeDefinition | null>(null);
  // Milestone yang sudah diklaim disimpan permanen di Database Lokal (anti farming reward)
  const [claimedMilestones, setClaimedMilestones] = useState<number[]>(() => {
    return LocalDB.loadShapeAlbumMilestones();
  });

  if (!isOpen) return null;

  const totalShapes = SHAPES_DATA.length;
  // Hitung berapa bentuk yang sudah dibuka
  const unlockedShapes = SHAPES_DATA.filter((s) => collectedCardIds.includes(s.id));
  const unlockedCount = unlockedShapes.length;
  const progressPercent = Math.min(100, Math.round((unlockedCount / totalShapes) * 100));

  // Tentukan milestone yang bisa diklaim berikutnya (4 bentuk, lalu 8 bentuk)
  const pendingMilestone =
    unlockedCount >= 8 && !claimedMilestones.includes(8)
      ? 8
      : unlockedCount >= 4 && !claimedMilestones.includes(4)
        ? 4
        : null;
  const isEligibleReward = pendingMilestone !== null;
  const allApplicableClaimed = unlockedCount >= 4 && pendingMilestone === null;

  const handleClaim = () => {
    if (!isEligibleReward || pendingMilestone === null) return;
    const bonusStars = pendingMilestone === 8 ? 150 : 50;
    const bonusGems = pendingMilestone === 8 ? 25 : 10;
    const nextClaimed = [...claimedMilestones, pendingMilestone];
    setClaimedMilestones(nextClaimed);
    LocalDB.saveShapeAlbumMilestones(nextClaimed).catch((err) =>
      console.warn('Gagal menyimpan milestone album bentuk:', err)
    );
    onClaimReward?.(bonusStars, bonusGems);
  };

  return (
    <div className="shape-album-backdrop" onClick={onClose}>
      <div className="shape-album-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="shape-album-header">
          <div className="album-title-group">
            <div className="album-chest-mini">
              <BookOpen size={20} color="#facc15" />
            </div>
            <div>
              <h2 className="album-title">Koleksi Bangun Datar</h2>
              <span className="album-subtitle">Album Eksplorasi 8 Bentuk Geometri</span>
            </div>
          </div>
          <button className="album-close-btn" onClick={onClose} aria-label="Tutup Album">
            <X size={18} />
          </button>
        </div>

        {/* Progress & Milestone Bar */}
        <div className="album-progress-card">
          <div className="progress-top-row">
            <span className="progress-label">Progres Koleksi Peta:</span>
            <span className="progress-fraction">
              <strong>{unlockedCount}</strong> / {totalShapes} Terkumpul ({progressPercent}%)
            </span>
          </div>

          <div className="album-progress-track">
            <div
              className="album-progress-fill"
              style={{ width: `${Math.max(12, progressPercent)}%` }}
            />
          </div>

          {/* Hadiah Milestone */}
          <div className="milestone-row">
            <div className="milestone-badge">
              <Award size={14} color="#f59e0b" />
              <span>
                {claimedMilestones.includes(4) && !claimedMilestones.includes(8)
                  ? 'Target: 8 Bentuk (+150 ⭐, +25 💎)'
                  : 'Target: 4 Bentuk (+50 ⭐, +10 💎)'}
              </span>
            </div>
            {isEligibleReward ? (
              <button className="claim-reward-btn animate-pulse" onClick={handleClaim}>
                <Sparkles size={13} /> Klaim Bonus
              </button>
            ) : allApplicableClaimed ? (
              <span className="claimed-badge">
                <CheckCircle2 size={13} color="#22c55e" /> Sudah Diklaim
              </span>
            ) : (
              <span className="milestone-hint">
                Kumpulkan {Math.max(0, 4 - unlockedCount)} bentuk lagi
              </span>
            )}
          </div>
        </div>

        {/* Grid 8 Kartu Bangun Datar */}
        <div className="album-grid-container">
          <div className="album-cards-grid">
            {SHAPES_DATA.map((shape) => {
              const isUnlocked = collectedCardIds.includes(shape.id);

              return (
                <div
                  key={shape.id}
                  className={`album-shape-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => isUnlocked && setSelectedShape(shape)}
                  title={isUnlocked ? `Buka detail ${shape.name}` : shape.worldHint}
                >
                  <div className="card-illustration-box" style={{ borderColor: isUnlocked ? shape.color : '#334155' }}>
                    {isUnlocked ? (
                      shape.svgRender(50)
                    ) : (
                      <div className="locked-icon-wrap">
                        <Lock size={26} color="#64748b" />
                      </div>
                    )}
                  </div>

                  <div className="card-info">
                    <span className="card-category-tag">{isUnlocked ? shape.category : 'Terkunci'}</span>
                    <h4 className="card-shape-name">{isUnlocked ? shape.name : '???'}</h4>
                    <span className="card-formula-preview">
                      {isUnlocked ? shape.areaFormula : 'Buka di Peta'}
                    </span>
                  </div>

                  {isUnlocked && (
                    <div className="card-unlocked-badge">
                      <ChevronRight size={14} color="#facc15" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Detail Popover ketika kartu yang terbuka disentuh */}
        {selectedShape && (
          <div className="shape-detail-overlay" onClick={() => setSelectedShape(null)}>
            <div className="shape-detail-sheet animate-pop" onClick={(e) => e.stopPropagation()}>
              <div className="detail-header" style={{ background: `linear-gradient(135deg, ${selectedShape.color}, ${selectedShape.accentColor})` }}>
                <div className="detail-header-content">
                  <div className="detail-shape-preview">
                    {selectedShape.svgRender(64)}
                  </div>
                  <div>
                    <span className="detail-badge">{selectedShape.category}</span>
                    <h3 className="detail-title">{selectedShape.name}</h3>
                  </div>
                </div>
                <button className="detail-close-btn" onClick={() => setSelectedShape(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="detail-body">
                <p className="detail-desc">{selectedShape.description}</p>

                {/* Kotak Rumus Penting */}
                <div className="formula-boxes-row">
                  <div className="formula-box">
                    <span className="formula-box-title">Rumus Keliling</span>
                    <code className="formula-code">{selectedShape.perimeterFormula}</code>
                  </div>
                  <div className="formula-box">
                    <span className="formula-box-title">Rumus Luas</span>
                    <code className="formula-code">{selectedShape.areaFormula}</code>
                  </div>
                </div>

                {/* Sifat-sifat Bentuk */}
                <div className="detail-section">
                  <span className="detail-section-title">✨ Sifat Geometri:</span>
                  <ul className="properties-list">
                    {selectedShape.properties.map((prop, idx) => (
                      <li key={idx}>✓ {prop}</li>
                    ))}
                  </ul>
                </div>

                {/* Contoh Nyata */}
                <div className="detail-example-box">
                  <span className="example-title">🌍 Benda di Dunia Nyata:</span>
                  <p className="example-text">{selectedShape.realWorldExample}</p>
                </div>
              </div>

              <div className="detail-footer">
                <button className="detail-done-btn" onClick={() => setSelectedShape(null)}>
                  Mengerti!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
