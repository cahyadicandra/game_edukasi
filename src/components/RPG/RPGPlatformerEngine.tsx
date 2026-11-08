import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedMascot, type MascotAnimationState, type MascotDirection } from '../Mascot/AnimatedMascot';
import type { RPGLevelConfig, PlatformDef, CollectibleDef } from '../../data/rpgLevelConfigs';
import type { GeometryMonster } from '../../data/monsters';
import type { PlayerProfile } from '../../types/game';
import {
  computeWeaponStats,
  DEFAULT_LOADOUTS,
  BLASTER_COLORS,
  type ComputedWeaponStats,
} from '../../data/weaponParts';
import { RPGIslandBackdrop } from './RPGIslandBackdrop';
import { ArrowLeft, ArrowRight, ArrowUp, Coins, Heart, Clock, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './RPGPlatformerEngine.css';

export interface RPGPlatformerEngineProps {
  levelConfig: RPGLevelConfig;
  boss?: GeometryMonster;
  player?: PlayerProfile;
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

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  damage: number;
  projectile?: string;
  isPierce?: boolean;
}

interface PlatformEnemy {
  id: string;
  type: 'slime_green' | 'slime_blue' | 'slime_purple' | 'bat' | 'mushroom_walker';
  x: number;
  y: number;
  vx: number;
  hp: number;
  maxHp: number;
  minX: number;
  maxX: number;
  isDead: boolean;
}

// Helper resolusi aset platform tematik sesuai tema pulau
const getPlatformAssetUrl = (asset: string, theme: string): string => {
  let themeName = 'grass';
  if (theme === 'hutan-segi-empat') themeName = 'sand';
  else if (theme === 'pegunungan-segitiga') themeName = 'snow';
  else if (theme === 'danau-lingkaran' || theme === 'kastil-geometri') themeName = 'stone';

  if (asset === 'cloud_1' || asset === 'cloud_2') {
    return '/assets/png/background/cloud_a.png';
  }
  if (asset === 'island_wide' || asset === 'island_L') {
    return `/assets/png/terrain/platform_${themeName}_flat_480.png`;
  }
  if (asset === 'island_M' || asset === 'platform_L') {
    return `/assets/png/terrain/platform_${themeName}_flat_360.png`;
  }
  if (asset === 'island_S' || asset === 'platform_M') {
    return `/assets/png/terrain/platform_${themeName}_flat_220.png`;
  }
  if (asset === 'platform_S') {
    return `/assets/png/terrain/platform_${themeName}_tri_190.png`;
  }
  return `/assets/png/terrain/platform_${themeName}_flat_360.png`;
};

// Helper dekorasi alam di atas platform
const getPlatformDecorUrl = (platId: string, platX: number, theme: string): string | null => {
  if (platId === 'plat-start') return null;
  let themeName = 'grass';
  if (theme === 'hutan-segi-empat') themeName = 'sand';
  else if (theme === 'pegunungan-segitiga') themeName = 'snow';
  else if (theme === 'danau-lingkaran' || theme === 'kastil-geometri') themeName = 'stone';

  const decorMap: Record<string, string[]> = {
    grass: ['tree_round.png', 'tree_apple.png', 'bush_round.png', 'flowers.png', 'fence.png'],
    sand: ['tree_palm.png', 'tree_cactus.png', 'rock_sand.png', 'crate.png'],
    snow: ['tree_pine_snow.png', 'rock_snow.png', 'tree_autumn.png', 'log.png'],
    stone: ['crystal_blue.png', 'crystal_purple.png', 'mushroom_red.png', 'rock_large.png'],
  };

  const list = decorMap[themeName] || decorMap.grass;
  const index = Math.abs(Math.floor(platX / 80)) % list.length;
  return `/assets/png/nature/${list[index]}`;
};

// WebAudio Synthesizer Murni Zero-Dependency
let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playSfx = (type: 'jump' | 'shoot' | 'stomp' | 'hit' | 'explosion' | 'coin') => {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (type === 'jump') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.14);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'shoot') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  } else if (type === 'stomp') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'hit') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'coin') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.07);
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } else if (type === 'explosion') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
};

export const RPGPlatformerEngine: React.FC<RPGPlatformerEngineProps> = ({
  levelConfig,
  boss,
  player,
  onReachBoss,
  onQuit,
}) => {
  // Hitung Stat Senjata Modular & Kustomisasi
  const activeLoadout =
    player?.equipment?.loadouts?.[player?.equipment?.activeLoadoutIndex ?? 0] ||
    DEFAULT_LOADOUTS[0];
  const weaponStats: ComputedWeaponStats = computeWeaponStats(
    activeLoadout,
    player?.equipment?.partLevels
  );
  const blasterColorDef =
    BLASTER_COLORS.find((c) => c.id === (player?.equipment?.blasterColor || activeLoadout.color)) ||
    BLASTER_COLORS[0];

  // Viewport & Kamera
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldStageRef = useRef<HTMLDivElement | null>(null);
  const playerElRef = useRef<HTMLDivElement | null>(null);
  const enemyElsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const bulletElsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const cameraXRef = useRef(0);
  const facingRef = useRef<MascotDirection>('right');
  const animStateRef = useRef<MascotAnimationState>('idle');

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth || 900);

  // Status Pemain
  const [facing, setFacing] = useState<MascotDirection>('right');
  const [animState, setAnimState] = useState<MascotAnimationState>('idle');
  const [hearts, setHearts] = useState(3);
  const [coins, setCoins] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTransitioningToBoss, setIsTransitioningToBoss] = useState(false);
  const [isInvulnerable, setIsInvulnerable] = useState(false);

  // Generator Musuh Berjalan di Platform
const generateInitialEnemies = (platforms: PlatformDef[]): PlatformEnemy[] => {
  const list: PlatformEnemy[] = [];
  const enemyTypes: ('slime_green' | 'bat' | 'slime_blue' | 'mushroom_walker' | 'slime_purple')[] = [
    'slime_green',
    'bat',
    'slime_blue',
    'mushroom_walker',
    'slime_purple',
  ];
  platforms.forEach((plat, idx) => {
    if (idx > 0 && !plat.isFading && plat.width >= 240) {
      const type = enemyTypes[(idx - 1) % enemyTypes.length];
      const hp = type === 'bat' ? 1 : type === 'slime_green' || type === 'mushroom_walker' ? 2 : 3;
      const speed = type === 'bat' ? 85 : 55;
      list.push({
        id: `enemy-${idx}`,
        type,
        x: plat.x + plat.width / 2,
        y: plat.y + 24,
        vx: speed,
        hp,
        maxHp: hp,
        minX: plat.x + 30,
        maxX: plat.x + plat.width - 30,
        isDead: false,
      });
    }
  });
  return list;
};

// Senjata Blaster & Peluru
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const [isShootingFlash, setIsShootingFlash] = useState(false);

  // Musuh-musuh wandering di platform
  const [enemies, setEnemies] = useState<PlatformEnemy[]>(() =>
    generateInitialEnemies(levelConfig.platforms)
  );
  const enemiesRef = useRef<PlatformEnemy[]>(enemies);
  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  // Koleksi & Item
  const [collectibles, setCollectibles] = useState<CollectibleDef[]>(levelConfig.collectibles);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Synchronous Refs untuk loop 60fps bebas stutter
  const heartsRef = useRef(3);
  const coinsRef = useRef(0);
  const timeElapsedRef = useRef(0);
  const hasReachedBossRef = useRef(false);
  const isInvulnerableRef = useRef(false);
  const bulletIdCounterRef = useRef(0); // ID peluru unik yang aman dari duplikat

  // Platform interaktif (moving, fading, springs)
  const [dynamicPlatforms] = useState<PlatformDef[]>(levelConfig.platforms);
  const movingOffsetsRef = useRef<Record<string, { offsetX: number; offsetY: number }>>({});
  const prevMovingOffsetsRef = useRef<Record<string, { offsetX: number; offsetY: number }>>({});
  const platformElsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const fadingTimersRef = useRef<Record<string, { timers: number[]; visible: boolean }>>({});

  // Timer umum peluru, invulnerability, dan teks mengambang untuk cleanup unmount
  const activeGeneralTimersRef = useRef<Set<number>>(new Set());
  const safeSetTimeout = useCallback((fn: () => void, delay: number) => {
    const timerId = window.setTimeout(() => {
      activeGeneralTimersRef.current.delete(timerId);
      fn();
    }, delay);
    activeGeneralTimersRef.current.add(timerId);
    return timerId;
  }, []);

  // Helper aman pointer capture untuk touch controller mobile
  const safeCapturePointer = (el: HTMLElement, id: number) => {
    try {
      el.setPointerCapture(id);
    } catch {
      // pointer capture tidak didukung pada platform atau pointer ini
    }
  };

  const safeReleasePointer = (el: HTMLElement, id: number) => {
    try {
      el.releasePointerCapture(id);
    } catch {
      // pointer release tidak didukung pada platform atau pointer ini
    }
  };

  // Bersihkan semua timer platform memudar (dipakai saat restart level & unmount)
  const clearAllFadingTimers = () => {
    Object.values(fadingTimersRef.current).forEach((entry) => {
      entry.timers.forEach((t) => clearTimeout(t));
    });
    fadingTimersRef.current = {};
    setFadedPlatIds({});
  };

  // Safety net: pastikan semua timer mati saat komponen dilepas
  useEffect(() => {
    const generalTimers = activeGeneralTimersRef.current;
    const fadingTimers = fadingTimersRef.current;
    return () => {
      Object.values(fadingTimers).forEach((entry) => {
        entry.timers.forEach((t) => clearTimeout(t));
      });
      fadingTimersRef.current = {};
      generalTimers.forEach((t) => clearTimeout(t));
      generalTimers.clear();
    };
  }, []);
  const [fadedPlatIds, setFadedPlatIds] = useState<Record<string, boolean>>({});

  // Physics Refs (untuk 60fps tanpa re-render berlebih)
  const playerPosRef = useRef({ x: levelConfig.playerStartX, y: levelConfig.playerStartY });
  const playerVelRef = useRef({ vx: 0, vy: 0 });
  const isGroundedRef = useRef(false);
  const coyoteTimerRef = useRef(0);
  const jumpBufferTimerRef = useRef(0);
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
  const addFloatingText = useCallback((x: number, y: number, text: string, color = '#facc15') => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color }]);
    safeSetTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 900);
  }, [safeSetTimeout]);

  // Fungsi Utama Loncat Maskot dengan Coyote Time
  const doJump = useCallback(() => {
    if (isGameOver || isTransitioningToBoss) return;

    if (isGroundedRef.current || coyoteTimerRef.current > 0) {
      isGroundedRef.current = false;
      coyoteTimerRef.current = 0;
      jumpBufferTimerRef.current = 0;
      // Impuls kecepatan lompat (px/detik) yang kuat dan mantap
      const jumpImpulse = levelConfig.mechanic === 'low_gravity' ? -800 : -740;
      playerVelRef.current.vy = jumpImpulse;
      setAnimState('jump');
      playSfx('jump');
      triggerHaptic(ImpactStyle.Light);
    }
  }, [isGameOver, isTransitioningToBoss, levelConfig.mechanic]);

  // Tembak Peluru Blaster Modular
  const handleShoot = useCallback(() => {
    if (isGameOver || isTransitioningToBoss) return;
    const dir = facingRef.current === 'right' ? 1 : -1;
    const spawnX = playerPosRef.current.x + (dir * 60);
    const spawnY = playerPosRef.current.y - 48;

    const isCrit = Math.random() * 100 < weaponStats.critChance;
    const dmg = isCrit ? Math.round(weaponStats.damage * 2 * 10) / 10 : weaponStats.damage;

    const newBullet: Bullet = {
      id: ++bulletIdCounterRef.current,
      x: spawnX,
      y: spawnY,
      vx: dir * weaponStats.projectileSpeed,
      damage: dmg,
      projectile: weaponStats.bulletType,
      isPierce: weaponStats.bulletType === 'bullet_laser',
    };

    bulletsRef.current.push(newBullet);
    setBullets([...bulletsRef.current]);

    setIsShootingFlash(true);
    safeSetTimeout(() => setIsShootingFlash(false), 90);

    playSfx('shoot');
    triggerHaptic(ImpactStyle.Light);
  }, [isGameOver, isTransitioningToBoss, safeSetTimeout, weaponStats]);

  // Handler saat Pemain Terkena Serangan Musuh
  const handlePlayerHurt = useCallback(() => {
    if (isInvulnerableRef.current) return;
    isInvulnerableRef.current = true;
    setIsInvulnerable(true);
    safeSetTimeout(() => {
      isInvulnerableRef.current = false;
      setIsInvulnerable(false);
    }, 1200);

    playSfx('hit');
    triggerHaptic(ImpactStyle.Heavy);
    let nextH = heartsRef.current - 1;
    if (nextH < 0) nextH = 0;
    heartsRef.current = nextH;
    setHearts(nextH);

    addFloatingText(playerPosRef.current.x, playerPosRef.current.y - 40, '-1 ❤️ KENA MUSUH!', '#ef4444');

    // Dorongan knockback
    playerVelRef.current.vx = (facingRef.current === 'right' ? -260 : 260);
    playerVelRef.current.vy = -320;

    if (nextH <= 0) {
      setIsGameOver(true);
    }
  }, [addFloatingText, safeSetTimeout]);

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

    const isShootKey = (e: KeyboardEvent) =>
      e.code === 'KeyJ' ||
      e.code === 'KeyX' ||
      e.code === 'KeyF' ||
      e.key === 'j' ||
      e.key === 'x' ||
      e.key === 'f' ||
      e.key === 'J' ||
      e.key === 'X' ||
      e.key === 'F';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isTransitioningToBoss) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space', 'KeyJ', 'KeyX'].includes(e.code) || e.key === ' ') {
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
      if (isShootKey(e)) {
        handleShoot();
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetAllKeys);
    };
  }, [isGameOver, isTransitioningToBoss, doJump, handleShoot]);

  // Touch Controller Jump Handler
  const handleTouchJump = () => {
    doJump();
  };

  // Reset Karakter saat Jatuh ke Jurang
  const handlePlayerFall = useCallback(() => {
    // Hindari trigger ganda saat baru saja respawn, namun tetap amankan koordinat agar tidak tersesat di void
    if (isInvulnerableRef.current) {
      playerPosRef.current = {
        x: lastSafePlatformRef.current.x,
        y: lastSafePlatformRef.current.y,
      };
      playerVelRef.current = { vx: 0, vy: 0 };
      isGroundedRef.current = true;
      if (playerElRef.current) {
        playerElRef.current.style.transform = `translate3d(${playerPosRef.current.x - charWidth / 2}px, ${playerPosRef.current.y - charHeight}px, 0)`;
      }
      return;
    }
    isInvulnerableRef.current = true;
    setIsInvulnerable(true);
    safeSetTimeout(() => {
      isInvulnerableRef.current = false;
      setIsInvulnerable(false);
    }, 1200);

    triggerHaptic(ImpactStyle.Heavy);
    let nextH = heartsRef.current - 1;
    if (nextH < 0) nextH = 0;
    heartsRef.current = nextH;
    setHearts(nextH);

    addFloatingText(lastSafePlatformRef.current.x, lastSafePlatformRef.current.y - 40, '-1 ❤️', '#ef4444');

    if (nextH <= 0) {
      setIsGameOver(true);
      return;
    }

    // Respawn tepat di atas permukaan platform aman terakhir
    playerPosRef.current = {
      x: lastSafePlatformRef.current.x,
      y: lastSafePlatformRef.current.y,
    };
    playerVelRef.current = { vx: 0, vy: 0 };
    isGroundedRef.current = true;
    coyoteTimerRef.current = 0.2;
    jumpBufferTimerRef.current = 0;
    if (playerElRef.current) {
      playerElRef.current.style.transform = `translate3d(${playerPosRef.current.x - charWidth / 2}px, ${playerPosRef.current.y - charHeight}px, 0)`;
    }
  }, [addFloatingText, safeSetTimeout]);

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

      // 1. UPDATE PLATFORM DINAMIS (Moving Platforms dengan Delta Frame Presisi)
      let currentPlatformDx = 0;
      let currentPlatformDy = 0;

      for (const plat of dynamicPlatforms) {
        if (plat.isMoving && plat.moveRangeX && plat.moveSpeedX) {
          const offsetX = Math.sin((time / 1000) * plat.moveSpeedX) * plat.moveRangeX;
          const offsetY = plat.moveRangeY && plat.moveSpeedY
            ? Math.cos((time / 1000) * plat.moveSpeedY) * plat.moveRangeY
            : 0;

          const prevOffset = prevMovingOffsetsRef.current[plat.id] || { offsetX, offsetY };
          const deltaX = offsetX - prevOffset.offsetX;
          const deltaY = offsetY - prevOffset.offsetY;
          prevMovingOffsetsRef.current[plat.id] = { offsetX, offsetY };
          movingOffsetsRef.current[plat.id] = { offsetX, offsetY };

          const el = platformElsRef.current[plat.id];
          if (el) {
            el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
          }

          // Cek apakah karakter sedang berdiri di atas platform ini
          const platSurfaceY = plat.y + 24 + offsetY;
          const platX = plat.x + offsetX;
          const isPlayerOnPlat =
            isGroundedRef.current &&
            Math.abs(pos.y - platSurfaceY) < 8 &&
            pos.x + 18 >= platX &&
            pos.x - 18 <= platX + plat.width;

          if (isPlayerOnPlat) {
            currentPlatformDx = deltaX;
            currentPlatformDy = deltaY;
          }
        }
      }

      // 2. INPUT & HORIZONTAL MOVEMENT
      const moveSpeed = levelConfig.mechanic === 'crumbling_bridge' ? 440 : 360;
      const accel = 2000;
      const friction = 1800;

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

      // 3. GRAVITASI, COYOTE TIME & JUMP BUFFER
      if (isGroundedRef.current) {
        coyoteTimerRef.current = 0.18;
      } else {
        coyoteTimerRef.current = Math.max(0, coyoteTimerRef.current - dt);
      }

      // Hitung mundur buffer loncat
      if (jumpBufferTimerRef.current > 0) {
        jumpBufferTimerRef.current = Math.max(0, jumpBufferTimerRef.current - dt);
      }

      const gravity = levelConfig.mechanic === 'low_gravity' ? 950 : 1550;
      vel.vy += gravity * dt;
      const prevY = pos.y;
      pos.y += (vel.vy * dt) + currentPlatformDy;

      // 4. DETEKSI TABRAKAN PLATFORM (LANDING & STEP-UP ASSIST)
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

        // Toleransi lebar pijakan kaki (pos.x +/- 18px mencakup tapak maskot)
        const isWithinX = (pos.x + 18 >= platX) && (pos.x - 18 <= platX + plat.width);

        // Landing saat jatuh dari udara (vel.vy >= 0)
        const landingTolerance = Math.max(18, vel.vy * dt + 8);
        const crossedSurface = prevY <= surfaceY + 12 && pos.y >= surfaceY - landingTolerance;

        if (isWithinX && vel.vy >= 0 && crossedSurface) {
          landed = true;
          pos.y = surfaceY;
          vel.vy = 0;
          isGroundedRef.current = true;
          if (!plat.isFading) {
            lastSafePlatformRef.current = {
              x: Math.max(platX + 40, Math.min(platX + plat.width - 40, pos.x)),
              y: surfaceY,
            };
          }

          // Jika ada loncat yang sudah ditekan pemain sebelum menyentuh tanah, langsung loncat!
          if (jumpBufferTimerRef.current > 0) {
            isGroundedRef.current = false;
            coyoteTimerRef.current = 0;
            jumpBufferTimerRef.current = 0;
            const jumpImpulse = levelConfig.mechanic === 'low_gravity' ? -800 : -740;
            vel.vy = jumpImpulse;
            setAnimState('jump');
            triggerHaptic(ImpactStyle.Light);
          }

          // Mekanik Pegas Bouncing (Spring Pad)
          if (plat.isBouncy) {
            vel.vy = -980; // Lontarkan tinggi ke langit dengan unit px/detik!
            isGroundedRef.current = false;
            coyoteTimerRef.current = 0;
            jumpBufferTimerRef.current = 0;
            addFloatingText(platX + plat.width / 2, surfaceY - 30, 'BOING! 🚀', '#f59e0b');
            triggerHaptic(ImpactStyle.Medium);
          }

          // Mekanik Awan Rapuh (Fading Cloud)
          if (plat.isFading && !fadingTimersRef.current[plat.id]) {
            const entry: { timers: number[]; visible: boolean } = { timers: [], visible: true };
            fadingTimersRef.current[plat.id] = entry;
            entry.timers.push(
              window.setTimeout(() => {
                if (fadingTimersRef.current[plat.id]) {
                  fadingTimersRef.current[plat.id].visible = false;
                  setFadedPlatIds((prev) => ({ ...prev, [plat.id]: true }));
                  // Respawn setelah 2.5 detik
                  entry.timers.push(
                    window.setTimeout(() => {
                      if (fadingTimersRef.current[plat.id]) {
                        fadingTimersRef.current[plat.id].visible = true;
                        delete fadingTimersRef.current[plat.id];
                        setFadedPlatIds((prev) => ({ ...prev, [plat.id]: false }));
                      }
                    }, 2500)
                  );
                }
              }, plat.fadeDurationMs || 1400)
            );
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

        // Step-Up Assist: Saat berjalan di tanah, jika ada undakan kecil (<= 24px), naik secara mulus tanpa terganjal
        if (isGroundedRef.current && isWithinX && pos.y > surfaceY && pos.y <= surfaceY + 24) {
          landed = true;
          pos.y = surfaceY;
          vel.vy = 0;
          if (!plat.isFading) {
            lastSafePlatformRef.current = {
              x: Math.max(platX + 40, Math.min(platX + plat.width - 40, pos.x)),
              y: surfaceY,
            };
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
        // Sinkronkan variabel pos lokal seketika ke titik respawn aman
        pos.x = playerPosRef.current.x;
        pos.y = playerPosRef.current.y;
        vel.vx = 0;
        vel.vy = 0;
        // Jika seluruh nyawa habis, hentikan loop untuk menampilkan dialog Game Over
        if (heartsRef.current <= 0) {
          return;
        }
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
              playSfx('coin');
              setCoins((c) => {
                const next = c + 1;
                coinsRef.current = next;
                return next;
              });
              addFloatingText(item.x, item.y - 20, '+1 🪙', '#facc15');
            } else if (item.type === 'token') {
              playSfx('coin');
              setCoins((c) => {
                const next = c + 5;
                coinsRef.current = next;
                return next;
              });
              addFloatingText(item.x, item.y - 25, '+5 SHAPE! ⭐', '#38bdf8');
            } else if (item.type === 'heart') {
              playSfx('coin');
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

      // 6B. UPDATE PELURU BLASTER & TABRAKAN KE MUSUH
      if (bulletsRef.current.length > 0) {
        const remainingBullets: Bullet[] = [];
        let bulletsChanged = false;

        for (const b of bulletsRef.current) {
          b.x += b.vx * dt;
          const bEl = bulletElsRef.current[b.id];
          if (bEl) {
            bEl.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) scaleX(${b.vx < 0 ? -1 : 1})`;
          }
          let hit = false;

          for (const en of enemiesRef.current) {
            if (!en.isDead && Math.abs(b.x - en.x) < 36 && Math.abs(b.y - (en.y - 24)) < 36) {
              if (!b.isPierce) {
                hit = true;
              }
              bulletsChanged = true;
              en.hp -= b.damage;
              playSfx('hit');

              // Efek khusus status peluru modular
              let hitText = `-${b.damage} 💥`;
              let hitColor = '#f59e0b';
              if (b.projectile === 'bullet_fire') {
                hitText = `🔥 -${b.damage}`;
                hitColor = '#ef4444';
              } else if (b.projectile === 'bullet_ice') {
                hitText = `❄️ -${b.damage}`;
                hitColor = '#38bdf8';
                en.vx = en.vx * 0.4;
              } else if (b.projectile === 'bullet_laser') {
                hitText = `⚡ -${b.damage}`;
                hitColor = '#a855f7';
              } else if (b.projectile === 'bullet_star') {
                hitText = `⭐ -${b.damage}`;
                hitColor = '#fbbf24';
              }

              addFloatingText(b.x, b.y - 20, hitText, hitColor);

              if (en.hp <= 0) {
                en.isDead = true;
                playSfx('explosion');
                setCoins((c) => {
                  const next = c + 3;
                  coinsRef.current = next;
                  return next;
                });
                addFloatingText(en.x, en.y - 30, '+3 🪙 KALAH!', '#10b981');
              }
              if (!b.isPierce) break;
            }
          }

          if (!hit && b.x >= 0 && b.x <= levelConfig.levelWidth) {
            remainingBullets.push(b);
          } else {
            bulletsChanged = true;
          }
        }

        bulletsRef.current = remainingBullets;
        if (bulletsChanged) {
          setBullets([...remainingBullets]);
        }
      }

      // 6C. UPDATE GERAKAN MUSUH & TABRAKAN DENGAN PEMAIN (STOMP / HURT)
      let enemiesChanged = false;
      for (const en of enemiesRef.current) {
        if (en.isDead) continue;
        en.x += en.vx * dt;
        if (en.x <= en.minX) {
          en.x = en.minX;
          en.vx = Math.abs(en.vx);
        } else if (en.x >= en.maxX) {
          en.x = en.maxX;
          en.vx = -Math.abs(en.vx);
        }

        const el = enemyElsRef.current[en.id];
        if (el) {
          el.style.transform = `translate3d(${en.x}px, ${en.y - 48}px, 0) scaleX(${en.vx < 0 ? -1 : 1})`;
        }

        // Cek tabrakan pemain vs musuh
        const isOverlapX = Math.abs(pos.x - en.x) < 34;
        // Injak musuh (STOMP) HANYA jika pemain sedang di udara dan melayang jatuh dari atas
        const isFallingOnTop = !isGroundedRef.current && vel.vy > 100 && prevY <= en.y - 12 && pos.y >= en.y - 40;

        if (isOverlapX && isFallingOnTop) {
          if (en.type === 'slime_purple') {
            // Slime Berduri: Melukai pemain jika diinjak!
            handlePlayerHurt();
          } else {
            // Berhasil menginjak musuh (STOMP!)
            en.hp -= 1;
            vel.vy = en.type === 'mushroom_walker' ? -880 : -740;
            playSfx('stomp');
            triggerHaptic(ImpactStyle.Medium);
            addFloatingText(en.x, en.y - 25, 'STOMP! 💥', '#22c55e');

            if (en.hp <= 0) {
              en.isDead = true;
              playSfx('explosion');
              setCoins((c) => {
                const next = c + 4;
                coinsRef.current = next;
                return next;
              });
              addFloatingText(en.x, en.y - 45, '+4 🪙', '#facc15');
            }
            enemiesChanged = true;
          }
        } else if (isOverlapX && Math.abs((pos.y - 30) - (en.y - 24)) < 34 && !isInvulnerableRef.current) {
          // Tertabrak musuh dari samping
          handlePlayerHurt();
        }
      }

      if (enemiesChanged) {
        setEnemies([...enemiesRef.current]);
      }

      // 7. CEK SAMPAI KE ARENA BOS (BOSS ENCOUNTER TRIGGER DENGAN SYNCHRONOUS REF GATE)
      const bossGateX = levelConfig.bossPlatform.x + 80;
      if (pos.x >= bossGateX && !hasReachedBossRef.current) {
        hasReachedBossRef.current = true;
        setIsTransitioningToBoss(true);
        triggerHaptic(ImpactStyle.Heavy);
        const finalCoins = coinsRef.current;
        const finalTime = timeElapsedRef.current;
        const finalHearts = heartsRef.current;
        safeSetTimeout(() => {
          onReachBoss({
            coins: finalCoins,
            timeSec: finalTime,
            heartsRemaining: finalHearts,
          });
        }, 800);
        return;
      }

      // 8. TENTUKAN STATE ANIMASI DENGAN DEBOUNCE NILAI (MENCEGAH RE-RENDER BERLEBIH)
      let nextAnim: MascotAnimationState;
      if (!isGroundedRef.current) {
        nextAnim = vel.vy < 0 ? 'jump' : 'fall';
      } else if (!keys.left && !keys.right && Math.abs(vel.vx) === 0) {
        nextAnim = 'idle';
      } else {
        nextAnim = Math.abs(vel.vx) > 15 ? 'walk' : 'idle';
      }
      if (animStateRef.current !== nextAnim) {
        animStateRef.current = nextAnim;
        setAnimState(nextAnim);
      }

      // 9. UPDATE KAMERA & POSISI PEMAIN DENGAN AKSELERASI HARDWARE GPU (ZERO RE-RENDER!)
      const targetCamX = Math.max(0, Math.min(levelConfig.levelWidth - viewportWidth, pos.x - viewportWidth / 2.5));
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.14;

      if (worldStageRef.current) {
        worldStageRef.current.style.transform = `translate3d(${-cameraXRef.current}px, 0, 0)`;
      }
      if (containerRef.current) {
        containerRef.current.style.setProperty('--camera-x', `${cameraXRef.current}px`);
      }
      if (playerElRef.current) {
        playerElRef.current.style.transform = `translate3d(${pos.x - charWidth / 2}px, ${pos.y - charHeight}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    isGameOver,
    isTransitioningToBoss,
    dynamicPlatforms,
    levelConfig,
    viewportWidth,
    handlePlayerFall,
    handlePlayerHurt,
    onReachBoss,
    safeSetTimeout,
    addFloatingText,
  ]);

  // Restart Level jika Game Over
  const handleRestartLevel = () => {
    // Batalkan semua timer platform memudar yang tersisa dari sesi sebelumnya
    clearAllFadingTimers();

    const startPlat = levelConfig.platforms[0];
    const startSurfaceY = startPlat ? startPlat.y + 24 : levelConfig.playerStartY;
    playerPosRef.current = { x: levelConfig.playerStartX, y: startSurfaceY };
    playerVelRef.current = { vx: 0, vy: 0 };
    isGroundedRef.current = true;
    coyoteTimerRef.current = 0.2;
    jumpBufferTimerRef.current = 0;
    hasReachedBossRef.current = false;
    isInvulnerableRef.current = false;
    coinsRef.current = 0;
    timeElapsedRef.current = 0;
    heartsRef.current = 3;
    lastSafePlatformRef.current = { x: levelConfig.playerStartX, y: startSurfaceY };
    keysRef.current = { left: false, right: false, jump: false };

    // Respawn musuh dan bersihkan proyektil
    const freshEnemies = generateInitialEnemies(levelConfig.platforms);
    enemiesRef.current = freshEnemies;
    setEnemies(freshEnemies);
    bulletsRef.current = [];
    setBullets([]);

    cameraXRef.current = 0;
    if (worldStageRef.current) {
      worldStageRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (containerRef.current) {
      containerRef.current.style.setProperty('--camera-x', '0px');
    }
    if (playerElRef.current) {
      playerElRef.current.style.transform = `translate3d(${levelConfig.playerStartX - charWidth / 2}px, ${startSurfaceY - charHeight}px, 0)`;
    }

    setHearts(3);
    setCoins(0);
    setTimeElapsed(0);
    setAnimState('idle');
    setFacing('right');
    setIsInvulnerable(false);
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
          cameraX={0}
          levelWidth={levelConfig.levelWidth}
        />

        <div
          ref={worldStageRef}
          className="rpg-world-stage"
          style={{
            width: `${levelConfig.levelWidth}px`,
            height: `${levelConfig.levelHeight}px`,
            transform: 'translate3d(0, 0, 0)',
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
                  src={getPlatformAssetUrl(plat.asset, levelConfig.islandThemeKey)}
                  alt=""
                  className="rpg-platform-img"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.triedFallback) {
                      img.dataset.triedFallback = 'true';
                      img.src = `/game_assets/png/${plat.asset}.png`;
                    } else {
                      img.style.display = 'none';
                    }
                  }}
                />

                {/* Dekorasi Alam Indah di Atas Platform */}
                {getPlatformDecorUrl(plat.id, plat.x, levelConfig.islandThemeKey) && (
                  <img
                    src={getPlatformDecorUrl(plat.id, plat.x, levelConfig.islandThemeKey)!}
                    alt="Dekorasi Alam"
                    className="rpg-platform-nature-decor"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}

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

          {/* MUSUH-MUSUH WANDERING DI PLATFORM */}
          {enemies.map((enemy) => {
            if (enemy.isDead) return null;
            let enemyImg = `/assets/png/enemies/${enemy.type}_idle.png`;
            if (enemy.type === 'bat') {
              enemyImg = '/assets/png/enemies/bat_wings_up.png';
            } else if (enemy.type === 'mushroom_walker') {
              enemyImg = '/assets/png/enemies/mushroom_walker.png';
            }

            return (
              <div
                key={enemy.id}
                ref={(el) => {
                  enemyElsRef.current[enemy.id] = el;
                }}
                className={`rpg-enemy-entity ${enemy.type}`}
                style={{
                  transform: `translate3d(${enemy.x}px, ${enemy.y - 48}px, 0) scaleX(${enemy.vx < 0 ? -1 : 1})`,
                }}
              >
                <img
                  src={enemyImg}
                  alt={enemy.type}
                  className="rpg-enemy-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/png/enemies/slime_green_idle.png';
                  }}
                />
                {enemy.hp < enemy.maxHp && (
                  <div className="enemy-hp-track">
                    <div className="enemy-hp-fill" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}

          {/* PROYEKTIL TEMBAKAN BLASTER PEMAIN */}
          {bullets.map((b) => (
            <div
              key={b.id}
              ref={(el) => {
                // Hapus entri saat elemen dilepas agar Record tidak menumpuk (memory leak)
                if (el) {
                  bulletElsRef.current[b.id] = el;
                } else {
                  delete bulletElsRef.current[b.id];
                }
              }}
              className={`rpg-bullet-entity ${b.projectile || 'bullet_orb'}`}
              style={{
                transform: `translate3d(${b.x}px, ${b.y}px, 0) scaleX(${b.vx < 0 ? -1 : 1})`,
              }}
            >
              <img
                src={`/assets/png/attack/${b.projectile || 'bullet_orb'}.png`}
                alt="Bullet"
                className="rpg-bullet-img"
              />
            </div>
          ))}

          {/* KARAKTER MASKOT KITA YANG BISA DIGERAKKAN */}
          <div
            ref={playerElRef}
            className={`rpg-mascot-entity ${isInvulnerable ? 'respawn-blink' : ''}`}
            style={{
              transform: `translate3d(${levelConfig.playerStartX - charWidth / 2}px, ${levelConfig.playerStartY - charHeight}px, 0)`,
              width: `${charWidth}px`,
              height: `${charHeight}px`,
              opacity: isInvulnerable ? 0.65 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            <AnimatedMascot
              state={animState}
              direction={facing}
              size={charHeight + 20}
              showShadow={true}
              walkSpeed={0.5}
              skinColor={player?.equipment?.skinColor || 'default'}
              hat={player?.equipment?.hat || 'none'}
              weapon="blaster"
              weaponColorFilter={blasterColorDef.filter}
              isShooting={isShootingFlash}
            />
          </div>
        </div>
      </div>

      {/* 4. ON-SCREEN VIRTUAL TOUCH CONTROLLER UNTUK MOBILE */}
      <div className="rpg-touch-controls-bar">
        {/* D-Pad Kiri & Kanan dengan Multi-touch Pointer Capture */}
        <div className="rpg-touch-dpad">
          <button
            type="button"
            className="touch-btn btn-left"
            title="Lari Kiri"
            onPointerDown={(e) => {
              e.preventDefault();
              safeCapturePointer(e.currentTarget, e.pointerId);
              keysRef.current.left = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
              keysRef.current.left = false;
            }}
            onPointerCancel={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
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
              safeCapturePointer(e.currentTarget, e.pointerId);
              keysRef.current.right = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
              keysRef.current.right = false;
            }}
            onPointerCancel={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
              keysRef.current.right = false;
            }}
          >
            <ArrowRight size={34} />
          </button>
        </div>

        {/* Tombol Aksi: Tembak Blaster & Loncat */}
        <div className="rpg-touch-actions">
          <button
            type="button"
            className="touch-btn btn-shoot-action"
            title="Tembak Blaster"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.blur();
              safeCapturePointer(e.currentTarget, e.pointerId);
              handleShoot();
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
            }}
          >
            <Zap size={32} />
            <span className="btn-jump-label">TEMBAK</span>
          </button>

          <button
            type="button"
            className="touch-btn btn-jump-action"
            title="Loncat"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.blur();
              safeCapturePointer(e.currentTarget, e.pointerId);
              handleTouchJump();
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
            }}
            onPointerCancel={(e) => {
              e.preventDefault();
              safeReleasePointer(e.currentTarget, e.pointerId);
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
