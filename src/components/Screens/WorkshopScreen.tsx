import React, { useState, useEffect, useRef } from 'react';
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
  rollGacha,
  RARITY_CONFIG,
  GACHA_POOL,
  CHEST_CONFIG,
  COLLECTION_MILESTONES,
  type GachaItem,
  type ChestType,
} from '../../data/gachaItems';
import { ItemIconRenderer } from '../Gacha/ItemIconRenderer';
import { LocalDB } from '../../services/localDatabase';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  Sparkles,
  Crosshair,
  Palette,
  Gift,
  BookOpen,
  Coins,
  Star,
  Gem,
  Check,
  Lock,
  RotateCw,
  HelpCircle,
  X,
} from 'lucide-react';
import './ScreenCommon.css';
import '../Customization/CustomizationModal.css';
import '../Gacha/GachaModal.css';
import './WorkshopScreen.css';
import { weaponSoundService } from '../../services/weaponSoundService';

export type WorkshopSubTab = 'weapon' | 'character' | 'gacha' | 'index';

interface WorkshopScreenProps {
  player: PlayerProfile;
  onUpdatePlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  initialSubTab?: WorkshopSubTab;
  onSubTabChange?: (tab: WorkshopSubTab) => void;
}

export const WorkshopScreen: React.FC<WorkshopScreenProps> = ({
  player,
  onUpdatePlayer,
  initialSubTab = 'weapon',
  onSubTabChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkshopSubTab>(initialSubTab);

  // Sinkronkan jika initialSubTab berubah dari luar
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSwitchTab = (tab: WorkshopSubTab) => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
    playSynthesizedSfx('click');
  };

  // ══════════════════════════════════════════════════════════════════════════
  // BAGIAN 1: SENJATA BLASTER & MASKOT KARAKTER
  // ══════════════════════════════════════════════════════════════════════════
  const [mascotAnimState, setMascotAnimState] = useState<MascotAnimationState>('idle');
  const [selectedSkin, setSelectedSkin] = useState<string>(
    player.equipment?.skinColor || 'default'
  );
  const [selectedHat, setSelectedHat] = useState<string>(
    player.equipment?.hat || 'none'
  );

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

  const activeSkinId =
    player.equipment?.blasterSkin ||
    player.equipment?.loadouts?.[0]?.skinId ||
    'blaster_klasik';

  const activeColor =
    player.equipment?.blasterColor ||
    player.equipment?.loadouts?.[0]?.color ||
    'default';

  const activeColorDef =
    BLASTER_COLORS.find((c) => c.id === activeColor) || BLASTER_COLORS[0];

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

  // Live bullet frame cycling (0..3)
  const [bulletAnimFrameIdx, setBulletAnimFrameIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBulletAnimFrameIdx((prev) => (prev + 1) % 4);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Zero-Latency Synthesizer SFX
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

  const triggerHaptic = (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      Haptics.impact({ style });
    } catch {
      // Haptics fallback silent
    }
  };

  // Pilih & Pasang Skin Senjata Langsung
  const handleSelectSkinWeapon = (skinId: string) => {
    if (!isSkinUnlocked(skinId)) return;
    weaponSoundService.playWeaponEquip(skinId);
    triggerHaptic(ImpactStyle.Light);

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

  // Beli / Buka Kunci Skin Baru dengan Koin
  const handleUnlockSkin = (skinId: string) => {
    const skinDef = WEAPON_SKINS_CATALOG[skinId];
    if (!skinDef) return;
    const cost = skinDef.unlockCostCoins || 0;
    if (playerCoins < cost) return;

    weaponSoundService.playWeaponEquip(skinId);
    triggerHaptic(ImpactStyle.Medium);

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

  // Kustomisasi Maskot Karakter
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

  // ══════════════════════════════════════════════════════════════════════════
  // BAGIAN 2: GACHA PETI & INDEX KOLEKSI
  // ══════════════════════════════════════════════════════════════════════════
  const [chestType, setChestType] = useState<ChestType>('coin');
  const [phase, setPhase] = useState<'idle' | 'opening' | 'result'>('idle');
  const [pulledItems, setPulledItems] = useState<GachaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [indexFilter, setIndexFilter] = useState<'all' | 'card' | 'equipment' | 'avatar'>('all');
  const [selectedDetailItem, setSelectedDetailItem] = useState<GachaItem | null>(null);
  const [showDropRates, setShowDropRates] = useState(false);

  const [claimedMilestones, setClaimedMilestones] = useState<number[]>(() => {
    return LocalDB.loadClaimedMilestones();
  });

  const currentChest = CHEST_CONFIG[chestType];
  const cost1 = currentChest.cost1;
  const cost10 = currentChest.cost10;

  const getPlayerBalance = (type: 'coins' | 'stars' | 'diamonds') => {
    if (type === 'coins') return player.coins || 0;
    if (type === 'stars') return player.stars || 0;
    return player.diamonds || 0;
  };

  const isItemOwned = (item: GachaItem): boolean => {
    const inv = player.inventory;
    if (!inv) return false;

    if (item.type === 'card') {
      return (inv.collectedCards || []).includes(item.id);
    }
    if (item.type === 'avatar') {
      const avKey = item.id.replace('avatar-', '');
      return (inv.unlockedAvatars || []).includes(avKey);
    }
    if (item.type === 'equipment' || item.type === 'accessory') {
      return (
        (inv.unlockedAccessories || []).includes(item.id) ||
        (inv.collectedCards || []).includes(item.id)
      );
    }
    if (item.type === 'potion') {
      if (item.id === 'item-potion-hp') return (inv.potions || 0) > 0;
      if (item.id === 'item-elixir-sp') return (inv.spElixirs || 0) > 0;
    }
    if (item.type === 'lifeline') {
      if (item.id === 'item-5050-1') return (inv.fiftyFiftyTickets || 0) > 0;
      return (inv.hintTickets || 0) > 0;
    }
    return false;
  };

  const totalIndexItems = GACHA_POOL.length;
  const ownedIndexItemsCount = GACHA_POOL.filter(isItemOwned).length;
  const collectionProgressPercent = Math.min(
    100,
    Math.round((ownedIndexItemsCount / totalIndexItems) * 100)
  );

  const handlePull = (count: 1 | 10) => {
    if (phase !== 'idle') return;
    const cost = count === 1 ? cost1 : cost10;
    const balance = getPlayerBalance(currentChest.currencyType);

    if (balance < cost) {
      setErrorMessage(
        `${currentChest.currencyLabel} tidak cukup! Butuh ${cost} ${currentChest.currencyIcon} (kamu punya ${balance} ${currentChest.currencyIcon})`
      );
      triggerHaptic(ImpactStyle.Heavy);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    onUpdatePlayer((prev) => {
      if (currentChest.currencyType === 'coins') {
        return { ...prev, coins: Math.max(0, (prev.coins || 0) - cost) };
      }
      if (currentChest.currencyType === 'stars') {
        return { ...prev, stars: Math.max(0, prev.stars - cost) };
      }
      return { ...prev, diamonds: Math.max(0, prev.diamonds - cost) };
    });

    triggerHaptic(ImpactStyle.Medium);
    setPhase('opening');
    setErrorMessage(null);

    const items = rollGacha(chestType, count);

    setTimeout(() => {
      setPulledItems(items);
      setPhase('result');
      triggerHaptic(ImpactStyle.Heavy);

      onUpdatePlayer((prev) => {
        let addedStars = 0;
        let addedDiamonds = 0;
        let addedCoins = 0;
        let addedHints = 0;
        let addedFiftyFifty = 0;
        let addedPotions = 0;
        let addedElixirs = 0;
        let addedAtk = 0;
        let addedDef = 0;

        const newCards = new Set(prev.inventory?.collectedCards || []);
        const newAvatars = new Set(prev.inventory?.unlockedAvatars || ['boy']);
        const newAcc = new Set(prev.inventory?.unlockedAccessories || []);

        items.forEach((item) => {
          if (item.type === 'currency') {
            if (item.id.includes('stars')) addedStars += item.value || 25;
            if (item.id.includes('gems')) addedDiamonds += item.value || 10;
            if (item.id.includes('coins')) addedCoins += item.value || 100;
          } else if (item.type === 'potion') {
            if (item.id === 'item-potion-hp') addedPotions += item.value || 1;
            if (item.id === 'item-elixir-sp') addedElixirs += item.value || 1;
          } else if (item.type === 'equipment') {
            if (item.id === 'item-ruler-crystal') addedAtk += 15;
            if (item.id === 'item-protractor-shield') addedDef += 12;
            newAcc.add(item.id);
            newCards.add(item.id);
          } else if (item.type === 'lifeline') {
            if (item.id === 'item-5050-1') addedFiftyFifty += item.value || 1;
            else if (item.id === 'item-combo-bundle') {
              addedFiftyFifty += 2;
              addedHints += 3;
            } else {
              addedHints += item.value || 1;
            }
          } else if (item.type === 'avatar') {
            if (item.id === 'avatar-wizard') newAvatars.add('wizard');
            if (item.id === 'avatar-princess') newAvatars.add('princess');
          } else if (item.type === 'card') {
            newCards.add(item.id);
          } else if (item.type === 'accessory') {
            newAcc.add(item.id);
          }
        });

        const currentStats = prev.stats || {
          hp: 100,
          maxHp: 100,
          sp: 50,
          maxSp: 50,
          atk: 25,
          def: 15,
        };

        const currentInventory = prev.inventory || {
          hintTickets: 2,
          fiftyFiftyTickets: 1,
          collectedCards: [],
          unlockedAvatars: ['boy', 'girl', 'adventurer', 'scientist'],
          unlockedAccessories: [],
          potions: 2,
          spElixirs: 2,
        };

        return {
          ...prev,
          stars: prev.stars + addedStars,
          diamonds: prev.diamonds + addedDiamonds,
          coins: (prev.coins || 0) + addedCoins,
          stats: {
            ...currentStats,
            atk: currentStats.atk + addedAtk,
            def: currentStats.def + addedDef,
          },
          inventory: {
            ...currentInventory,
            hintTickets: (currentInventory.hintTickets || 0) + addedHints,
            fiftyFiftyTickets: (currentInventory.fiftyFiftyTickets || 0) + addedFiftyFifty,
            potions: (currentInventory.potions || 0) + addedPotions,
            spElixirs: (currentInventory.spElixirs || 0) + addedElixirs,
            collectedCards: Array.from(newCards),
            unlockedAvatars: Array.from(newAvatars),
            unlockedAccessories: Array.from(newAcc),
          },
        };
      });
    }, 1200);
  };

  const handleClaimMilestone = (milestone: typeof COLLECTION_MILESTONES[0]) => {
    if (claimedMilestones.includes(milestone.requiredCount)) return;

    triggerHaptic(ImpactStyle.Medium);

    onUpdatePlayer((prev) => {
      if (milestone.rewardType === 'coins') {
        return { ...prev, coins: (prev.coins || 0) + milestone.rewardAmount };
      }
      return { ...prev, diamonds: prev.diamonds + milestone.rewardAmount };
    });

    const nextClaimed = [...claimedMilestones, milestone.requiredCount];
    setClaimedMilestones(nextClaimed);
    LocalDB.saveClaimedMilestones(nextClaimed);
  };

  const filteredIndexItems = GACHA_POOL.filter((item) => {
    if (indexFilter === 'card') return item.type === 'card';
    if (indexFilter === 'equipment') {
      return item.type === 'equipment' || item.type === 'potion' || item.type === 'accessory' || item.type === 'lifeline';
    }
    if (indexFilter === 'avatar') return item.type === 'avatar';
    return true;
  });

  return (
    <div className="sub-screen-container workshop-screen-container">
      {/* Background Animated Sky & Clouds */}
      <div className="sub-screen-sky" aria-hidden="true">
        <div className="sub-screen-cloud cloud-1" />
        <div className="sub-screen-cloud cloud-2" />
        <div className="sub-screen-cloud cloud-3" />
      </div>

      {/* 1. TOP HEADER & WALLET TERPADU (COMPACT & HEMAT TEMPAT) */}
      <div className="workshop-top-bar">
        <div className="workshop-top-title-wrap">
          <span className="workshop-top-icon">🛠️</span>
          <h1 className="workshop-top-title">Bengkel & Gacha</h1>
        </div>

        {/* Bar Saldo Ringkas dalam 1 Baris */}
        <div className="workshop-top-wallet">
          <div className="compact-wallet-pill gold" title="Koin Pemain">
            <Coins size={12} color="#b45309" />
            <span>{playerCoins.toLocaleString()}</span>
          </div>
          <div className="compact-wallet-pill star" title="Bintang Pemain">
            <Star size={12} fill="#facc15" color="#ca8a04" />
            <span>{player.stars.toLocaleString()}</span>
          </div>
          <div className="compact-wallet-pill gem" title="Permata Pemain">
            <Gem size={12} fill="#38bdf8" color="#0284c7" />
            <span>{player.diamonds.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. SUBTABS NAVIGASI 4 PILIHAN RINGKAS & BERSIH */}
      <nav className="workshop-subtabs-nav" role="tablist">
        <button
          role="tab"
          aria-selected={activeSubTab === 'weapon'}
          className={`workshop-subtab-btn ${activeSubTab === 'weapon' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('weapon')}
        >
          <Crosshair size={14} />
          <span>Senjata</span>
        </button>
        <button
          role="tab"
          aria-selected={activeSubTab === 'character'}
          className={`workshop-subtab-btn ${activeSubTab === 'character' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('character')}
        >
          <Palette size={14} />
          <span>Karakter</span>
        </button>
        <button
          role="tab"
          aria-selected={activeSubTab === 'gacha'}
          className={`workshop-subtab-btn ${activeSubTab === 'gacha' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('gacha')}
        >
          <Gift size={14} />
          <span>Gacha</span>
        </button>
        <button
          role="tab"
          aria-selected={activeSubTab === 'index'}
          className={`workshop-subtab-btn ${activeSubTab === 'index' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('index')}
        >
          <BookOpen size={14} />
          <span>Koleksi</span>
        </button>
      </nav>

      {/* 3. WADAH KONTEN UTAMA */}
      <div className="workshop-main-card">
        {/* ════════════════════════════════════════════════════════════════ */}
        {/* SUBTAB 1: KOLEKSI 13 SKIN SENJATA BLASTER (COMPACT 2-COLUMN)     */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'weapon' && (
          <div className="custom-workshop-body">
            {/* KARTU HERO SHOWCASE SENJATA AKTIF (COMPACT & RAPI) */}
            <div 
              className="active-weapon-compact-card"
              onClick={() => {
                weaponSoundService.playWeaponShoot(activeSkinId);
                triggerHaptic(ImpactStyle.Light);
              }}
              title="Ketuk kartu untuk mendengar suara tembakan senjata ini!"
              style={{ cursor: 'pointer' }}
            >
              <div className="active-weapon-main-row">
                <div className="active-weapon-preview-side">
                  <img
                    src={activeSkinDef.assetPng}
                    alt={activeSkinDef.name}
                    className="active-weapon-preview-img"
                  />
                  <div className="active-weapon-bullet-dot" title="Peluru Aktif">
                    <img
                      src={
                        activeSkinDef.bullets.bulletFrames[bulletAnimFrameIdx] ||
                        activeSkinDef.bullets.bulletFrames[0]
                      }
                      alt="Bullet"
                      className="active-bullet-mini-img"
                    />
                  </div>
                </div>

                <div className="active-weapon-info-side">
                  <div className="active-weapon-badges-line">
                    <span className={`rarity-badge-mini ${activeSkinDef.rarity}`}>
                      {activeSkinDef.rarity === 'common' && 'Biasa'}
                      {activeSkinDef.rarity === 'rare' && 'Langka'}
                      {activeSkinDef.rarity === 'epic' && 'Epik'}
                      {activeSkinDef.rarity === 'legendary' && 'Legendaris'}
                    </span>
                    <span
                      className="elem-badge-mini"
                      style={{
                        backgroundColor: activeSkinDef.elementBadgeBg,
                        color: activeSkinDef.elementColor,
                        borderColor: activeSkinDef.elementColor,
                      }}
                    >
                      {activeSkinDef.elementLabel}
                    </span>
                  </div>
                  <h3 className="active-weapon-title-compact">{activeSkinDef.name}</h3>
                  <p className="active-weapon-effect-compact">✨ {activeSkinDef.specialEffect}</p>
                </div>
              </div>

              {/* 4 STATS ROW DALAM 1 BARIS COMPACT */}
              <div className="active-weapon-stats-row">
                <div className="stat-pill red">
                  <span className="stat-lbl">ATK</span>
                  <span className="stat-num">{computedStats.damage}</span>
                </div>
                <div className="stat-pill blue">
                  <span className="stat-lbl">Laju</span>
                  <span className="stat-num">{computedStats.fireRate}/s</span>
                </div>
                <div className="stat-pill green">
                  <span className="stat-lbl">Jarak</span>
                  <span className="stat-num">{computedStats.range}px</span>
                </div>
                <div className="stat-pill purple">
                  <span className="stat-lbl">Krit</span>
                  <span className="stat-num">{computedStats.critChance}%</span>
                </div>
              </div>
            </div>

            {/* HEADER KATALOG SENJATA */}
            <div className="skin-catalog-header-compact">
              <span className="skin-catalog-title-compact">PILIH SKIN SENJATA</span>
              <span className="skin-count-pill-compact">
                {unlockedSkins.length} / {allSkinsList.length} Dimiliki
              </span>
            </div>

            {/* GRID 13 SKIN SENJATA 2 KOLOM (HEMAT TEMPAT & EFISIEN) */}
            <div className="skins-cards-grid-2col">
              {allSkinsList.map((skin) => {
                const isEquipped = activeSkinId === skin.id;
                const unlocked = isSkinUnlocked(skin.id);
                const canAfford = playerCoins >= skin.unlockCostCoins;

                return (
                  <div
                    key={skin.id}
                    className={`weapon-compact-card rarity-${skin.rarity} ${
                      isEquipped ? 'is-equipped' : ''
                    } ${!unlocked ? 'is-locked' : ''}`}
                    onClick={() => {
                      if (unlocked) {
                        if (!isEquipped) {
                          handleSelectSkinWeapon(skin.id);
                        } else {
                          // Jika sudah dipakai, klik untuk dengarkan suara tembakannya
                          weaponSoundService.playWeaponShoot(skin.id);
                          triggerHaptic(ImpactStyle.Light);
                        }
                      }
                    }}
                  >
                    <div className="card-top-badges">
                      <span className={`rarity-badge-mini ${skin.rarity}`}>
                        {skin.rarity === 'common' && 'Biasa'}
                        {skin.rarity === 'rare' && 'Langka'}
                        {skin.rarity === 'epic' && 'Epik'}
                        {skin.rarity === 'legendary' && 'Legenda'}
                      </span>
                      <span
                        className="elem-badge-mini"
                        style={{
                          color: skin.elementColor,
                          backgroundColor: skin.elementBadgeBg,
                        }}
                      >
                        {skin.elementLabel}
                      </span>
                    </div>

                    <div className="weapon-card-thumb-center">
                      <img
                        src={skin.assetPng}
                        alt={skin.name}
                        className="weapon-card-img"
                      />
                      <div className="weapon-card-bullet-preview" title="Peluru Skin">
                        <img
                          src={
                            skin.bullets.bulletFrames[bulletAnimFrameIdx] ||
                            skin.bullets.bulletFrames[0]
                          }
                          alt="Bullet"
                        />
                      </div>
                    </div>

                    <div className="weapon-card-meta">
                      <h4 className="weapon-card-name" title={skin.name}>{skin.name}</h4>
                      <div className="weapon-card-stats-text">
                        <span>⚔️ {skin.bonusStats.damage || 1} ATK</span>
                        <span>⚡ {skin.bonusStats.fireRate || 3}/s</span>
                      </div>
                    </div>

                    <div className="weapon-card-action">
                      {!unlocked ? (
                        <button
                          className={`btn-compact-unlock ${
                            canAfford ? 'can-buy' : 'cant-afford'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlockSkin(skin.id);
                          }}
                          disabled={!canAfford}
                        >
                          <Lock size={11} />
                          <span>🪙 {skin.unlockCostCoins.toLocaleString()}</span>
                        </button>
                      ) : isEquipped ? (
                        <div className="badge-compact-equipped">
                          <Check size={12} />
                          <span>Dipakai</span>
                        </div>
                      ) : (
                        <button
                          className="btn-compact-equip"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSkinWeapon(skin.id);
                          }}
                        >
                          Pakai
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
        {/* SUBTAB 2: KUSTOMISASI KARAKTER MASKOT & TOPI                     */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'character' && (
          <div className="custom-character-body">
            {/* STAGE MASKOT SEGITIGA 3D PREVIEW */}
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

              {/* Kontrol Siklus Gerak Maskot */}
              <div className="mascot-action-pills">
                <button
                  className={`action-pill ${mascotAnimState === 'idle' ? 'active' : ''}`}
                  onClick={() => {
                    playSynthesizedSfx('click');
                    setMascotAnimState('idle');
                  }}
                >
                  🧍 Diam
                </button>
                <button
                  className={`action-pill ${mascotAnimState === 'walk' ? 'active' : ''}`}
                  onClick={() => {
                    playSynthesizedSfx('click');
                    setMascotAnimState('walk');
                  }}
                >
                  🏃 Jalan
                </button>
                <button
                  className={`action-pill ${mascotAnimState === 'jump' ? 'active' : ''}`}
                  onClick={() => {
                    playSynthesizedSfx('click');
                    setMascotAnimState('jump');
                  }}
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

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* SUBTAB 3: PETI GACHA SUMMON                                      */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'gacha' && (
          <div className="gacha-body-content">
            {/* Pemilih Tipe Peti: Koin, Bintang, Permata */}
            {phase === 'idle' && (
              <div className="chest-selector-row">
                {(['coin', 'star', 'diamond'] as ChestType[]).map((type) => {
                  const cfg = CHEST_CONFIG[type];
                  const isSelected = chestType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      className={`chest-type-card ${isSelected ? 'selected' : ''} ${type}`}
                      onClick={() => {
                        setChestType(type);
                        triggerHaptic(ImpactStyle.Light);
                      }}
                    >
                      <span className="chest-type-icon">{cfg.currencyIcon}</span>
                      <span className="chest-type-name">{cfg.title}</span>
                      <span className="chest-type-cost">
                        Mulai {cfg.cost1} {cfg.currencyIcon}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* FASE 1: IDLE */}
            {phase === 'idle' && (
              <div className="gacha-stage idle">
                <div className="gacha-chest-display">
                  <div className={`chest-glow-aura ${currentChest.glowClass}`} />
                  <div className="chest-visual-box">
                    {chestType === 'coin' && '🧰'}
                    {chestType === 'star' && '🎁'}
                    {chestType === 'diamond' && '💎'}
                  </div>
                </div>

                <div className="gacha-chest-info">
                  <h3 className="chest-title">{currentChest.title}</h3>
                  <p className="chest-desc">{currentChest.description}</p>
                </div>

                {errorMessage && (
                  <div className="gacha-error-toast animate-shake">{errorMessage}</div>
                )}

                {/* Tombol Tarik Gacha */}
                <div className="gacha-actions-row">
                  <button
                    className="btn-pull-action single"
                    onClick={() => handlePull(1)}
                    disabled={phase !== 'idle'}
                  >
                    <span className="pull-lbl">Tarik 1x</span>
                    <span className="pull-price">
                      {cost1} {currentChest.currencyIcon}
                    </span>
                  </button>

                  <button
                    className="btn-pull-action multi"
                    onClick={() => handlePull(10)}
                    disabled={phase !== 'idle'}
                  >
                    <span className="pull-badge-discount">Hemat 10%!</span>
                    <span className="pull-lbl">Tarik 10x Sekaligus</span>
                    <span className="pull-price">
                      {cost10} {currentChest.currencyIcon}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* FASE 2: MEMBUKA PETI (ANIMASI) */}
            {phase === 'opening' && (
              <div className="gacha-stage opening">
                <div className="opening-chest-animation">
                  <div className="chest-sparkle-rings" />
                  <span className="opening-chest-emoji">
                    {chestType === 'coin' ? '🧰' : chestType === 'star' ? '🎁' : '💎'}
                  </span>
                </div>
                <h3 className="opening-title">Membuka {currentChest.title}...</h3>
                <p className="opening-sub">Menyerap kekuatan geometri semesta!</p>
              </div>
            )}

            {/* FASE 3: HASIL TARIKAN GACHA */}
            {phase === 'result' && (
              <div className="gacha-stage result">
                <div className="result-banner-header">
                  <Sparkles className="sparkle-gold" size={20} />
                  <h3>Selamat! Kamu Mendapatkan:</h3>
                  <Sparkles className="sparkle-gold" size={20} />
                </div>

                <div className="gacha-results-grid">
                  {pulledItems.map((item, idx) => {
                    const rarityCfg = RARITY_CONFIG[item.rarity];

                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        className="gacha-card-reveal"
                        style={{
                          borderColor: rarityCfg.borderColor,
                          background: rarityCfg.bgColor,
                          boxShadow: `0 6px 18px ${rarityCfg.glowColor}`,
                        }}
                      >
                        <div
                          className="card-rarity-pill"
                          style={{ background: rarityCfg.color }}
                        >
                          {rarityCfg.label}
                        </div>

                        <div className="card-icon-center">
                          <ItemIconRenderer item={item} size={48} />
                        </div>

                        <span className="card-item-title">{item.name}</span>
                        <span
                          className="card-badge-detail"
                          style={{ color: rarityCfg.color }}
                        >
                          {item.badgeText}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="result-actions-row">
                  <button
                    className="btn-pull-action single"
                    onClick={() => {
                      setPhase('idle');
                      setPulledItems([]);
                      handlePull(1);
                    }}
                  >
                    <RotateCw size={16} />
                    <span>Tarik 1x Lagi</span>
                  </button>
                  <button
                    className="btn-pull-action multi"
                    onClick={() => {
                      setPhase('idle');
                      setPulledItems([]);
                    }}
                  >
                    <Check size={16} />
                    <span>Selesai & Simpan</span>
                  </button>
                </div>
              </div>
            )}

            {/* INFORMASI TINGKAT DROP / PELUANG RATE */}
            <div className="gacha-rates-card">
              <button
                type="button"
                className="gacha-rates-toggle"
                onClick={() => setShowDropRates(!showDropRates)}
              >
                <HelpCircle size={15} color="#0284c7" />
                <span>Peluang Drop & Kelangkaan Item</span>
                <span className="rates-toggle-arrow">
                  {showDropRates ? '▲ Tutup' : '▼ Lihat'}
                </span>
              </button>

              {showDropRates && (
                <div className="gacha-rates-content">
                  <div className="rate-row legendary">
                    <span className="rate-badge legendary">Legendaris (5%)</span>
                    <span className="rate-desc">Avatar Penyihir, Jubah Bintang, Senjata Langka</span>
                  </div>
                  <div className="rate-row epic">
                    <span className="rate-badge epic">Epik (15%)</span>
                    <span className="rate-desc">Penggaris Kristal, Busur Derajat Perisai, Elixir SP</span>
                  </div>
                  <div className="rate-row rare">
                    <span className="rate-badge rare">Langka (30%)</span>
                    <span className="rate-desc">Kartu Bentuk Khusus, Tiket 50:50, Potion HP</span>
                  </div>
                  <div className="rate-row common">
                    <span className="rate-badge common">Biasa (50%)</span>
                    <span className="rate-desc">Kartu Segitiga/Persegi, Tiket Petunjuk, Koin Bonus</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* SUBTAB 4: INDEX KOLEKSI LENGKAP & MILESTONE REWARDS              */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'index' && (
          <div className="gacha-body-content">
            {/* KARTU MILESTONE KOLEKSI */}
            <div className="milestones-card">
              <div className="milestone-header">
                <div className="milestone-header-text">
                  <span className="milestone-title-icon">🏆</span>
                  <h4 className="milestone-title">Progres Koleksi</h4>
                </div>
                <span className="milestone-sub">
                  <strong>{ownedIndexItemsCount}</strong>/{totalIndexItems} ({collectionProgressPercent}%)
                </span>
              </div>

              <div className="milestone-progress-bar">
                <div
                  className="milestone-progress-fill"
                  style={{ width: `${collectionProgressPercent}%` }}
                />
              </div>

              {/* Daftar Hadiah Pencapaian Milestone (Horizontal Scrollable Strip) */}
              <div className="milestone-pills-row">
                {COLLECTION_MILESTONES.map((m) => {
                  const isReached = ownedIndexItemsCount >= m.requiredCount;
                  const isClaimed = claimedMilestones.includes(m.requiredCount);
                  const cleanName = m.label.replace(/\s*\([^)]*\)/, '');

                  return (
                    <div
                      key={m.requiredCount}
                      className={`milestone-pill ${isReached ? 'reached' : ''} ${
                        isClaimed ? 'claimed' : ''
                      }`}
                    >
                      <div className="milestone-pill-top">
                        <span className="milestone-target-badge">🎯 {m.requiredCount} Item</span>
                        <span className="milestone-reward-badge">
                          +{m.rewardAmount} {m.rewardType === 'coins' ? '🪙' : '💎'}
                        </span>
                      </div>

                      <div className="milestone-pill-name" title={m.label}>
                        {cleanName}
                      </div>

                      <div className="milestone-pill-action">
                        {isClaimed ? (
                          <span className="milestone-status-badge claimed">
                            <Check size={11} /> Selesai
                          </span>
                        ) : isReached ? (
                          <button
                            type="button"
                            className="milestone-btn-claim"
                            onClick={() => handleClaimMilestone(m)}
                          >
                            🎁 Klaim!
                          </button>
                        ) : (
                          <span className="milestone-status-badge locked">
                            <Lock size={10} /> {m.requiredCount} Item
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter Kategori Index */}
            <div className="compendium-filters-bar">
              <button
                className={`filter-pill ${indexFilter === 'all' ? 'active' : ''}`}
                onClick={() => setIndexFilter('all')}
              >
                Semua ({GACHA_POOL.length})
              </button>
              <button
                className={`filter-pill ${indexFilter === 'card' ? 'active' : ''}`}
                onClick={() => setIndexFilter('card')}
              >
                📐 Kartu ({GACHA_POOL.filter((i) => i.type === 'card').length})
              </button>
              <button
                className={`filter-pill ${indexFilter === 'equipment' ? 'active' : ''}`}
                onClick={() => setIndexFilter('equipment')}
              >
                ⚔️ Relik ({GACHA_POOL.filter((i) => i.type === 'equipment' || i.type === 'potion' || i.type === 'accessory' || i.type === 'lifeline').length})
              </button>
              <button
                className={`filter-pill ${indexFilter === 'avatar' ? 'active' : ''}`}
                onClick={() => setIndexFilter('avatar')}
              >
                🧙 Avatar ({GACHA_POOL.filter((i) => i.type === 'avatar').length})
              </button>
            </div>

            {/* Grid Kartu Index Koleksi */}
            <div className="compendium-items-grid">
              {filteredIndexItems.map((item) => {
                const owned = isItemOwned(item);
                const rarityCfg = RARITY_CONFIG[item.rarity];

                return (
                  <div
                    key={item.id}
                    className={`compendium-card ${owned ? 'owned' : 'locked'}`}
                    style={{
                      borderColor: owned ? rarityCfg.borderColor : '#cbd5e1',
                      background: owned ? rarityCfg.bgColor : '#f1f5f9',
                    }}
                    onClick={() => setSelectedDetailItem(item)}
                    title={owned ? `Lihat detail ${item.name}` : 'Belum ditemukan! Klik untuk info'}
                  >
                    <div className="compendium-card-top-row">
                      <span
                        className="compendium-rarity-tag"
                        style={{
                          background: owned ? rarityCfg.color : '#64748b',
                        }}
                      >
                        {rarityCfg.label}
                      </span>
                      {owned ? (
                        <span className="compendium-check-tag">Terkumpul ✨</span>
                      ) : (
                        <span className="compendium-lock-tag"><Lock size={9} /> Kunci</span>
                      )}
                    </div>

                    <div className="compendium-card-icon-box">
                      <ItemIconRenderer
                        item={item}
                        size={46}
                        isSilhouette={!owned}
                      />
                    </div>

                    <span className="compendium-card-title">
                      {owned ? item.name : '??? Terkunci'}
                    </span>

                    <span className="compendium-card-badge-info">
                      {owned ? item.badgeText : 'Buka dari Peti Gacha'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* MODAL DETAIL ITEM INDEX KOLEKSI */}
            {selectedDetailItem && (
              <div
                className="compendium-detail-overlay"
                onClick={() => setSelectedDetailItem(null)}
              >
                <div
                  className="compendium-detail-box"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderColor: RARITY_CONFIG[selectedDetailItem.rarity].borderColor,
                  }}
                >
                  <button
                    className="compendium-detail-close"
                    onClick={() => setSelectedDetailItem(null)}
                  >
                    <X size={18} />
                  </button>

                  <div className="compendium-detail-icon-wrap">
                    <ItemIconRenderer item={selectedDetailItem} size={64} />
                  </div>

                  <span
                    className="compendium-detail-rarity-badge"
                    style={{
                      background: RARITY_CONFIG[selectedDetailItem.rarity].color,
                    }}
                  >
                    {RARITY_CONFIG[selectedDetailItem.rarity].label}
                  </span>

                  <h3 className="compendium-detail-title">{selectedDetailItem.name}</h3>
                  <p className="compendium-detail-desc">{selectedDetailItem.description}</p>

                  {selectedDetailItem.geometryFact && (
                    <div className="compendium-detail-fact">
                      <strong>💡 Fakta Geometri:</strong> {selectedDetailItem.geometryFact}
                    </div>
                  )}

                  <div className="compendium-detail-status">
                    {isItemOwned(selectedDetailItem) ? (
                      <span className="status-owned">✓ Item ini sudah ada di inventori kamu!</span>
                    ) : (
                      <span className="status-locked">
                        🔒 Belum didapatkan. Tarik Peti Gacha untuk membukanya!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
