import React, { useState, useRef, useEffect } from 'react';
import type { PlayerProfile, WeaponLoadout } from '../../types/game';
import {
  WEAPON_SKINS_CATALOG,
  DEFAULT_UNLOCKED_SKINS,
  getWeaponSkin,
  BLASTER_COLORS,
  CHARACTER_SKINS,
  CHARACTER_HATS,
  computeWeaponStats,
  type ComputedWeaponStats,
  type WeaponSkinDef,
} from '../../data/weaponParts';
import { AnimatedMascot, type MascotAnimationState } from '../Mascot/AnimatedMascot';
import {
  X,
  Crosshair,
  Wrench,
  Palette,
  Check,
  Lock,
} from 'lucide-react';
import { weaponSoundService } from '../../services/weaponSoundService';
import './CustomizationModal.css';

export interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdatePlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

type TabType = 'weapon' | 'character';

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('weapon');

  // Character Mascot Preview State
  const [mascotAnimState, setMascotAnimState] = useState<MascotAnimationState>('idle');
  const [selectedSkin, setSelectedSkin] = useState<string>(
    player.equipment?.skinColor || 'default'
  );
  const [selectedHat, setSelectedHat] = useState<string>(
    player.equipment?.hat || 'none'
  );

  // Unlocked Skins List
  const unlockedSkins: string[] =
    player.equipment?.unlockedSkins && player.equipment.unlockedSkins.length > 0
      ? player.equipment.unlockedSkins
      : DEFAULT_UNLOCKED_SKINS;

  const isSkinUnlocked = (skinId: string) => {
    const skinDef = WEAPON_SKINS_CATALOG[skinId];
    if (!skinDef) return false;
    if (skinDef.unlockCostCoins === 0) return true;
    return unlockedSkins.includes(skinId);
  };

  const playerCoins = player.coins ?? 1000;

  // Single Active Weapon Configuration (Semua Stat & Peluru Terkandung Langsung di Skin)
  const activeSkinId =
    player.equipment?.blasterSkin ||
    player.equipment?.loadouts?.[0]?.skinId ||
    'blaster_klasik';

  const activeColor =
    player.equipment?.blasterColor ||
    player.equipment?.loadouts?.[0]?.color ||
    'default';

  const currentWeaponLoadout: WeaponLoadout = {
    name: 'Blaster Aktif',
    skinId: activeSkinId,
    body: 'blaster_std',
    core: 'core_skin_native',
    barrel: 'barrel_std',
    grip: 'grip_std',
    charm: 'charm_none',
    color: activeColor,
  };

  const computedStats: ComputedWeaponStats = computeWeaponStats(
    currentWeaponLoadout,
    player.equipment?.partLevels
  );
  const activeSkinDef: WeaponSkinDef = getWeaponSkin(activeSkinId);
  const activeColorDef =
    BLASTER_COLORS.find((c) => c.id === activeColor) || BLASTER_COLORS[0];

  // Siklus frame animasi peluru bawaan untuk live preview
  const [bulletAnimFrameIdx, setBulletAnimFrameIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBulletAnimFrameIdx((prev) => (prev + 1) % 4);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  // Audio Context Ref for instant zero-latency SFX
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedSfx = (type: 'equip' | 'unlock' | 'click') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'unlock') {
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

  // 1. Pilih & Pasang Skin Senjata Langsung (Peluru & Stat Langsung Include di Skin)
  const handleSelectSkinWeapon = (skinId: string) => {
    if (!isSkinUnlocked(skinId)) return;
    weaponSoundService.playWeaponEquip(skinId);

    const nextWeapon: WeaponLoadout = {
      name: 'Blaster Aktif',
      skinId,
      body: 'blaster_std',
      core: 'core_skin_native',
      barrel: 'barrel_std',
      grip: 'grip_std',
      charm: 'charm_none',
      color: activeColor,
    };

    onUpdatePlayer((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        loadouts: [nextWeapon],
        activeLoadoutIndex: 0,
        blasterSkin: skinId,
        blasterCore: 'bullet_skin',
        blasterColor: activeColor,
        skinColor: selectedSkin,
        hat: selectedHat,
        unlockedSkins: prev.equipment?.unlockedSkins || unlockedSkins,
      },
    }));
  };

  // 2. Beli / Buka Kunci Skin Baru dengan Koin & Langsung Pasang
  const handleUnlockSkin = (skinId: string) => {
    const skinDef = WEAPON_SKINS_CATALOG[skinId];
    if (!skinDef) return;
    const cost = skinDef.unlockCostCoins || 0;
    if (playerCoins < cost) return;

    weaponSoundService.playWeaponEquip(skinId);

    const nextUnlocked = Array.from(new Set([...unlockedSkins, skinId]));
    const nextWeapon: WeaponLoadout = {
      name: 'Blaster Aktif',
      skinId,
      body: 'blaster_std',
      core: 'core_skin_native',
      barrel: 'barrel_std',
      grip: 'grip_std',
      charm: 'charm_none',
      color: activeColor,
    };

    onUpdatePlayer((prev) => ({
      ...prev,
      coins: Math.max(0, (prev.coins ?? 1000) - cost),
      equipment: {
        ...prev.equipment,
        unlockedSkins: nextUnlocked,
        loadouts: [nextWeapon],
        activeLoadoutIndex: 0,
        blasterSkin: skinId,
        blasterCore: 'bullet_skin',
        blasterColor: activeColor,
      },
    }));
  };

  // 3. Kustomisasi Maskot Karakter
  const handleSelectSkin = (skinId: string) => {
    playSynthesizedSfx('click');
    setSelectedSkin(skinId);
    onUpdatePlayer((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        skinColor: skinId,
      },
    }));
  };

  const handleSelectHat = (hatId: string) => {
    playSynthesizedSfx('equip');
    setSelectedHat(hatId);
    onUpdatePlayer((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        hat: hatId,
      },
    }));
  };

  const allSkinsList = Object.values(WEAPON_SKINS_CATALOG);

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
              <h2 className="custom-header-title">Koleksi Senjata & Maskot</h2>
              <div className="custom-currencies-pill">
                <span className="curr-badge gold">
                  🪙 {playerCoins.toLocaleString()} Koin
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

        {/* 2. TAB NAVIGASI UTAMA DUA TOMBOL BERSIH */}
        <nav className="custom-tab-nav">
          <button
            className={`custom-tab-btn btn-weapon ${activeTab === 'weapon' ? 'active' : ''}`}
            onClick={() => {
              playSynthesizedSfx('click');
              setActiveTab('weapon');
            }}
          >
            <Crosshair size={16} />
            <span>Koleksi Senjata ({allSkinsList.length})</span>
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
        {/* TAB 1: KOLEKSI 13 SENJATA BLASTER (SIMPLE & CLEAN)               */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'weapon' && (
          <div className="custom-workshop-body">
            {/* 1. KARTU HERO PREVIEW SENJATA AKTIF */}
            <div className="active-weapon-hero-card">
              <div className="active-weapon-top-row">
                {/* Thumbnail Senjata */}
                <div className="active-weapon-thumb-box">
                  <img
                    src={activeSkinDef.assetPng}
                    alt={activeSkinDef.name}
                    className="active-weapon-hero-img"
                  />
                </div>

                {/* Detail Senjata Aktif */}
                <div className="active-weapon-details">
                  <div className="active-weapon-badges-row">
                    <span className={`rarity-badge ${activeSkinDef.rarity}`}>
                      {activeSkinDef.rarity === 'common' && 'Biasa'}
                      {activeSkinDef.rarity === 'rare' && 'Langka'}
                      {activeSkinDef.rarity === 'epic' && 'Epik'}
                      {activeSkinDef.rarity === 'legendary' && 'Legendaris'}
                    </span>
                    <span
                      className="active-weapon-elem-badge"
                      style={{
                        backgroundColor: activeSkinDef.elementBadgeBg,
                        color: activeSkinDef.elementColor,
                        borderColor: activeSkinDef.elementColor,
                      }}
                    >
                      {activeSkinDef.elementLabel}
                    </span>
                  </div>

                  <h3 className="active-weapon-name">{activeSkinDef.name}</h3>
                  <span className="active-weapon-tagline">{activeSkinDef.tagline}</span>
                  <p className="active-weapon-effect">✨ {activeSkinDef.specialEffect}</p>
                </div>

                {/* Animasi Peluru Bawaan Skin */}
                <div className="active-bullet-preview-box">
                  <div className="bullet-anim-stage">
                    <img
                      src={
                        activeSkinDef.bullets.bulletFrames[bulletAnimFrameIdx] ||
                        activeSkinDef.bullets.bulletFrames[0]
                      }
                      alt="Bullet Frame"
                      className="bullet-anim-frame"
                    />
                  </div>
                  <span className="bullet-anim-label">Peluru Bawaan</span>
                </div>
              </div>

              {/* 4 STAT CHIPS BERSIH & RAPI */}
              <div className="active-weapon-stats-grid">
                <div className="stat-chip-clean red">
                  <span className="stat-label">⚔️ ATK</span>
                  <span className="stat-val">{computedStats.damage}</span>
                </div>
                <div className="stat-chip-clean blue">
                  <span className="stat-label">⚡ Laju</span>
                  <span className="stat-val">{computedStats.fireRate}/s</span>
                </div>
                <div className="stat-chip-clean green">
                  <span className="stat-label">🎯 Jarak</span>
                  <span className="stat-val">{computedStats.range}px</span>
                </div>
                <div className="stat-chip-clean purple">
                  <span className="stat-label">💥 Krit</span>
                  <span className="stat-val">{computedStats.critChance}%</span>
                </div>
              </div>
            </div>

            {/* 2. HEADER DAFTAR SENJATA */}
            <div className="skin-catalog-header">
              <span className="skin-catalog-title">PILIH SKIN SENJATA:</span>
              <span className="skin-count-pill">
                {unlockedSkins.length} / {allSkinsList.length} Dimiliki
              </span>
            </div>

            {/* 3. GRID 13 SKIN SENJATA LENGKAP */}
            <div className="skins-cards-grid">
              {allSkinsList.map((skin) => {
                const isEquipped = activeSkinId === skin.id;
                const unlocked = isSkinUnlocked(skin.id);
                const canAfford = playerCoins >= skin.unlockCostCoins;

                return (
                  <div
                    key={skin.id}
                    className={`weapon-skin-card rarity-${skin.rarity} ${isEquipped ? 'is-equipped' : ''} ${!unlocked ? 'is-locked' : ''}`}
                  >
                    {/* Header: Rarity & Elemen */}
                    <div className="skin-card-header">
                      <span className={`rarity-badge ${skin.rarity}`}>
                        {skin.rarity === 'common' && 'Biasa'}
                        {skin.rarity === 'rare' && 'Langka'}
                        {skin.rarity === 'epic' && 'Epik'}
                        {skin.rarity === 'legendary' && 'Legendaris'}
                      </span>
                      <span
                        className="skin-element-chip"
                        style={{
                          color: skin.elementColor,
                          backgroundColor: skin.elementBadgeBg,
                        }}
                      >
                        {skin.elementLabel}
                      </span>
                    </div>

                    {/* Thumbnail Senjata */}
                    <div className="skin-card-thumb-wrap">
                      <img
                        src={skin.assetPng}
                        alt={skin.name}
                        className="skin-card-img"
                      />
                    </div>

                    {/* Detail Senjata & Efek */}
                    <div className="skin-card-details">
                      <h4 className="skin-card-title">{skin.name}</h4>
                      <span className="skin-card-tagline">{skin.tagline}</span>
                      <div className="skin-effect-box">
                        <span className="skin-effect-text">✨ {skin.specialEffect}</span>
                      </div>
                    </div>

                    {/* Animasi Mini Peluru Bawaan */}
                    <div className="skin-mini-bullet-row">
                      <span className="mini-bullet-label">Peluru:</span>
                      <img
                        src={skin.bullets.bulletFrames[bulletAnimFrameIdx] || skin.bullets.bulletFrames[0]}
                        alt="Bullet preview"
                        className="mini-bullet-preview-img"
                      />
                    </div>

                    {/* Tombol Aksi: Pasang atau Buka Kunci */}
                    <div className="skin-card-action-bar">
                      {!unlocked ? (
                        <button
                          className={`btn-skin-unlock ${canAfford ? 'can-buy' : 'cant-afford'}`}
                          onClick={() => handleUnlockSkin(skin.id)}
                          disabled={!canAfford}
                        >
                          <Lock size={12} />
                          <span>Buka 🪙{skin.unlockCostCoins}</span>
                        </button>
                      ) : isEquipped ? (
                        <div className="badge-skin-equipped">
                          <Check size={14} />
                          <span>Sedang Dipakai</span>
                        </div>
                      ) : (
                        <button
                          className="btn-skin-equip"
                          onClick={() => handleSelectSkinWeapon(skin.id)}
                        >
                          Pakai Senjata Ini
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
        {/* TAB 2: SKIN MASKOT & TOPI (CLEAN & COMPACT)                     */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'character' && (
          <div className="custom-character-body">
            {/* STAGE MASKOT DENGAN LATAR CERAH & PROPORSI PAS */}
            <div className="character-hero-card">
              <div className="character-mascot-view">
                <AnimatedMascot
                  size={135}
                  state={mascotAnimState}
                  direction="right"
                  skinColor={selectedSkin}
                  hat={selectedHat}
                  weapon="blaster"
                  weaponSkin={activeSkinId}
                  weaponSkinAsset={activeSkinDef.assetPng}
                  muzzleFlashAsset={activeSkinDef.bullets.muzzleFrames[0]}
                  weaponColorFilter={activeColorDef.filter}
                  showShadow={true}
                  walkSpeed={0.55}
                />
              </div>

              {/* Kontrol Aksi Gerak Maskot (Compact Chips) */}
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

            {/* PALET WARNA KARAKTER (1 BARIS BERSIH & RAPI) */}
            <div className="character-sub-section">
              <div className="character-sub-header">
                <span className="custom-sub-label">WARNA KARAKTER:</span>
                <span className="active-color-name">
                  {CHARACTER_SKINS.find((s) => s.id === selectedSkin)?.name || 'Kuning Klasik'}
                </span>
              </div>
              <div className="skin-dots-flex">
                {CHARACTER_SKINS.map((skin) => (
                  <button
                    key={skin.id}
                    className={`skin-dot-circle-btn ${selectedSkin === skin.id ? 'active' : ''}`}
                    onClick={() => handleSelectSkin(skin.id)}
                    title={skin.name}
                    aria-label={skin.name}
                  >
                    <span
                      className="skin-circle-fill"
                      style={{ backgroundColor: skin.hex }}
                    />
                    {selectedSkin === skin.id && (
                      <span className="skin-circle-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* PILIHAN TOPI & AKSESORI (GRID 3 KOLOM KOMPAK) */}
            <div className="character-sub-section">
              <span className="custom-sub-label">TOPI & AKSESORI KEPALA:</span>
              <div className="clean-hats-grid">
                {CHARACTER_HATS.map((hatItem) => {
                  const isEquipped = selectedHat === hatItem.id;
                  return (
                    <button
                      key={hatItem.id}
                      className={`clean-hat-tile ${isEquipped ? 'active' : ''}`}
                      onClick={() => handleSelectHat(hatItem.id)}
                      title={hatItem.description}
                    >
                      <span className="hat-tile-emoji">{hatItem.icon}</span>
                      <span className="hat-tile-title">{hatItem.name}</span>
                      <span className={`hat-tile-status ${isEquipped ? 'equipped' : ''}`}>
                        {isEquipped ? '✓ Dipakai' : 'Pakai'}
                      </span>
                    </button>
                  );
                })}
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
