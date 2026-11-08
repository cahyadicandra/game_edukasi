import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedMascot, type MascotAnimationState, type MascotDirection } from './AnimatedMascot';
import { ArrowLeft, ArrowRight, ArrowUp, Sparkles, RotateCcw } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './PlayableMascot.css';

export interface PlayableMascotProps {
  initialX?: number; // Persentase 0 - 100
  characterSize?: number;
  minX?: number; // Batas kiri persentase (default 5%)
  maxX?: number; // Batas kanan persentase (default 95%)
  showControls?: boolean;
  enableKeyboard?: boolean;
  showInfoBadge?: boolean;
  customGroundY?: number; // Offset piksel dari bawah
  className?: string;
  onPositionChange?: (x: number, y: number) => void;
  onJump?: () => void;
  onLand?: () => void;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  dir: number;
}

export const PlayableMascot: React.FC<PlayableMascotProps> = ({
  initialX = 50,
  characterSize = 160,
  minX = 6,
  maxX = 94,
  showControls = true,
  enableKeyboard = true,
  showInfoBadge = true,
  customGroundY = 24,
  className = '',
  onPositionChange,
  onJump,
  onLand,
}) => {
  // Posisi fisik
  const [posX, setPosX] = useState(initialX); // dalam % dari kontainer
  const [posY, setPosY] = useState(0); // dalam px dari lantai (0 = di tanah)
  const [facing, setFacing] = useState<MascotDirection>('right');
  const [state, setState] = useState<MascotAnimationState>('idle');

  // Input states
  const keysDown = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Fisika internal (ref agar mulus di requestAnimationFrame)
  const posRef = useRef({ x: initialX, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const isGroundedRef = useRef(true);
  const facingRef = useRef<MascotDirection>('right');
  const landingTimeoutRef = useRef<number | null>(null);
  const [particles, setParticles] = useState<DustParticle[]>([]);

  // Trigger partikel debu saat mendarat
  const spawnLandParticles = useCallback((xPercent: number) => {
    const id = Date.now();
    const newParticles: DustParticle[] = [
      { id: id, x: xPercent - 2, y: 0, dir: -1 },
      { id: id + 1, x: xPercent + 2, y: 0, dir: 1 },
      { id: id + 2, x: xPercent - 4, y: 0, dir: -1.5 },
      { id: id + 3, x: xPercent + 4, y: 0, dir: 1.5 },
    ];
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 450);
  }, []);

  // Fungsi Lompat
  const doJump = useCallback(() => {
    if (isGroundedRef.current || posRef.current.y <= 2) {
      isGroundedRef.current = false;
      velRef.current.vy = 22; // Kecepatan impuls awal lompat
      setState('jump');

      try {
        Haptics.impact({ style: ImpactStyle.Light });
      } catch {
        // Fallback untuk browser desktop
      }

      if (onJump) onJump();
    }
  }, [onJump]);

  // Handler keyboard
  useEffect(() => {
    if (!enableKeyboard) return;

    const isJumpKey = (e: KeyboardEvent) =>
      e.code === 'Space' ||
      e.code === 'ArrowUp' ||
      e.code === 'KeyW' ||
      e.key === ' ' ||
      e.key === 'ArrowUp' ||
      e.key === 'w' ||
      e.key === 'W';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Mencegah scroll halaman saat menekan tombol panah atau spasi
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(e.code) || e.key === ' ') {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysDown.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysDown.current.right = true;
      }
      if (isJumpKey(e)) {
        if (!keysDown.current.jump) {
          keysDown.current.jump = true;
          doJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysDown.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysDown.current.right = false;
      }
      if (isJumpKey(e)) {
        keysDown.current.jump = false;
      }
    };

    const resetKeys = () => {
      keysDown.current.left = false;
      keysDown.current.right = false;
      keysDown.current.jump = false;
      velRef.current.vx = 0;
    };

    // Listener sentuh global harus bernama agar bisa dilepas (anti memory-leak)
    const resetTouchKeys = () => {
      keysDown.current.left = false;
      keysDown.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetKeys);
    window.addEventListener('pointerup', resetTouchKeys);
    window.addEventListener('pointercancel', resetTouchKeys);
    window.addEventListener('touchend', resetTouchKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetKeys);
      window.removeEventListener('pointerup', resetTouchKeys);
      window.removeEventListener('pointercancel', resetTouchKeys);
      window.removeEventListener('touchend', resetTouchKeys);
    };
  }, [enableKeyboard, doJump]);

  // Game Physics Loop menggunakan requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap delta time
      lastTime = currentTime;

      const keys = keysDown.current;
      const vel = velRef.current;
      const pos = posRef.current;

      // 1. Akselerasi Horizontal
      const moveSpeed = 42; // persen layar per detik
      const accel = 180;
      const friction = 140;

      let targetVx = 0;
      if (keys.left && !keys.right) {
        targetVx = -moveSpeed;
        if (facingRef.current !== 'left') {
          facingRef.current = 'left';
          setFacing('left');
        }
      } else if (keys.right && !keys.left) {
        targetVx = moveSpeed;
        if (facingRef.current !== 'right') {
          facingRef.current = 'right';
          setFacing('right');
        }
      }

      if (targetVx !== 0) {
        // Berjalan/berlari
        if (vel.vx < targetVx) {
          vel.vx = Math.min(targetVx, vel.vx + accel * dt);
        } else if (vel.vx > targetVx) {
          vel.vx = Math.max(targetVx, vel.vx - accel * dt);
        }
      } else {
        // Perlambatan (friksi)
        if (Math.abs(vel.vx) < 1.5) {
          vel.vx = 0;
        } else if (vel.vx > 0) {
          vel.vx = Math.max(0, vel.vx - friction * dt);
        } else if (vel.vx < 0) {
          vel.vx = Math.min(0, vel.vx + friction * dt);
        }
      }

      // Kunci diam di tanah jika tidak ada input arah (Anti-drift)
      if (isGroundedRef.current && !keys.left && !keys.right && Math.abs(vel.vx) < 2) {
        vel.vx = 0;
      }

      // Update posisi X dengan batas tepi layar
      pos.x += vel.vx * dt;
      if (pos.x < minX) {
        pos.x = minX;
        vel.vx = 0;
      } else if (pos.x > maxX) {
        pos.x = maxX;
        vel.vx = 0;
      }

      // 2. Fisika Vertikal (Gravitasi & Lompatan)
      const gravity = 55; // percepatan gravitasi px/s^2

      if (!isGroundedRef.current) {
        pos.y += vel.vy;
        vel.vy -= gravity * dt * 15; // penyesuaian skala piksel

        // Deteksi Pendaratan
        if (pos.y <= 0) {
          pos.y = 0;
          vel.vy = 0;
          isGroundedRef.current = true;

          // Animasi landing squash
          setState('land');
          spawnLandParticles(pos.x);
          if (onLand) onLand();

          try {
            Haptics.impact({ style: ImpactStyle.Light });
          } catch {
            // Ignore
          }

          if (landingTimeoutRef.current) clearTimeout(landingTimeoutRef.current);
          landingTimeoutRef.current = window.setTimeout(() => {
            if (isGroundedRef.current) {
              setState(Math.abs(vel.vx) > 1 ? 'walk' : 'idle');
            }
          }, 110);
        } else {
          // Sedang di udara
          if (vel.vy > 0) {
            setState('jump');
          } else {
            setState('fall');
          }
        }
      } else {
        // Sedang di tanah
        if (state !== 'land') {
          if (Math.abs(vel.vx) > 1.2) {
            setState('walk');
          } else {
            setState('idle');
          }
        }
      }

      // Sync ke React state
      setPosX(pos.x);
      setPosY(pos.y);
      if (onPositionChange) {
        onPositionChange(pos.x, pos.y);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      if (landingTimeoutRef.current) clearTimeout(landingTimeoutRef.current);
    };
  }, [minX, maxX, spawnLandParticles, state, onPositionChange, onLand]);

  // Reset Posisi
  const handleReset = () => {
    posRef.current = { x: initialX, y: 0 };
    velRef.current = { vx: 0, vy: 0 };
    isGroundedRef.current = true;
    setPosX(initialX);
    setPosY(0);
    setState('idle');
  };

  return (
    <div className={`playable-mascot-arena ${className}`}>
      {/* Indikator Status & Panduan Tombol */}
      {showInfoBadge && (
        <div className="mascot-status-badge">
          <span className="mascot-badge-pill">
            <Sparkles size={14} className="mascot-badge-icon" />
            Status: <strong>{state.toUpperCase()}</strong> ({facing === 'right' ? 'Kanan' : 'Kiri'})
          </span>
          <span className="mascot-badge-hint">
            Keyboard: ⬅️ / ➡️ atau A / D | Loncat: Spasi / ⬆️
          </span>
        </div>
      )}

      {/* Area Karakter */}
      <div
        className="playable-mascot-track"
        style={{ bottom: `${customGroundY}px` }}
      >
        {/* Karakter Maskot dengan Posisi Dinamis X & Y */}
        <div
          className="playable-mascot-entity"
          style={{
            left: `${posX}%`,
            transform: `translate(-50%, ${-posY}px)`,
          }}
        >
          <AnimatedMascot
            state={state}
            direction={facing}
            size={characterSize}
            showShadow={true}
            walkSpeed={0.55}
          />
        </div>

        {/* Efek Partikel Debu saat mendarat di tanah */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="dust-particle"
            style={{
              left: `${p.x}%`,
              '--particle-dir': p.dir,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* On-screen Virtual Controller untuk Mobile / Layar Sentuh */}
      {showControls && (
        <div className="virtual-controller-overlay">
          {/* D-Pad Kiri & Kanan */}
          <div className="virtual-dpad">
            <button
              type="button"
              className="ctrl-btn btn-left"
              title="Gerak Kiri"
              onPointerDown={(e) => {
                e.preventDefault();
                keysDown.current.left = true;
              }}
              onPointerUp={() => {
                keysDown.current.left = false;
              }}
              onPointerLeave={() => {
                keysDown.current.left = false;
              }}
            >
              <ArrowLeft size={28} />
              <span className="btn-label">Kiri</span>
            </button>

            <button
              type="button"
              className="ctrl-btn btn-right"
              title="Gerak Kanan"
              onPointerDown={(e) => {
                e.preventDefault();
                keysDown.current.right = true;
              }}
              onPointerUp={() => {
                keysDown.current.right = false;
              }}
              onPointerLeave={() => {
                keysDown.current.right = false;
              }}
            >
              <ArrowRight size={28} />
              <span className="btn-label">Kanan</span>
            </button>
          </div>

          {/* Tombol Aksi Loncat & Reset */}
          <div className="virtual-actions">
            <button
              type="button"
              className="ctrl-btn btn-reset"
              onClick={handleReset}
              title="Reset Posisi Maskot"
            >
              <RotateCcw size={20} />
            </button>

            <button
              type="button"
              className="ctrl-btn btn-jump"
              title="Loncat!"
              onPointerDown={(e) => {
                e.preventDefault();
                doJump();
              }}
            >
              <ArrowUp size={32} />
              <span className="btn-jump-text">LONCAT</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
