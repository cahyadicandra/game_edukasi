import React, { useState, useEffect, useRef } from 'react';
import type { GeometryMonster } from '../../data/monsters';
import { type QuizQuestion, shuffleQuestionOptions } from '../../data/questions';
import type { PlayerProfile } from '../../types/game';
import { BLASTER_COLORS } from '../../data/weaponParts';
import { AnimatedMascot } from '../Mascot/AnimatedMascot';
import { Swords, Check, X, Skull, Zap, Shield, Sparkles, Trophy } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { weaponSoundService } from '../../services/weaponSoundService';
import './RPGBossBattleView.css';

export interface RPGBossBattleViewProps {
  boss: GeometryMonster;
  questions: QuizQuestion[];
  player: PlayerProfile;
  onVictory: (stats: { correctAnswers: number; totalQuestions: number }) => void;
  onDefeat: () => void;
  onConsumeItem?: (itemType: 'potion' | 'hint' | 'fiftyFifty') => void;
}

/** Menentukan tema arena visual berdasarkan level atau warna monster sesuai 5 Pulau */
function getArenaTheme(boss: GeometryMonster): {
  key: string;
  name: string;
  ambientIcon: React.ReactNode;
} {
  const lvl = boss.levelNum;
  if (lvl >= 6 && lvl <= 10) {
    return { key: 'forest', name: 'Rimba Purba Hutan Segi Empat', ambientIcon: <Sparkles size={14} /> };
  }
  if (lvl >= 11 && lvl <= 15) {
    return { key: 'ice', name: 'Puncak Salju Pegunungan Segitiga', ambientIcon: <Sparkles size={14} /> };
  }
  if (lvl >= 16 && lvl <= 20) {
    return { key: 'lake', name: 'Laguna Magis Danau Lingkaran', ambientIcon: <Sparkles size={14} /> };
  }
  if (lvl >= 21 && lvl <= 25) {
    return { key: 'castle', name: 'Benteng Angkasa Kastil Geometri', ambientIcon: <Skull size={14} /> };
  }
  return { key: 'island', name: 'Lembah Hijau Pulau Bentuk', ambientIcon: <Zap size={14} /> };
}

/** Komponen Gambar Vektor Monster Bos yang Menyeramkan */
const ScaryBossMonsterVisual: React.FC<{ boss: GeometryMonster; isHit: boolean }> = ({ boss, isHit }) => {
  const size = 170;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const glowColor = boss.isBoss ? '#ef4444' : boss.color;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`scary-boss-svg ${isHit ? 'monster-hit-flash' : 'monster-breathing'}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`scaryGrad-${boss.id}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={boss.color} stopOpacity="1" />
          <stop offset="60%" stopColor="#1f112e" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#05020a" stopOpacity="1" />
        </radialGradient>

        <radialGradient id="evilEyeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f87171" />
          <stop offset="70%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        <filter id={`scaryGlow-${boss.id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={boss.isBoss ? '8' : '5'} result="blur" />
          <feFlood floodColor={glowColor} floodOpacity="0.75" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Aura bayangan gelap luar yang berputar */}
      <circle
        cx={cx}
        cy={cy}
        r={r * 1.32}
        fill="none"
        stroke={glowColor}
        strokeWidth="2"
        strokeDasharray="14 10"
        opacity="0.45"
        className="rotating-outer-aura"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r * 1.18}
        fill="none"
        stroke={glowColor}
        strokeWidth="1.5"
        strokeDasharray="6 8"
        opacity="0.6"
        className="rotating-inner-aura"
      />

      {/* Bentuk Tubuh Bos Menyeramkan sesuai tipe geometri */}
      <g filter={`url(#scaryGlow-${boss.id})`}>
        {boss.shapeType === 'triangle' && (
          <polygon
            points={`${cx},${cy - r * 1.1} ${cx - r},${cy + r * 0.9} ${cx + r},${cy + r * 0.9}`}
            fill={`url(#scaryGrad-${boss.id})`}
            stroke={glowColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {boss.shapeType === 'square' && (
          <rect
            x={cx - r * 0.85}
            y={cy - r * 0.85}
            width={r * 1.7}
            height={r * 1.7}
            rx={10}
            fill={`url(#scaryGrad-${boss.id})`}
            stroke={glowColor}
            strokeWidth="3.5"
          />
        )}

        {boss.shapeType === 'rectangle' && (
          <rect
            x={cx - r * 1.1}
            y={cy - r * 0.65}
            width={r * 2.2}
            height={r * 1.3}
            rx={10}
            fill={`url(#scaryGrad-${boss.id})`}
            stroke={glowColor}
            strokeWidth="3.5"
          />
        )}

        {boss.shapeType === 'circle' && (
          <circle
            cx={cx}
            cy={cy}
            r={r * 0.95}
            fill={`url(#scaryGrad-${boss.id})`}
            stroke={glowColor}
            strokeWidth="3.5"
          />
        )}

        {boss.shapeType === 'polygon' && (
          <polygon
            points={Array.from({ length: 6 }, (_, i) => {
              const ang = (Math.PI / 3) * i - Math.PI / 6;
              return `${cx + r * 0.95 * Math.cos(ang)},${cy + r * 0.95 * Math.sin(ang)}`;
            }).join(' ')}
            fill={`url(#scaryGrad-${boss.id})`}
            stroke={glowColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}
      </g>

      {/* Tanduk / Duri Runcing Menyeramkan */}
      <polygon
        points={`${cx - r * 0.65},${cy - r * 0.5} ${cx - r * 0.95},${cy - r * 1.05} ${cx - r * 0.35},${cy - r * 0.7}`}
        fill="#0f051d"
        stroke={glowColor}
        strokeWidth="1.5"
      />
      <polygon
        points={`${cx + r * 0.65},${cy - r * 0.5} ${cx + r * 0.95},${cy - r * 1.05} ${cx + r * 0.35},${cy - r * 0.7}`}
        fill="#0f051d"
        stroke={glowColor}
        strokeWidth="1.5"
      />

      {/* Retakan menyala di badan bos */}
      <path
        d={`M ${cx - r * 0.3} ${cy - r * 0.4} L ${cx - r * 0.05} ${cy - r * 0.05} L ${cx - r * 0.25} ${cy + r * 0.3} L ${cx} ${cy + r * 0.65}`}
        stroke="#fca5a5"
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      <path
        d={`M ${cx - r * 0.05} ${cy - r * 0.05} L ${cx + r * 0.35} ${cy - r * 0.15} L ${cx + r * 0.55} ${cy + r * 0.1}`}
        stroke="#fca5a5"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Mata Jahat Iblis Bersinar (Glowing Crimson Eyes) */}
      <ellipse
        cx={cx - r * 0.32}
        cy={cy - r * 0.08}
        rx={r * 0.22}
        ry={r * 0.14}
        fill="url(#evilEyeGrad)"
        transform={`rotate(12 ${cx - r * 0.32} ${cy - r * 0.08})`}
        className="evil-eye-pulse"
      />
      <ellipse
        cx={cx + r * 0.32}
        cy={cy - r * 0.08}
        rx={r * 0.22}
        ry={r * 0.14}
        fill="url(#evilEyeGrad)"
        transform={`rotate(-12 ${cx + r * 0.32} ${cy - r * 0.08})`}
        className="evil-eye-pulse"
      />

      {/* Pupil Mata Hitam Vertikal Berpijar */}
      <ellipse
        cx={cx - r * 0.32}
        cy={cy - r * 0.08}
        rx={r * 0.06}
        ry={r * 0.12}
        fill="#05020a"
      />
      <ellipse
        cx={cx + r * 0.32}
        cy={cy - r * 0.08}
        rx={r * 0.06}
        ry={r * 0.12}
        fill="#05020a"
      />

      {/* Kilatan Cahaya Merah Menembus Keluar dari Mata */}
      <line
        x1={cx - r * 0.32}
        y1={cy - r * 0.08}
        x2={cx - r * 0.75}
        y2={cy + r * 0.45}
        stroke="#ef4444"
        strokeWidth="2"
        opacity="0.65"
        className="eye-beam-laser"
      />
      <line
        x1={cx + r * 0.32}
        y1={cy - r * 0.08}
        x2={cx + r * 0.75}
        y2={cy + r * 0.45}
        stroke="#ef4444"
        strokeWidth="2"
        opacity="0.65"
        className="eye-beam-laser"
      />

      {/* Mulut Menyeringai dengan Gigi Tajam Runcing */}
      <path
        d={`M ${cx - r * 0.45} ${cy + r * 0.38} Q ${cx} ${cy + r * 0.68} ${cx + r * 0.45} ${cy + r * 0.38} Z`}
        fill="#090314"
        stroke="#ef4444"
        strokeWidth="1.5"
      />
      {/* Gigi Taring Tajam */}
      <polygon points={`${cx - r * 0.3},${cy + r * 0.38} ${cx - r * 0.22},${cy + r * 0.52} ${cx - r * 0.14},${cy + r * 0.38}`} fill="#f8fafc" />
      <polygon points={`${cx - r * 0.08},${cy + r * 0.39} ${cx},${cy + r * 0.54} ${cx + r * 0.08},${cy + r * 0.39}`} fill="#f8fafc" />
      <polygon points={`${cx + r * 0.14},${cy + r * 0.38} ${cx + r * 0.22},${cy + r * 0.52} ${cx + r * 0.3},${cy + r * 0.38}`} fill="#f8fafc" />
    </svg>
  );
};

export const RPGBossBattleView: React.FC<RPGBossBattleViewProps> = ({
  boss,
  questions,
  player,
  onVictory,
  onDefeat,
  onConsumeItem,
}) => {
  const [battleQuestions, setBattleQuestions] = useState<QuizQuestion[]>(() =>
    questions.map(shuffleQuestionOptions)
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [playerHp, setPlayerHp] = useState(100);
  const [correctCount, setCorrectCount] = useState(0);

  // Status perlengkapan RPG
  const hasSword =
    (player.inventory?.unlockedAccessories || []).includes('item-ruler-crystal') ||
    player.equipment?.weapon === 'item-ruler-crystal';
  const hasShield =
    (player.inventory?.unlockedAccessories || []).includes('item-protractor-shield') ||
    player.equipment?.shield === 'item-protractor-shield';

  // Stok Item Bekal Pertarungan
  const [localPotions, setLocalPotions] = useState(player.inventory?.potions ?? 2);
  const [localHints, setLocalHints] = useState(player.inventory?.hintTickets ?? 2);
  const [localFiftyFifty, setLocalFiftyFifty] = useState(player.inventory?.fiftyFiftyTickets ?? 1);
  const [showFormulaHint, setShowFormulaHint] = useState(false);

  // Status visual aksi
  const [mascotAnim, setMascotAnim] = useState<'idle' | 'walk' | 'jump' | 'fall' | 'land'>('idle');
  const [bossHitEffect, setBossHitEffect] = useState(false);
  const [playerHitEffect, setPlayerHitEffect] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; isBoss: boolean } | null>(null);
  const [showSkillAttack, setShowSkillAttack] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [battleOutcome, setBattleOutcome] = useState<'ongoing' | 'victory' | 'defeat'>('ongoing');

  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = getArenaTheme(boss);
  const currentQ = battleQuestions[currentQIndex] || battleQuestions[0];

  // Auto-hide Intro Banner setelah 2.2 detik
  useEffect(() => {
    introTimerRef.current = setTimeout(() => {
      setShowIntroModal(false);
    }, 2200);
    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, []);

  // Helper Haptics
  const triggerHaptic = (style: ImpactStyle = ImpactStyle.Medium) => {
    try {
      Haptics.impact({ style });
    } catch {
      // Ignore
    }
  };

  // Gunakan Ramuan HP (+45 HP)
  const handleUsePotion = () => {
    if (localPotions <= 0 || playerHp >= 100 || battleOutcome !== 'ongoing' || isAnswerRevealed) return;
    setLocalPotions((p) => Math.max(0, p - 1));
    setPlayerHp((prev) => Math.min(100, prev + 45));
    setFloatingDamage({ text: '+45 HP Dipulihkan! 💚', isBoss: false });
    triggerHaptic(ImpactStyle.Medium);
    if (onConsumeItem) onConsumeItem('potion');
    setTimeout(() => setFloatingDamage(null), 1200);
  };

  // Gunakan Petunjuk Rumus
  const handleUseFormulaHint = () => {
    if (localHints <= 0 || showFormulaHint || battleOutcome !== 'ongoing') return;
    setLocalHints((h) => Math.max(0, h - 1));
    setShowFormulaHint(true);
    triggerHaptic(ImpactStyle.Light);
    if (onConsumeItem) onConsumeItem('hint');
  };

  // 50:50 Bantuan (Ketat memvalidasi stok tiket)
  const handleUseFiftyFifty = () => {
    if (localFiftyFifty <= 0 || hintUsed || isAnswerRevealed || showIntroModal || battleOutcome !== 'ongoing') return;
    setHintUsed(true);
    setLocalFiftyFifty((f) => Math.max(0, f - 1));
    if (onConsumeItem) onConsumeItem('fiftyFifty');

    const incorrectOptions = currentQ.options.filter((opt) => opt.id !== currentQ.correctId);
    const shuffled = [...incorrectOptions].sort(() => 0.5 - Math.random());
    setEliminatedOptions([shuffled[0]?.id, shuffled[1]?.id].filter(Boolean) as string[]);
    triggerHaptic(ImpactStyle.Light);
  };

  // Memilih Jawaban
  const handleSelectOption = (optionId: string) => {
    if (isAnswerRevealed || showIntroModal || battleOutcome !== 'ongoing') return;
    setSelectedOptionId(optionId);
    setIsAnswerRevealed(true);

    const isCorrect = optionId === currentQ.correctId;

    if (isCorrect) {
      // PEMAIN MENYERANG BOS!
      triggerHaptic(ImpactStyle.Heavy);
      setCorrectCount((c) => c + 1);
      setMascotAnim('jump');

      const equippedWeapon = player.equipment?.blasterSkin || 'blaster_klasik';
      weaponSoundService.playWeaponShoot(equippedWeapon);
      setTimeout(() => {
        weaponSoundService.playWeaponHit(equippedWeapon);
      }, 150);

      // 3 jawaban benar akan menghabisi HP bos + bonus senjata pedang
      const swordBonus = hasSword ? 4 : 0;
      const damageToBoss = Math.ceil(boss.maxHp / 3) + 5 + swordBonus;
      const nextBossHp = Math.max(0, bossHp - damageToBoss);

      setFloatingDamage({
        text: `-${damageToBoss} HP! 💥${hasSword ? ' 🗡️+Pedang' : ''}`,
        isBoss: true,
      });
      setBossHitEffect(true);
      // Kurangi HP bos seketika agar visual feedback responsif!
      setBossHp(nextBossHp);

      setTimeout(() => {
        setBossHitEffect(false);
        setMascotAnim('idle');

        // GAME SELESAI: BOS KALAH!
        if (nextBossHp <= 0) {
          setBattleOutcome('victory');
          triggerHaptic(ImpactStyle.Heavy);
          setTimeout(() => {
            onVictory({
              correctAnswers: correctCount + 1,
              totalQuestions: battleQuestions.length,
            });
          }, 1400);
          return;
        }

        advanceToNextQuestion();
      }, 900);
    } else {
      // BOS MENYERANG PEMAIN DENGAN SKILL KHUSUS!
      triggerHaptic(ImpactStyle.Heavy);
      setShowSkillAttack(true);

      // 3 jawaban salah akan menghabiskan HP pemain (100 HP), tertahan perisai jika ada
      const shieldMitigation = hasShield ? 8 : 0;
      const baseDmg = Math.max(boss.atk, 34);
      const damageToPlayer = Math.max(16, baseDmg - shieldMitigation);
      const nextPlayerHp = Math.max(0, playerHp - damageToPlayer);

      setFloatingDamage({
        text: `-${damageToPlayer} HP! ⚡${hasShield ? ' 🛡️-Perisai' : ''}`,
        isBoss: false,
      });
      setPlayerHitEffect(true);
      // Kurangi HP pemain seketika agar bar darah langsung merespons
      setPlayerHp(nextPlayerHp);

      setTimeout(() => {
        setShowSkillAttack(false);
        setPlayerHitEffect(false);

        // GAME SELESAI: PLAYER KALAH!
        if (nextPlayerHp <= 0) {
          setBattleOutcome('defeat');
          triggerHaptic(ImpactStyle.Heavy);
          setTimeout(() => {
            onDefeat();
          }, 1400);
          return;
        }

        advanceToNextQuestion();
      }, 1200);
    }
  };

  const advanceToNextQuestion = () => {
    setTimeout(() => {
      setSelectedOptionId(null);
      setIsAnswerRevealed(false);
      setFloatingDamage(null);
      setEliminatedOptions([]);
      setHintUsed(false);
      setShowFormulaHint(false);

      // Pertarungan TERUS BERLANJUT sampai Bos Kalah ATAU Player Kalah!
      // Jika di akhir daftar soal, putar kembali pertanyaan secara bergilir & acak ulang opsi
      setCurrentQIndex((idx) => {
        const nextIdx = (idx + 1) % battleQuestions.length;
        if (nextIdx === 0) {
          setBattleQuestions((prev) => prev.map(shuffleQuestionOptions));
        }
        return nextIdx;
      });
    }, 700);
  };

  return (
    <div className={`boss-battle-screen theme-${theme.key}`}>
      {/* Efek Partikel Latar Belakang Tema */}
      <div className="arena-ambient-fx" aria-hidden="true">
        <div className="ambient-fog-layer" />
        <div className="ambient-ember-1" />
        <div className="ambient-ember-2" />
        <div className="ambient-ember-3" />
      </div>

      {/* 0. INTRO DRAMATIS PERTARUNGAN BOS */}
      {showIntroModal && (
        <div className="boss-intro-splash" onClick={() => setShowIntroModal(false)}>
          <div className="boss-intro-content">
            <div className="boss-intro-badge">
              <Skull size={20} className="skull-flash-icon" />
              <span>PERINGATAN BOS MUNCUL!</span>
            </div>
            <h1 className="boss-intro-monster-name">{boss.name}</h1>
            <p className="boss-intro-subtitle">{boss.title}</p>
            <div className="boss-intro-arena-tag">
              {theme.ambientIcon} <span>Arena: {theme.name}</span>
            </div>
            <div className="boss-intro-skill-tag">
              <Zap size={14} /> <span>Jurus Mematikan: {boss.skill.name}</span>
            </div>
            <p className="boss-intro-touch-hint">Ketuk untuk mulai bertarung ⚔️</p>
          </div>
        </div>
      )}

      {/* Efek Kilat Serangan Jurus Bos */}
      {showSkillAttack && (
        <div className="boss-skill-lightning-fx" aria-hidden="true">
          <div className="skill-lightning-beam" />
          <div className="skill-banner-announcement">
            <Zap size={22} className="lightning-zap-icon" />
            <span>{boss.skill.name}!</span>
          </div>
        </div>
      )}

      {/* OVERLAY KEMENANGAN (BOS KALAH) */}
      {battleOutcome === 'victory' && (
        <div className="boss-battle-outcome-overlay victory">
          <div className="outcome-content-box victory">
            <div className="outcome-icon-wrap victory">
              <Trophy size={56} className="outcome-trophy-icon" />
            </div>
            <h2 className="outcome-title victory">BOS TELAH DIKALAHKAN!</h2>
            <p className="outcome-subtitle">Kamu berhasil menaklukkan {boss.name}! 🏆</p>
          </div>
        </div>
      )}

      {/* OVERLAY KEKALAHAN (PLAYER KALAH) */}
      {battleOutcome === 'defeat' && (
        <div className="boss-battle-outcome-overlay defeat">
          <div className="outcome-content-box defeat">
            <div className="outcome-icon-wrap defeat">
              <Skull size={56} className="outcome-skull-icon" />
            </div>
            <h2 className="outcome-title defeat">KAMU KALAH DARI BOS!</h2>
            <p className="outcome-subtitle">{boss.name} melumpuhkanmu dengan {boss.skill.name}! 💀</p>
          </div>
        </div>
      )}

      {/* 1. ARENA PERTARUNGAN RPG (ATAS) */}
      <div className="battle-stage-arena">
        {/* Karakter Maskot Pemain (Kiri) */}
        <div className={`battle-combatant mascot-side ${playerHitEffect ? 'hit-shake' : ''}`}>
          <div className="combatant-info-card player-info-card">
            <div className="combatant-header-row">
              <Shield size={13} className="player-shield-icon" />
              <span className="combatant-name">{player.name}</span>
            </div>
            <div className="health-bar-container">
              <div
                className="health-bar-fill player-hp"
                style={{ width: `${(playerHp / 100) * 100}%` }}
              />
            </div>
            <span className="health-number">{playerHp} / 100 HP</span>
          </div>

          <div className="battle-mascot-rig-box">
            <AnimatedMascot
              state={mascotAnim}
              direction="right"
              size={160}
              showShadow={true}
              skinColor={player.equipment?.skinColor || 'default'}
              hat={player.equipment?.hat || 'none'}
              weapon="blaster"
              weaponSkin={
                player.equipment?.blasterSkin ||
                player.equipment?.loadouts?.[player.equipment?.activeLoadoutIndex ?? 0]?.skinId ||
                'blaster_klasik'
              }
              weaponColorFilter={BLASTER_COLORS.find((c) => c.id === (player.equipment?.blasterColor || 'default'))?.filter}
              isShooting={mascotAnim === 'jump'}
            />
          </div>

          {floatingDamage && !floatingDamage.isBoss && (
            <div className="floating-damage-number player-dmg">
              {floatingDamage.text}
            </div>
          )}
        </div>

        {/* Lencana VS di Tengah */}
        <div className="battle-vs-badge">
          <Swords size={26} className="vs-swords-icon" />
          <span>VS</span>
          <span className="arena-theme-mini-badge">{theme.key.toUpperCase()}</span>
        </div>

        {/* Bos Monster Menyeramkan (Kanan) */}
        <div className={`battle-combatant boss-side ${bossHitEffect ? 'hit-shake' : ''}`}>
          <div className="combatant-info-card boss-card">
            <div className="boss-title-row">
              <Skull size={15} className="boss-skull-badge-icon" />
              <span className="combatant-name boss-name-label">{boss.name}</span>
            </div>
            <div className="health-bar-container">
              <div
                className="health-bar-fill boss-hp"
                style={{ width: `${(bossHp / boss.maxHp) * 100}%` }}
              />
            </div>
            <span className="health-number">{bossHp} / {boss.maxHp} HP</span>
          </div>

          <div className="battle-scary-boss-stage">
            <div className="boss-ground-shadow" />
            <ScaryBossMonsterVisual boss={boss} isHit={bossHitEffect} />
          </div>

          {floatingDamage && floatingDamage.isBoss && (
            <div className="floating-damage-number boss-dmg">
              {floatingDamage.text}
            </div>
          )}
        </div>
      </div>

      {/* 2. KARTU SOAL & KUIS GEOMETRI (BAWAH) */}
      <div className="battle-quiz-card">
        {/* Header Kuis & Quickbar Item */}
        <div className="quiz-card-top-bar">
          <div className="quiz-progress-pill">
            Pertanyaan <strong>{currentQIndex + 1}</strong> dari {questions.length}
          </div>

          <div className="quiz-boss-skill-alert">
            <Zap size={14} /> Waspada: {boss.skill.name} (-{boss.atk} HP)
          </div>

          {/* Quickbar Item Bekal RPG */}
          <div className="battle-items-quickbar">
            <button
              type="button"
              className={`btn-battle-item potion ${localPotions <= 0 || playerHp >= 100 ? 'disabled' : ''}`}
              onClick={handleUsePotion}
              disabled={localPotions <= 0 || playerHp >= 100 || isAnswerRevealed || battleOutcome !== 'ongoing'}
              title="Gunakan Ramuan (+45 HP)"
            >
              <span className="item-btn-icon">🧪</span>
              <span className="item-btn-label">+45 HP</span>
              <span className="item-badge-count">{localPotions}</span>
            </button>

            <button
              type="button"
              className={`btn-battle-item formula ${showFormulaHint ? 'active' : ''} ${localHints <= 0 ? 'disabled' : ''}`}
              onClick={handleUseFormulaHint}
              disabled={localHints <= 0 || showFormulaHint || isAnswerRevealed || battleOutcome !== 'ongoing'}
              title="Gunakan Tiket Rumus Geometri"
            >
              <span className="item-btn-icon">📜</span>
              <span className="item-btn-label">Rumus</span>
              <span className="item-badge-count">{localHints}</span>
            </button>

            <button
              type="button"
              className={`btn-battle-item fifty ${hintUsed ? 'active' : ''} ${localFiftyFifty <= 0 && !hintUsed ? 'disabled' : ''}`}
              onClick={handleUseFiftyFifty}
              disabled={hintUsed || isAnswerRevealed || battleOutcome !== 'ongoing'}
              title="Hilangkan 2 Opsi Salah (50:50)"
            >
              <span className="item-btn-icon">🎯</span>
              <span className="item-btn-label">50:50</span>
              <span className="item-badge-count">{localFiftyFifty}</span>
            </button>
          </div>
        </div>

        {/* Banner Petunjuk Rumus Jika Aktif */}
        {showFormulaHint && (
          <div className="battle-formula-hint-banner">
            <div className="formula-hint-icon">💡</div>
            <div className="formula-hint-content">
              <span className="formula-hint-title">Contekan Rumus Geometri:</span>
              <p className="formula-hint-desc">
                {currentQ.formulaHint || currentQ.explanation || 'Ingat sifat dan rumus bangun geometri terkait!'}
              </p>
            </div>
          </div>
        )}

        {/* Pertanyaan */}
        <h3 className="quiz-prompt-text">{currentQ.prompt}</h3>

        {/* Pilihan Jawaban */}
        <div className="quiz-options-grid">
          {currentQ.options.map((opt) => {
            const isEliminated = eliminatedOptions.includes(opt.id);
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = isAnswerRevealed && opt.id === currentQ.correctId;
            const isWrong = isAnswerRevealed && isSelected && !isCorrect;

            return (
              <button
                key={opt.id}
                type="button"
                className={`quiz-option-button ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${isEliminated ? 'eliminated' : ''}`}
                disabled={isAnswerRevealed || isEliminated}
                onClick={() => handleSelectOption(opt.id)}
              >
                <span className="opt-letter">{opt.id.toUpperCase()}</span>
                <span className="opt-label">{opt.label}</span>
                {isCorrect && <Check size={18} className="status-icon correct" />}
                {isWrong && <X size={18} className="status-icon wrong" />}
              </button>
            );
          })}
        </div>

        {/* Petunjuk Rumus / Penjelasan */}
        {isAnswerRevealed && (
          <div className="quiz-explanation-box">
            <span>{currentQ.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
};
