import React from 'react';
import type { QuizQuestion } from '../../data/questions';

export interface QuestionVisualProps {
  type?: QuizQuestion['visual'];
  prompt?: string;
  size?: number;
}

export const QuestionVisual: React.FC<QuestionVisualProps> = ({
  type,
  prompt = '',
}) => {
  // 1. Auto-deteksi visual dari kata kunci pertanyaan jika type belum diset
  let effectiveType: string = type || '';

  if (!effectiveType && prompt) {
    const lower = prompt.toLowerCase();
    if (lower.includes('catur')) effectiveType = 'chessboard';
    else if (lower.includes('pizza')) effectiveType = 'pizza';
    else if (lower.includes('jam dinding') || lower.includes('jam ')) effectiveType = 'clock';
    else if (lower.includes('pintu')) effectiveType = 'door';
    else if (lower.includes('buku') || lower.includes('meja berbentuk buku')) effectiveType = 'book';
    else if (lower.includes('koin') || lower.includes('roda')) effectiveType = 'coin';
    else if (lower.includes('rumah') || lower.includes('atap') || lower.includes('jendela')) effectiveType = 'shape_composite_house';
    else if (lower.includes('lintasan') || lower.includes('lapangan lari')) effectiveType = 'shape_composite_track';
    else if (lower.includes('huruf l') || lower.includes('bangun l') || lower.includes('berundak')) effectiveType = 'shape_composite_l';
    else if (lower.includes('jajar genjang') || lower.includes('jajargenjang')) effectiveType = 'shape_parallelogram';
    else if (lower.includes('belah ketupat') || lower.includes('ketupat') || lower.includes('layang-layang')) effectiveType = 'shape_rhombus';
    else if (lower.includes('trapesium')) effectiveType = 'shape_trapezoid';
    else if (lower.includes('juring')) effectiveType = 'shape_circle_sector';
    else if (lower.includes('diameter')) effectiveType = 'shape_circle_diameter';
    else if (lower.includes('jari-jari') || lower.includes('jari jari')) effectiveType = 'shape_circle_radius';
    else if (lower.includes('setengah lingkaran')) effectiveType = 'shape_circle_sector';
    else if (lower.includes('lingkaran')) effectiveType = 'shape_circle';
    else if (lower.includes('persegi panjang')) effectiveType = 'shape_rectangle';
    else if (lower.includes('persegi') || lower.includes('papan') || lower.includes('kotak') || lower.includes('segi empat')) effectiveType = 'shape_square';
    else if (lower.includes('siku-siku') || lower.includes('90°') || lower.includes('90 derajat')) effectiveType = 'shape_triangle_right';
    else if (lower.includes('sama kaki')) effectiveType = 'shape_triangle_isosceles';
    else if (lower.includes('segitiga')) effectiveType = 'shape_triangle';
    else effectiveType = 'shape_square';
  }

  // Jika kata kunci catur ada di prompt dan typenya shape_square, jadikan chessboard
  if (prompt && prompt.toLowerCase().includes('catur') && effectiveType === 'shape_square') {
    effectiveType = 'chessboard';
  }
  // Jika kata kunci koin/roda ada di prompt dan typenya lingkaran/clock, jadikan coin
  if (prompt && (prompt.toLowerCase().includes('koin') || prompt.toLowerCase().includes('roda')) && (effectiveType === 'clock' || effectiveType === 'shape_circle')) {
    effectiveType = 'coin';
  }

  return (
    <div className={`quiz-visual quiz-visual-${effectiveType}`} aria-hidden="true">
      {/* 1. OBJEK NYATA: RUMAH (ATAP SEGITIGA + BADAN PERSEGI) */}
      {effectiveType === 'house' && (
        <>
          <div className="qv-roof" />
          <div className="qv-body">
            <div className="qv-window" />
            <div className="qv-door" />
          </div>
        </>
      )}

      {/* 2. OBJEK NYATA: POTONGAN PIZZA */}
      {effectiveType === 'pizza' && (
        <div className="qv-pizza">
          <span className="qv-pepperoni p1" />
          <span className="qv-pepperoni p2" />
          <span className="qv-pepperoni p3" />
        </div>
      )}

      {/* 3. OBJEK NYATA: PINTU KAYU PERSEGI PANJANG */}
      {effectiveType === 'door' && (
        <div className="qv-door-frame">
          <div className="qv-door-leaf">
            <span className="qv-door-knob" />
          </div>
        </div>
      )}

      {/* 4. OBJEK NYATA: JAM DINDING LINGKARAN */}
      {effectiveType === 'clock' && (
        <div className="qv-clock">
          <span className="qv-clock-hand hour" />
          <span className="qv-clock-hand minute" />
          <span className="qv-clock-dot" />
        </div>
      )}

      {/* 5. OBJEK NYATA: BUKU CATATAN */}
      {effectiveType === 'book' && (
        <div className="qv-book">
          <div className="qv-book-lines" />
          <div className="qv-book-lines short" />
        </div>
      )}

      {/* 6. OBJEK NYATA: PAPAN CATUR (PERSEGI 4 SISI SAMA) */}
      {effectiveType === 'chessboard' && (
        <svg width="130" height="115" viewBox="0 0 130 115" className="qv-svg">
          <defs>
            <linearGradient id="boardWood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <rect x="15" y="8" width="100" height="96" rx="8" fill="url(#boardWood)" stroke="#451a03" strokeWidth="3" />
          <rect x="21" y="14" width="88" height="84" fill="#ffffff" rx="4" />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={21 + c * 22}
                y={14 + r * 21}
                width="22"
                height="21"
                fill={(r + c) % 2 === 1 ? '#0f172a' : '#f8fafc'}
              />
            ))
          )}
          <text x="65" y="112" textAnchor="middle" fill="#78350f" fontSize="9.5" fontWeight="800">
            Papan Catur (Persegi)
          </text>
        </svg>
      )}

      {/* 7. OBJEK NYATA: KOIN EMAS LINGKARAN */}
      {effectiveType === 'coin' && (
        <svg width="130" height="115" viewBox="0 0 130 115" className="qv-svg">
          <defs>
            <linearGradient id="coinGoldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <circle cx="65" cy="54" r="44" fill="url(#coinGoldGrad)" stroke="#854d0e" strokeWidth="3.5" />
          <circle cx="65" cy="54" r="37" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="4 2" />
          <text x="65" y="62" textAnchor="middle" fill="#713f12" fontSize="26">
            🪙
          </text>
          <text x="65" y="110" textAnchor="middle" fill="#854d0e" fontSize="9.5" fontWeight="800">
            Uang Koin (Lingkaran)
          </text>
        </svg>
      )}

      {/* 8. BANGUN DATAR: PERSEGI (4 SISI SAMA & 4 SIKU-SIKU) */}
      {effectiveType === 'shape_square' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="sqGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <rect x="25" y="12" width="85" height="85" rx="8" fill="url(#sqGrad)" stroke="#0369a1" strokeWidth="3.5" />
          {/* Tanda Siku-siku */}
          <path d="M 25 24 L 37 24 L 37 12" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 98 12 L 98 24 L 110 24" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 25 85 L 37 85 L 37 97" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 98 97 L 98 85 L 110 85" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          {/* Tanda sisi sama panjang */}
          <line x1="67" y1="7" x2="67" y2="17" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="67" y1="92" x2="67" y2="102" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="54" x2="30" y2="54" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="105" y1="54" x2="115" y2="54" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <text x="67" y="52" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
            PERSEGI
          </text>
          <text x="67" y="68" textAnchor="middle" fill="#e0f2fe" fontSize="9.5" fontWeight="800">
            s = sisi
          </text>
          <text x="67" y="112" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="800">
            4 Sisi Sama Panjang
          </text>
        </svg>
      )}

      {/* 9. BANGUN DATAR: PERSEGI PANJANG */}
      {effectiveType === 'shape_rectangle' && (
        <svg width="145" height="115" viewBox="0 0 145 115" className="qv-svg">
          <defs>
            <linearGradient id="rectGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <rect x="18" y="22" width="110" height="65" rx="8" fill="url(#rectGrad)" stroke="#15803d" strokeWidth="3.5" />
          {/* Tanda Siku-siku */}
          <path d="M 18 34 L 28 34 L 28 22" fill="none" stroke="#ffffff" strokeWidth="2" />
          <path d="M 118 22 L 118 34 L 128 34" fill="none" stroke="#ffffff" strokeWidth="2" />
          <text x="73" y="16" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="800">
            Panjang (p)
          </text>
          <text x="73" y="58" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
            PERSEGI PANJANG
          </text>
          <text x="73" y="73" textAnchor="middle" fill="#dcfce7" fontSize="9" fontWeight="700">
            K = 2 × (p + l)
          </text>
          <text x="73" y="105" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="800">
            Lebar (l) di kanan-kiri
          </text>
        </svg>
      )}

      {/* 10. BANGUN DATAR: SEGITIGA SAMA SISI */}
      {effectiveType === 'shape_triangle' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="triGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <polygon
            points="67,12 120,95 15,95"
            fill="url(#triGrad)"
            stroke="#d97706"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Titik Sudut */}
          <circle cx="67" cy="12" r="3.5" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
          <circle cx="120" cy="95" r="3.5" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
          <circle cx="15" cy="95" r="3.5" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
          <text x="67" y="62" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="900">
            SEGITIGA
          </text>
          <text x="67" y="78" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="800">
            3 Sisi & 3 Sudut
          </text>
          <text x="67" y="110" textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="800">
            Total Sudut = 180°
          </text>
        </svg>
      )}

      {/* 11. BANGUN DATAR: SEGITIGA SIKU-SIKU (90 DERAJAT) */}
      {effectiveType === 'shape_triangle_right' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="triRightGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <polygon
            points="25,18 25,95 115,95"
            fill="url(#triRightGrad)"
            stroke="#c2410c"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Tanda siku-siku 90° */}
          <path d="M 25 78 L 42 78 L 42 95" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <text x="12" y="58" textAnchor="middle" fill="#c2410c" fontSize="9.5" fontWeight="800">
            tinggi
          </text>
          <text x="70" y="108" textAnchor="middle" fill="#c2410c" fontSize="9.5" fontWeight="800">
            alas (a)
          </text>
          <text x="82" y="52" textAnchor="middle" fill="#7c2d12" fontSize="9" fontWeight="800">
            miring (c)
          </text>
          <text x="56" y="70" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
            90°
          </text>
        </svg>
      )}

      {/* 12. BANGUN DATAR: SEGITIGA SAMA KAKI */}
      {effectiveType === 'shape_triangle_isosceles' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="triIsoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          <polygon
            points="67,14 116,98 18,98"
            fill="url(#triIsoGrad)"
            stroke="#ca8a04"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* 2 Sisi sama */}
          <line x1="38" y1="56" x2="46" y2="52" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="88" y1="52" x2="96" y2="56" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <text x="67" y="68" textAnchor="middle" fill="#713f12" fontSize="10.5" fontWeight="900">
            SAMA KAKI
          </text>
          <text x="67" y="82" textAnchor="middle" fill="#854d0e" fontSize="9" fontWeight="800">
            2 Sisi Sama Panjang
          </text>
        </svg>
      )}

      {/* 13. BANGUN DATAR: LINGKARAN (JARI-JARI & TITIK PUSAT) */}
      {(effectiveType === 'shape_circle' || effectiveType === 'shape_circle_radius') && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="circGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>
          <circle cx="67" cy="54" r="44" fill="url(#circGrad)" stroke="#be185d" strokeWidth="3.5" />
          {/* Titik pusat O dan garis jari-jari r */}
          <circle cx="67" cy="54" r="3.5" fill="#ffffff" />
          <line x1="67" y1="54" x2="111" y2="54" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" />
          <circle cx="111" cy="54" r="2.5" fill="#ffffff" />
          <text x="89" y="48" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
            r
          </text>
          <text x="67" y="78" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
            LINGKARAN
          </text>
          <text x="67" y="110" textAnchor="middle" fill="#be185d" fontSize="9" fontWeight="800">
            r = jari-jari • d = 2 × r
          </text>
        </svg>
      )}

      {/* 14. BANGUN DATAR: LINGKARAN DENGAN DIAMETER d */}
      {effectiveType === 'shape_circle_diameter' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="circDiamGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>
          <circle cx="67" cy="54" r="44" fill="url(#circDiamGrad)" stroke="#9d174d" strokeWidth="3.5" />
          {/* Garis diameter d penuh melalui pusat */}
          <line x1="23" y1="54" x2="111" y2="54" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="67" cy="54" r="4" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
          <text x="67" y="46" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
            Diameter (d)
          </text>
          <text x="67" y="80" textAnchor="middle" fill="#fdf2f8" fontSize="10" fontWeight="900">
            K = π × d
          </text>
          <text x="67" y="110" textAnchor="middle" fill="#9d174d" fontSize="9" fontWeight="800">
            Garis Tengah Melewati Pusat
          </text>
        </svg>
      )}

      {/* 15. BANGUN DATAR: JURING / BAGIAN LINGKARAN */}
      {effectiveType === 'shape_circle_sector' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="sectorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="67" cy="54" r="42" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
          {/* Juring 90 derajat */}
          <path d="M 67 54 L 67 12 A 42 42 0 0 1 109 54 Z" fill="url(#sectorGrad)" stroke="#d97706" strokeWidth="3" />
          <circle cx="67" cy="54" r="3.5" fill="#d97706" />
          <text x="90" y="38" textAnchor="middle" fill="#78350f" fontSize="9.5" fontWeight="900">
            Juring
          </text>
          <text x="67" y="80" textAnchor="middle" fill="#475569" fontSize="10.5" fontWeight="900">
            BAGIAN LINGKARAN
          </text>
          <text x="67" y="110" textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="800">
            Dibatasi 2 Jari-jari & 1 Busur
          </text>
        </svg>
      )}

      {/* 16. BANGUN DATAR: JAJAR GENJANG */}
      {effectiveType === 'shape_parallelogram' && (
        <svg width="145" height="115" viewBox="0 0 145 115" className="qv-svg">
          <defs>
            <linearGradient id="paraGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
          <polygon
            points="38,20 135,20 107,90 10,90"
            fill="url(#paraGrad)"
            stroke="#115e59"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Garis tinggi t putus-putus */}
          <line x1="38" y1="20" x2="38" y2="90" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M 38 80 L 46 80 L 46 90" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <text x="30" y="55" textAnchor="end" fill="#ffffff" fontSize="9.5" fontWeight="800">
            t
          </text>
          <text x="58" y="106" textAnchor="middle" fill="#115e59" fontSize="10" fontWeight="800">
            alas (a)
          </text>
          <text x="78" y="58" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="900">
            JAJAR GENJANG
          </text>
          <text x="126" y="55" textAnchor="start" fill="#115e59" fontSize="9" fontWeight="800">
            sisi (b)
          </text>
        </svg>
      )}

      {/* 17. BANGUN DATAR: BELAH KETUPAT */}
      {effectiveType === 'shape_rhombus' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="rhoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <polygon
            points="67,10 120,56 67,102 14,56"
            fill="url(#rhoGrad)"
            stroke="#9a3412"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Diagonal d1 dan d2 */}
          <line x1="67" y1="10" x2="67" y2="102" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="14" y1="56" x2="120" y2="56" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          <text x="67" y="46" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="900">
            BELAH KETUPAT
          </text>
          <text x="67" y="70" textAnchor="middle" fill="#ffedd5" fontSize="8.5" fontWeight="800">
            4 Sisi Sama Panjang
          </text>
          <text x="67" y="112" textAnchor="middle" fill="#9a3412" fontSize="9" fontWeight="800">
            Diagonal Tegak Lurus
          </text>
        </svg>
      )}

      {/* 18. BANGUN DATAR: TRAPESIUM */}
      {effectiveType === 'shape_trapezoid' && (
        <svg width="145" height="115" viewBox="0 0 145 115" className="qv-svg">
          <defs>
            <linearGradient id="trapGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
          <polygon
            points="35,22 110,22 135,92 10,92"
            fill="url(#trapGrad)"
            stroke="#6b21a8"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <text x="72" y="16" textAnchor="middle" fill="#6b21a8" fontSize="9.5" fontWeight="800">
            sisi atas (a)
          </text>
          <text x="72" y="60" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
            TRAPESIUM
          </text>
          <text x="72" y="74" textAnchor="middle" fill="#f3e8ff" fontSize="9" fontWeight="700">
            1 Pasang Sisi Sejajar
          </text>
          <text x="72" y="108" textAnchor="middle" fill="#6b21a8" fontSize="9.5" fontWeight="800">
            sisi alas (b)
          </text>
        </svg>
      )}

      {/* 19. BANGUN GABUNGAN: RUMAH (ATAP SEGITIGA + DINDING PERSEGI) */}
      {effectiveType === 'shape_composite_house' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          {/* Atap Segitiga */}
          <polygon points="67,8 120,46 14,46" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" strokeLinejoin="round" />
          {/* Dinding Persegi */}
          <rect x="24" y="46" width="86" height="56" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
          {/* Garis batas dalam putus-putus */}
          <line x1="24" y1="46" x2="110" y2="46" stroke="#b91c1c" strokeWidth="2" strokeDasharray="3 2" />
          {/* Pintu dan Jendela */}
          <rect x="53" y="70" width="22" height="32" rx="2" fill="#92400e" />
          <rect x="80" y="58" width="16" height="16" rx="2" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" />
          <rect x="36" y="58" width="16" height="16" rx="2" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" />
          <text x="67" y="38" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
            ATAP
          </text>
          <text x="67" y="112" textAnchor="middle" fill="#b91c1c" fontSize="8.5" fontWeight="800">
            Keliling = Hanya Sisi Luar!
          </text>
        </svg>
      )}

      {/* 20. BANGUN GABUNGAN: LINTASAN LARI STADIUM */}
      {effectiveType === 'shape_composite_track' && (
        <svg width="145" height="115" viewBox="0 0 145 115" className="qv-svg">
          <defs>
            <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <rect x="36" y="26" width="73" height="58" fill="url(#trackGrad)" stroke="#991b1b" strokeWidth="3" />
          {/* Lengkung kiri & kanan */}
          <path d="M 36 26 A 29 29 0 0 0 36 84 Z" fill="url(#trackGrad)" stroke="#991b1b" strokeWidth="3" />
          <path d="M 109 26 A 29 29 0 0 1 109 84 Z" fill="url(#trackGrad)" stroke="#991b1b" strokeWidth="3" />
          {/* Garis batas dalam putus-putus */}
          <line x1="36" y1="26" x2="36" y2="84" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="109" y1="26" x2="109" y2="84" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          <text x="72" y="58" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
            LINTASAN LARI
          </text>
          <text x="72" y="72" textAnchor="middle" fill="#fee2e2" fontSize="8" fontWeight="700">
            Persegi Panjang + 2 Lengkung
          </text>
          <text x="72" y="106" textAnchor="middle" fill="#991b1b" fontSize="9" fontWeight="800">
            Keliling = 2 Lurus + 2 Lengkung
          </text>
        </svg>
      )}

      {/* 21. BANGUN GABUNGAN: BENTUK HURUF L */}
      {effectiveType === 'shape_composite_l' && (
        <svg width="135" height="115" viewBox="0 0 135 115" className="qv-svg">
          <defs>
            <linearGradient id="lGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <polygon
            points="24,14 62,14 62,54 110,54 110,98 24,98"
            fill="url(#lGrad)"
            stroke="#1d4ed8"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <text x="67" y="42" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="900">
            BANGUN L
          </text>
          <text x="67" y="80" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">
            6 Ruas Sisi Luar
          </text>
          <text x="67" y="112" textAnchor="middle" fill="#1d4ed8" fontSize="9" fontWeight="800">
            Keliling = Jumlah Seluruh 6 Sisi
          </text>
        </svg>
      )}
    </div>
  );
};
