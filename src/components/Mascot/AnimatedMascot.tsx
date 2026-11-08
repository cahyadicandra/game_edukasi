import React from 'react';
import './AnimatedMascot.css';
import { CHARACTER_SKINS } from '../../data/weaponParts';

export type MascotAnimationState = 'idle' | 'walk' | 'jump' | 'fall' | 'land';
export type MascotDirection = 'left' | 'right';

export interface AnimatedMascotProps {
  state?: MascotAnimationState;
  direction?: MascotDirection;
  size?: number | string;
  isGrounded?: boolean;
  walkSpeed?: number; // Kecepatan siklus animasi jalan (dalam detik, default 0.65s)
  showShadow?: boolean;
  skinColor?: string;
  hat?: string;
  weapon?: 'blaster' | 'none';
  weaponColorFilter?: string;
  isShooting?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * AnimatedMascot:
 * Komponen rig modular karakter maskot Petualang Segitiga.
 * Berisi 9 layer terpisah dari mascot_assets/manifest.json
 * dengan pivot poin dan hirarki anatomi presisi tinggi,
 * serta dukungan kustomisasi warna kulit (skin) dan aksesoris (hat).
 */
export const AnimatedMascot: React.FC<AnimatedMascotProps> = React.memo(({
  state = 'idle',
  direction = 'right',
  size = 200,
  showShadow = true,
  walkSpeed = 0.65,
  skinColor = 'default',
  hat = 'none',
  weapon = 'none',
  weaponColorFilter,
  isShooting = false,
  className = '',
  style,
  onClick,
}) => {
  const containerStyle: React.CSSProperties = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    ...style,
  };

  const animationSpeedStyle = {
    '--mascot-walk-speed': `${walkSpeed}s`,
  } as React.CSSProperties;

  // Temukan filter warna kulit yang sesuai
  const activeSkin = CHARACTER_SKINS.find((s) => s.id === skinColor);
  const skinFilter = activeSkin && activeSkin.filter !== 'none' ? activeSkin.filter : undefined;

  return (
    <div
      className={`animated-mascot-root ${className}`}
      style={containerStyle}
      onClick={onClick}
    >
      {/* Bayangan di tanah yang merespons animasi melompat/berjalan */}
      {showShadow && (
        <div
          className={`mascot-shadow state-${state} dir-${direction}`}
          aria-hidden="true"
        />
      )}

      {/* Kontainer Rig Karakter yang mendukung flip arah hadap */}
      <div
        className={`mascot-rig-wrapper state-${state} dir-${direction}`}
        style={animationSpeedStyle}
      >
        <svg
          viewBox="0 0 1024 1024"
          className="mascot-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="crownGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <g className="mascot-entire-body">
            {/* 1. Arm Fist (Tangan Kanan / Belakang) - z: 1 */}
            <g
              className="mascot-part mascot-arm-fist"
              style={{ transformOrigin: '818px 500px' }}
            >
              {/* Lengan dan Kepalan Tangan Maskot */}
              <image
                href="/mascot_assets/01_arm_fist.png"
                x="778"
                y="370"
                width="171"
                height="181"
                style={{ filter: skinFilter }}
              />

              {/* SENJATA BLASTER DI GENGGAMAN TANGAN */}
              {weapon === 'blaster' && (
                <g className="mascot-weapon-in-hand">
                  {/* Sprite Senjata Blaster Ukuran Jumbo Mantap & Pas di Tangan */}
                  <image
                    href="/assets/png/attack/blaster.png"
                    x="677"
                    y="235"
                    width="500"
                    height="300"
                    style={{
                      filter: `${weaponColorFilter ? weaponColorFilter + ' ' : ''}drop-shadow(0 8px 14px rgba(0, 0, 0, 0.5))`,
                    }}
                  />

                  {/* Jari-Jari Maskot yang Menggenggam Mantap Gagang Senjata */}
                  <g className="mascot-grip-fingers" style={{ filter: skinFilter }}>
                    <rect x="850" y="405" width="48" height="22" rx="11" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
                    <rect x="844" y="432" width="52" height="22" rx="11" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
                    <rect x="838" y="459" width="48" height="22" rx="11" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
                    <ellipse cx="826" cy="398" rx="16" ry="22" fill="#facc15" stroke="#ca8a04" strokeWidth="3" transform="rotate(-25 826 398)" />
                  </g>

                  {/* Muzzle Flash Animasi Saat Menembak Tepat di Ujung Laras */}
                  {isShooting && (
                    <image
                      href="/assets/png/attack/muzzle_flash.png"
                      x="1025"
                      y="260"
                      width="185"
                      height="185"
                    />
                  )}
                </g>
              )}
            </g>

            {/* 2 & 3. Leg Back Group (Kaki Belakang: Paha + Sepatu) - z: 2 & 3 */}
            <g
              className="mascot-part mascot-leg-back-group"
              style={{ transformOrigin: '509.4px 679.2px' }}
            >
              {/* Paha Kaki Belakang */}
              <image
                href="/mascot_assets/02_leg_back.png"
                x="287"
                y="657"
                width="254"
                height="170"
              />
              {/* Sepatu Kaki Belakang dengan sendi ankle */}
              <g
                className="mascot-part mascot-boot-back"
                style={{ transformOrigin: '333.3px 778.7px' }}
              >
                <image
                  href="/mascot_assets/03_boot_back.png"
                  x="229"
                  y="714"
                  width="185"
                  height="243"
                />
              </g>
            </g>

            {/* 4 & 5. Leg Front Group (Kaki Depan: Paha + Sepatu) - z: 4 & 5 */}
            <g
              className="mascot-part mascot-leg-front-group"
              style={{ transformOrigin: '495.7px 658.5px' }}
            >
              {/* Paha Kaki Depan */}
              <image
                href="/mascot_assets/04_leg_front.png"
                x="458"
                y="628"
                width="279"
                height="218"
              />
              {/* Sepatu Kaki Depan dengan sendi ankle */}
              <g
                className="mascot-part mascot-boot-front"
                style={{ transformOrigin: '683px 771.6px' }}
              >
                <image
                  href="/mascot_assets/05_boot_front.png"
                  x="601"
                  y="733"
                  width="295"
                  height="271"
                />
              </g>
            </g>

            {/* 6, 7, 8, 9. Torso Group (Ransel, Badan, Tali, Tangan Depan) - z: 6, 7, 8, 9 */}
            <g
              className="mascot-part mascot-torso-group"
              style={{ transformOrigin: '545px 715px' }}
            >
              {/* 6. Ransel Petualang */}
              <image
                href="/mascot_assets/06_pack.png"
                x="52"
                y="179"
                width="343"
                height="528"
              />
              {/* 7. Badan Utama Segitiga Kuning (Diberi Filter Kustomisasi Warna) */}
              <image
                href="/mascot_assets/07_body.png"
                x="204"
                y="35"
                width="672"
                height="691"
                style={{ filter: skinFilter }}
              />

              {/* AKSESORI KUSTOMISASI: KACAMATA */}
              {hat === 'glasses' && (
                <g className="mascot-acc-glasses" transform="translate(425, 290)">
                  <rect x="0" y="0" width="105" height="65" rx="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="5" />
                  <rect x="135" y="0" width="105" height="65" rx="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="5" />
                  <path d="M 105,20 L 135,20" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                  <line x1="18" y1="12" x2="55" y2="52" stroke="rgba(255,255,255,0.45)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="153" y1="12" x2="190" y2="52" stroke="rgba(255,255,255,0.45)" strokeWidth="6" strokeLinecap="round" />
                </g>
              )}

              {/* AKSESORI KUSTOMISASI: MAHKOTA RAJA */}
              {hat === 'crown' && (
                <g className="mascot-hat-crown" transform="translate(420, -35)">
                  <path d="M 0,90 L 30,15 L 85,55 L 140,5 L 195,55 L 250,15 L 280,90 Z" fill="url(#crownGoldGrad)" stroke="#b45309" strokeWidth="5" />
                  <circle cx="30" cy="15" r="9" fill="#ef4444" stroke="#fff" strokeWidth="2.5" />
                  <circle cx="140" cy="5" r="12" fill="#3b82f6" stroke="#fff" strokeWidth="2.5" />
                  <circle cx="250" cy="15" r="9" fill="#10b981" stroke="#fff" strokeWidth="2.5" />
                  <rect x="0" y="84" width="280" height="20" rx="8" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
                </g>
              )}

              {/* AKSESORI KUSTOMISASI: TOPI PRAMUKA RIMBA */}
              {hat === 'scout' && (
                <g className="mascot-hat-scout" transform="translate(365, -55)">
                  <ellipse cx="170" cy="120" rx="190" ry="38" fill="#78350f" stroke="#451a03" strokeWidth="4" />
                  <path d="M 50,115 C 65,20 275,20 290,115 Z" fill="#92400e" stroke="#451a03" strokeWidth="4" />
                  <path d="M 62,102 C 110,88 230,88 278,102 L 283,115 C 230,100 110,100 57,115 Z" fill="#15803d" />
                </g>
              )}

              {/* AKSESORI KUSTOMISASI: TOPI PENYIHIR BINTANG */}
              {hat === 'wizard' && (
                <g className="mascot-hat-wizard" transform="translate(370, -115)">
                  <ellipse cx="170" cy="180" rx="180" ry="32" fill="#3730a3" stroke="#1e1b4b" strokeWidth="4" />
                  <path d="M 55,175 Q 160,55 270,-15 Q 220,65 285,175 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="4" />
                  <ellipse cx="170" cy="170" rx="115" ry="16" fill="#f59e0b" />
                  <text x="215" y="60" fontSize="32">⭐</text>
                </g>
              )}

              {/* AKSESORI KUSTOMISASI: TOPI SPORTY */}
              {hat === 'cap' && (
                <g className="mascot-hat-cap" transform="translate(400, -25)">
                  <path d="M 100,90 Q 250,65 280,110 Q 180,110 95,95 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="3" />
                  <path d="M 30,90 C 35,10 230,10 235,90 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="4" />
                  <circle cx="132" cy="14" r="8" fill="#fff" />
                </g>
              )}
              {/* 8. Tali Selempang Ransel */}
              <image
                href="/mascot_assets/08_strap.png"
                x="256"
                y="376"
                width="133"
                height="255"
              />
              {/* 9. Tangan Depan Pemegang Tali */}
              <g
                className="mascot-part mascot-arm-strap"
                style={{ transformOrigin: '318px 482px' }}
              >
                <image
                  href="/mascot_assets/09_arm_strap.png"
                  x="144"
                  y="428"
                  width="191"
                  height="232"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
});
