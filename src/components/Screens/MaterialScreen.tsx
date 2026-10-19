import React, { useState } from 'react';
import './ScreenCommon.css';

interface ShapeDetail {
  id: string;
  name: string;
  color: string;
  sides: number;
  corners: number;
  formula: string;
  formulaKeliling: string;
  description: string;
  svg: React.ReactNode;
}

export const MaterialScreen: React.FC = () => {
  const shapes: ShapeDetail[] = [
    {
      id: 'segitiga',
      name: 'Segitiga',
      color: '#facc15',
      sides: 3,
      corners: 3,
      formula: '½ × alas × tinggi',
      formulaKeliling: 'sisi A + sisi B + sisi C',
      description: 'Bangun datar yang memiliki 3 sisi dan 3 titik sudut. Jumlah sudutnya adalah 180°.',
      svg: (
        <svg viewBox="0 0 100 100" className="shape-preview-svg">
          <polygon points="50,15 90,85 10,85" fill="#facc15" stroke="#ca8a04" strokeWidth="4" />
        </svg>
      ),
    },
    {
      id: 'persegi',
      name: 'Persegi',
      color: '#38bdf8',
      sides: 4,
      corners: 4,
      formula: 'sisi × sisi (s²)',
      formulaKeliling: '4 × sisi',
      description: 'Bangun datar dengan 4 sisi sama panjang dan 4 sudut siku-siku (90°).',
      svg: (
        <svg viewBox="0 0 100 100" className="shape-preview-svg">
          <rect x="15" y="15" width="70" height="70" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
        </svg>
      ),
    },
    {
      id: 'lingkaran',
      name: 'Lingkaran',
      color: '#f87171',
      sides: 1,
      corners: 0,
      formula: 'π × r² (atau ¼ × π × d²)',
      formulaKeliling: '2 × π × r',
      description: 'Bangun datar yang terbentuk dari himpunan titik-titik dengan jarak yang sama ke titik pusat.',
      svg: (
        <svg viewBox="0 0 100 100" className="shape-preview-svg">
          <circle cx="50" cy="50" r="38" fill="#f87171" stroke="#dc2626" strokeWidth="4" />
        </svg>
      ),
    },
    {
      id: 'persegi-panjang',
      name: 'Persegi Panjang',
      color: '#4ade80',
      sides: 4,
      corners: 4,
      formula: 'panjang × lebar (p × l)',
      formulaKeliling: '2 × (p + l)',
      description: 'Memiliki 2 pasang sisi sejajar yang sama panjang dan 4 sudut siku-siku.',
      svg: (
        <svg viewBox="0 0 100 100" className="shape-preview-svg">
          <rect x="10" y="25" width="80" height="50" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="4" />
        </svg>
      ),
    },
  ];

  const [selectedShape, setSelectedShape] = useState<ShapeDetail>(shapes[0]);

  return (
    <div className="sub-screen-container">
      <div className="sub-screen-header">
        <h1 className="sub-screen-title">📚 Materi Bangun Datar</h1>
        <p className="sub-screen-subtitle">Pelajari sifat, rumus keliling, dan luas bentuk geometri</p>
      </div>

      {/* Selected shape spotlight */}
      <div className="shape-spotlight-card">
        <div className="spotlight-visual">{selectedShape.svg}</div>
        <div className="spotlight-info">
          <h2 className="spotlight-title">{selectedShape.name}</h2>
          <p className="spotlight-desc">{selectedShape.description}</p>
          <div className="formula-pill">
            <span className="formula-label">Luas:</span>
            <span className="formula-val">{selectedShape.formula}</span>
          </div>
          <div className="formula-pill">
            <span className="formula-label">Keliling:</span>
            <span className="formula-val">{selectedShape.formulaKeliling}</span>
          </div>
        </div>
      </div>

      {/* Shapes list */}
      <div className="shape-tab-selector">
        {shapes.map((item) => (
          <button
            key={item.id}
            className={`shape-selector-btn ${selectedShape.id === item.id ? 'active' : ''}`}
            onClick={() => setSelectedShape(item)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
