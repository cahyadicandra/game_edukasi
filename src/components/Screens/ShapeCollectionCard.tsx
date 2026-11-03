import React from 'react';
import { ChevronRight } from 'lucide-react';
import './ShapeCollectionCard.css';

interface ShapeCollectionCardProps {
  collected?: number;
  total?: number;
  onClick: () => void;
}

export const ShapeCollectionCard: React.FC<ShapeCollectionCardProps> = ({
  collected = 0,
  total = 13,
  onClick,
}) => {
  const percent = Math.min(100, Math.max(0, Math.round((collected / total) * 100)));

  return (
    <button
      type="button"
      className="shape-collection-vector-card"
      onClick={onClick}
      aria-label={`Koleksi Bentuk: ${collected} dari ${total} terkumpul. Sentuh untuk membuka materi.`}
      title="Buka Koleksi Bentuk"
    >
      {/* 1. Peti Harta Karun Vektor (3D Vector Chest) */}
      <div className="chest-vector-wrapper">
        <svg
          viewBox="0 0 80 80"
          className="chest-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Gradien Biru Badan Peti */}
            <linearGradient id="chestBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Gradien Emas Bevel & Bingkai Peti */}
            <linearGradient id="chestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Kilau Cahaya Emas di Dalam Peti */}
            <linearGradient id="chestGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Bayangan Peti */}
            <filter id="chestDropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0f2942" floodOpacity="0.45" />
            </filter>
          </defs>

          <g filter="url(#chestDropShadow)">
            {/* Lingkaran Alas Belakang (Backdrop Disc) */}
            <circle cx="40" cy="42" r="32" fill="#0284c7" opacity="0.25" />
            <circle cx="40" cy="42" r="29" fill="#e0f2fe" opacity="0.6" />

            {/* Badan Bawah Peti (Kotak Biru) */}
            <rect x="18" y="42" width="44" height="25" rx="5" fill="url(#chestBlueGrad)" stroke="#0369a1" strokeWidth="1.5" />

            {/* Bingkai Emas Luar Badan Peti */}
            <path
              d="M 18 42 L 25 42 L 25 67 L 18 67 Z M 55 42 L 62 42 L 62 67 L 55 67 Z M 18 63 L 62 63 L 62 67 L 18 67 Z"
              fill="url(#chestGoldGrad)"
            />

            {/* Kilau Cahaya Keemasan dari Celah Peti Terbuka */}
            <path
              d="M 22 40 L 58 40 L 54 44 L 26 44 Z"
              fill="url(#chestGlowGrad)"
              opacity="0.9"
            />

            {/* Tutup Peti Melengkung Terbuka (Dome Lid) */}
            <path
              d="M 20 38 C 20 22, 60 22, 60 38 Z"
              fill="url(#chestBlueGrad)"
              stroke="#0369a1"
              strokeWidth="1.5"
            />

            {/* Lengkungan Emas Tutup Peti */}
            <path
              d="M 20 38 C 20 23, 27 23, 27 38 Z"
              fill="url(#chestGoldGrad)"
            />
            <path
              d="M 53 38 C 53 23, 60 23, 60 38 Z"
              fill="url(#chestGoldGrad)"
            />
            <path
              d="M 36 24 C 38 23, 42 23, 44 24 L 44 38 L 36 38 Z"
              fill="url(#chestGoldGrad)"
            />

            {/* Lis Emas Bawah Tutup Peti */}
            <rect x="17" y="36" width="46" height="5.5" rx="2" fill="url(#chestGoldGrad)" stroke="#b45309" strokeWidth="0.8" />

            {/* Gembok / Kancing Emas Depan Peti */}
            <circle cx="40" cy="46" r="4.5" fill="url(#chestGoldGrad)" stroke="#78350f" strokeWidth="0.8" />
            <path d="M 38.5 45 C 38.5 43.5, 41.5 43.5, 41.5 45 L 41.5 48.5 L 38.5 48.5 Z" fill="#451a03" />

            {/* Kaki-kaki Emas Peti */}
            <rect x="19" y="66" width="6" height="3" rx="1.5" fill="url(#chestGoldGrad)" />
            <rect x="55" y="66" width="6" height="3" rx="1.5" fill="url(#chestGoldGrad)" />
          </g>
        </svg>
      </div>

      {/* 2. Informasi Dinamis: Judul & Progress Bar */}
      <div className="card-info-content">
        <span className="card-main-title">Koleksi Bentuk</span>

        <div className="dynamic-progress-container">
          <div className="dynamic-progress-track">
            <div
              className="dynamic-progress-fill"
              style={{ width: `${percent}%` }}
            />
            <span className="dynamic-progress-label">
              {collected}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tombol Panah Buka (Chevron) */}
      <div className="card-chevron-wrap">
        <ChevronRight size={22} color="#0369a1" strokeWidth={3} />
      </div>
    </button>
  );
};
