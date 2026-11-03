import React from 'react';
import type { GachaItem } from '../../data/gachaItems';

interface ItemIconRendererProps {
  item: GachaItem;
  size?: number;
  className?: string;
  isSilhouette?: boolean;
}

export const ItemIconRenderer: React.FC<ItemIconRendererProps> = ({
  item,
  size = 48,
  className = '',
  isSilhouette = false,
}) => {
  if (isSilhouette) {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size} className={className}>
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
        <text x="24" y="29" fill="#64748b" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          ?
        </text>
      </svg>
    );
  }

  const renderSvg = () => {
    switch (item.id) {
      // ── 1. RAMUAN MERAH RUBY (HP) ──
      case 'item-potion-hp':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="hpLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="45%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="corkWoodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            {/* Tutup Botol Gabus */}
            <rect x="20" y="4" width="8" height="5" rx="1.5" fill="url(#corkWoodGrad)" stroke="#78350f" strokeWidth="1" />
            <rect x="18" y="8" width="12" height="3" rx="1.5" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
            {/* Leher Botol Kaca */}
            <rect x="21" y="9" width="6" height="7" fill="rgba(255,255,255,0.7)" stroke="#ffffff" strokeWidth="1" />
            {/* Badan Labu Bulat */}
            <circle cx="24" cy="28" r="14" fill="url(#hpLiquidGrad)" stroke="#ffffff" strokeWidth="2.5" />
            {/* Cairan Gelembung Bersinar */}
            <circle cx="19" cy="24" r="2.5" fill="#ffffff" opacity="0.65" />
            <circle cx="28" cy="30" r="1.8" fill="#ffffff" opacity="0.5" />
            <circle cx="22" cy="33" r="1.5" fill="#ffffff" opacity="0.4" />
            {/* Tanda Palang Penyembuh Merah-Putih */}
            <rect x="22" y="24" width="4" height="10" rx="1" fill="#ffffff" />
            <rect x="19" y="27" width="10" height="4" rx="1" fill="#ffffff" />
          </svg>
        );

      // ── 2. ELIKSIR BIRU SAFIR (SP) ──
      case 'item-elixir-sp':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="spLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            <rect x="20" y="4" width="8" height="5" rx="1" fill="#a855f7" stroke="#6b21a8" strokeWidth="1" />
            <rect x="17" y="8" width="14" height="3" rx="1.5" fill="#e0e7ff" />
            {/* Botol Bentuk Kristal Segi Enam */}
            <polygon points="24,12 36,19 36,37 24,44 12,37 12,19" fill="url(#spLiquidGrad)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
            {/* Kilau Petir Energi */}
            <polygon points="25,18 20,28 24,28 23,38 30,26 26,26" fill="#fde047" stroke="#d97706" strokeWidth="1" />
            <circle cx="17" cy="22" r="1.5" fill="#ffffff" opacity="0.8" />
          </svg>
        );

      // ── 3. TIKET BANTUAN 50:50 ──
      case 'item-5050-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="ticketRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <rect x="4" y="8" width="40" height="32" rx="6" fill="url(#ticketRedGrad)" stroke="#fef2f2" strokeWidth="2" />
            <circle cx="4" cy="24" r="5" fill="#ffffff" />
            <circle cx="44" cy="24" r="5" fill="#ffffff" />
            <line x1="15" y1="11" x2="15" y2="37" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.85" />
            {/* Target 50:50 */}
            <circle cx="29" cy="24" r="9" fill="#ffffff" />
            <circle cx="29" cy="24" r="6" fill="#ef4444" />
            <circle cx="29" cy="24" r="2.5" fill="#ffffff" />
            <text x="29" y="14" fill="#ffffff" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              50:50
            </text>
          </svg>
        );

      // ── 4. TIKET PETUNJUK RUMUS (x1 atau x2) ──
      case 'item-hint-1':
      case 'item-hint-2':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="ticketBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="bulbGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect x="4" y="8" width="40" height="32" rx="6" fill="url(#ticketBlueGrad)" stroke="#f0f9ff" strokeWidth="2" />
            <circle cx="4" cy="24" r="5" fill="#ffffff" />
            <circle cx="44" cy="24" r="5" fill="#ffffff" />
            <line x1="15" y1="11" x2="15" y2="37" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.85" />
            {/* Lampu Bohlam Ide */}
            <path d="M29 14 C25 14, 23 17, 23 20 C23 23, 25 25, 26 27 L32 27 C33 25, 35 23, 35 20 C35 17, 33 14, 29 14 Z" fill="url(#bulbGoldGrad)" />
            <rect x="26.5" y="27" width="5" height="3" rx="1" fill="#e2e8f0" />
            <circle cx="29" cy="20" r="2" fill="#ffffff" opacity="0.8" />
          </svg>
        );

      // ── 5. KANTONG KOIN EMAS (+100 🪙) ──
      case 'item-coins-100':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="coinStackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            {/* Tumpukan Koin Emas */}
            <ellipse cx="18" cy="36" rx="12" ry="5" fill="#b45309" />
            <ellipse cx="18" cy="33" rx="12" ry="5" fill="url(#coinStackGrad)" stroke="#ffffff" strokeWidth="1.5" />
            <ellipse cx="28" cy="32" rx="13" ry="5.5" fill="#92400e" />
            <ellipse cx="28" cy="28" rx="13" ry="5.5" fill="url(#coinStackGrad)" stroke="#ffffff" strokeWidth="1.5" />
            {/* Koin Depan Berdiri */}
            <circle cx="25" cy="19" r="11" fill="url(#coinStackGrad)" stroke="#ffffff" strokeWidth="2" />
            <circle cx="25" cy="19" r="8" fill="none" stroke="#b45309" strokeWidth="1.2" strokeDasharray="3 2" />
            <text x="25" y="23" fill="#78350f" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              🪙
            </text>
          </svg>
        );

      // ── 6. KANTONG BINTANG MINI (+25 ⭐) ──
      case 'item-stars-25':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="pouchBrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="60%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <path d="M12 20 C12 14, 36 14, 36 20 L40 38 C40 43, 8 43, 8 38 Z" fill="url(#pouchBrownGrad)" stroke="#f59e0b" strokeWidth="2" />
            <path d="M14 20 Q24 23 34 20" stroke="#fef08a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <polygon points="24,24 26.5,29.5 32.5,30 28,34 29.5,40 24,36.5 18.5,40 20,34 15.5,30 21.5,29.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />
          </svg>
        );

      // ── 7. KANTONG PERMATA (+10 💎) ──
      case 'item-gems-10':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="gemPouchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>
            <path d="M12 20 C12 14, 36 14, 36 20 L40 38 C40 43, 8 43, 8 38 Z" fill="url(#gemPouchGrad)" stroke="#38bdf8" strokeWidth="2" />
            <path d="M14 20 Q24 23 34 20" stroke="#bae6fd" strokeWidth="3" fill="none" strokeLinecap="round" />
            <polygon points="24,25 31,30 24,40 17,30" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <polygon points="24,25 31,30 24,32 17,30" fill="#bae6fd" />
          </svg>
        );

      // ── 8. PAKET BANTUAN SUPER (COMBO) ──
      case 'item-combo-bundle':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="boxPurpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
            </defs>
            <rect x="8" y="16" width="32" height="26" rx="5" fill="url(#boxPurpGrad)" stroke="#f3e8ff" strokeWidth="2" />
            <rect x="6" y="12" width="36" height="8" rx="3" fill="#c084fc" stroke="#f3e8ff" strokeWidth="1.5" />
            <rect x="22" y="12" width="4" height="30" fill="#facc15" />
            <circle cx="24" cy="12" r="3.5" fill="#f59e0b" />
          </svg>
        );

      // ── 9. PEDANG PENGGARIS KRISTAL (SENJATA ATK) ──
      case 'item-ruler-crystal':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="swordBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Bilah Pedang Penggaris */}
            <polygon points="38,8 40,12 18,34 14,30" fill="url(#swordBladeGrad)" stroke="#ffffff" strokeWidth="1.8" />
            {/* Tanda Skala Milimeter Penggaris */}
            <line x1="20" y1="28" x2="23" y2="25" stroke="#ffffff" strokeWidth="1" />
            <line x1="24" y1="24" x2="27" y2="21" stroke="#ffffff" strokeWidth="1" />
            <line x1="28" y1="20" x2="31" y2="17" stroke="#ffffff" strokeWidth="1" />
            <line x1="32" y1="16" x2="35" y2="13" stroke="#ffffff" strokeWidth="1" />
            {/* Gagang & Pelindung Tangan Emas */}
            <rect x="11" y="31" width="10" height="3.5" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="1" transform="rotate(-45 16 33)" />
            <rect x="8" y="36" width="4" height="7" rx="1.5" fill="#78350f" transform="rotate(-45 10 39.5)" />
            <circle cx="7" cy="42" r="2.5" fill="#facc15" />
          </svg>
        );

      // ── 10. PERISAI BUSUR DERAJAT SAKTI (PERISAI DEF) ──
      case 'item-protractor-shield':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* Badan Perisai Busur 180 Derajat */}
            <path d="M8 14 Q24 6 40 14 L36 32 Q24 44 12 32 Z" fill="url(#shieldGrad)" stroke="#ffffff" strokeWidth="2.5" />
            {/* Garis Busur Derajat di Dalam */}
            <path d="M14 20 A10 10 0 0 1 34 20 Z" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx="24" cy="20" r="2" fill="#1d4ed8" />
            <line x1="24" y1="10" x2="24" y2="13" stroke="#1d4ed8" strokeWidth="1" />
            <line x1="17" y1="13" x2="19" y2="15" stroke="#1d4ed8" strokeWidth="1" />
            <line x1="31" y1="13" x2="29" y2="15" stroke="#1d4ed8" strokeWidth="1" />
          </svg>
        );

      // ── 11. KARTU BENTUK: SEGITIGA SIKU-SIKU ──
      case 'card-tri-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Segitiga Siku-Siku Kuning Emas */}
            <polygon points="12,36 12,12 36,36" fill="#facc15" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
            {/* Tanda Sudut 90 Derajat */}
            <polyline points="12,30 18,30 18,36" fill="none" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="36" cy="12" r="2.5" fill="#f59e0b" />
          </svg>
        );

      // ── 12. KARTU BENTUK: PERSEGI UBIN ──
      case 'card-sq-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" />
            {/* Persegi Hijau */}
            <rect x="13" y="13" width="22" height="22" rx="4" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            {/* Pola Kisi Grid Persegi */}
            <line x1="24" y1="13" x2="24" y2="35" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="13" y1="24" x2="35" y2="24" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );

      // ── 13. KARTU BENTUK: PERSEGI PANJANG ZAMRUD ──
      case 'card-rect-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Persegi Panjang Biru */}
            <rect x="10" y="16" width="28" height="16" rx="3.5" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
            <line x1="10" y1="24" x2="38" y2="24" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          </svg>
        );

      // ── 14. KARTU BENTUK: JAJAR GENJANG EMAS ──
      case 'card-parallelogram-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />
            <polygon points="17,16 38,16 31,32 10,32" fill="#fbbf24" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
            <line x1="17" y1="16" x2="17" y2="32" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        );

      // ── 15. KARTU BENTUK: TRAPESIUM PIRAMIDA ──
      case 'card-trapezoid-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#fff7ed" stroke="#f97316" strokeWidth="2.5" />
            <polygon points="18,16 30,16 38,32 10,32" fill="#fb923c" stroke="#c2410c" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        );

      // ── 16. KARTU BENTUK: LAYANG-LAYANG PELANGI ──
      case 'card-kite-1':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#faf5ff" stroke="#a855f7" strokeWidth="2.5" />
            <polygon points="24,10 36,22 24,38 12,22" fill="#c084fc" stroke="#6b21a8" strokeWidth="2" strokeLinejoin="round" />
            <line x1="24" y1="10" x2="24" y2="38" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="36" y2="22" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );

      // ── 17. KARTU BENTUK: BELAH KETUPAT SAFIR ──
      case 'card-diamond-rhombus':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#ecfeff" stroke="#06b6d4" strokeWidth="2.5" />
            <polygon points="24,11 37,24 24,37 11,24" fill="#22d3ee" stroke="#0e7490" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="24,16 32,24 24,32 16,24" fill="#67e8f9" />
          </svg>
        );

      // ── 18. KARTU BENTUK: LINGKARAN SEMPURNA ──
      case 'card-circle-compass':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="13" fill="#f472b6" stroke="#be185d" strokeWidth="2" />
            <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
            <line x1="24" y1="24" x2="37" y2="24" stroke="#ffffff" strokeWidth="2" />
            <text x="30" y="21" fill="#ffffff" fontSize="7" fontWeight="bold">r</text>
          </svg>
        );

      // ── 19. KARTU HEKSAGON SARANG LEBAH ──
      case 'card-hexagon-honey':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#fefce8" stroke="#ca8a04" strokeWidth="2.5" />
            <polygon points="24,11 36,17.5 36,30.5 24,37 12,30.5 12,17.5" fill="#fde047" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="24" cy="24" r="3.5" fill="#ca8a04" />
          </svg>
        );

      // ── 20. KARTU PENTAGON PERISAI BINTANG ──
      case 'card-pentagon-shield':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2.5" />
            <polygon points="24,11 36,20 31,34 17,34 12,20" fill="#a78bfa" stroke="#5b21b6" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="24,16 26,22 32,22 27,26 29,32 24,28 19,32 21,26 16,22 22,22" fill="#ffffff" />
          </svg>
        );

      // ── 21. KARTU CANDI PIRAMIDA EMAS ──
      case 'card-pyramid-gold':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2.5" />
            <polygon points="24,10 38,34 10,34" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            <line x1="24" y1="10" x2="28" y2="34" stroke="#d97706" strokeWidth="1.5" />
            <line x1="16" y1="26" x2="34" y2="26" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="20" y1="18" x2="30" y2="18" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );

      // ── 22. KARTU KASTIL GEOMETRI 3D ──
      case 'card-castle-geom':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="5" y="5" width="38" height="38" rx="8" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
            {/* Tembok & Menara Kastil */}
            <rect x="14" y="22" width="20" height="15" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
            <polygon points="24,10 20,18 28,18" fill="#ef4444" />
            <rect x="22" y="18" width="4" height="6" fill="#cbd5e1" />
            <polygon points="14,14 11,20 17,20" fill="#3b82f6" />
            <polygon points="34,14 31,20 37,20" fill="#3b82f6" />
            <rect x="22" y="29" width="4" height="8" rx="2" fill="#1e293b" />
          </svg>
        );

      // ── 23. BUSUR DERAJAT PELANGI KRISTAL (LEGENDARY CARD) ──
      case 'card-ruler-crystal':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="40" height="40" rx="9" fill="#0f172a" stroke="url(#rainbowGrad)" strokeWidth="3" />
            <path d="M12 28 A12 12 0 0 1 36 28 Z" fill="none" stroke="url(#rainbowGrad)" strokeWidth="3" />
            <circle cx="24" cy="28" r="3" fill="#ffffff" />
            <polygon points="24,12 25.5,15 28.5,15 26,17 27,20 24,18 21,20 22,17 19.5,15 22.5,15" fill="#facc15" />
          </svg>
        );

      // ── 24. MAHKOTA JUARA GEOMETRI ──
      case 'acc-crown-gold':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <polygon points="8,36 12,18 20,26 24,14 28,26 36,18 40,36" fill="url(#crownGrad)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="18" r="2.5" fill="#ef4444" />
            <circle cx="24" cy="14" r="3" fill="#3b82f6" />
            <circle cx="36" cy="18" r="2.5" fill="#ef4444" />
            <rect x="8" y="34" width="32" height="5" rx="2" fill="#b45309" />
          </svg>
        );

      // ── 25. RANSEL BINTANG PELANGI ──
      case 'acc-backpack-rainbow':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <rect x="12" y="14" width="24" height="26" rx="6" fill="#f43f5e" stroke="#881337" strokeWidth="2" />
            <rect x="16" y="24" width="16" height="13" rx="3" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
            <path d="M18 14 C18 9, 30 9, 30 14" stroke="#facc15" strokeWidth="3" fill="none" />
            <circle cx="24" cy="30" r="2" fill="#ffffff" />
          </svg>
        );

      // ── 26. TOPI PETUALANG CILIK ──
      case 'acc-hat-adventurer':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <ellipse cx="24" cy="32" rx="18" ry="5" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
            <path d="M14 31 C14 20, 34 20, 34 31 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <rect x="14" y="28" width="20" height="3" fill="#15803d" />
          </svg>
        );

      // ── 27. KACAMATA CENDEKIA BULAT ──
      case 'acc-glasses-smart':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <circle cx="16" cy="24" r="9" fill="rgba(224,242,254,0.7)" stroke="#d97706" strokeWidth="2.5" />
            <circle cx="32" cy="24" r="9" fill="rgba(224,242,254,0.7)" stroke="#d97706" strokeWidth="2.5" />
            <line x1="25" y1="23" x2="23" y2="23" stroke="#d97706" strokeWidth="2.5" />
            <path d="M7 23 L2 21" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M41 23 L46 21" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // ── 28. AVATAR PENYIHIR ──
      case 'avatar-wizard':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <circle cx="24" cy="24" r="20" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
            {/* Topi Kerucut */}
            <polygon points="24,6 12,24 36,24" fill="#4338ca" />
            <ellipse cx="24" cy="24" rx="15" ry="3.5" fill="#312e81" />
            <circle cx="24" cy="26" r="8" fill="#fed7aa" />
            {/* Janggut Putih */}
            <path d="M18 29 Q24 38 30 29 Z" fill="#ffffff" />
            <circle cx="21" cy="25" r="1.2" fill="#1e1b4b" />
            <circle cx="27" cy="25" r="1.2" fill="#1e1b4b" />
          </svg>
        );

      // ── 29. AVATAR PUTRI ──
      case 'avatar-princess':
        return (
          <svg viewBox="0 0 48 48" width={size} height={size}>
            <circle cx="24" cy="24" r="20" fill="#fdf2f8" stroke="#db2777" strokeWidth="2" />
            {/* Rambut Emas */}
            <path d="M12 20 C12 10, 36 10, 36 20 C36 34, 32 38, 30 40 C28 41, 20 41, 18 40 C16 38, 12 34, 12 20 Z" fill="#d97706" />
            <circle cx="24" cy="24" r="9" fill="#ffedd5" />
            {/* Mahkota Mini */}
            <polygon points="18,17 21,12 24,15 27,12 30,17" fill="#facc15" stroke="#b45309" strokeWidth="1" />
            <circle cx="21" cy="24" r="1.3" fill="#831843" />
            <circle cx="27" cy="24" r="1.3" fill="#831843" />
            <path d="M22 28 Q24 30 26 28" stroke="#e11d48" strokeWidth="1.2" fill="none" />
          </svg>
        );

      // DEFAULT FALLBACK
      default:
        return (
          <div
            style={{
              width: size,
              height: size,
              fontSize: size * 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </div>
        );
    }
  };

  return <div className={`gacha-item-icon-wrapper ${className}`}>{renderSvg()}</div>;
};
