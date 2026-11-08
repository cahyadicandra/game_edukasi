import React from 'react';
import type { IslandThemeKey } from '../../data/rpgLevelConfigs';
import './RPGIslandBackdrop.css';

export interface RPGIslandBackdropProps {
  islandTheme: IslandThemeKey;
  cameraX: number;
  levelWidth: number;
}

export const RPGIslandBackdrop: React.FC<RPGIslandBackdropProps> = React.memo(({
  islandTheme,
  cameraX,
  levelWidth,
}) => {
  // Parallax offsets agar latar belakang bergerak lebih lambat dibanding platform
  const mountainOffset = cameraX * 0.08;
  const farOffset = cameraX * 0.15;
  const midOffset = cameraX * 0.28;

  return (
    <div className={`rpg-island-backdrop theme-${islandTheme}`} aria-hidden="true">
      {/* LAPISAN PARALLAX ALAM: PEGUNUNGAN & BUKIT PNG (TILED RINGAN) */}
      <div
        className="parallax-png-mountains"
        style={{ transform: `translate3d(${-mountainOffset}px, 0, 0)` }}
      />

      <div
        className="parallax-png-hills-far"
        style={{ transform: `translate3d(${-farOffset}px, 0, 0)` }}
      />

      <div
        className="parallax-png-hills-near"
        style={{ transform: `translate3d(${-midOffset}px, 0, 0)` }}
      />

      {/* 1. PULAU BENTUK: LEMBAH HIJAU TROPIS & AWAN CERIA */}
      {islandTheme === 'pulau-bentuk' && (
        <div className="backdrop-layer-group pulau-bentuk">
          <div className="sun-corona" />
          <div
            className="parallax-far-hills"
            style={{ transform: `translate3d(${-farOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1600 300" preserveAspectRatio="none" className="hills-svg far">
              <path
                d="M0,200 Q200,80 450,190 T900,120 T1350,170 T1600,100 L1600,300 L0,300 Z"
                fill="#86efac"
                opacity="0.6"
              />
              <path
                d="M0,230 Q250,120 500,210 T1000,140 T1500,200 T1600,150 L1600,300 L0,300 Z"
                fill="#4ade80"
                opacity="0.75"
              />
            </svg>
          </div>
          <div
            className="parallax-mid-hills"
            style={{ transform: `translate3d(${-midOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1600 240" preserveAspectRatio="none" className="hills-svg mid">
              <path
                d="M0,170 Q180,60 400,140 T800,80 T1200,150 T1600,90 L1600,240 L0,240 Z"
                fill="#22c55e"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>
      )}

      {/* 2. HUTAN SEGI EMPAT: KANOPI RIMBA HIJAU ZAMRUD & KUNANG-KUNANG */}
      {islandTheme === 'hutan-segi-empat' && (
        <div className="backdrop-layer-group hutan-segi-empat">
          <div className="forest-mist-glow" />
          {/* Siluet Pepohonan Purba Kanopi Hutan Rimba */}
          <div
            className="parallax-forest-trees far"
            style={{ transform: `translate3d(${-farOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 340" preserveAspectRatio="none" className="trees-svg far">
              <path
                d="M0,340 L0,160 L40,160 L60,80 L80,160 L140,160 L180,60 L220,160 L320,160 L360,90 L400,160 L500,160 L550,50 L600,160 L720,160 L770,70 L820,160 L940,160 L990,40 L1040,160 L1180,160 L1230,80 L1280,160 L1400,160 L1400,340 Z"
                fill="#064e3b"
                opacity="0.75"
              />
            </svg>
          </div>
          <div
            className="parallax-forest-trees near"
            style={{ transform: `translate3d(${-midOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 300" preserveAspectRatio="none" className="trees-svg near">
              <path
                d="M0,300 L0,140 L80,140 L120,40 L160,140 L280,140 L340,30 L400,140 L560,140 L620,20 L680,140 L840,140 L900,30 L960,140 L1120,140 L1180,10 L1240,140 L1400,140 L1400,300 Z"
                fill="#022c22"
                opacity="0.9"
              />
            </svg>
          </div>
          {/* Kunang-kunang berpijar di kanopi hutan */}
          <div className="forest-fireflies-container">
            <div className="firefly ff-1" />
            <div className="firefly ff-2" />
            <div className="firefly ff-3" />
            <div className="firefly ff-4" />
            <div className="firefly ff-5" />
            <div className="firefly ff-6" />
          </div>
        </div>
      )}

      {/* 3. PEGUNUNGAN SEGITIGA: PUNCAK ES ALPINE & SALJU MELAYANG */}
      {islandTheme === 'pegunungan-segitiga' && (
        <div className="backdrop-layer-group pegunungan-segitiga">
          <div className="mountain-aurora-glow" />
          {/* Deretan Puncak Gunung Segitiga Bersalju */}
          <div
            className="parallax-mountains far"
            style={{ transform: `translate3d(${-farOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 320" preserveAspectRatio="none" className="mountains-svg far">
              <polygon points="100,60 0,320 200,320" fill="#312e81" opacity="0.6" />
              <polygon points="100,60 80,120 120,120" fill="#e0e7ff" />
              <polygon points="350,30 180,320 520,320" fill="#3730a3" opacity="0.75" />
              <polygon points="350,30 310,110 390,110" fill="#ffffff" />
              <polygon points="680,70 500,320 860,320" fill="#312e81" opacity="0.6" />
              <polygon points="680,70 650,130 710,130" fill="#e0e7ff" />
              <polygon points="1020,40 850,320 1190,320" fill="#3730a3" opacity="0.75" />
              <polygon points="1020,40 980,120 1060,120" fill="#ffffff" />
              <polygon points="1300,60 1150,320 1400,320" fill="#312e81" opacity="0.6" />
            </svg>
          </div>
          <div
            className="parallax-mountains near"
            style={{ transform: `translate3d(${-midOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 280" preserveAspectRatio="none" className="mountains-svg near">
              <polygon points="220,50 60,280 380,280" fill="#1e1b4b" opacity="0.9" />
              <polygon points="220,50 180,120 260,120" fill="#ffffff" />
              <polygon points="560,30 380,280 740,280" fill="#1e1b4b" opacity="0.9" />
              <polygon points="560,30 510,110 610,110" fill="#ffffff" />
              <polygon points="900,60 720,280 1080,280" fill="#1e1b4b" opacity="0.9" />
              <polygon points="900,60 860,130 940,130" fill="#ffffff" />
              <polygon points="1240,40 1050,280 1400,280" fill="#1e1b4b" opacity="0.9" />
              <polygon points="1240,40 1190,110 1290,110" fill="#ffffff" />
            </svg>
          </div>
          {/* Efek Salju Berhamburan */}
          <div className="snowfall-container">
            <div className="snowflake sf-1" />
            <div className="snowflake sf-2" />
            <div className="snowflake sf-3" />
            <div className="snowflake sf-4" />
            <div className="snowflake sf-5" />
            <div className="snowflake sf-6" />
          </div>
        </div>
      )}

      {/* 4. DANAU LINGKARAN: AIR TOSKA SENJA MAGIS & GELEMBUNG AIR */}
      {islandTheme === 'danau-lingkaran' && (
        <div className="backdrop-layer-group danau-lingkaran">
          <div className="lake-sunset-glow" />
          {/* Riak Gelombang Danau Air Toska */}
          <div
            className="parallax-lake-water far"
            style={{ transform: `translate3d(${-farOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 240" preserveAspectRatio="none" className="lake-svg far">
              <path
                d="M0,130 Q175,90 350,130 T700,130 T1050,130 T1400,130 L1400,240 L0,240 Z"
                fill="#0f766e"
                opacity="0.6"
              />
            </svg>
          </div>
          <div
            className="parallax-lake-water near"
            style={{ transform: `translate3d(${-midOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 200" preserveAspectRatio="none" className="lake-svg near">
              <path
                d="M0,90 Q175,50 350,90 T700,90 T1050,90 T1400,90 L1400,200 L0,200 Z"
                fill="#042f2e"
                opacity="0.85"
              />
              {/* Lingkaran Teratai Air Magis */}
              <circle cx="280" cy="85" r="30" fill="none" stroke="#5eead4" strokeWidth="2" opacity="0.6" />
              <circle cx="280" cy="85" r="14" fill="#2dd4bf" opacity="0.5" />
              <circle cx="780" cy="90" r="38" fill="none" stroke="#5eead4" strokeWidth="2" opacity="0.6" />
              <circle cx="780" cy="90" r="18" fill="#2dd4bf" opacity="0.5" />
              <circle cx="1200" cy="82" r="28" fill="none" stroke="#5eead4" strokeWidth="2" opacity="0.6" />
              <circle cx="1200" cy="82" r="12" fill="#2dd4bf" opacity="0.5" />
            </svg>
          </div>
          {/* Gelembung Air Berpijar Mengapung */}
          <div className="lake-bubbles-container">
            <div className="aqua-bubble ab-1" />
            <div className="aqua-bubble ab-2" />
            <div className="aqua-bubble ab-3" />
            <div className="aqua-bubble ab-4" />
            <div className="aqua-bubble ab-5" />
          </div>
        </div>
      )}

      {/* 5. KASTIL GEOMETRI: BENTENG ANGKASA KOSMIK & BINTANG KELAP-KELIP */}
      {islandTheme === 'kastil-geometri' && (
        <div className="backdrop-layer-group kastil-geometri">
          <div className="cosmic-nebula-glow" />
          {/* Siluet Menara Kastil Geometri Kristal Megah */}
          <div
            className="parallax-castle-citadel far"
            style={{ transform: `translate3d(${-farOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 360" preserveAspectRatio="none" className="castle-svg far">
              {/* Menara-menara Kastil di Kejauhan */}
              <rect x="180" y="110" width="80" height="250" fill="#3b0764" opacity="0.65" />
              <polygon points="220,40 170,110 270,110" fill="#e879f9" opacity="0.8" />
              <rect x="520" y="80" width="120" height="280" fill="#4c1d95" opacity="0.7" />
              <polygon points="580,10 500,80 660,80" fill="#facc15" opacity="0.9" />
              <rect x="880" y="120" width="90" height="240" fill="#3b0764" opacity="0.65" />
              <polygon points="925,50 865,120 985,120" fill="#e879f9" opacity="0.8" />
              <rect x="1180" y="90" width="110" height="270" fill="#4c1d95" opacity="0.7" />
              <polygon points="1235,20 1165,90 1305,90" fill="#facc15" opacity="0.9" />
              <path d="M0,260 L1400,260 L1400,360 L0,360 Z" fill="#2e1065" opacity="0.75" />
            </svg>
          </div>
          <div
            className="parallax-castle-citadel near"
            style={{ transform: `translate3d(${-midOffset}px, 0, 0)`, width: `${levelWidth + 800}px` }}
          >
            <svg viewBox="0 0 1400 300" preserveAspectRatio="none" className="castle-svg near">
              <rect x="340" y="90" width="100" height="210" fill="#1e103f" opacity="0.9" />
              <polygon points="390,20 330,90 450,90" fill="#d946ef" />
              <rect x="740" y="60" width="130" height="240" fill="#0f0728" opacity="0.95" />
              <polygon points="805,0 725,60 885,60" fill="#fde047" />
              <rect x="1050" y="100" width="90" height="200" fill="#1e103f" opacity="0.9" />
              <polygon points="1095,30 1035,100 1155,100" fill="#d946ef" />
              <path d="M0,220 L1400,220 L1400,300 L0,300 Z" fill="#090314" opacity="0.95" />
            </svg>
          </div>
          {/* Bintang-Bintang Kosmik Kelap-kelip */}
          <div className="cosmic-stars-container">
            <div className="c-star st-1" />
            <div className="c-star st-2" />
            <div className="c-star st-3" />
            <div className="c-star st-4" />
            <div className="c-star st-5" />
            <div className="c-star st-6" />
            <div className="c-star st-7" />
            <div className="c-star st-8" />
          </div>
        </div>
      )}
    </div>
  );
});
