import React from 'react';
import './WorldBanner.css';

interface WorldBannerProps {
  worldNumber: number;
  worldName: string;
  subtitle: string;
}

export const WorldBanner: React.FC<WorldBannerProps> = ({
  worldNumber,
  worldName,
  subtitle,
}) => {
  return (
    <div className="vector-world-banner" aria-label={`Dunia ${worldNumber}: ${worldName}`}>
      {/* 1. Lencana Vektor Heksagon Emas & Zamrud di Sebelah Kiri */}
      <div className="banner-hexagon-badge">
        <svg
          viewBox="0 0 76 76"
          className="badge-hex-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Gradien Emas Bevel Atas (Highlight) */}
            <linearGradient id="goldTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Gradien Emas Bevel Samping */}
            <linearGradient id="goldSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Gradien Emas Bevel Bawah (Shadow) */}
            <linearGradient id="goldBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Gradien Hijau Zamrud Tengah */}
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="80%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Drop Shadow untuk lencana */}
            <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.45" />
            </filter>
          </defs>

          <g filter="url(#badgeShadow)">
            {/* Bingkai Luar Heksagon Emas Dasar */}
            <polygon
              points="38,4 68,21 68,55 38,72 8,55 8,21"
              fill="#b45309"
            />

            {/* Faset Bevel Emas Atas */}
            <polygon
              points="38,4 68,21 57,28 38,16 19,28 8,21"
              fill="url(#goldTopGrad)"
            />

            {/* Faset Bevel Emas Kanan */}
            <polygon
              points="68,21 68,55 57,48 57,28"
              fill="url(#goldSideGrad)"
            />

            {/* Faset Bevel Emas Kiri */}
            <polygon
              points="8,21 19,28 19,48 8,55"
              fill="url(#goldSideGrad)"
            />

            {/* Faset Bevel Emas Bawah */}
            <polygon
              points="8,55 19,48 38,60 57,48 68,55 38,72"
              fill="url(#goldBottomGrad)"
            />

            {/* Heksagon Dalam Zamrud Hijau */}
            <polygon
              points="38,15 58,26.5 58,49.5 38,61 18,49.5 18,26.5"
              fill="url(#emeraldGrad)"
              stroke="#047857"
              strokeWidth="1.5"
            />

            {/* Kilau Halus di Atas Zamrud */}
            <polygon
              points="38,17 56,27 38,36 20,27"
              fill="#ffffff"
              opacity="0.25"
            />
          </g>

          {/* Nomor Level / Dunia di Tengah Heksagon */}
          <text
            x="38"
            y="47"
            textAnchor="middle"
            className="hex-badge-number-shadow"
          >
            {worldNumber}
          </text>
          <text
            x="38"
            y="45"
            textAnchor="middle"
            className="hex-badge-number-text"
          >
            {worldNumber}
          </text>
        </svg>
      </div>

      {/* 2. Papan Kayu Vektor Berisi Judul & Keterangan */}
      <div className="banner-wood-plank">
        {/* Serat / Guratan Kayu Vektor */}
        <div className="wood-grain-overlay" />

        <div className="wood-text-content">
          <h2 className="banner-world-title">{worldName}</h2>
          <p className="banner-world-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
