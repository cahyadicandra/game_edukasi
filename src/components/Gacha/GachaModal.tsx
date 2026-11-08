import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Star,
  Gem,
  RotateCw,
  Coins,
  Shield,
  Swords,
  BookOpen,
  Award,
  HelpCircle,
  Check,
} from 'lucide-react';
import type { PlayerProfile } from '../../types/game';
import {
  rollGacha,
  RARITY_CONFIG,
  GACHA_POOL,
  CHEST_CONFIG,
  COLLECTION_MILESTONES,
  type GachaItem,
  type ChestType,
} from '../../data/gachaItems';
import { ItemIconRenderer } from './ItemIconRenderer';
import { LocalDB } from '../../services/localDatabase';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './GachaModal.css';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdatePlayer: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
}

export const GachaModal: React.FC<GachaModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
}) => {
  const [chestType, setChestType] = useState<ChestType>('coin');
  const [activeTab, setActiveTab] = useState<'gacha' | 'inventory' | 'index'>('gacha');
  const [phase, setPhase] = useState<'idle' | 'opening' | 'result'>('idle');
  const [pulledItems, setPulledItems] = useState<GachaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter untuk Index Koleksi
  const [indexFilter, setIndexFilter] = useState<'all' | 'card' | 'equipment' | 'avatar'>('all');
  const [selectedDetailItem, setSelectedDetailItem] = useState<GachaItem | null>(null);

  // Status klaim milestone tersimpan di Database Lokal
  const [claimedMilestones, setClaimedMilestones] = useState<number[]>(() => {
    return LocalDB.loadClaimedMilestones();
  });

  if (!isOpen) return null;

  const currentChest = CHEST_CONFIG[chestType];
  const cost1 = currentChest.cost1;
  const cost10 = currentChest.cost10;

  const triggerHaptic = (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      Haptics.impact({ style });
    } catch {
      // Ignore
    }
  };

  const getPlayerBalance = (type: 'coins' | 'stars' | 'diamonds') => {
    if (type === 'coins') return player.coins || 0;
    if (type === 'stars') return player.stars || 0;
    return player.diamonds || 0;
  };

  // Cek apakah pemain memiliki item dalam inventori/koleksi
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

  // Hitung jumlah item terkumpul dalam index
  const totalIndexItems = GACHA_POOL.length;
  const ownedIndexItemsCount = GACHA_POOL.filter(isItemOwned).length;
  const collectionProgressPercent = Math.min(
    100,
    Math.round((ownedIndexItemsCount / totalIndexItems) * 100)
  );

  // Penanganan Tarik Gacha (1x atau 10x)
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

    // Kurangi saldo pemain
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

      // Terapkan hasil gacha ke profil pemain secara nyata
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

  // Klaim Hadiah Milestone Koleksi
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

  const inventory = player.inventory || {
    hintTickets: 2,
    fiftyFiftyTickets: 1,
    collectedCards: [],
    unlockedAvatars: ['boy'],
    unlockedAccessories: [],
    potions: 2,
    spElixirs: 2,
  };

  // Filter item untuk Index Koleksi
  const filteredIndexItems = GACHA_POOL.filter((item) => {
    if (indexFilter === 'card') return item.type === 'card';
    if (indexFilter === 'equipment') {
      return item.type === 'equipment' || item.type === 'potion' || item.type === 'accessory' || item.type === 'lifeline';
    }
    if (indexFilter === 'avatar') return item.type === 'avatar';
    return true;
  });

  return (
    <div className="gacha-modal-overlay" onClick={onClose}>
      <div className="gacha-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal Gacha */}
        <div className="gacha-header-bar">
          <div className="gacha-title-area">
            <span className="gacha-header-icon">🎁</span>
            <div>
              <h2 className="gacha-main-heading">Peti Misteri Geometri</h2>
              <span className="gacha-sub-heading">Koleksi kartu bentuk, perlengkapan RPG & karakter</span>
            </div>
          </div>

          {/* Saldo Pemain (Koin, Bintang, Permata) */}
          <div className="gacha-wallet-pills">
            <div className="wallet-pill coin">
              <Coins size={13} className="wallet-coin-icon" />
              <strong>{player.coins || 0}</strong>
            </div>
            <div className="wallet-pill star">
              <Star size={13} fill="#facc15" color="#ca8a04" />
              <strong>{player.stars}</strong>
            </div>
            <div className="wallet-pill gem">
              <Gem size={13} fill="#38bdf8" color="#0284c7" />
              <strong>{player.diamonds}</strong>
            </div>
            <button
              type="button"
              className="wallet-pill refill-btn"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: '1px solid #34d399',
                cursor: 'pointer',
                fontWeight: 800,
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Isi Saldo Testing Koin & Permata"
              onClick={() => {
                onUpdatePlayer((prev) => ({
                  ...prev,
                  coins: (prev.coins || 0) + 9999,
                  stars: (prev.stars || 0) + 9999,
                  diamonds: (prev.diamonds || 0) + 9999,
                }));
                triggerHaptic(ImpactStyle.Medium);
              }}
            >
              <span>⚡ +9999 Test</span>
            </button>
            <button className="gacha-btn-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 3 Tab Navigasi: Gacha, Tas Inventori, Index Koleksi */}
        <div className="gacha-tabs-row">
          <button
            className={`gacha-nav-tab ${activeTab === 'gacha' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('gacha');
              setPhase('idle');
            }}
          >
            🎁 Buka Peti
          </button>
          <button
            className={`gacha-nav-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            🎒 Tas Inventaris
          </button>
          <button
            className={`gacha-nav-tab ${activeTab === 'index' ? 'active' : ''}`}
            onClick={() => setActiveTab('index')}
          >
            📚 Index Koleksi ({ownedIndexItemsCount}/{totalIndexItems})
          </button>
        </div>

        {/* Isi Modal */}
        <div className="gacha-body-content">
          {/* ════════ TAB 1: GACHA PETI ════════ */}
          {activeTab === 'gacha' && (
            <>
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
                          <div className="card-rarity-pill" style={{ background: rarityCfg.color }}>
                            {rarityCfg.label}
                          </div>

                          <div className="card-icon-center">
                            <ItemIconRenderer item={item} size={48} />
                          </div>

                          <span className="card-item-title">{item.name}</span>
                          <span className="card-badge-detail" style={{ color: rarityCfg.color }}>
                            {item.badgeText}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="result-actions-row">
                    <button
                      className="btn-again-pull"
                      onClick={() => setPhase('idle')}
                    >
                      <RotateCw size={15} />
                      <span>Buka Peti Lagi</span>
                    </button>
                    <button
                      className="btn-confirm-gacha"
                      onClick={() => setActiveTab('index')}
                    >
                      <span>Lihat di Index Koleksi 📚</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ════════ TAB 2: TAS INVENTARIS RPG ════════ */}
          {activeTab === 'inventory' && (
            <div className="gacha-inventory-view">
              {/* Bekal Pertarungan Turn-Based */}
              <h3 className="inventory-section-title">
                🧪 Bekal Pertarungan RPG (Digunakan saat Melawan Bos)
              </h3>
              <div className="inventory-tickets-row">
                <div className="inventory-ticket-card">
                  <span className="ticket-icon">🧪</span>
                  <div className="ticket-info">
                    <strong>{inventory.potions || 0}x Ramuan</strong>
                    <span>Ramuan HP Merah (+45 HP)</span>
                  </div>
                </div>
                <div className="inventory-ticket-card">
                  <span className="ticket-icon">⚡</span>
                  <div className="ticket-info">
                    <strong>{inventory.spElixirs || 0}x Eliksir</strong>
                    <span>Eliksir SP Safir (+30 SP)</span>
                  </div>
                </div>
              </div>

              {/* Tiket Bantuan Kuis */}
              <h3 className="inventory-section-title">🎯 Tiket Bantuan Kuis Geometri</h3>
              <div className="inventory-tickets-row">
                <div className="inventory-ticket-card">
                  <span className="ticket-icon">🎯</span>
                  <div className="ticket-info">
                    <strong>{inventory.fiftyFiftyTickets || 0}x Tiket</strong>
                    <span>Bantuan 50:50 Kuis</span>
                  </div>
                </div>
                <div className="inventory-ticket-card">
                  <span className="ticket-icon">💡</span>
                  <div className="ticket-info">
                    <strong>{inventory.hintTickets || 0}x Tiket</strong>
                    <span>Petunjuk Contekan Rumus</span>
                  </div>
                </div>
              </div>

              {/* Status Equipment Aktif */}
              <h3 className="inventory-section-title">⚔️ Status Perlengkapan Aktif</h3>
              <div className="inventory-tickets-row">
                <div className="inventory-ticket-card">
                  <Swords size={20} color="#0284c7" />
                  <div className="ticket-info">
                    <strong>{player.stats?.atk || 25} Poin ATK</strong>
                    <span>Bonus Serangan ke Bos</span>
                  </div>
                </div>
                <div className="inventory-ticket-card">
                  <Shield size={20} color="#16a34a" />
                  <div className="ticket-info">
                    <strong>{player.stats?.def || 15} Poin DEF</strong>
                    <span>Pertahanan dari Serangan Bos</span>
                  </div>
                </div>
              </div>

              {/* Tombol kembali */}
              <button
                className="inventory-back-btn"
                onClick={() => setActiveTab('gacha')}
              >
                Kembali ke Peti Gacha 🎁
              </button>
            </div>
          )}

          {/* ════════ TAB 3: INDEX KOLEKSI GEOMETRI & PUSAKA ════════ */}
          {activeTab === 'index' && (
            <div className="gacha-compendium-view">
              {/* Banner Progres Koleksi */}
              <div className="compendium-progress-banner">
                <div className="progress-info-row">
                  <div className="progress-label-wrap">
                    <BookOpen size={18} color="#0284c7" />
                    <strong>Index Koleksi Bentuk & Pusaka</strong>
                  </div>
                  <span className="progress-fraction">
                    {ownedIndexItemsCount} / {totalIndexItems} ({collectionProgressPercent}%)
                  </span>
                </div>
                <div className="compendium-progress-track">
                  <div
                    className="compendium-progress-fill"
                    style={{ width: `${collectionProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Bar Hadiah Milestone Koleksi */}
              <div className="compendium-milestones-area">
                <span className="milestones-heading">
                  <Award size={14} color="#f59e0b" /> Hadiah Pencapaian Index:
                </span>
                <div className="milestones-scroll-list">
                  {COLLECTION_MILESTONES.map((m) => {
                    const isReached = ownedIndexItemsCount >= m.requiredCount;
                    const isClaimed = claimedMilestones.includes(m.requiredCount);

                    return (
                      <div
                        key={m.requiredCount}
                        className={`milestone-badge-box ${isReached ? 'reached' : ''} ${isClaimed ? 'claimed' : ''}`}
                      >
                        <span className="milestone-name">{m.label}</span>
                        <span className="milestone-reward-text">
                          +{m.rewardAmount} {m.rewardType === 'coins' ? '🪙' : '💎'}
                        </span>
                        {isClaimed ? (
                          <span className="milestone-status-tag claimed">
                            <Check size={11} /> Diklaim
                          </span>
                        ) : isReached ? (
                          <button
                            type="button"
                            className="btn-claim-milestone"
                            onClick={() => handleClaimMilestone(m)}
                          >
                            Klaim ✨
                          </button>
                        ) : (
                          <span className="milestone-status-tag locked">Terkunci</span>
                        )}
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
                  📐 Kartu Bentuk ({GACHA_POOL.filter((i) => i.type === 'card').length})
                </button>
                <button
                  className={`filter-pill ${indexFilter === 'equipment' ? 'active' : ''}`}
                  onClick={() => setIndexFilter('equipment')}
                >
                  ⚔️ Perlengkapan & Relik
                </button>
                <button
                  className={`filter-pill ${indexFilter === 'avatar' ? 'active' : ''}`}
                  onClick={() => setIndexFilter('avatar')}
                >
                  🧙 Karakter Avatar
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
                        {owned && <span className="compendium-check-tag">Terkumpul ✨</span>}
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
            </div>
          )}
        </div>
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
            <div className="detail-icon-wrap">
              <ItemIconRenderer
                item={selectedDetailItem}
                size={64}
                isSilhouette={!isItemOwned(selectedDetailItem)}
              />
            </div>

            <h3 className="detail-item-name">
              {isItemOwned(selectedDetailItem) ? selectedDetailItem.name : 'Item Belum Ditemukan'}
            </h3>

            <div
              className="detail-rarity-badge"
              style={{ background: RARITY_CONFIG[selectedDetailItem.rarity].color }}
            >
              {RARITY_CONFIG[selectedDetailItem.rarity].label} • {selectedDetailItem.badgeText}
            </div>

            <p className="detail-item-desc">{selectedDetailItem.description}</p>

            {selectedDetailItem.formula && (
              <div className="detail-formula-box">
                📐 <strong>Rumus:</strong> {selectedDetailItem.formula}
              </div>
            )}

            {selectedDetailItem.geometryFact && (
              <div className="detail-fact-box">
                💡 <strong>Fakta:</strong> {selectedDetailItem.geometryFact}
              </div>
            )}

            <div className="detail-source-hint">
              {isItemOwned(selectedDetailItem) ? (
                <span className="status-owned-text">
                  <Check size={14} /> Item sudah tersimpan di koleksi akunmu!
                </span>
              ) : (
                <span className="status-locked-text">
                  <HelpCircle size={14} /> Cara Mendapatkan: Buka Peti Gacha atau Selesaikan Tantangan Bos!
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn-close-detail"
              onClick={() => setSelectedDetailItem(null)}
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
