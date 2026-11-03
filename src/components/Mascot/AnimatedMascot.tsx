import React from 'react';
import './AnimatedMascot.css';

export type MascotAnimationState = 'idle' | 'walk' | 'jump' | 'fall' | 'land';
export type MascotDirection = 'left' | 'right';

export interface AnimatedMascotProps {
  state?: MascotAnimationState;
  direction?: MascotDirection;
  size?: number | string;
  isGrounded?: boolean;
  walkSpeed?: number; // Kecepatan siklus animasi jalan (dalam detik, default 0.65s)
  showShadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * AnimatedMascot:
 * Komponen rig modular karakter maskot Petualang Segitiga.
 * Berisi 9 layer terpisah dari mascot_assets/manifest.json
 * dengan pivot poin dan hirarki anatomi presisi tinggi.
 */
export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  state = 'idle',
  direction = 'right',
  size = 200,
  showShadow = true,
  walkSpeed = 0.65,
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
          <g className="mascot-entire-body">
            {/* 1. Arm Fist (Tangan Kanan / Belakang) - z: 1 */}
            <g
              className="mascot-part mascot-arm-fist"
              style={{ transformOrigin: '818px 500px' }}
            >
              <image
                href="/mascot_assets/01_arm_fist.png"
                x="778"
                y="370"
                width="171"
                height="181"
              />
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
              {/* 7. Badan Utama Segitiga Kuning */}
              <image
                href="/mascot_assets/07_body.png"
                x="204"
                y="35"
                width="672"
                height="691"
              />
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
};
