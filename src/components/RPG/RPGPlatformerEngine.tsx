import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedMascot, type MascotAnimationState, type MascotDirection } from '../Mascot/AnimatedMascot';
import type { RPGLevelConfig, PlatformDef, CollectibleDef } from '../../data/rpgLevelConfigs';
import type { GeometryMonster } from '../../data/monsters';
import { RPGIslandBackdrop } from './RPGIslandBackdrop';
import { ArrowLeft, ArrowRight, ArrowUp, Coins, Heart, Clock, Sparkles, RotateCcw } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './RPGPlatformerEngine.css';

export interface RPGPlatformerEngineProps {
  levelConfig: RPGLevelConfig;
  boss?: GeometryMonster;
  onReachBoss: (stats: { coins: number; timeSec: number; heartsRemaining: number }) => void;
  onQuit: () => void;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const RPGPlatformerEngine: React.FC<RPGPlatformerEngineProps> = ({
  levelConfig,
  boss,
  onReachBoss,
  onQuit,
}) => {
  // Viewport & Kamera
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth || 900);
  const [cameraX, setCameraX] = useState(0);

  // Status Pemain
  const [playerX, setPlayerX] = useState(levelConfig.playerStartX);
  const [playerY, setPlayerY] = useState(levelConfig.playerStartY);
  const [facing, setFacing] = useState<MascotDirection>('right');
  const [animState, setAnimState] = useState<MascotAnimationState>('idle');
  const [hearts, setHearts] = useState(3);
  const [coins, setCoins] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTransitioningToBoss, setIsTransitioningToBoss] = useState(false);

  // Koleksi & Item
  const [collectibles, setCollectibles] = useState<CollectibleDef[]>(levelConfig.collectibles);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Synchronous Refs untuk loop 60fps bebas stutter
  const heartsRef = useRef(3);
  const coinsRef = useRef(0);
  const timeElapsedRef = useRef(0);
  const hasReachedBossRef = useRef(false);

  // Platform interaktif (moving, fading, springs)
  const [dynamicPlatforms] = useState<PlatformDef[]>(levelConfig.platforms);
  const movingOffsetsRef = useRef<Record<string, { offsetX: number; offsetY: number }>>({});
  const platformElsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const fadingTimersRef = useRef<Record<string, { timer: number; visible: boolean }>>({});
  const [fadedPlatIds, setFadedPlatIds] = useState<Record<string, boolean>>({});

  // Physics Refs (untuk 60fps tanpa re-render berlebih)
  const playerPosRef = useRef({ x: levelConfig.playerStartX, y: levelConfig.playerStartY });
  const playerVelRef = useRef({ vx: 0, vy: 0 });
  const isGroundedRef = useRef(false);
  const coyoteTimerRef = useRef(0);
  const lastSafePlatformRef = useRef({ x: levelConfig.playerStartX, y: levelConfig.playerStartY });
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Ukuran hit-box karakter
  const charWidth = 64;
  const charHeight = 84;

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer Detik Level
  useEffect(() => {
    if (isGameOver || isTransitioningToBoss) return;
    const interval = setInterval(() => {
      setTimeElapsed((t) => {
        const next = t + 1;
        timeElapsedRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, isTransitioningToBoss]);

  // Haptic feedback aman
  const triggerHaptic = (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      Haptics.impact({ style });
    } catch {
      // Ignore
    }
  };

  // Tampilkan teks mengambang saat mengumpulkan koin/token
  const addFloatingText = (x: number, y: number, text: string, color = '#facc15') => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 900);
  };

  // Fungsi Utama Loncat Maskot
  const doJump = useCallback(() => {
    if (isGameOver || isTransitioningToBoss) return;
    // Loncat jika di tanah atau dalam toleransi coyote time (0.2s)
    if (isGroundedRef.current || coyoteTimerRef.current > 0) {
      isGroundedRef.current = false;
      coyoteTimerRef.current = 0;
      // Impuls kecepatan lompat (px/detik) yang kuat dan mantap
      const jumpImpulse = levelConfig.mechanic === 'low_gravity' ? -800 : -720;
      playerVelRef.current.vy = jumpImpulse;
      setAnimState('jump');
      triggerHaptic(ImpactStyle.Light);
    }
  }, [isGameOver, isTransitioningToBoss, levelConfig.mechanic]);

  // Keyboard Event Listener
  useEffect(() => {
    const isJumpKey = (e: KeyboardEvent) =>
      e.code === 'Space' ||
      e.code === 'ArrowUp' ||
      e.code === 'KeyW' ||
      e.key === ' ' ||
      e.key === 'ArrowUp' ||
      e.key === 'w' ||
      e.key === 'W';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isTransitioningToBoss) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(e.code) || e.key === ' ') {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
      }
      if (isJumpKey(e)) {
        if (!keysRef.current.jump) {
          keysRef.current.jump = true;
          doJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
      }
      if (isJumpKey(e)) {
        keysRef.current.jump = false;
      }
    };

    const resetAllKeys = () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.jump = false;
      playerVelRef.current.vx = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetAllKeys);
    window.addEventListener('pointerup', () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
    });
    window.addEventListener('touchend', () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
    });
    window.addEventListener('touchcancel', () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetAllKeys);
    };
  }, [isGameOver, isTransitioningToBoss, doJump]);

  // Touch Controller Jump Handler
  const handleTouchJump = () => {
    doJump();
  };

  // Reset Karakter saat Jatuh ke Jurang
  const handlePlayerFall = useCallback(() => {
    triggerHaptic(ImpactStyle.Heavy);
    setHearts((h) => {
      const nextH = Math.max(0, h - 1);
      heartsRef.current = nextH;
      if (nextH <= 0) {
        setIsGameOver(true);
      }
      return nextH;
    });

    // Respawn di platform aman terakhir
    playerPosRef.current = {
      x: lastSafePlatformRef.current.x,
      y: lastSafePlatformRef.current.y - 40,
    };
    playerVelRef.current = { vx: 0, vy: 0 };
    isGroundedRef.current = false;
    setPlayerX(playerPosRef.current.x);
    setPlayerY(playerPosRef.current.y);
  }, []);

  // GAME PHYSICS & COLLISION LOOP (60 FPS)
  useEffect(() => {
    if (isGameOver || isTransitioningToBoss) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const keys = keysRef.current;
      const pos = playerPosRef.current;
      const vel = playerVelRef.current;

      // 1. UPDATE PLATFORM DINAMIS (Moving Platforms via Direct Hardware Transform)
      let currentPlatformDx = 0;
      let currentPlatformDy = 0;

      for (const plat of dynamicPlatforms) {
        if (plat.isMoving && plat.moveRangeX && plat.moveSpeedX) {
          const offsetX = Math.sin((time / 1000) * plat.moveSpeedX) * plat.moveRangeX;
          const offsetY = plat.moveRangeY && plat.moveSpeedY
            ? Math.cos((time / 1000) * plat.moveSpeedY) * plat.moveRangeY
            : 0;

          movingOffsetsRef.current[plat.id] = { offsetX, offsetY };

          const el = platformElsRef.current[plat.id];
          if (el) {
            el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
          }

          // Cek apakah karakter sedang berdiri di atas platform ini
          const platSurfaceY = plat.y + 24;
          const isPlayerOnPlat =
            isGroundedRef.current &&
            Math.abs(pos.y - platSurfaceY) < 8 &&
            pos.x >= plat.x + offsetX &&
            pos.x <= plat.x + offsetX + plat.width;

          if (isPlayerOnPlat) {
            currentPlatformDx = Math.cos((time / 1000) * plat.moveSpeedX) * plat.moveRangeX * plat.moveSpeedX * dt;
            currentPlatformDy = offsetY * dt;
          }
        }
      }

      // 2. INPUT & HORIZONTAL MOVEMENT
      const moveSpeed = levelConfig.mechanic === 'crumbling_bridge' ? 440 : 360;
      const accel = 1800;
      const friction = 1600;

      let targetVx = 0;
      if (keys.left && !keys.right) {
        targetVx = -moveSpeed;
        setFacing('left');
      } else if (keys.right && !keys.left) {
        targetVx = moveSpeed;
        setFacing('right');
      }

      // Hembusan angin hanya memengaruhi saat melayang di udara (tidak menggeser saat diam di tanah)
      if (levelConfig.mechanic === 'wind_gusts' && !isGroundedRef.current) {
        const windCycle = Math.sin(time / 1500);
        if (windCycle > 0.1) {
          targetVx += windCycle * 140;
        }
      }

      // Akselerasi / Friksi yang mengunci diam total saat tidak disentuh
      if (targetVx !== 0) {
        if (vel.vx < targetVx) vel.vx = Math.min(targetVx, vel.vx + accel * dt);
        else if (vel.vx > targetVx) vel.vx = Math.max(targetVx, vel.vx - accel * dt);
      } else {
        // Karakter didiamkan: Hentikan total kecepatan dan jangan gerak sendiri!
        if (Math.abs(vel.vx) < 15) {
          vel.vx = 0;
        } else if (vel.vx > 0) {
          vel.vx = Math.max(0, vel.vx - friction * dt);
        } else if (vel.vx < 0) {
          vel.vx = Math.min(0, vel.vx + friction * dt);
        }
      }

      // Kunci diam di tanah jika tidak ada tombol arah yang ditekan
      if (isGroundedRef.current && !keys.left && !keys.right && Math.abs(vel.vx) < 25) {
        vel.vx = 0;
      }

      // Update posisi X dengan moving platform drift
      pos.x += (vel.vx * dt) + currentPlatformDx;
      if (pos.x < 40) {
        pos.x = 40;
        vel.vx = 0;
      }
      if (pos.x > levelConfig.levelWidth - 60) {
        pos.x = levelConfig.levelWidth - 60;
        vel.vx = 0;
      }

      // 3. GRAVITASI & VERTICAL MOVEMENT
      if (isGroundedRef.current) {
        coyoteTimerRef.current = 0.2;
      } else {
        coyoteTimerRef.current = Math.max(0, coyoteTimerRef.current - dt);
      }

      const gravity = levelConfig.mechanic === 'low_gravity' ? 950 : 1550;
      vel.vy += gravity * dt;
      const prevY = pos.y;
      pos.y += (vel.vy * dt) + currentPlatformDy;

      // 4. DETEKSI TABRAKAN PLATFORM (LANDING)
      let landed = false;

      for (const plat of dynamicPlatforms) {
        // Abaikan platform awan yang sedang lenyap
        if (plat.isFading && fadingTimersRef.current[plat.id]?.visible === false) {
          continue;
        }

        const offset = movingOffsetsRef.current[plat.id] || { offsetX: 0, offsetY: 0 };
        const platX = plat.x + offset.offsetX;
        const platY = plat.y + offset.offsetY;
        const surfaceY = platY + 24; // Titik tumpu tanah 24px dari atas sprite

        // Cek apakah karakter mendarat di permukaan platform
        const footX = pos.x;
        const isWithinX = footX >= platX + 4 && footX <= platX + plat.width - 4;
        const crossedSurface = prevY <= surfaceY + 14 && pos.y >= surfaceY - 16;

        if (isWithinX && crossedSurface && vel.vy >= 0) {
          landed = true;
          pos.y = surfaceY;
          vel.vy = 0;
          isGroundedRef.current = true;
          lastSafePlatformRef.current = { x: platX + plat.width / 2, y: surfaceY };

          // Mekanik Pegas Bouncing (Spring Pad)
          if (plat.isBouncy) {
            vel.vy = -950; // Lontarkan tinggi ke langit dengan unit px/detik!
            isGroundedRef.current = false;
            coyoteTimerRef.current = 0;
            addFloatingText(platX + plat.width / 2, surfaceY - 30, 'BOING! 🚀', '#f59e0b');
            triggerHaptic(ImpactStyle.Medium);
          }

          // Mekanik Awan Rapuh (Fading Cloud)
          if (plat.isFading && !fadingTimersRef.current[plat.id]) {
            fadingTimersRef.current[plat.id] = { timer: 0, visible: true };
            setTimeout(() => {
              if (fadingTimersRef.current[plat.id]) {
                fadingTimersRef.current[plat.id].visible = false;
                setFadedPlatIds((prev) => ({ ...prev, [plat.id]: true }));
              }
              // Respawn setelah 2.5 detik
              setTimeout(() => {
                if (fadingTimersRef.current[plat.id]) {
                  fadingTimersRef.current[plat.id].visible = true;
                  delete fadingTimersRef.current[plat.id];
                  setFadedPlatIds((prev) => ({ ...prev, [plat.id]: false }));
                }
              }, 2500);
            }, plat.fadeDurationMs || 1200);
          }

          // Mekanik Portal Teleportasi (Warp Portal)
          if (plat.isPortal && plat.portalTargetX && plat.portalTargetY) {
            pos.x = plat.portalTargetX;
            pos.y = plat.portalTargetY;
            addFloatingText(pos.x, pos.y - 40, 'WARP! 🌀', '#06b6d4');
            triggerHaptic(ImpactStyle.Heavy);
          }

          break;
        }
      }

      if (!landed) {
        isGroundedRef.current = false;
      }

      // 5. CEK JATUH KE JURANG (FALL OFF SCREEN)
      if (pos.y > levelConfig.levelHeight + 80) {
        handlePlayerFall();
        return;
      }

      // 6. CEK AMBIL KOIN & TOKEN GEOMETRI
      setCollectibles((prev) => {
        let changed = false;
        const remaining = prev.filter((item) => {
          const dx = Math.abs(pos.x - item.x);
          const dy = Math.abs((pos.y - 40) - item.y);
          if (dx < 36 && dy < 48) {
            // Ambil item!
            changed = true;
            if (item.type === 'coin') {
              setCoins((c) => {
                const next = c + 1;
                coinsRef.current = next;
                return next;
              });
              addFloatingText(item.x, item.y - 20, '+1 🪙', '#facc15');
            } else if (item.type === 'token') {
              setCoins((c) => {
                const next = c + 5;
                coinsRef.current = next;
                return next;
              });
              addFloatingText(item.x, item.y - 25, '+5 SHAPE! ⭐', '#38bdf8');
            } else if (item.type === 'heart') {
              setHearts((h) => {
                const next = Math.min(3, h + 1);
                heartsRef.current = next;
                return next;
              });
              addFloatingText(item.x, item.y - 20, '+1 HP ❤️', '#ef4444');
            }
            triggerHaptic(ImpactStyle.Light);
            return false;
          }
          return true;
        });
        return changed ? remaining : prev;
      });

      // 7. CEK SAMPAI KE ARENA BOS (BOSS ENCOUNTER TRIGGER DENGAN SYNCHRONOUS REF GATE)
      const bossGateX = levelConfig.bossPlatform.x + 80;
      if (pos.x >= bossGateX && !hasReachedBossRef.current) {
        hasReachedBossRef.current = true;
        setIsTransitioningToBoss(true);
        triggerHaptic(ImpactStyle.Heavy);
        const finalCoins = coinsRef.current;
        const finalTime = timeElapsedRef.current;
        const finalHearts = heartsRef.current;
        setTimeout(() => {
          onReachBoss({
            coins: finalCoins,
            timeSec: finalTime,
            heartsRemaining: finalHearts,
          });
        }, 800);
        return;
      }

      // 8. TENTUKAN STATE ANIMASI (Diam total jika tidak ada tombol arah ditekan)
      if (!isGroundedRef.current) {
        setAnimState(vel.vy < 0 ? 'jump' : 'fall');
      } else {
        if (!keys.left && !keys.right && Math.abs(vel.vx) === 0) {
          setAnimState('idle');
        } else {
          setAnimState(Math.abs(vel.vx) > 15 ? 'walk' : 'idle');
        }
      }

      // 9. UPDATE STATE & SMOOTH CAMERA LERP
      setPlayerX(pos.x);
      setPlayerY(pos.y);

      // Kamera memusatkan pemain dengan batas level
      const targetCamX = Math.max(0, Math.min(levelConfig.levelWidth - viewportWidth, pos.x - viewportWidth / 2.5));
      setCameraX((prevCam) => prevCam + (targetCamX - prevCam) * 0.12);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    isGameOver,
    dynamicPlatforms,
    levelConfig,
    viewportWidth,
    handlePlayerFall,
    onReachBoss,
  ]);

  // Restart Level jika Game Over
  const handleRestartLevel = () => {
    playerPosRef.current = { x: levelConfig.playerStartX, y: levelConfig.playerStartY };
    playerVelRef.current = { vx: 0, vy: 0 };
    isGroundedRef.current = false;
    hasReachedBossRef.current = false;
    coinsRef.current = 0;
    timeElapsedRef.current = 0;
    heartsRef.current = 3;
    setPlayerX(levelConfig.playerStartX);
    setPlayerY(levelConfig.playerStartY);
    setHearts(3);
    setCoins(0);
    setTimeElapsed(0);
    setCollectibles(levelConfig.collectibles);
    setIsGameOver(false);
    setIsTransitioningToBoss(false);
  };

  return (
    <div className="rpg-engine-container" ref={containerRef}>
      {/* 1. TOP HEADS-UP DISPLAY (HUD) */}
      <header className="rpg-hud-header">
        {/* Tombol Keluar / Kembali */}
        <button type="button" className="hud-btn-quit" onClick={onQuit} title="Keluar ke Peta">
          <ArrowLeft size={20} />
          <span>Peta</span>
        </button>

        {/* Info Level & Mekanik Unik */}
        <div
          className="hud-level-badge"
          style={{ borderColor: levelConfig.mechanicBadgeColor }}
        >
          <span className="badge-level-title">{levelConfig.title}</span>
          <span className="badge-mechanic-desc">
            <Sparkles size={13} style={{ color: levelConfig.mechanicBadgeColor }} />
            {levelConfig.mechanicName}
          </span>
        </div>

        {/* Statistik Live: Koin, Waktu, & Nyawa */}
        <div className="hud-stats-group">
          {/* Nyawa */}
          <div className="hud-heart-row" title="Sisa Nyawa">
            {[1, 2, 3].map((idx) => (
              <Heart
                key={idx}
                size={22}
                className={`hud-heart-icon ${idx <= hearts ? 'filled' : 'empty'}`}
              />
            ))}
          </div>

          {/* Koin Terkumpul */}
          <div className="hud-counter-pill" title="Koin Terkumpul">
            <Coins size={18} className="coin-icon" />
            <span>
              {coins} / {levelConfig.targetCoins}
            </span>
          </div>

          {/* Stopwatch Waktu */}
          <div
            className={`hud-counter-pill ${timeElapsed <= levelConfig.targetTimeSec ? 'time-good' : 'time-warning'}`}
            title="Waktu Bermain"
          >
            <Clock size={17} />
            <span>
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* 2. PETUNJUK MEKANIK BANNER DI AWAL LEVEL */}
      <div className="rpg-mechanic-banner">
        <strong>Mekanik Level:</strong> {levelConfig.mechanicInstruction}
      </div>

      {/* 3. DUNIA RPG PLATFORMER DENGAN KAMERA HORIZONTAL */}
      <div
        className={`rpg-world-viewport theme-${levelConfig.islandThemeKey}`}
        style={{ background: levelConfig.skyGradient }}
      >
        {/* Parallax Latar Belakang Khusus Tema Setiap Pulau */}
        <RPGIslandBackdrop
          islandTheme={levelConfig.islandThemeKey}
          cameraX={cameraX}
          levelWidth={levelConfig.levelWidth}
        />

        <div
          className="rpg-world-stage"
          style={{
            width: `${levelConfig.levelWidth}px`,
            height: `${levelConfig.levelHeight}px`,
            transform: `translate3d(${-cameraX}px, 0, 0)`,
          }}
        >
          {/* Awan-awan Ambien di Latar Belakang */}
          {levelConfig.ambientClouds.map((cloud, idx) => (
            <img
              key={idx}
              src={`/game_assets/png/${cloud.asset}.png`}
              alt="Awan Langit"
              className="rpg-ambient-cloud"
              style={{
                left: `${cloud.x}px`,
                top: `${cloud.y}px`,
              }}
            />
          ))}

          {/* Efek Visual Angin jika Level Bertema Wind Gusts */}
          {levelConfig.mechanic === 'wind_gusts' && (
            <div className="rpg-wind-effect-overlay" />
          )}

          {/* Sinar Laser Bahaya (jika level memiliki hazard laser) */}
          {levelConfig.hazards.map((haz) => (
            haz.type === 'laser' && (
              <div
                key={haz.id}
                className="rpg-laser-hazard"
                style={{
                  left: `${haz.x}px`,
                  top: `${haz.y}px`,
                  width: `${haz.width}px`,
                  height: `${haz.height}px`,
                }}
              >
                <div className="laser-beam" />
              </div>
            )
          ))}

          {/* PLATFORM-PLATFORM TANAH DARI GAME_ASSETS */}
          {dynamicPlatforms.map((plat) => {
            const isFadedOut = !!fadedPlatIds[plat.id];
            return (
              <div
                key={plat.id}
                ref={(el) => {
                  platformElsRef.current[plat.id] = el;
                }}
                className={`rpg-platform-wrapper ${plat.isMoving ? 'moving' : ''} ${plat.isBouncy ? 'bouncy' : ''} ${plat.isFading ? 'fading' : ''} ${isFadedOut ? 'faded-out' : ''}`}
                style={{
                  left: `${plat.x}px`,
                  top: `${plat.y}px`,
                  width: `${plat.width}px`,
                  height: `${plat.height}px`,
                }}
              >
                <img
                  src={`/game_assets/png/${plat.asset}.png`}
                  alt="Platform Tanah"
                  className="rpg-platform-img"
                />

                {/* Indikator Pegas Pantul */}
                {plat.isBouncy && (
                  <div className="bouncy-spring-indicator" title="Pegas Super Jump!">
                    <span>▲ BOING ▲</span>
                  </div>
                )}

                {/* Indikator Portal Warp */}
                {plat.isPortal && (
                  <div className="warp-portal-glow">
                    <div className="portal-ring" />
                  </div>
                )}
              </div>
            );
          })}

          {/* KOLEKTIBEL: KOIN, TOKEN BANGUN DATAR, & HATI */}
          {collectibles.map((item) => (
            <div
              key={item.id}
              className={`rpg-collectible-item ${item.type}`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
              }}
            >
              {item.type === 'coin' && (
                <img
                  src="/game_assets/png/coin.png"
                  alt="Koin Emas"
                  className="coin-spin-anim"
                />
              )}
              {item.type === 'token' && item.shapeToken && (
                <img
                  src={`/game_assets/png/${item.shapeToken}.png`}
                  alt="Token Bentuk"
                  className="token-bounce-anim"
                />
              )}
              {item.type === 'heart' && (
                <img
                  src="/game_assets/png/heart.png"
                  alt="Hati Nyawa"
                  className="heart-pulse-anim"
                />
              )}
            </div>
          ))}

          {/* TEKS MENGAMBANG SAAT AMBIL ITEM */}
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className="rpg-floating-pickup-text"
              style={{
                left: `${ft.x}px`,
                top: `${ft.y}px`,
                color: ft.color,
              }}
            >
              {ft.text}
            </div>
          ))}

          {/* GERBANG BOS DI UJUNG LEVEL */}
          <div
            className="rpg-boss-encounter-station"
            style={{
              left: `${levelConfig.bossPlatform.x + 160}px`,
              top: `${levelConfig.bossPlatform.y - 120}px`,
            }}
          >
            <div className="boss-warning-tag finish-tag" style={{ background: '#dc2626', color: '#fff', fontWeight: 800 }}>
              <span style={{ fontSize: '12px' }}>⚠️ BOS: {boss?.name || 'BOS LEVEL'}</span>
            </div>
            <div className="boss-preview-sprite finish-portal">
              <div
                className="boss-silhouette-pulse"
                style={{ background: boss?.gradient || 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)', borderColor: '#ef4444' }}
              >
                <span className="boss-symbol-badge">
                  {boss?.shapeType === 'triangle' ? '▲' : boss?.shapeType === 'square' ? '■' : boss?.shapeType === 'circle' ? '●' : '💀'}
                </span>
              </div>
            </div>
          </div>

          {/* KARAKTER MASKOT KITA YANG BISA DIGERAKKAN */}
          <div
            className="rpg-mascot-entity"
            style={{
              left: `${playerX}px`,
              top: `${playerY - charHeight}px`,
              width: `${charWidth}px`,
              height: `${charHeight}px`,
            }}
          >
            <AnimatedMascot
              state={animState}
              direction={facing}
              size={charHeight + 20}
              showShadow={true}
              walkSpeed={0.5}
            />
          </div>
        </div>
      </div>

      {/* 4. ON-SCREEN VIRTUAL TOUCH CONTROLLER UNTUK MOBILE */}
      <div className="rpg-touch-controls-bar">
        {/* D-Pad Kiri & Kanan */}
        <div className="rpg-touch-dpad">
          <button
            type="button"
            className="touch-btn btn-left"
            title="Lari Kiri"
            onPointerDown={(e) => {
              e.preventDefault();
              keysRef.current.left = true;
            }}
            onPointerUp={() => {
              keysRef.current.left = false;
            }}
            onPointerCancel={() => {
              keysRef.current.left = false;
            }}
            onPointerLeave={() => {
              keysRef.current.left = false;
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              keysRef.current.left = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              keysRef.current.left = false;
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              keysRef.current.left = false;
            }}
          >
            <ArrowLeft size={34} />
          </button>

          <button
            type="button"
            className="touch-btn btn-right"
            title="Lari Kanan"
            onPointerDown={(e) => {
              e.preventDefault();
              keysRef.current.right = true;
            }}
            onPointerUp={() => {
              keysRef.current.right = false;
            }}
            onPointerCancel={() => {
              keysRef.current.right = false;
            }}
            onPointerLeave={() => {
              keysRef.current.right = false;
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              keysRef.current.right = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              keysRef.current.right = false;
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              keysRef.current.right = false;
            }}
          >
            <ArrowRight size={34} />
          </button>
        </div>

        {/* Tombol Loncat Besar */}
        <div className="rpg-touch-actions">
          <button
            type="button"
            className="touch-btn btn-jump-action"
            title="Loncat"
            onPointerDown={(e) => {
              e.preventDefault();
              handleTouchJump();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchJump();
            }}
          >
            <ArrowUp size={38} />
            <span className="btn-jump-label">LONCAT</span>
          </button>
        </div>
      </div>

      {/* 5. OVERLAY GAME OVER JIKA NYAWA HABIS */}
      {isGameOver && (
        <div className="rpg-game-over-modal">
          <div className="game-over-box">
            <h2 className="game-over-title">Karaktermu Terjatuh!</h2>
            <p className="game-over-sub">
              Jangan menyerah, ayo bangkit dan coba lagi dari awal level!
            </p>
            <div className="game-over-actions">
              <button
                type="button"
                className="btn-retry-level"
                onClick={handleRestartLevel}
              >
                <RotateCcw size={20} />
                <span>Ulangi Level</span>
              </button>
              <button
                type="button"
                className="btn-quit-level"
                onClick={onQuit}
              >
                Kembali ke Peta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. OVERLAY TRANSISI SELESAI LEVEL */}
      {isTransitioningToBoss && (
        <div className="rpg-boss-intro-curtain">
          <div className="boss-intro-content">
            <span className="boss-alert-text" style={{ color: '#facc15' }}>🏁 LEVEL SELESAI! 🏁</span>
            <h1 className="boss-intro-name">Garis Akhir Tercapai!</h1>
            <p className="boss-intro-title">Menghitung bintang & koin terkumpul...</p>
          </div>
        </div>
      )}
    </div>
  );
};
