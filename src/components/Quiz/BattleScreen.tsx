import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import type { QuizQuestion } from '../../data/questions';
import type { PlayerProfile } from '../../types/game';
import type { GeometryMonster } from '../../data/monsters';
import { AvatarRenderer } from '../Common/AvatarRenderer';
import { QuestionVisual } from './QuestionVisual';
import './Battle.css';
import './Quiz.css';

interface BattleScreenProps {
  monster: GeometryMonster;
  player: PlayerProfile;
  questions: QuizQuestion[];
  onVictory: (reward: { exp: number; coins: number; stars: number; diamonds?: number }) => void;
  onDefeat: () => void;
  onQuit: () => void;
  onConsumeItem?: (kind: 'potion' | 'elixir') => boolean;
  onUseFiftyFifty?: () => boolean;
  onUseHint?: () => boolean;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  monster,
  player,
  questions,
  onVictory,
  onDefeat,
  onQuit,
  onConsumeItem,
  onUseFiftyFifty,
  onUseHint,
}) => {
  // Status Karakter RPG
  const initialPlayerStats = player.stats || {
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    atk: 25,
    def: 15,
  };

  const [playerHp, setPlayerHp] = useState(initialPlayerStats.hp);
  const [playerSp, setPlayerSp] = useState(initialPlayerStats.sp);
  const [monsterHp, setMonsterHp] = useState(monster.maxHp);

  // Mode konsol pertarungan
  const [consoleMode, setConsoleMode] = useState<'menu' | 'quiz' | 'skills' | 'items'>('menu');
  const [qIndex, setQIndex] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isMonsterHit, setIsMonsterHit] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [combatLog, setCombatLog] = useState(`Seekor ${monster.name} menghadang jalan! Bersiap bertarung!`);
  const [floatingEffect, setFloatingEffect] = useState<{ text: string; type: 'damage' | 'heal' | 'crit' } | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [activeSkill, setActiveSkill] = useState<{ name: string; multiplier: number; spCost: number; heal?: number } | null>(null);

  const currentQ = questions.length > 0 ? questions[qIndex % questions.length] : undefined;
  if (!currentQ) {
    return (
      <div className="battle-screen" style={{ padding: 24, textAlign: 'center', color: '#fff' }}>
        <p>Tidak ada soal untuk level ini. Silakan kembali ke peta.</p>
        <button onClick={onQuit}>Kembali ke Peta</button>
      </div>
    );
  }

  const triggerFloating = (text: string, type: 'damage' | 'heal' | 'crit') => {
    setFloatingEffect({ text, type });
    setTimeout(() => setFloatingEffect(null), 900);
  };

  // 1. Eksekusi Pilihan Aksi: Bertahan (Guard)
  const handleDefend = () => {
    setIsDefending(true);
    setCombatLog('🛡️ Mengambil posisi bertahan! Damage serangan monster berkurang 50%.');
    // Pulihkan 10 SP saat bertahan
    setPlayerSp((sp) => Math.min(initialPlayerStats.maxSp, sp + 10));
    triggerFloating('+10 SP', 'heal');

    // Giliran monster menyerang
    setTimeout(() => {
      monsterTurn(true);
    }, 1200);
  };

  // 2. Eksekusi Serang Biasa -> Buka Soal Kuis
  const handleStartBasicAttack = () => {
    setActiveSkill(null);
    setConsoleMode('quiz');
    setSelectedOptId(null);
    setIsAnswerCorrect(null);
    setEliminatedOptions([]);
    setCombatLog(`Pecahkan soal geometri untuk melancarkan serangan pedang penggaris!`);
  };

  // 3. Eksekusi Jurus Rumus -> Buka Soal Kuis dengan Pengganda Damage
  const handleExecuteSkill = (skill: { name: string; multiplier: number; spCost: number; heal?: number }) => {
    if (playerSp < skill.spCost) {
      setCombatLog(`⚡ SP tidak cukup untuk melancarkan ${skill.name}! (Butuh ${skill.spCost} SP)`);
      return;
    }
    setPlayerSp((sp) => sp - skill.spCost);
    setActiveSkill(skill);
    setConsoleMode('quiz');
    setSelectedOptId(null);
    setIsAnswerCorrect(null);
    setEliminatedOptions([]);
    setCombatLog(`Mempersiapkan jurus [${skill.name}]! Jawab soal untuk mengeksekusi!`);
  };

  // 4. Penggunaan Ramuan Darah & Eliksir SP di Menu Tas (stok dipotong via App)
  const handleUsePotion = () => {
    const ok = onConsumeItem ? onConsumeItem('potion') : true;
    if (!ok) {
      setCombatLog('Ramuan habis dan permata tidak cukup (Butuh 2 💎)!');
      return;
    }
    setPlayerHp((hp) => Math.min(initialPlayerStats.maxHp, hp + 45));
    triggerFloating('+45 HP', 'heal');
    setCombatLog('❤️ Meminum ramuan geometri! Memulihkan 45 HP.');
    setConsoleMode('menu');
  };

  const handleUseElixir = () => {
    const ok = onConsumeItem ? onConsumeItem('elixir') : true;
    if (!ok) {
      setCombatLog('Eliksir SP habis dan permata tidak cukup (Butuh 2 💎)!');
      return;
    }
    setPlayerSp((sp) => Math.min(initialPlayerStats.maxSp, sp + 30));
    triggerFloating('+30 SP', 'heal');
    setCombatLog('⚡ Meminum Eliksir Biru Safir! Memulihkan 30 SP.');
    setConsoleMode('menu');
  };

  // 5. Bantuan 50:50 di Mode Kuis Pertarungan
  const handleFiftyFifty = () => {
    if (eliminatedOptions.length > 0) return;
    const ok = onUseFiftyFifty ? onUseFiftyFifty() : false;
    if (ok) {
      const wrong = currentQ.options.filter((o) => o.id !== currentQ.correctId);
      const toElim = wrong.slice(0, 2).map((o) => o.id);
      setEliminatedOptions(toElim);
      setCombatLog('🎯 Bantuan 50:50: Menghapus 2 pilihan yang salah!');
    } else {
      setCombatLog('Tiket 50:50 habis / permata tidak cukup!');
    }
  };

  // 6. Bantuan Petunjuk Rumus
  const handleHint = () => {
    const ok = onUseHint ? onUseHint() : false;
    if (ok) {
      setCombatLog(`💡 Petunjuk: ${currentQ.formulaHint || currentQ.explanation}`);
    } else {
      setCombatLog('Tiket petunjuk rumus habis!');
    }
  };

  // 7. Giliran Serangan Monster Balasan
  const monsterTurn = (isPlayerGuarding: boolean) => {
    const rawDamage = monster.atk;
    const defReduction = Math.floor(initialPlayerStats.def / 2);
    let finalDamage = Math.max(5, rawDamage - defReduction);
    if (isPlayerGuarding) {
      finalDamage = Math.max(3, Math.floor(finalDamage * 0.5));
    }

    // Hitung HP baru di luar updater agar efek samping (kalah) tidak doble-eksekusi
    const nextHp = Math.max(0, playerHp - finalDamage);
    setPlayerHp(nextHp);

    if (nextHp <= 0) {
      triggerFloating(`-${finalDamage}`, 'damage');
      setIsDefending(false);
      setConsoleMode('menu');
      setTimeout(() => onDefeat(), 1200);
      return;
    }

    triggerFloating(`-${finalDamage}`, 'damage');
    setCombatLog(
      `💥 ${monster.name} melancarkan [${monster.skill.name}]! Kamu terkena ${finalDamage} damage!`
    );
    setIsDefending(false);
    setConsoleMode('menu');
  };

  // 8. Pemain Memilih Jawaban Kuis
  const handleAnswerSelect = (optionId: string) => {
    if (selectedOptId || eliminatedOptions.includes(optionId)) return;

    const correct = optionId === currentQ.correctId;
    setSelectedOptId(optionId);
    setIsAnswerCorrect(correct);

    if (correct) {
      // Hitung damage serangan pemain
      let dmg = Math.floor(initialPlayerStats.atk * (activeSkill ? activeSkill.multiplier : 1));
      // eslint-disable-next-line react-hooks/purity -- crit dihitung di event handler, bukan saat render
      const isCrit = Math.random() < 0.25; // Critical acak, tidak bisa diprediksi pemain
      if (isCrit) dmg = Math.floor(dmg * 1.5);

      // Kurangi HP Monster
      setIsMonsterHit(true);
      setTimeout(() => setIsMonsterHit(false), 450);

      const nextMonsterHp = Math.max(0, monsterHp - dmg);
      setMonsterHp(nextMonsterHp);
      triggerFloating(`-${dmg}${isCrit ? ' CRIT!' : ''}`, isCrit ? 'crit' : 'damage');

      // Tambah SP jika berhasil menjawab benar
      setPlayerSp((sp) => Math.min(initialPlayerStats.maxSp, sp + 8));

      // Jika skill memiliki efek pemulihan darah
      if (activeSkill?.heal) {
        setPlayerHp((hp) => Math.min(initialPlayerStats.maxHp, hp + activeSkill.heal!));
      }

      setCombatLog(
        `⚔️ Benar! Serangan [${activeSkill?.name || 'Tebasan Geometri'}] berhasil memberikan ${dmg} damage!`
      );

      // Cek apakah Monster KO
      if (nextMonsterHp <= 0) {
        setCombatLog(`🏆 ${monster.name} telah dikalahkan! Kemenangan untuk Petualang!`);
        setTimeout(() => {
          onVictory(monster.dropReward);
        }, 1200);
        return;
      }

      // Lanjut giliran monster
      setTimeout(() => {
        setQIndex((q) => q + 1);
        monsterTurn(false);
      }, 1400);
    } else {
      // Salah jawab: Meleset dan langsung diserang monster
      setCombatLog(`❌ Jawaban salah! Seranganmu meleset!`);
      triggerFloating('MISS!', 'damage');

      setTimeout(() => {
        setQIndex((q) => q + 1);
        monsterTurn(false);
      }, 1200);
    }
  };

  const monsterHpPct = Math.max(0, Math.min(100, (monsterHp / monster.maxHp) * 100));
  const playerHpPct = Math.max(0, Math.min(100, (playerHp / initialPlayerStats.maxHp) * 100));
  const playerSpPct = Math.max(0, Math.min(100, (playerSp / initialPlayerStats.maxSp) * 100));

  return (
    <div className="battle-screen">
      <div className="battle-arena-bg" />
      <div className="battle-arena-grid" />

      {/* Bar Navigasi Atas */}
      <div className="battle-topbar">
        <div className="battle-world-badge">
          <Swords size={17} color="#38bdf8" />
          <span>Pertarungan Geometri Lv.{monster.levelNum}</span>
        </div>
        <button className="battle-quit-btn" onClick={onQuit}>
          Kabur (Keluar)
        </button>
      </div>

      <div className="battle-stage">
        {/* Floating Combat Pop-up */}
        {floatingEffect && (
          <div className={`floating-damage ${floatingEffect.type}`}>
            {floatingEffect.text}
          </div>
        )}

        {/* Section Monster Musuh */}
        <div className="monster-section">
          <div className="monster-info-card">
            <div className="monster-header-row">
              <div className="monster-name-title">
                <span className="monster-name">{monster.name}</span>
                <span className="monster-sub">{monster.title}</span>
              </div>
              <span className="monster-badge-tag">
                {monster.isBoss ? '👑 BOS' : `Lv.${monster.levelNum}`}
              </span>
            </div>

            <div className="monster-hp-bar-wrap">
              <div className="monster-hp-fill" style={{ width: `${monsterHpPct}%` }} />
            </div>
            <span className="monster-hp-text">
              HP: {monsterHp} / {monster.maxHp}
            </span>
          </div>

          {/* Ilustrasi Visual Monster Geometri */}
          <div className="monster-avatar-stage">
            <div
              className="monster-aura"
              style={{ background: monster.color }}
            />
            <div className={`monster-shape-art ${isMonsterHit ? 'hit' : ''}`}>
              <svg width="86" height="86" viewBox="0 0 100 100">
                {monster.shapeType === 'triangle' && (
                  <polygon
                    points="50,15 90,85 10,85"
                    fill={monster.color}
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                )}
                {monster.shapeType === 'rectangle' && (
                  <rect
                    x="10"
                    y="25"
                    width="80"
                    height="50"
                    rx="10"
                    fill={monster.color}
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                )}
                {monster.shapeType === 'square' && (
                  <rect
                    x="15"
                    y="15"
                    width="70"
                    height="70"
                    rx="12"
                    fill={monster.color}
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                )}
                {monster.shapeType === 'polygon' && (
                  <polygon
                    points="50,10 88,38 74,84 26,84 12,38"
                    fill={monster.color}
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                )}
                {/* Mata Monster 3D */}
                <circle cx="38" cy="48" r="7" fill="#ffffff" />
                <circle cx="38" cy="48" r="4" fill="#0f172a" />
                <circle cx="62" cy="48" r="7" fill="#ffffff" />
                <circle cx="62" cy="48" r="4" fill="#0f172a" />
                {/* Mulut Senyum Nakal */}
                <path
                  d="M40 64 Q50 72 60 64"
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="monster-ground-shadow" />
          </div>
        </div>

        {/* Combat Log */}
        <div className="battle-combat-log">
          <span>{combatLog}</span>
        </div>

        {/* Console RPG Pemain */}
        <div className="player-rpg-console">
          {/* Status Bar HP/SP Pemain */}
          <div className="player-status-row">
            <div className="player-avatar-small">
              <AvatarRenderer avatarId={player.avatarId} />
            </div>
            <div className="player-bars-col">
              <div className="rpg-bar-item">
                <span className="rpg-bar-label hp">HP</span>
                <div className="rpg-bar-track">
                  <div className="rpg-bar-fill hp" style={{ width: `${playerHpPct}%` }} />
                </div>
                <span className="rpg-bar-val">{playerHp}/{initialPlayerStats.maxHp}</span>
              </div>
              <div className="rpg-bar-item">
                <span className="rpg-bar-label sp">SP</span>
                <div className="rpg-bar-track">
                  <div className="rpg-bar-fill sp" style={{ width: `${playerSpPct}%` }} />
                </div>
                <span className="rpg-bar-val">{playerSp}/{initialPlayerStats.maxSp}</span>
              </div>
            </div>
          </div>

          {/* TAMPILAN 1: MENU 4 PERINTAH RPG UTAMA */}
          {consoleMode === 'menu' && (
            <div className="battle-commands-grid">
              <button
                className="battle-cmd-btn attack"
                onClick={handleStartBasicAttack}
              >
                <div className="cmd-icon-box">⚔️</div>
                <div className="cmd-text-col">
                  <span className="cmd-title">Serang Biasa</span>
                  <span className="cmd-desc">Kuis Rumus Dasar</span>
                </div>
              </button>

              <button
                className="battle-cmd-btn skill"
                onClick={() => setConsoleMode('skills')}
              >
                <div className="cmd-icon-box">✨</div>
                <div className="cmd-text-col">
                  <span className="cmd-title">Jurus Rumus</span>
                  <span className="cmd-desc">Pakai SP Magis</span>
                </div>
              </button>

              <button
                className="battle-cmd-btn defend"
                onClick={handleDefend}
                disabled={isDefending}
              >
                <div className="cmd-icon-box">🛡️</div>
                <div className="cmd-text-col">
                  <span className="cmd-title">Bertahan</span>
                  <span className="cmd-desc">Kurangi Damage 50%</span>
                </div>
              </button>

              <button
                className="battle-cmd-btn bag"
                onClick={() => setConsoleMode('items')}
              >
                <div className="cmd-icon-box">🎒</div>
                <div className="cmd-text-col">
                  <span className="cmd-title">Tas Bantuan</span>
                  <span className="cmd-desc">Ramuan & Tiket</span>
                </div>
              </button>
            </div>
          )}

          {/* TAMPILAN 2: PILIHAN JURUS RUMUS MAGIS */}
          {consoleMode === 'skills' && (
            <div className="skills-select-panel">
              <div className="battle-quiz-header">
                <span className="battle-quiz-type">Pilih Jurus Rumus Geometri</span>
                <button className="battle-cancel-btn" onClick={() => setConsoleMode('menu')}>
                  Kembali
                </button>
              </div>

              <button
                className="skill-card-btn"
                disabled={playerSp < 15}
                onClick={() =>
                  handleExecuteSkill({
                    name: 'Tusukan Trisula Segitiga',
                    multiplier: 1.8,
                    spCost: 15,
                  })
                }
              >
                <div className="skill-info">
                  <span className="skill-name">🔺 Tusukan Trisula Segitiga</span>
                  <span className="skill-desc">Serangan 3 sudut tajam (Damage 1.8x)</span>
                </div>
                <span className="skill-sp-cost">15 SP</span>
              </button>

              <button
                className="skill-card-btn"
                disabled={playerSp < 20}
                onClick={() =>
                  handleExecuteSkill({
                    name: 'Benteng Kuadrat 4 Sisi',
                    multiplier: 1.3,
                    spCost: 20,
                    heal: 25,
                  })
                }
              >
                <div className="skill-info">
                  <span className="skill-name">🟦 Benteng Kuadrat Sejajar</span>
                  <span className="skill-desc">Serangan stabil + Pulihkan 25 HP</span>
                </div>
                <span className="skill-sp-cost">20 SP</span>
              </button>

              <button
                className="skill-card-btn"
                disabled={playerSp < 30}
                onClick={() =>
                  handleExecuteSkill({
                    name: 'Pusaran Lingkaran 360°',
                    multiplier: 2.5,
                    spCost: 30,
                  })
                }
              >
                <div className="skill-info">
                  <span className="skill-name">🔴 Pusaran Lingkaran 360°</span>
                  <span className="skill-desc">Jurus pamungkas kritikal (Damage 2.5x)</span>
                </div>
                <span className="skill-sp-cost">30 SP</span>
              </button>
            </div>
          )}

          {/* TAMPILAN 3: TAS RAMUAN & TIKET */}
          {consoleMode === 'items' && (
            <div className="skills-select-panel">
              <div className="battle-quiz-header">
                <span className="battle-quiz-type">Tas Bekal RPG Petualang</span>
                <button className="battle-cancel-btn" onClick={() => setConsoleMode('menu')}>
                  Kembali
                </button>
              </div>

              <button className="skill-card-btn" onClick={handleUsePotion}>
                <div className="skill-info">
                  <span className="skill-name">🧪 Ramuan Merah Ruby (HP)</span>
                  <span className="skill-desc">Pulihkan 45 HP seketika</span>
                </div>
                <span className="skill-sp-cost">
                  {(player.inventory?.potions || 0) > 0 ? `${player.inventory?.potions}x` : '2 💎'}
                </span>
              </button>

              <button className="skill-card-btn" onClick={handleUseElixir}>
                <div className="skill-info">
                  <span className="skill-name">⚡ Eliksir Biru Safir (SP)</span>
                  <span className="skill-desc">Pulihkan 30 SP seketika</span>
                </div>
                <span className="skill-sp-cost">
                  {(player.inventory?.spElixirs || 0) > 0 ? `${player.inventory?.spElixirs}x` : '2 💎'}
                </span>
              </button>

              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', textAlign: 'center' }}>
                Tiket 50:50 dan Petunjuk Rumus dapat langsung ditekan saat menjawab soal kuis!
              </p>
            </div>
          )}

          {/* TAMPILAN 4: PANEL SOAL KUIS PERTARUNGAN */}
          {consoleMode === 'quiz' && (
            <div className="battle-quiz-panel">
              <div className="battle-quiz-header">
                <span className="battle-quiz-type">
                  {activeSkill ? `✨ Jurus: ${activeSkill.name}` : '⚔️ Serangan Dasar'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="battle-cancel-btn"
                    onClick={handleFiftyFifty}
                    disabled={eliminatedOptions.length > 0 || !!selectedOptId}
                    title="Hilangkan 2 pilihan salah"
                  >
                    🎯 50:50
                  </button>
                  <button
                    className="battle-cancel-btn"
                    onClick={handleHint}
                    disabled={!!selectedOptId}
                    title="Buka petunjuk rumus"
                  >
                    💡 Petunjuk
                  </button>
                  <button
                    className="battle-cancel-btn"
                    onClick={() => setConsoleMode('menu')}
                    disabled={!!selectedOptId}
                  >
                    Batal
                  </button>
                </div>
              </div>

              <QuestionVisual type={currentQ.visual} prompt={currentQ.prompt} />

              <h4 className="battle-prompt-text">{currentQ.prompt}</h4>

              <div className="battle-options-grid">
                {currentQ.options.map((opt) => {
                  const isPicked = selectedOptId === opt.id;
                  const isElim = eliminatedOptions.includes(opt.id);
                  const isRight = selectedOptId && opt.id === currentQ.correctId;

                  const cls = [
                    'battle-opt-btn',
                    isPicked && isAnswerCorrect ? 'correct' : '',
                    isPicked && !isAnswerCorrect ? 'wrong' : '',
                    isRight && !isPicked ? 'correct' : '',
                    isElim ? 'eliminated' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={opt.id}
                      className={cls}
                      onClick={() => handleAnswerSelect(opt.id)}
                      disabled={!!selectedOptId || isElim}
                    >
                      <span>{isElim ? '—' : opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
