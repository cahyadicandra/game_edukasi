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
import { SubScreenHeader } from '../Common';
import { ACHIEVEMENTS_DATA, type AchievementDef } from '../../data/achievements';
import { LocalDB } from '../../services/localDatabase';
import { initialPlayer } from '../../data/mockData';
import { worlds as defaultWorlds, type WorldData } from '../../data/worlds';
import type { PlayerProfile } from '../../types/game';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './ScreenCommon.css';

export interface AchievementScreenProps {
  player?: PlayerProfile;
  worlds?: WorldData[];
  onUpdatePlayer?: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  embedded?: boolean;
}

export const AchievementScreen: React.FC<AchievementScreenProps> = ({
  player: propPlayer,
  worlds: propWorlds,
  onUpdatePlayer,
  embedded = false,
}) => {
  // Ambil data lokal jika props tidak diberikan (fallback aman)
  const player = useMemo(() => propPlayer || LocalDB.loadPlayerProfile(initialPlayer), [propPlayer]);
  const worlds = useMemo(() => propWorlds || LocalDB.loadWorldsProgress(defaultWorlds), [propWorlds]);
  const levelRecords = useMemo(() => LocalDB.loadLevelRecords(), []);

  // Status klaim tersimpan di database lokal
  const [claimedIds, setClaimedIds] = useState<string[]>(() => LocalDB.loadClaimedAchievements());
  const [claimToast, setClaimToast] = useState<{ message: string; icon: string } | null>(null);

  // Helper render ikon prestasi berdasarkan nama
  const renderAchievementIcon = (iconName: AchievementDef['iconName'], color: string) => {
    const size = 20;
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
  const overallPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Urutkan prestasi secara intuitif tanpa perlu filter:
  // 1. Siap diklaim (paling atas agar pemain langsung bisa ambil hadiah)
  // 2. Sedang berjalan (diurutkan berdasarkan progres tertinggi ke terendah)
  // 3. Sudah diklaim / selesai (diletakkan di bagian paling bawah)
  const sortedAchievements = useMemo(() => {
    return [...evaluatedAchievements].sort((a, b) => {
      if (a.canClaim && !b.canClaim) return -1;
      if (!a.canClaim && b.canClaim) return 1;

      if (!a.isClaimed && b.isClaimed) return -1;
      if (a.isClaimed && !b.isClaimed) return 1;

      if (!a.isCompleted && !b.isCompleted) {
        if (b.percent !== a.percent) return b.percent - a.percent;
        return b.currentVal - a.currentVal;
      }

      return 0;
    });
  }, [evaluatedAchievements]);

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
      message: `Hadiah +${rewardLabel} berhasil diklaim!`,
    });
    setTimeout(() => {
      setClaimToast(null);
    }, 2800);
  };

  const content = (
    <>
      {/* Floating Claim Toast Notification */}
      {claimToast && (
        <div className="achievement-toast-float">
          <span className="toast-icon">{claimToast.icon}</span>
          <span className="toast-text">{claimToast.message}</span>
        </div>
      )}

      {!embedded && (
        <SubScreenHeader
          icon="🏆"
          title="Prestasi & Lencana"
          subtitle="Buktikan kehebatanmu dalam menguasai geometri & raih hadiah berlimpah!"
        />
      )}

      {/* Ringkasan Kemajuan Prestasi Simpel & Rapi */}
      <div className="summary-hero-card">
        <div className="summary-hero-visual">
          <div className="trophy-badge-wrapper">
            <Crown size={22} color="#ffffff" />
          </div>
        </div>
        <div className="summary-hero-info">
          <div className="summary-hero-title-row">
            <span className="summary-hero-count">
              <strong>{completedCount}</strong> dari {totalCount} Selesai
            </span>
            <span className="summary-hero-percent">{overallPercent}%</span>
          </div>
          <div className="summary-progress-bar">
            <div
              className="summary-progress-fill"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          {readyToClaimCount > 0 && (
            <div className="summary-ready-hint">
              <span className="ready-claim-badge pulse-badge">
                <Gift size={11} /> {readyToClaimCount} Hadiah Siap Diklaim!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Daftar Kartu Prestasi Simpel & Terurut */}
      <div className="achievement-list">
        {sortedAchievements.length === 0 ? (
          <div className="achievement-empty-state">
            <div className="empty-icon-wrap">🌟</div>
            <p className="empty-title">Belum ada prestasi</p>
            <p className="empty-desc">
              Terus mainkan petualanganmu untuk membuka pencapaian baru!
            </p>
          </div>
        ) : (
          sortedAchievements.map((item) => (
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
                    <CheckCircle2 size={13} color="#ffffff" fill="#16a34a" />
                  </span>
                )}
                {item.canClaim && (
                  <span className="achievement-icon-sparkle">
                    <Sparkles size={13} color="#f59e0b" fill="#fef08a" />
                  </span>
                )}
              </div>

              {/* Info Konten & Progres */}
              <div className="achievement-info">
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

                {/* Progress bar (hanya jika belum selesai diklaim) */}
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
                    <CheckCircle2 size={11} /> Selesai
                  </span>
                ) : item.canClaim ? (
                  <button
                    type="button"
                    className="achievement-btn-claim pulse-btn"
                    onClick={() => handleClaimReward(item)}
                  >
                    <Gift size={12} /> Klaim!
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  if (embedded) {
    return <div className="embedded-achievement-wrap">{content}</div>;
  }

  return (
    <div className="sub-screen-container">
      {/* Latar Belakang Langit & Awan Animasi */}
      <div className="sub-screen-sky" aria-hidden="true">
        <div className="sub-screen-cloud cloud-1" />
        <div className="sub-screen-cloud cloud-2" />
        <div className="sub-screen-cloud cloud-3" />
      </div>

      <div className="sub-screen-content">
        {content}
      </div>
    </div>
  );
};
