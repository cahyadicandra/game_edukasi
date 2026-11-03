import React, { useState, useMemo } from 'react';
import {
  Award,
  Zap,
  Flame,
  ShieldCheck,
  Compass,
  Crown,
  Swords,
  Gem,
  Star,
  BookOpen,
  CheckCircle2,
  Gift,
  Sparkles,
} from 'lucide-react';
import { SubScreenHeader } from './SubScreenHeader';
import { ACHIEVEMENTS_DATA, type AchievementDef, type AchievementCategory } from '../../data/achievements';
import { LocalDB } from '../../services/localDatabase';
import { initialPlayer } from '../../data/mockData';
import { worlds as defaultWorlds, type WorldData } from '../../data/worlds';
import type { PlayerProfile } from '../../types/game';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './ScreenCommon.css';

interface AchievementScreenProps {
  player?: PlayerProfile;
  worlds?: WorldData[];
  onUpdatePlayer?: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

type FilterTab = 'all' | 'ready' | 'ongoing' | 'claimed';

export const AchievementScreen: React.FC<AchievementScreenProps> = ({
  player: propPlayer,
  worlds: propWorlds,
  onUpdatePlayer,
}) => {
  // Ambil data lokal jika props tidak diberikan (fallback aman)
  const player = useMemo(() => propPlayer || LocalDB.loadPlayerProfile(initialPlayer), [propPlayer]);
  const worlds = useMemo(() => propWorlds || LocalDB.loadWorldsProgress(defaultWorlds), [propWorlds]);
  const levelRecords = useMemo(() => LocalDB.loadLevelRecords(), []);

  // Status klaim tersimpan di database lokal
  const [claimedIds, setClaimedIds] = useState<string[]>(() => LocalDB.loadClaimedAchievements());
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [claimToast, setClaimToast] = useState<{ message: string; icon: string } | null>(null);

  // Helper render ikon prestasi berdasarkan nama
  const renderAchievementIcon = (iconName: AchievementDef['iconName'], color: string) => {
    const size = 22;
    switch (iconName) {
      case 'award':
        return <Award size={size} color={color} />;
      case 'zap':
        return <Zap size={size} color={color} />;
      case 'flame':
        return <Flame size={size} color={color} />;
      case 'shield':
        return <ShieldCheck size={size} color={color} />;
      case 'compass':
        return <Compass size={size} color={color} />;
      case 'crown':
        return <Crown size={size} color={color} />;
      case 'swords':
        return <Swords size={size} color={color} />;
      case 'gem':
        return <Gem size={size} color={color} />;
      case 'star':
        return <Star size={size} color={color} />;
      case 'book':
        return <BookOpen size={size} color={color} />;
      default:
        return <Award size={size} color={color} />;
    }
  };

  // Helper label kategori
  const getCategoryLabel = (cat: AchievementCategory) => {
    switch (cat) {
      case 'adventure':
        return 'Petualangan';
      case 'battle':
        return 'Pertarungan Bos';
      case 'collection':
        return 'Koleksi Kartu';
      case 'economy':
        return 'Kekayaan';
    }
  };

  // Hitung progres dinamis untuk setiap item prestasi
  const evaluatedAchievements = useMemo(() => {
    return ACHIEVEMENTS_DATA.map((ach) => {
      const currentVal = ach.getCurrentValue({ player, worlds, levelRecords });
      const targetVal = ach.targetValue;
      const isCompleted = currentVal >= targetVal;
      const isClaimed = claimedIds.includes(ach.id);
      const canClaim = isCompleted && !isClaimed;
      const percent = Math.min(100, Math.round((currentVal / targetVal) * 100));
      const displayCurrent = Math.min(currentVal, targetVal);

      return {
        ...ach,
        currentVal,
        targetVal,
        displayCurrent,
        isCompleted,
        isClaimed,
        canClaim,
        percent,
      };
    });
  }, [player, worlds, levelRecords, claimedIds]);

  // Statistik ringkasan
  const totalCount = evaluatedAchievements.length;
  const completedCount = evaluatedAchievements.filter((a) => a.isCompleted).length;
  const readyToClaimCount = evaluatedAchievements.filter((a) => a.canClaim).length;
  const claimedCount = evaluatedAchievements.filter((a) => a.isClaimed).length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  // Filter daftar prestasi
  const filteredAchievements = useMemo(() => {
    return evaluatedAchievements.filter((item) => {
      // Filter kategori
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Filter status
      if (activeFilter === 'ready') return item.canClaim;
      if (activeFilter === 'ongoing') return !item.isCompleted;
      if (activeFilter === 'claimed') return item.isClaimed;
      return true; // 'all'
    });
  }, [evaluatedAchievements, activeFilter, selectedCategory]);

  // Handler klaim hadiah prestasi
  const handleClaimReward = async (ach: (typeof evaluatedAchievements)[0]) => {
    if (!ach.canClaim) return;

    // Haptic feedback
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Abaikan jika platform tidak mendukung
    }

    const { type, amount } = ach.reward;
    let rewardLabel = '';
    let rewardIcon = '⭐';

    // Tambahkan mata uang ke player
    if (onUpdatePlayer) {
      onUpdatePlayer((prev) => {
        const next = { ...prev };
        if (type === 'star') {
          next.stars = (prev.stars || 0) + amount;
          rewardLabel = `${amount} Bintang`;
          rewardIcon = '⭐';
        } else if (type === 'gem') {
          next.diamonds = (prev.diamonds || 0) + amount;
          rewardLabel = `${amount} Permata`;
          rewardIcon = '💎';
        } else if (type === 'coin') {
          next.coins = (prev.coins || 0) + amount;
          rewardLabel = `${amount} Koin`;
          rewardIcon = '🪙';
        }
        return next;
      });
    } else {
      // Fallback jika direct LocalDB
      const currentProf = LocalDB.loadPlayerProfile(initialPlayer);
      if (type === 'star') currentProf.stars = (currentProf.stars || 0) + amount;
      if (type === 'gem') currentProf.diamonds = (currentProf.diamonds || 0) + amount;
      if (type === 'coin') currentProf.coins = (currentProf.coins || 0) + amount;
      LocalDB.savePlayerProfile(currentProf);
      rewardLabel = `${amount} ${type === 'star' ? 'Bintang' : type === 'gem' ? 'Permata' : 'Koin'}`;
      rewardIcon = type === 'star' ? '⭐' : type === 'gem' ? '💎' : '🪙';
    }

    // Perbarui riwayat klaim di database lokal
    const newClaimed = [...claimedIds, ach.id];
    setClaimedIds(newClaimed);
    await LocalDB.saveClaimedAchievements(newClaimed);

    // Tampilkan notifikasi pencapaian
    setClaimToast({
      icon: rewardIcon,
      message: `Selamat! Hadiah +${rewardLabel} berhasil diklaim!`,
    });
    setTimeout(() => {
      setClaimToast(null);
    }, 3200);
  };

  return (
    <div className="sub-screen-container">
      {/* Latar Belakang Langit & Awan Animasi */}
      <div className="sub-screen-sky" aria-hidden="true">
        <div className="sub-screen-cloud cloud-1" />
        <div className="sub-screen-cloud cloud-2" />
        <div className="sub-screen-cloud cloud-3" />
      </div>

      {/* Floating Claim Toast Notification */}
      {claimToast && (
        <div className="achievement-toast-float">
          <span className="toast-icon">{claimToast.icon}</span>
          <span className="toast-text">{claimToast.message}</span>
        </div>
      )}

      <div className="sub-screen-content">
        {/* Spanduk Papan Kayu Tematik */}
        <SubScreenHeader
          icon="🏆"
          title="Prestasi & Lencana"
          subtitle="Buktikan kehebatanmu dalam menguasai geometri & raih hadiah berlimpah!"
        />

        {/* Kartu Ringkasan Pencapaian Utama */}
        <div className="summary-hero-card">
          <div className="summary-hero-visual">
            <div className="trophy-badge-wrapper">
              <Crown size={30} color="#ffffff" />
            </div>
          </div>
          <div className="summary-hero-info">
            <div className="summary-hero-label-row">
              <span className="summary-hero-label">Kemajuan Prestasi</span>
              {readyToClaimCount > 0 && (
                <span className="ready-claim-badge pulse-badge">
                  <Gift size={12} /> {readyToClaimCount} Siap Diklaim!
                </span>
              )}
            </div>
            <div className="summary-hero-title-row">
              <span className="summary-hero-count">
                <strong>{completedCount}</strong> dari {totalCount} Tercapai
              </span>
              <span className="summary-hero-percent">{overallPercent}%</span>
            </div>
            <div className="summary-progress-bar">
              <div
                className="summary-progress-fill"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="summary-sub-stats">
              <span>✓ {claimedCount} Diklaim</span>
              <span>•</span>
              <span>⏳ {totalCount - completedCount} Berjalan</span>
            </div>
          </div>
        </div>

        {/* Filter Status Tab */}
        <div className="achievement-tabs-wrap">
          <button
            className={`achievement-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Semua ({totalCount})
          </button>
          <button
            className={`achievement-tab-btn ${activeFilter === 'ready' ? 'active alert-ready' : ''} ${
              readyToClaimCount > 0 ? 'has-claims' : ''
            }`}
            onClick={() => setActiveFilter('ready')}
          >
            🎁 Bisa Klaim
            {readyToClaimCount > 0 && (
              <span className="tab-pill-counter">{readyToClaimCount}</span>
            )}
          </button>
          <button
            className={`achievement-tab-btn ${activeFilter === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ongoing')}
          >
            ⏳ Berjalan ({totalCount - completedCount})
          </button>
          <button
            className={`achievement-tab-btn ${activeFilter === 'claimed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('claimed')}
          >
            ✓ Diklaim ({claimedCount})
          </button>
        </div>

        {/* Filter Kategori Mini Pills */}
        <div className="achievement-cat-pills">
          {(
            [
              { id: 'all', label: 'Semua' },
              { id: 'adventure', label: 'Petualangan' },
              { id: 'battle', label: 'Bos Battle' },
              { id: 'collection', label: 'Kartu' },
              { id: 'economy', label: 'Ekonomi' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Daftar Kartu Prestasi Dinamis */}
        <div className="achievement-list">
          {filteredAchievements.length === 0 ? (
            <div className="achievement-empty-state">
              <div className="empty-icon-wrap">🌟</div>
              <p className="empty-title">Tidak ada prestasi di tab ini</p>
              <p className="empty-desc">
                {activeFilter === 'ready'
                  ? 'Belum ada hadiah yang siap diklaim. Lanjutkan petualanganmu untuk menyelesaikan misi!'
                  : 'Coba pilih filter lain untuk melihat misi prestasi lainnya.'}
              </p>
            </div>
          ) : (
            filteredAchievements.map((item) => (
              <div
                key={item.id}
                className={`achievement-card ${
                  item.isClaimed
                    ? 'claimed'
                    : item.canClaim
                    ? 'can-claim'
                    : 'in-progress'
                }`}
              >
                {/* Ikon Prestasi */}
                <div
                  className="achievement-icon-wrapper"
                  style={{
                    backgroundColor: item.isClaimed ? '#f1f5f9' : `${item.badgeColor}18`,
                    borderColor: item.isClaimed ? '#cbd5e1' : item.badgeColor,
                  }}
                >
                  {renderAchievementIcon(item.iconName, item.isClaimed ? '#94a3b8' : item.badgeColor)}
                  {item.isClaimed && (
                    <span className="achievement-icon-check">
                      <CheckCircle2 size={15} color="#ffffff" fill="#16a34a" />
                    </span>
                  )}
                  {item.canClaim && (
                    <span className="achievement-icon-sparkle">
                      <Sparkles size={14} color="#f59e0b" fill="#fef08a" />
                    </span>
                  )}
                </div>

                {/* Konten & Deskripsi */}
                <div className="achievement-info">
                  <div className="achievement-category-tag">
                    {getCategoryLabel(item.category)}
                  </div>
                  <div className="achievement-title-row">
                    <span className={`achievement-title ${item.isClaimed ? 'muted' : ''}`}>
                      {item.title}
                    </span>
                    <span className={`achievement-reward-pill ${item.reward.type}`}>
                      {item.reward.type === 'star' && '⭐'}
                      {item.reward.type === 'gem' && '💎'}
                      {item.reward.type === 'coin' && '🪙'} +{item.reward.amount}
                    </span>
                  </div>
                  <p className="achievement-desc">{item.desc}</p>

                  {/* Progress bar dinamis */}
                  {!item.isClaimed && (
                    <div className="achievement-mini-progress">
                      <div className="mini-progress-track">
                        <div
                          className="mini-progress-fill"
                          style={{
                            width: `${item.percent}%`,
                            background: item.canClaim
                              ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                              : 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
                          }}
                        />
                      </div>
                      <span className="mini-progress-text">
                        {item.displayCurrent}/{item.targetVal}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status / Tombol Klaim */}
                <div className="achievement-status-area">
                  {item.isClaimed ? (
                    <span className="achievement-badge done">
                      <CheckCircle2 size={12} /> Diklaim
                    </span>
                  ) : item.canClaim ? (
                    <button
                      className="achievement-btn-claim pulse-btn"
                      onClick={() => handleClaimReward(item)}
                    >
                      <Gift size={13} /> Klaim!
                    </button>
                  ) : (
                    <span className="achievement-badge ongoing">
                      {item.percent}%
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
