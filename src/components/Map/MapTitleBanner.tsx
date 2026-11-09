import React from 'react';
import './MapTitleBanner.css';

export const MapTitleBanner: React.FC = () => {
  return (
    <div className="map-title-vector-banner" aria-label="Peta Petualangan — Jelajahi Dunia, Temukan Bentuknya!">
      <svg
        viewBox="0 0 290 76"
        className="map-title-svg"
        aria-hidden="true"
      >
        <defs>
          {/* Gradien Kayu Papan Atas */}
          <linearGradient id="mapWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="25%" stopColor="#b45309" />
            <stop offset="70%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Gradien Bevel Emas / Highlight Papan Kayu */}
          <linearGradient id="mapWoodBevel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Gradien Pita Biru Bawah */}
          <linearGradient id="mapRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="40%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          {/* Jalur Teks Melengkung untuk Judul Utama "Peta Petualangan" (Posisi tepat di tengah vertikal) */}
          <path
            id="titleCurvePath"
            d="M 28 37 Q 145 22.5 262 37"
            fill="none"
          />

          {/* Jalur Teks Melengkung untuk Subjudul "Jelajahi Dunia, Temukan Bentuknya!" (Posisi tepat di tengah pita) */}
          <path
            id="ribbonCurvePath"
            d="M 44 56 Q 145 48.5 246 56"
            fill="none"
          />

          {/* Drop shadow efek untuk banner keseluruhan */}
          <filter id="bannerShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#0f2942" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter="url(#bannerShadow)">
          {/* === 1. PITA BIRU DI BAWAH (RIBBON) === */}
          {/* Bayangan pita bawah */}
          <path
            d="M 40 41 Q 145 32 250 41 L 243 65 Q 145 56 47 65 Z"
            fill="#032541"
          />
          {/* Badan pita biru */}
          <path
            d="M 42 40 Q 145 32 248 40 L 242 63 Q 145 55 48 63 Z"
            fill="url(#mapRibbonGrad)"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />
          {/* Lipatan ujung pita kiri & kanan */}
          <polygon points="42,40 48,63 37,54" fill="#075985" />
          <polygon points="248,40 242,63 253,54" fill="#075985" />

          {/* === 2. PAPAN KAYU MELENGKUNG DI ATAS === */}
          {/* Pasak / baut kayu samping kiri & kanan */}
          <rect x="13" y="27" width="10" height="7" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          <circle cx="16" cy="30.5" r="1.5" fill="#fef08a" />
          <rect x="267" y="27" width="10" height="7" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          <circle cx="274" cy="30.5" r="1.5" fill="#fef08a" />

          {/* Bayangan tebal bawah papan kayu */}
          <path
            d="M 20 22 Q 145 4 270 22 L 268 47 Q 145 29 22 47 Z"
            fill="#451a03"
          />

          {/* Badan papan kayu dengan gradien */}
          <path
            d="M 20 20 Q 145 4 270 20 L 267 44 Q 145 28 23 44 Z"
            fill="url(#mapWoodGrad)"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          {/* Garis serat kayu highlight di atas */}
          <path
            d="M 28 22 Q 145 7 262 22"
            fill="none"
            stroke="url(#mapWoodBevel)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Serat guratan kayu tengah halus */}
          <path
            d="M 38 29 Q 145 15 252 29"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            strokeDasharray="40 10 25 15"
          />
          <path
            d="M 32 37 Q 145 22 258 37"
            fill="none"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="30 15 45 10"
          />

          {/* Paku / ornamen emas di 4 sudut papan */}
          <circle cx="30" cy="26" r="2.2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="260" cy="26" r="2.2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="32" cy="38" r="2.2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="258" cy="38" r="2.2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
        </g>

        {/* === 3. TIPOGRAFI VEKTOR TERPUSAT SEMPURNA === */}
        {/* Shadow teks judul utama */}
        <text className="banner-title-shadow">
          <textPath href="#titleCurvePath" startOffset="50%" textAnchor="middle">
            Peta Petualangan
          </textPath>
        </text>

        {/* Teks putih judul utama */}
        <text className="banner-title-text">
          <textPath href="#titleCurvePath" startOffset="50%" textAnchor="middle">
            Peta Petualangan
          </textPath>
        </text>

        {/* Subjudul pada pita biru */}
        <text className="banner-ribbon-text">
          <textPath href="#ribbonCurvePath" startOffset="50%" textAnchor="middle">
            Jelajahi Dunia, Temukan Bentuknya!
          </textPath>
        </text>
      </svg>
    </div>
  );
};
