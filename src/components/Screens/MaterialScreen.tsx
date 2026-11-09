import React, { useState } from 'react';
import { SubScreenHeader } from '../Common';
import { Sparkles, Compass, Lightbulb } from 'lucide-react';
import './ScreenCommon.css';

interface ShapeDetail {
  id: string;
  name: string;
  color: string;
  iconSvg: React.ReactNode;
  sides: number;
  corners: number;
  formula: string;
  formulaKeliling: string;
  description: string;
  funFact: string;
  svg: React.ReactNode;
}

export interface MaterialScreenProps {
  embedded?: boolean;
}

export const MaterialScreen: React.FC<MaterialScreenProps> = ({ embedded = false }) => {
  const shapes: ShapeDetail[] = [
    {
      id: 'segitiga',
      name: 'Segitiga',
      color: '#f59e0b',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <polygon points="12,3 21,20 3,20" fill="#facc15" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      sides: 3,
      corners: 3,
      formula: '½ × alas × tinggi',
      formulaKeliling: 'sisi a + sisi b + sisi c',
      description: 'Bangun datar yang memiliki 3 sisi dan 3 titik sudut. Total ketiga sudutnya selalu berjumlah 180°.',
      funFact: 'Ada segitiga sama sisi, sama kaki, dan siku-siku!',
      svg: (
        <svg viewBox="0 0 120 120" className="shape-preview-svg">
          <defs>
            <linearGradient id="triGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <filter id="triShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#92400e" floodOpacity="0.35" />
            </filter>
          </defs>
          <polygon
            points="60,18 108,102 12,102"
            fill="url(#triGrad)"
            stroke="#b45309"
            strokeWidth="5"
            strokeLinejoin="round"
            filter="url(#triShadow)"
          />
          {/* Garis tinggi putus-putus edukatif */}
          <line x1="60" y1="20" x2="60" y2="102" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.8" />
          <circle cx="60" cy="18" r="4.5" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: 'persegi',
      name: 'Persegi',
      color: '#0284c7',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        </svg>
      ),
      sides: 4,
      corners: 4,
      formula: 'sisi × sisi (s²)',
      formulaKeliling: '4 × sisi',
      description: 'Bangun datar beraturan dengan 4 sisi yang sama panjang dan 4 sudut siku-siku bernilai 90°.',
      funFact: 'Papan catur dan ubin lantai rumah adalah contoh nyata persegi!',
      svg: (
        <svg viewBox="0 0 120 120" className="shape-preview-svg">
          <defs>
            <linearGradient id="sqGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="sqShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#075985" floodOpacity="0.35" />
            </filter>
          </defs>
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            rx="12"
            fill="url(#sqGrad)"
            stroke="#0369a1"
            strokeWidth="5"
            filter="url(#sqShadow)"
          />
          {/* Tanda sudut siku-siku di pojok kiri atas */}
          <path d="M 28 40 L 40 40 L 40 28" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
        </svg>
      ),
    },
    {
      id: 'persegi-panjang',
      name: 'Persegi Panjang',
      color: '#16a34a',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <rect x="3" y="6" width="18" height="12" rx="3" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
        </svg>
      ),
      sides: 4,
      corners: 4,
      formula: 'panjang × lebar (p × l)',
      formulaKeliling: '2 × (panjang + lebar)',
      description: 'Memiliki 2 pasang sisi sejajar yang sama panjang dan 4 sudut siku-siku bernilai 90°.',
      funFact: 'Layar ponsel, buku tulis, dan pintu kamar berbentuk persegi panjang!',
      svg: (
        <svg viewBox="0 0 120 120" className="shape-preview-svg">
          <defs>
            <linearGradient id="rectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <filter id="rectShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#14532d" floodOpacity="0.35" />
            </filter>
          </defs>
          <rect
            x="14"
            y="30"
            width="92"
            height="60"
            rx="12"
            fill="url(#rectGrad)"
            stroke="#15803d"
            strokeWidth="5"
            filter="url(#rectShadow)"
          />
        </svg>
      ),
    },
    {
      id: 'lingkaran',
      name: 'Lingkaran',
      color: '#e11d48',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <circle cx="12" cy="12" r="9" fill="#fb7185" stroke="#e11d48" strokeWidth="2" />
        </svg>
      ),
      sides: 1,
      corners: 0,
      formula: 'π × r² (π = 22/7 atau 3,14)',
      formulaKeliling: '2 × π × r (atau π × d)',
      description: 'Bangun datar yang terbentuk dari himpunan semua titik yang memiliki jarak sama ke titik pusat.',
      funFact: 'Roda sepeda dan pizza berbentuk lingkaran utuh!',
      svg: (
        <svg viewBox="0 0 120 120" className="shape-preview-svg">
          <defs>
            <linearGradient id="circGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="50%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <filter id="circShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#9f1239" floodOpacity="0.35" />
            </filter>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="url(#circGrad)"
            stroke="#be123c"
            strokeWidth="5"
            filter="url(#circShadow)"
          />
          {/* Garis Jari-jari r */}
          <line x1="60" y1="60" x2="104" y2="60" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="4.5" fill="#ffffff" stroke="#9f1239" strokeWidth="1.5" />
          <text x="80" y="54" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">r</text>
        </svg>
      ),
    },
    {
      id: 'jajar-genjang',
      name: 'Jajar Genjang',
      color: '#8b5cf6',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <polygon points="7,5 21,5 17,19 3,19" fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
        </svg>
      ),
      sides: 4,
      corners: 4,
      formula: 'alas × tinggi (a × t)',
      formulaKeliling: '2 × (sisi miring + alas)',
      description: 'Bangun datar segi empat yang memiliki sisi-sisi berhadapan sejajar dan sama panjang.',
      funFact: 'Bila dipotong segitiganya, jajar genjang berubah jadi persegi panjang!',
      svg: (
        <svg viewBox="0 0 120 120" className="shape-preview-svg">
          <defs>
            <linearGradient id="jajarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="jajarShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#581c87" floodOpacity="0.35" />
            </filter>
          </defs>
          <polygon
            points="34,30 106,30 86,90 14,90"
            fill="url(#jajarGrad)"
            stroke="#6d28d9"
            strokeWidth="5"
            strokeLinejoin="round"
            filter="url(#jajarShadow)"
          />
        </svg>
      ),
    },
    {
      id: 'trapesium',
      name: 'Trapesium',
      color: '#ea580c',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <polygon points="6,6 18,6 22,18 2,18" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
        </svg>
      ),
      sides: 4,
      corners: 4,
      formula: '½ × (sisi a + sisi b) × t',
      formulaKeliling: 'sisi a + b + c + d',
      description: 'Bangun segi empat yang memiliki tepat satu pasang sisi sejajar namun tidak sama panjang.',
      funFact: 'Bentuk atap rumah tradisional Indonesia seringkali mirip trapesium!',
      svg: (
        <svg viewBox="0 0 120 120" className="shape-preview-svg">
          <defs>
            <linearGradient id="trapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="trapShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#7c2d12" floodOpacity="0.35" />
            </filter>
          </defs>
          <polygon
            points="32,32 88,32 108,90 12,90"
            fill="url(#trapGrad)"
            stroke="#c2410c"
            strokeWidth="5"
            strokeLinejoin="round"
            filter="url(#trapShadow)"
          />
        </svg>
      ),
    },
  ];

  const [selectedShape, setSelectedShape] = useState<ShapeDetail>(shapes[0]);

  const content = (
    <>
      {!embedded && (
        <SubScreenHeader
          icon="📚"
          title="Materi Bangun Datar"
          subtitle="Pelajari sifat, rumus keliling, dan luas bentuk geometri"
        />
      )}

      {/* Tab Pemilih Bentuk (Tombol 3D Game) */}
      <div className="shape-tab-scroll-wrap">
        <div className="shape-tab-selector">
          {shapes.map((item) => {
            const isActive = selectedShape.id === item.id;
            return (
              <button
                key={item.id}
                className={`shape-selector-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedShape(item)}
              >
                <span className="shape-btn-icon">{item.iconSvg}</span>
                <span className="shape-btn-name">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kartu Utama Sorotan Bentuk */}
      <div className="shape-spotlight-card">
        {/* Ilustrasi Visual Bentuk */}
        <div className="spotlight-visual-wrap">
          <div className="spotlight-visual">
            {selectedShape.svg}
          </div>
        </div>

        <div className="spotlight-info">
          <div className="spotlight-title-row">
            <h2 className="spotlight-title">{selectedShape.name}</h2>
            <div className="shape-properties-row">
              <span className="property-badge">
                <Compass size={13} color="#0284c7" />
                {selectedShape.sides} Sisi
              </span>
              <span className="property-badge">
                <Sparkles size={13} color="#d97706" />
                {selectedShape.corners} Sudut
              </span>
            </div>
          </div>

          <p className="spotlight-desc">{selectedShape.description}</p>

          {/* Kartu Rumus Luas & Keliling */}
          <div className="formula-cards-grid">
            <div className="formula-pill area-pill">
              <div className="formula-pill-header">
                <span className="formula-icon">📐</span>
                <span className="formula-label">Rumus Luas</span>
              </div>
              <span className="formula-val">{selectedShape.formula}</span>
            </div>

            <div className="formula-pill perimeter-pill">
              <div className="formula-pill-header">
                <span className="formula-icon">📏</span>
                <span className="formula-label">Rumus Keliling</span>
              </div>
              <span className="formula-val">{selectedShape.formulaKeliling}</span>
            </div>
          </div>

          {/* Fakta Unik / Tips Belajar */}
          <div className="shape-fun-fact-box">
            <Lightbulb size={18} color="#eab308" className="fact-icon" />
            <p className="fact-text">{selectedShape.funFact}</p>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return <div className="embedded-material-wrap">{content}</div>;
  }

  return (
    <div className="sub-screen-container">
      {/* Latar Belakang Langit & Awan Animasi */}
      <div className="sub-screen-sky" aria-hidden="true">
        <div className="sub-screen-cloud cloud-1" />
        <div className="sub-screen-cloud cloud-2" />
        <div className="sub-screen-cloud cloud-3" />
      </div>

      <div className="sub-screen-content">
        {content}
      </div>
    </div>
  );
};
