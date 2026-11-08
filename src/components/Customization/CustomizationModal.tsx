import React, { useState, useRef } from 'react';
import type { PlayerProfile, WeaponLoadout } from '../../types/game';
import {
  WEAPON_PARTS_CATALOG,
  BLASTER_COLORS,
  CHARACTER_SKINS,
  CHARACTER_HATS,
  DEFAULT_LOADOUTS,
  DEFAULT_UNLOCKED_PARTS,
  SLOT_INFO,
  UPGRADE_REQUIREMENTS,
  computeWeaponStats,
  getPartUpgradeDiff,
  type ComputedWeaponStats,
} from '../../data/weaponParts';
import { AnimatedMascot, type MascotAnimationState } from '../Mascot/AnimatedMascot';
import {
  X,
  Crosshair,
  Wrench,
  Palette,
  Zap,
  ArrowUpCircle,
  Check,
  Lock,
} from 'lucide-react';
import './CustomizationModal.css';

export interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdatePlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

type TabType = 'weapon' | 'character';
type WeaponSlotType = 'body' | 'core' | 'barrel' | 'grip' | 'charm';

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('weapon');

  // Loadouts State
  const initialLoadouts: WeaponLoadout[] =
    player.equipment?.loadouts && player.equipment.loadouts.length === 3
      ? player.equipment.loadouts
      : DEFAULT_LOADOUTS;

  const [activeLoadoutIdx, setActiveLoadoutIdx] = useState<number>(
    player.equipment?.activeLoadoutIndex ?? 0
  );
  const [loadouts, setLoadouts] = useState<WeaponLoadout[]>(initialLoadouts);

  // Selected Weapon Slot for inspection
  const [activeSlot, setActiveSlot] = useState<WeaponSlotType>('core');

  // Character Mascot Preview State
  const [mascotAnimState, setMascotAnimState] = useState<MascotAnimationState>('idle');
  const [selectedSkin, setSelectedSkin] = useState<string>(
    player.equipment?.skinColor || 'default'
  );
  const [selectedHat, setSelectedHat] = useState<string>(
    player.equipment?.hat || 'none'
  );

  // Unlocked Parts List (Default jika kosong)
  const unlockedParts: string[] =
    player.equipment?.unlockedParts && player.equipment.unlockedParts.length > 0
      ? player.equipment.unlockedParts
      : DEFAULT_UNLOCKED_PARTS;

  const isPartUnlocked = (partId: string) => {
    const partDef = WEAPON_PARTS_CATALOG[partId];
    if (!partDef) return false;
    if ((partDef.unlockCostCoins ?? 0) === 0) return true;
    return unlockedParts.includes(partId);
  };

  // Part Levels & Coins
  const partLevels = player.equipment?.partLevels || {};
  const playerShards = player.equipment?.shards ?? 150;
  const playerCoins = player.coins ?? 1000;

  // Dummy Shooting Target & Bullet Fly Animation Simulator
  const [isDummyHurt, setIsDummyHurt] = useState(false);
  const [isMuzzleFlashing, setIsMuzzleFlashing] = useState(false);
  const [flyingBullet, setFlyingBullet] = useState<{ active: boolean; type: string } | null>(null);
  const [impactSpark, setImpactSpark] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; id: number } | null>(null);

  // Audio Context Ref for instant zero-latency SFX
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedSfx = (type: 'shoot' | 'hit' | 'upgrade' | 'equip' | 'click' | 'unlock') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'shoot') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'upgrade' || type === 'unlock') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.33);
      } else if (type === 'equip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio fallback silent
    }
  };

  if (!isOpen) return null;

  const currentLoadout = loadouts[activeLoadoutIdx] || DEFAULT_LOADOUTS[0];
  const computedStats: ComputedWeaponStats = computeWeaponStats(currentLoadout, partLevels);
  const activeColorDef = BLASTER_COLORS.find((c) => c.id === currentLoadout.color) || BLASTER_COLORS[0];

  // Helper ganti item pada loadout aktif
  const handleSelectPart = (slot: WeaponSlotType, partId: string) => {
    if (!isPartUnlocked(partId)) return;
    playSynthesizedSfx('equip');
    const updated = [...loadouts];
    updated[activeLoadoutIdx] = {
      ...updated[activeLoadoutIdx],
      [slot]: partId,
    };
    setLoadouts(updated);
    saveToPlayerProfile(updated, activeLoadoutIdx, selectedSkin, selectedHat);
  };

  // Buka Kunci / Pembelian Peluru atau Bagian Senjata
  const handleUnlockPart = (partId: string) => {
    const partDef = WEAPON_PARTS_CATALOG[partId];
    if (!partDef) return;
    const cost = partDef.unlockCostCoins || 0;
    if (playerCoins < cost) return;

    playSynthesizedSfx('unlock');

    onUpdatePlayer((prev) => {
      const prevCoins = prev.coins ?? 1000;
      const prevUnlocked = prev.equipment?.unlockedParts || DEFAULT_UNLOCKED_PARTS;
      // Cegah doble-eksekusi (double tap) dan koin negatif
      if (prevUnlocked.includes(partId)) return prev;
      if (prevCoins < cost) return prev;
      const nextUnlocked = Array.from(new Set([...prevUnlocked, partId]));

      return {
        ...prev,
        coins: Math.max(0, prevCoins - cost),
        equipment: {
          ...prev.equipment,
          unlockedParts: nextUnlocked,
        },
      };
    });
  };

  // Ganti warna blaster
  const handleSelectColor = (colorId: string) => {
    playSynthesizedSfx('click');
    const updated = [...loadouts];
    updated[activeLoadoutIdx] = {
      ...updated[activeLoadoutIdx],
      color: colorId,
    };
    setLoadouts(updated);
    saveToPlayerProfile(updated, activeLoadoutIdx, selectedSkin, selectedHat);
  };

  // Ganti slot loadout aktif (1, 2, atau 3)
  const handleSwitchLoadout = (idx: number) => {
    playSynthesizedSfx('click');
    setActiveLoadoutIdx(idx);
    saveToPlayerProfile(loadouts, idx, selectedSkin, selectedHat);
  };

  // Upgrade part senjata (MENGGUNAKAN KOIN)
  const handleUpgradePart = (partId: string) => {
    const curLevel = partLevels[partId] || 1;
    if (curLevel >= 5) return;
    const req = UPGRADE_REQUIREMENTS[curLevel];
    if (playerCoins < req.coins) return;

    playSynthesizedSfx('upgrade');

    onUpdatePlayer((prev) => {
      const prevCoins = prev.coins ?? 1000;
      const prevLevels = prev.equipment?.partLevels || {};

      // Cegah doble-eksekusi (double tap) dan koin negatif
      if ((prevLevels[partId] || 1) > curLevel) return prev;
      if (prevCoins < req.coins) return prev;

      const nextLevels = {
        ...prevLevels,
        [partId]: curLevel + 1,
      };

      const updatedEq = {
        ...prev.equipment,
        partLevels: nextLevels,
      };

      return {
        ...prev,
        coins: Math.max(0, prevCoins - req.coins),
        equipment: updatedEq,
      };
    });
  };

  // Simpan data kustomisasi ke Player Profile
  const saveToPlayerProfile = (
    updatedLoadouts: WeaponLoadout[],
    activeIdx: number,
    skin: string,
    hat: string
  ) => {
    const curL = updatedLoadouts[activeIdx];
    const coreDef = WEAPON_PARTS_CATALOG[curL.core];
    const activeBulletType = coreDef?.projectile || 'bullet_orb';

    onUpdatePlayer((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        loadouts: updatedLoadouts,
        activeLoadoutIndex: activeIdx,
        blasterColor: curL.color,
        blasterCore: activeBulletType,
        blasterBarrel: curL.barrel,
        blasterGrip: curL.grip,
        blasterCharm: curL.charm,
        skinColor: skin,
        hat: hat,
        unlockedParts: prev.equipment?.unlockedParts || unlockedParts,
      },
    }));
  };

  // Simpan Kustomisasi Karakter
  const handleSelectSkin = (skinId: string) => {
    playSynthesizedSfx('click');
    setSelectedSkin(skinId);
    saveToPlayerProfile(loadouts, activeLoadoutIdx, skinId, selectedHat);
  };

  const handleSelectHat = (hatId: string) => {
    playSynthesizedSfx('equip');
    setSelectedHat(hatId);
    saveToPlayerProfile(loadouts, activeLoadoutIdx, selectedSkin, hatId);
  };

  // Uji Coba Tembak Dummy Target dengan Peluru Terbang Animasi Nyata
  const handleTestShoot = () => {
    playSynthesizedSfx('shoot');
    setIsMuzzleFlashing(true);
    setFlyingBullet({ active: true, type: computedStats.bulletType });
    setTimeout(() => setIsMuzzleFlashing(false), 100);

    // Peluru tiba di target dummy setelah 160ms
    setTimeout(() => {
      playSynthesizedSfx('hit');
      setFlyingBullet(null);
      setIsDummyHurt(true);
      setImpactSpark(true);

      const isCrit = Math.random() * 100 < computedStats.critChance;
      const finalDmg = isCrit ? Math.round(computedStats.damage * 2 * 10) / 10 : computedStats.damage;

      setFloatingDamage({
        text: isCrit ? `💥 CRIT! -${finalDmg}` : `-${finalDmg}`,
        id: Date.now(),
      });

      setTimeout(() => {
        setIsDummyHurt(false);
        setImpactSpark(false);
      }, 200);

      setTimeout(() => setFloatingDamage(null), 850);
    }, 160);
  };

  // Part yang tersedia untuk slot aktif
  const availablePartsForSlot = Object.values(WEAPON_PARTS_CATALOG).filter(
    (p) => p.slot === activeSlot
  );

  return (
    <div className="custom-modal-overlay" role="dialog" aria-modal="true">
      <div className="custom-modal-container">
        {/* 1. HEADER CERIA & COLORFUL */}
        <header className="custom-modal-header">
          <div className="custom-header-left">
            <div className="custom-header-icon-wrap">
              <Wrench size={20} color="#f59e0b" />
            </div>
            <div className="custom-header-text">
              <h2 className="custom-header-title">Bengkel & Kustomisasi</h2>
              <div className="custom-currencies-pill">
                <span className="curr-badge gold">
                  🪙 {playerCoins.toLocaleString()} Koin
                </span>
                <span className="curr-badge shard">
                  💠 {playerShards.toLocaleString()} Shard
                </span>
              </div>
            </div>
          </div>

          <button
            className="custom-btn-close"
            onClick={onClose}
            aria-label="Tutup Bengkel"
          >
            <X size={20} />
          </button>
        </header>

        {/* 2. TAB NAVIGASI COLORFUL DUA TOMBOL */}
        <nav className="custom-tab-nav">
          <button
            className={`custom-tab-btn btn-weapon ${activeTab === 'weapon' ? 'active' : ''}`}
            onClick={() => {
              playSynthesizedSfx('click');
              setActiveTab('weapon');
            }}
          >
            <Crosshair size={16} />
            <span>Bengkel Senjata</span>
          </button>
          <button
            className={`custom-tab-btn btn-character ${activeTab === 'character' ? 'active' : ''}`}
            onClick={() => {
              playSynthesizedSfx('click');
              setActiveTab('character');
            }}
          >
            <Palette size={16} />
            <span>Karakter & Topi</span>
          </button>
        </nav>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: BENGKEL SENJATA (CLEAN, COLORFUL & ANIMATED) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'weapon' && (
          <div className="custom-workshop-body">
            {/* ROW LOADOUT & PILIHAN WARNA CEPAT */}
            <div className="custom-quick-bar">
              <div className="loadout-pills-row">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    className={`loadout-pill-btn ${activeLoadoutIdx === idx ? 'active' : ''}`}
                    onClick={() => handleSwitchLoadout(idx)}
                  >
                    <span>Loadout {idx + 1}</span>
                    {activeLoadoutIdx === idx && <Check size={14} />}
                  </button>
                ))}
              </div>

              {/* Warna Blaster Cepat */}
              <div className="swatches-compact-row">
                {BLASTER_COLORS.map((col) => (
                  <button
                    key={col.id}
                    className={`swatch-dot ${currentLoadout.color === col.id ? 'selected' : ''}`}
                    style={{ backgroundColor: col.hex }}
                    onClick={() => handleSelectColor(col.id)}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* SHOWCASE ARENA BLASTER, PELURU TERBANG & DUMMY TARGET */}
            <div className="blaster-showcase-arena">
              {/* Sisi Kiri: Blaster & Info Peluru */}
              <div className="blaster-display-box">
                <div className="blaster-img-container">
                  <img
                    src="/assets/png/attack/blaster.png"
                    alt="Blaster"
                    className="blaster-hero-img"
                    style={{ filter: activeColorDef.filter }}
                  />
                  {isMuzzleFlashing && (
                    <img
                      src="/assets/png/attack/muzzle_flash.png"
                      alt="Flash"
                      className="blaster-muzzle-flash"
                    />
                  )}
                </div>
              </div>

              {/* PELURU ANIMASI TERBANG NYATA KE DUMMY TARGET */}
              {flyingBullet && (
                <div className={`flying-bullet-anim-box ${flyingBullet.type}`}>
                  <img
                    src={`/assets/png/attack/${flyingBullet.type}.png`}
                    alt="Flying Bullet"
                    className="flying-bullet-img"
                  />
                </div>
              )}

              {/* SPARK EFEK SAAT PELURU MELEDAK DI DUMMY */}
              {impactSpark && (
                <img
                  src="/assets/png/attack/hit_spark_1.png"
                  alt="Hit Spark"
                  className="target-impact-spark-effect"
                />
              )}

              {/* Tombol Tembak Tengah */}
              <button
                className="btn-action-test-shoot"
                onClick={handleTestShoot}
                title="Tembak dummy target untuk menguji senjata & peluru"
              >
                <Zap size={16} color="#fcd34d" />
                <span>Tembak!</span>
              </button>

              {/* Sisi Kanan: Target Dummy Uji */}
              <div className="dummy-target-box">
                <div className={`dummy-doll ${isDummyHurt ? 'hurt' : ''}`}>
                  <span className="dummy-emoji">🎯</span>
                  <span className="dummy-text">Target Uji</span>
                  {floatingDamage && (
                    <span className="floating-dmg-pop">
                      {floatingDamage.text}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* KARTU PRATINJAU PELURU AKTIF & EFEK STATUS KHUSUS */}
            <div className="active-bullet-showcase-card">
              <div className="bullet-glow-orbit">
                <img
                  src={`/assets/png/attack/${computedStats.bulletType}.png`}
                  alt={computedStats.bulletType}
                  className="bullet-hero-preview-img"
                />
              </div>
              <div className="bullet-preview-details">
                <div className="bullet-title-badge-row">
                  <span className="bullet-display-title">
                    {computedStats.bulletType === 'bullet_orb' && 'Inti Plasma Orb'}
                    {computedStats.bulletType === 'bullet_fire' && 'Inti Api Membara'}
                    {computedStats.bulletType === 'bullet_ice' && 'Inti Es Kristal'}
                    {computedStats.bulletType === 'bullet_star' && 'Inti Bintang Pantul'}
                    {computedStats.bulletType === 'bullet_laser' && 'Inti Laser Penembus'}
                  </span>
                  <span className={`bullet-effect-pill ${computedStats.bulletType}`}>
                    {computedStats.effectName}
                  </span>
                </div>
                <p className="bullet-display-desc">
                  {computedStats.bulletType === 'bullet_orb' && 'Tembakan plasma seimbang & stabil untuk segala medan petualangan.'}
                  {computedStats.bulletType === 'bullet_fire' && 'Membakar musuh dengan bola api berkobar dan damage berkala!'}
                  {computedStats.bulletType === 'bullet_ice' && 'Membekukan dan memperlambat pergerakan slime monster sebesar 50%!'}
                  {computedStats.bulletType === 'bullet_star' && 'Bintang berpendar yang memantul di platform dan menjangkau musuh tersembunyi.'}
                  {computedStats.bulletType === 'bullet_laser' && 'Sinar laser berkecepatan tinggi yang menembus barisan monster sekaligus!'}
                </p>
              </div>
            </div>

            {/* STATISTIK MINI COLORFUL (4 CHIP BERSIH & RAPI) */}
            <div className="stats-pills-row">
              <div className="stat-pill red">
                <span className="stat-pill-label">⚔️ ATK</span>
                <span className="stat-pill-val">{computedStats.damage}</span>
              </div>
              <div className="stat-pill blue">
                <span className="stat-pill-label">⚡ Laju</span>
                <span className="stat-pill-val">{computedStats.fireRate}/s</span>
              </div>
              <div className="stat-pill green">
                <span className="stat-pill-label">🎯 Jarak</span>
                <span className="stat-pill-val">{computedStats.range}px</span>
              </div>
              <div className="stat-pill purple">
                <span className="stat-pill-label">💥 Krit</span>
                <span className="stat-pill-val">{computedStats.critChance}%</span>
              </div>
            </div>

            {/* TAB 5 SLOT SENJATA DENGAN IKON ASET ASLI */}
            <div className="slot-nav-container">
              <span className="custom-sub-label">PILIH BAGIAN SENJATA:</span>
              <div className="slot-buttons-flex">
                {(['body', 'core', 'barrel', 'grip', 'charm'] as WeaponSlotType[]).map((slotKey) => {
                  const slotMeta = SLOT_INFO[slotKey];
                  return (
                    <button
                      key={slotKey}
                      className={`slot-tab-item ${activeSlot === slotKey ? 'active' : ''}`}
                      onClick={() => {
                        playSynthesizedSfx('click');
                        setActiveSlot(slotKey);
                      }}
                    >
                      <img
                        src={slotMeta.iconAsset}
                        alt={slotMeta.label}
                        className="slot-tab-img"
                      />
                      <span className="slot-tab-text">
                        {slotMeta.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DAFTAR PART UNTUK SLOT INI (PAKAI ASET GAMBAR NYATA + UPGRADE PAKAI KOIN & DIFF) */}
            <div className="parts-clean-list">
              {availablePartsForSlot.map((part) => {
                const isEquipped = currentLoadout[activeSlot] === part.id;
                const curLvl = partLevels[part.id] || 1;
                const upgradeReq = UPGRADE_REQUIREMENTS[curLvl];
                const unlocked = isPartUnlocked(part.id);
                const unlockCost = part.unlockCostCoins || 0;
                const canAffordUnlock = playerCoins >= unlockCost;
                const canUpgrade =
                  unlocked &&
                  curLvl < 5 &&
                  playerCoins >= upgradeReq.coins;

                return (
                  <div
                    key={part.id}
                    className={`clean-part-card rarity-${part.rarity} ${isEquipped ? 'is-equipped' : ''} ${!unlocked ? 'is-locked' : ''}`}
                  >
                    <div className="clean-part-left">
                      <div className="clean-part-icon">
                        {part.iconAsset ? (
                          <img
                            src={part.iconAsset}
                            alt={part.name}
                            className="clean-part-asset-img"
                          />
                        ) : (
                          <span>{part.icon}</span>
                        )}
                      </div>
                      <div className="clean-part-info">
                        <div className="clean-part-title-row">
                          <span className="clean-part-name">{part.name}</span>
                          <span className="clean-part-lvl">Lv.{curLvl}</span>
                          {!unlocked && (
                            <span className="part-locked-badge">
                              <Lock size={12} />
                              Terkunci
                            </span>
                          )}
                        </div>
                        <p className="clean-part-desc">{part.description}</p>
                        
                        {/* PERUBAHAN STAT JIKA LEVEL UP */}
                        {unlocked && curLvl < 5 && (
                          <div className="part-upgrade-diff-row">
                            <span className="diff-highlight">
                              📈 {getPartUpgradeDiff(part, curLvl)}
                            </span>
                          </div>
                        )}

                        {part.effect && (
                          <span className="clean-part-effect">
                            Efek: {part.effect.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="clean-part-actions">
                      {!unlocked ? (
                        <button
                          className={`btn-unlock-part ${canAffordUnlock ? 'can-buy' : 'cant-afford'}`}
                          onClick={() => handleUnlockPart(part.id)}
                          disabled={!canAffordUnlock}
                          title={canAffordUnlock ? `Buka modul seharga ${unlockCost} koin` : `Butuh ${unlockCost} koin`}
                        >
                          <span>Buka 🪙{unlockCost}</span>
                        </button>
                      ) : isEquipped ? (
                        <div className="badge-equipped-tag">
                          <Check size={14} />
                          <span>Terpasang</span>
                        </div>
                      ) : (
                        <button
                          className="btn-clean-equip"
                          onClick={() => handleSelectPart(activeSlot, part.id)}
                        >
                          Pasang
                        </button>
                      )}

                      {/* TOMBOL UPGRADE DENGAN KOIN & HARGA JELAS */}
                      {unlocked && curLvl < 5 && (
                        <button
                          className={`btn-clean-upgrade ${canUpgrade ? 'active' : 'disabled'}`}
                          onClick={() => handleUpgradePart(part.id)}
                          disabled={!canUpgrade}
                          title={canUpgrade ? `Upgrade ke Lv.${curLvl + 1} seharga ${upgradeReq.coins} Koin` : `Butuh ${upgradeReq.coins} Koin`}
                        >
                          <ArrowUpCircle size={14} />
                          <span>Up Lv.{curLvl + 1} (🪙{upgradeReq.coins})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: KARAKTER & TOPI (COLORFUL & RAMAH ANAK) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'character' && (
          <div className="custom-character-body">
            {/* STAGE MASKOT DENGAN LATAR CERAH */}
            <div className="character-hero-card">
              <div className="character-mascot-view">
                <AnimatedMascot
                  size={190}
                  state={mascotAnimState}
                  direction="right"
                  skinColor={selectedSkin}
                  hat={selectedHat}
                  weapon="blaster"
                  weaponColorFilter={activeColorDef.filter}
                  showShadow={true}
                  walkSpeed={0.55}
                />
              </div>

              {/* Kontrol Aksi Gerak Maskot */}
              <div className="mascot-action-pills">
                <button
                  className={`action-pill ${mascotAnimState === 'idle' ? 'active' : ''}`}
                  onClick={() => setMascotAnimState('idle')}
                >
                  🧍 Diam
                </button>
                <button
                  className={`action-pill ${mascotAnimState === 'walk' ? 'active' : ''}`}
                  onClick={() => setMascotAnimState('walk')}
                >
                  🏃 Jalan
                </button>
                <button
                  className={`action-pill ${mascotAnimState === 'jump' ? 'active' : ''}`}
                  onClick={() => setMascotAnimState('jump')}
                >
                  🦘 Melompat
                </button>
              </div>
            </div>

            {/* PILIHAN WARNA KULIT MASKOT */}
            <div className="character-sub-section">
              <span className="custom-sub-label">WARNA KARAKTER:</span>
              <div className="skin-dots-flex">
                {CHARACTER_SKINS.map((skin) => (
                  <button
                    key={skin.id}
                    className={`skin-dot-btn ${selectedSkin === skin.id ? 'active' : ''}`}
                    onClick={() => handleSelectSkin(skin.id)}
                    title={skin.name}
                  >
                    <span
                      className="skin-circle"
                      style={{ backgroundColor: skin.hex }}
                    />
                    <span className="skin-label-text">{skin.name}</span>
                    {selectedSkin === skin.id && <Check size={14} color="#f59e0b" />}
                  </button>
                ))}
              </div>
            </div>

            {/* PILIHAN TOPI & AKSESORI */}
            <div className="character-sub-section">
              <span className="custom-sub-label">TOPI & AKSESORI KEPALA:</span>
              <div className="clean-hats-grid">
                {CHARACTER_HATS.map((hatItem) => (
                  <div
                    key={hatItem.id}
                    className={`clean-hat-card ${selectedHat === hatItem.id ? 'active' : ''}`}
                    onClick={() => handleSelectHat(hatItem.id)}
                  >
                    <span className="clean-hat-emoji">{hatItem.icon}</span>
                    <div className="clean-hat-info">
                      <span className="clean-hat-title">{hatItem.name}</span>
                      <p className="clean-hat-desc">{hatItem.description}</p>
                    </div>
                    {selectedHat === hatItem.id ? (
                      <div className="clean-hat-badge active">
                        <Check size={14} />
                        <span>Dipakai</span>
                      </div>
                    ) : (
                      <button className="btn-clean-hat-use">Pakai</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. FOOTER BERSIH DENGAN TOMBOL SELESAI */}
        <footer className="custom-modal-footer">
          <button className="btn-finish-dialog" onClick={onClose}>
            <Check size={20} />
            <span>Selesai & Main</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
