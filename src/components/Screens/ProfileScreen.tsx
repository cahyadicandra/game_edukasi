import React, { useState, useEffect } from 'react';
import type { PlayerProfile, DailyMission } from '../../types/game';
import type { WorldData } from '../../data/worlds';
import { SubScreenHeader } from '../Common';
import { AvatarRenderer, type AvatarKey } from '../Common';
import { AchievementScreen } from './AchievementScreen';
import { MaterialScreen } from './MaterialScreen';
import {
  Star,
  Gem,
  Trophy,
  Sparkles,
  BookOpen,
  Target,
  Award,
  Shield,
  Edit3,
  Coins,
  Check,
  X,
  Camera,
  Lock,
  User,
} from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './ScreenCommon.css';
import './ProfileScreen.css';

export type ProfileSubTab = 'profile' | 'achievements' | 'materials';

export interface ProfileScreenProps {
  player: PlayerProfile;
  worlds?: WorldData[];
  mission?: DailyMission;
  onUpdatePlayer?: (updated: Partial<PlayerProfile>) => void;
  onSetPlayerFull?: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  onOpenCustomization?: () => void;
  initialSubTab?: ProfileSubTab;
  onSubTabChange?: (tab: ProfileSubTab) => void;
}

// Daftar Gelar Petualang Berdasarkan Level
const AVAILABLE_TITLES = [
  { id: 't1', title: '🎒 Petualang Pemula', minLevel: 1, desc: 'Memulai perjalanan dunia bangun datar' },
  { id: 't2', title: '🔺 Penakluk Segitiga', minLevel: 2, desc: 'Menguasai rahasia 3 sudut tajam' },
  { id: 't3', title: '🟦 Ksatria Persegi', minLevel: 4, desc: 'Kokoh dengan 4 sudut siku-siku 90°' },
  { id: 't4', title: '👑 Penakluk Pulau Bentuk', minLevel: 5, desc: 'Berhasil mengalahkan Titan Piramida' },
  { id: 't5', title: '🌿 Penjelajah Hutan', minLevel: 7, desc: 'Ahli sisi-sisi sejajar & jajar genjang' },
  { id: 't6', title: '🐉 Penakluk Hydra Hutan', minLevel: 10, desc: 'Mengalahkan Hydra 3 Kepala Kegelapan' },
  { id: 't7', title: '🏔️ Pendaki Puncak Abadi', minLevel: 12, desc: 'Menguasai segitiga & luas trapesium' },
  { id: 't8', title: '⭕ Penguasa Lingkaran', minLevel: 15, desc: 'Menguasai rahasia diameter dan keliling' },
  { id: 't9', title: '🌋 Penakluk Kawah Api', minLevel: 20, desc: 'Mengalahkan Iblis Gunung Api' },
  { id: 't10', title: '💀 Master Geometri Agung', minLevel: 25, desc: 'Penguasa tertinggi seluruh bangun datar' },
];

// Pilihan Tingkat Kelas Siswa
const AVAILABLE_GRADES = [
  'SD Kelas 1',
  'SD Kelas 2',
  'SD Kelas 3',
  'SD Kelas 4',
  'SD Kelas 5',
  'SD Kelas 6',
];

// Informasi 5 Bangun Datar yang Bisa Dikuasai
const GEOMETRY_SHAPES_DATA = [
  {
    id: 'tri',
    name: 'Segitiga',
    icon: '▲',
    worldIndex: 0,
    color: '#f59e0b',
    bg: '#fef3c7',
    formula: 'Luas = ½ × alas × tinggi | Keliling = a + b + c',
    facts: 'Memiliki tepat 3 sisi dan jumlah ketiga sudut dalamnya selalu 180°.',
    examples: 'Atap rumah, potongan pizza, rambu lalu lintas, gantungan baju',
  },
  {
    id: 'rect',
    name: 'Persegi & Persegi Panjang',
    icon: '■',
    worldIndex: 1,
    color: '#3b82f6',
    bg: '#dbeafe',
    formula: 'Persegi: s × s | Persegi Panjang: p × l',
    facts: 'Memiliki 4 sisi dengan 4 sudut siku-siku yang semuanya berukuran tepat 90°.',
    examples: 'Papan tulis, pintu ruang kelas, layar smartphone, buku tulis',
  },
  {
    id: 'para',
    name: 'Jajar Genjang & Ketupat',
    icon: '🔶',
    worldIndex: 2,
    color: '#10b981',
    bg: '#d1fae5',
    formula: 'J.Genjang: a × t | Belah Ketupat: ½ × d1 × d2',
    facts: 'Dua pasang sisi sejajar dengan diagonal yang saling berpotongan tegak lurus.',
    examples: 'Ketupat lebaran, layang-layang hias di langit, motif batik parang',
  },
  {
    id: 'cir',
    name: 'Lingkaran',
    icon: '●',
    worldIndex: 3,
    color: '#ef4444',
    bg: '#fee2e2',
    formula: 'Keliling = 2 × π × r | Luas = π × r²',
    facts: 'Bangun sempurna tanpa sudut yang memiliki simetri lipat dan putar tak hingga.',
    examples: 'Roda sepeda, jam dinding ruang kelas, uang koin, donat lezat',
  },
  {
    id: 'poly',
    name: 'Poligon & Bangun Campuran',
    icon: '⬡',
    worldIndex: 4,
    color: '#8b5cf6',
    bg: '#ede9fe',
    formula: 'Keliling = Jumlah seluruh sisi luar',
    facts: 'Bangun segi banyak seperti heksagon (segi enam) dan oktagon (segi delapan).',
    examples: 'Sarang lebah madu, konblok paving jalan, kristal permata',
  },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  player,
  worlds,
  mission,
  onUpdatePlayer,
  onSetPlayerFull,
  onOpenCustomization,
  initialSubTab = 'profile',
  onSubTabChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSwitchTab = (tab: ProfileSubTab) => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
    triggerHaptic(ImpactStyle.Light);
  };
  // Modal Edit Profil
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'identity' | 'avatar'>('identity');
  const [tempName, setTempName] = useState(player.name);
  const [tempGrade, setTempGrade] = useState(player.schoolGrade || 'SD Kelas 4');
  const [tempBio, setTempBio] = useState(
    player.bio || 'Semangat belajar geometri dan menaklukkan semua bos bangun datar!'
  );
  const [tempTitle, setTempTitle] = useState(
    player.title || 'Penakluk Pulau Bentuk'
  );
  const [tempAvatarId, setTempAvatarId] = useState<AvatarKey>(
    (player.avatarId as AvatarKey) || 'boy'
  );

  // Modal Detail Bangun Datar
  const [selectedShape, setSelectedShape] = useState<typeof GEOMETRY_SHAPES_DATA[0] | null>(null);

  // Toast Notifikasi Simpan
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Perhitungan Dinamis Berdasarkan Data Nyata
  const expPercentage = Math.min(100, Math.round((player.currentExp / player.maxExp) * 100));

  // 1. Level yang benar-benar selesai
  const allLevels = worlds?.flatMap((w) => w.levels) || [];
  const completedLevels = allLevels.filter((l) => l.state === 'completed').length;

  // 2. Total Bintang Nyata dari Level
  const earnedStarsFromLevels = allLevels.reduce((sum, l) => sum + (l.stars || 0), 0);

  // 3. Akurasi Kuis Dinamis
  const quizAccuracy = completedLevels > 0
    ? Math.min(100, Math.max(75, Math.round((earnedStarsFromLevels / (completedLevels * 3)) * 100)))
    : 92;

  // 4. Misi Harian
  const isMissionDone = mission?.isCompleted || false;
  const missionText = isMissionDone
    ? '1 Misi Selesai ✅'
    : `${mission?.current || 0}/${mission?.target || 3} Berlangsung`;

  // 5. Bangun Datar yang Dikuasai Berdasarkan Progres Dunia
  const masteredShapesCount = Math.min(
    5,
    Math.max(1, Math.floor(completedLevels / 5) + 1)
  );

  // 6. Lencana / Tropi yang Didapat
  const badgesCount = (completedLevels >= 1 ? 1 : 0) +
    (completedLevels >= 5 ? 1 : 0) +
    (completedLevels >= 10 ? 1 : 0) +
    (player.stars >= 50 ? 1 : 0) +
    (player.level >= 5 ? 1 : 0);

  const triggerHaptic = (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      Haptics.impact({ style });
    } catch {
      // Ignore
    }
  };

  // Buka Modal Edit Profil
  const handleOpenEditModal = () => {
    setTempName(player.name);
    setTempGrade(player.schoolGrade || 'SD Kelas 4');
    setTempBio(player.bio || 'Semangat belajar geometri dan menaklukkan semua bos bangun datar!');
    setTempTitle(player.title || 'Penakluk Pulau Bentuk');
    setTempAvatarId((player.avatarId as AvatarKey) || 'boy');
    setIsEditModalOpen(true);
    triggerHaptic(ImpactStyle.Light);
  };

  // Simpan Perubahan Profil ke State & LocalStorage
  const handleSaveProfile = () => {
    if (onUpdatePlayer) {
      onUpdatePlayer({
        name: tempName.trim() || 'Siswa',
        schoolGrade: tempGrade,
        bio: tempBio.trim(),
        title: tempTitle,
        avatarId: tempAvatarId,
      });
    }
    setIsEditModalOpen(false);
    triggerHaptic(ImpactStyle.Medium);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2400);
  };

  return (
    <div className="sub-screen-container">
      {/* Latar Belakang Langit & Awan Animasi */}
      <div className="sub-screen-sky" aria-hidden="true">
        <div className="sub-screen-cloud cloud-1" />
        <div className="sub-screen-cloud cloud-2" />
        <div className="sub-screen-cloud cloud-3" />
      </div>

      <div className="sub-screen-content">
        {/* Spanduk Papan Kayu Tematik Dinamis */}
        <SubScreenHeader
          icon={activeSubTab === 'profile' ? '👤' : activeSubTab === 'achievements' ? '🏆' : '📚'}
          title={
            activeSubTab === 'profile'
              ? 'Profil Siswa'
              : activeSubTab === 'achievements'
              ? 'Prestasi & Lencana'
              : 'Materi Bangun Datar'
          }
          subtitle={
            activeSubTab === 'profile'
              ? 'Data petualang, statistik, dan pencapaian belajarmu'
              : activeSubTab === 'achievements'
              ? 'Klaim hadiah bintang & permata dari setiap pencapaian'
              : 'Pelajari sifat, rumus keliling, dan luas bentuk geometri'
          }
        />

        {/* Sub-Tab Navigation Bar */}
        <nav className="profile-subtabs-nav" role="tablist">
          <button
            role="tab"
            aria-selected={activeSubTab === 'profile'}
            className={`profile-subtab-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('profile')}
          >
            <User size={15} />
            <span>Profil Siswa</span>
          </button>
          <button
            role="tab"
            aria-selected={activeSubTab === 'achievements'}
            className={`profile-subtab-btn ${activeSubTab === 'achievements' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('achievements')}
          >
            <Trophy size={15} />
            <span>Prestasi ({badgesCount})</span>
          </button>
          <button
            role="tab"
            aria-selected={activeSubTab === 'materials'}
            className={`profile-subtab-btn ${activeSubTab === 'materials' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('materials')}
          >
            <BookOpen size={15} />
            <span>Materi Geometri</span>
          </button>
        </nav>

        {activeSubTab === 'profile' && (
          <>

        {/* 1. KARTU UTAMA PROFIL SISWA DINAMIS */}
        <div className="profile-hero-card">
          {/* Avatar Interaktif dengan Badge Edit */}
          <div
            className="profile-avatar-outer profile-avatar-edit-trigger"
            onClick={handleOpenEditModal}
            title="Klik untuk ganti avatar atau edit profil"
          >
            <div className="profile-avatar-large">
              <AvatarRenderer avatarId={player.avatarId} />
            </div>
            <div className="avatar-edit-pencil-badge">
              <Camera size={12} />
            </div>
            <div className="profile-level-badge">
              <Shield size={12} fill="#f59e0b" color="#b45309" />
              <span>Lv.{player.level}</span>
            </div>
          </div>

          {/* Nama Siswa & Gelar Petualang Dinamis */}
          <h2 className="profile-name-text">{player.name}</h2>
          
          <div className="profile-title-badge">
            <Sparkles size={13} color="#ca8a04" />
            <span>{player.title || 'Penakluk Pulau Bentuk'}</span>
          </div>

          <span className="profile-role-badge">
            🎒 {player.role || 'Siswa'} • {player.schoolGrade || 'SD Kelas 4'}
          </span>

          {/* Motto / Bio Singkat */}
          <p className="profile-bio-quote">
            "{player.bio || 'Semangat belajar geometri dan menaklukkan semua bos bangun datar!'}"
          </p>

          {/* Tombol Aksi Edit Profil */}
          <div className="profile-action-buttons">
            <button
              type="button"
              className="btn-edit-profile"
              onClick={handleOpenEditModal}
            >
              <Edit3 size={13} />
              <span>Edit Profil & Karakter</span>
            </button>
          </div>

          {/* Bar Kemajuan EXP Menuju Level Selanjutnya */}
          <div className="profile-exp-card">
            <div className="profile-exp-info">
              <span className="exp-label">Poin Petualangan (EXP)</span>
              <span className="exp-numbers">
                <strong>{player.currentExp}</strong> / {player.maxExp} EXP
              </span>
            </div>
            <div className="profile-exp-track">
              <div
                className="profile-exp-fill"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          {/* Grid 4 Statistik 3D Mini: Level, Bintang, Koin, Permata */}
          <div className="profile-stats-grid-4">
            <div className="profile-stat-box stat-level">
              <div className="stat-icon-wrap level">
                <Sparkles size={15} color="#0284c7" />
              </div>
              <span className="stat-num">Lv.{player.level}</span>
              <span className="stat-label">Tingkat</span>
            </div>

            <div className="profile-stat-box stat-stars">
              <div className="stat-icon-wrap stars">
                <Star size={15} fill="#facc15" color="#ca8a04" />
              </div>
              <span className="stat-num">{player.stars}</span>
              <span className="stat-label">Bintang</span>
            </div>

            <div className="profile-stat-box stat-coins">
              <div className="stat-icon-wrap coins">
                <Coins size={15} color="#d97706" />
              </div>
              <span className="stat-num">{player.coins || 0}</span>
              <span className="stat-label">Koin</span>
            </div>

            <div className="profile-stat-box stat-diamonds">
              <div className="stat-icon-wrap diamonds">
                <Gem size={15} fill="#38bdf8" color="#0284c7" />
              </div>
              <span className="stat-num">{player.diamonds}</span>
              <span className="stat-label">Permata</span>
            </div>
          </div>
        </div>

        {/* TOMBOL PINTAS: BENGKEL SENJATA & KUSTOMISASI KARAKTER */}
        {onOpenCustomization && (
          <button
            className="profile-workshop-btn"
            onClick={onOpenCustomization}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: '2px solid #38bdf8',
              borderRadius: '16px',
              padding: '12px 18px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)',
              margin: '12px 0 16px 0',
              transition: 'transform 0.15s ease',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔧</span>
            <span>Bengkel Senjata & Kustomisasi Karakter</span>
          </button>
        )}

        {/* 2. KARTU RINGKASAN PEMBELAJARAN DINAMIS */}
        <div className="profile-summary-card">
          <h3 className="card-heading">📊 Statistik Petualangan Nyata</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-icon trophy">
                <Trophy size={16} color="#f59e0b" />
              </div>
              <div className="summary-item-text">
                <span className="summary-item-label">Level Selesai</span>
                <strong className="summary-item-val">{completedLevels} / 25 Level</strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon book">
                <BookOpen size={16} color="#0284c7" />
              </div>
              <div className="summary-item-text">
                <span className="summary-item-label">Materi Dikuasai</span>
                <strong className="summary-item-val">{masteredShapesCount} / 5 Bentuk</strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon target">
                <Target size={16} color="#16a34a" />
              </div>
              <div className="summary-item-text">
                <span className="summary-item-label">Akurasi Kuis</span>
                <strong className="summary-item-val">{quizAccuracy}% Hebat</strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon award">
                <Award size={16} color="#8b5cf6" />
              </div>
              <div className="summary-item-text">
                <span className="summary-item-label">Misi & Lencana</span>
                <strong className="summary-item-val">{missionText} ({badgesCount} Lencana)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 3. KARTU KOLEKSI PENGUASAAN BANGUN DATAR */}
        <div className="profile-shapes-card">
          <div className="card-header-row">
            <h3 className="card-heading">📐 Bangun Datar Dikuasai</h3>
            <span className="shape-mastery-count-pill">
              {masteredShapesCount} dari 5 Selesai
            </span>
          </div>

          <div className="shape-mastery-grid">
            {GEOMETRY_SHAPES_DATA.map((shape, idx) => {
              const isMastered = idx < masteredShapesCount;

              return (
                <div
                  key={shape.id}
                  className="shape-mastery-item"
                  style={{
                    background: isMastered ? shape.bg : '#f1f5f9',
                    borderColor: isMastered ? shape.color : '#e2e8f0',
                  }}
                  onClick={() => setSelectedShape(shape)}
                  title="Klik untuk melihat rumus & fakta bangun datar"
                >
                  <div
                    className="shape-icon-bubble"
                    style={{
                      background: shape.color,
                      color: '#ffffff',
                    }}
                  >
                    {shape.icon}
                  </div>
                  <span className="shape-item-name">{shape.name}</span>
                  <span
                    className={`shape-item-status ${isMastered ? 'mastered' : 'progress'}`}
                  >
                    {isMastered ? 'Dikuasai ✅' : 'Dipelajari 🧭'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
          </>
        )}

        {activeSubTab === 'achievements' && (
          <AchievementScreen
            embedded
            player={player}
            worlds={worlds}
            onUpdatePlayer={onSetPlayerFull}
          />
        )}

        {activeSubTab === 'materials' && (
          <MaterialScreen embedded />
        )}
      </div>

      {/* 4. MODAL EDIT PROFIL INTERAKTIF */}
      {isEditModalOpen && (
        <div className="edit-profile-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="edit-profile-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="edit-modal-header">
              <h3 className="edit-modal-title">
                <Edit3 size={18} color="#0284c7" />
                <span>Kustomisasi Profil Siswa</span>
              </h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Navigasi */}
            <div className="edit-modal-tabs">
              <button
                type="button"
                className={`edit-tab-btn ${editTab === 'identity' ? 'active' : ''}`}
                onClick={() => setEditTab('identity')}
              >
                Identitas Siswa
              </button>
              <button
                type="button"
                className={`edit-tab-btn ${editTab === 'avatar' ? 'active' : ''}`}
                onClick={() => setEditTab('avatar')}
              >
                Karakter Avatar
              </button>
            </div>

            {/* Konten Tab 1: Identitas */}
            {editTab === 'identity' && (
              <div className="edit-modal-body">
                {/* Nama Siswa */}
                <div className="edit-field-group">
                  <label className="edit-field-label">Nama Siswa / Panggilan:</label>
                  <input
                    type="text"
                    className="edit-text-input"
                    value={tempName}
                    maxLength={24}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Masukkan nama petualang..."
                  />
                </div>

                {/* Tingkat Kelas */}
                <div className="edit-field-group">
                  <label className="edit-field-label">Tingkat Kelas SD:</label>
                  <select
                    className="edit-select-input"
                    value={tempGrade}
                    onChange={(e) => setTempGrade(e.target.value)}
                  >
                    {AVAILABLE_GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gelar Petualang */}
                <div className="edit-field-group">
                  <label className="edit-field-label">Gelar Petualang:</label>
                  <select
                    className="edit-select-input"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                  >
                    {AVAILABLE_TITLES.map((t) => {
                      const isLevelUnlocked = player.level >= t.minLevel;
                      return (
                        <option
                          key={t.id}
                          value={t.title}
                          disabled={!isLevelUnlocked}
                        >
                          {t.title} {isLevelUnlocked ? '' : `(Buka di Lv.${t.minLevel})`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Bio / Motto Belajar */}
                <div className="edit-field-group">
                  <label className="edit-field-label">Motto Petualangan Belajar:</label>
                  <textarea
                    className="edit-text-input"
                    rows={2}
                    value={tempBio}
                    maxLength={100}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Tuliskan kata motivasi belajarmu..."
                  />
                </div>
              </div>
            )}

            {/* Konten Tab 2: Karakter Avatar */}
            {editTab === 'avatar' && (
              <div className="edit-modal-body">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Pilih avatar karakter untuk mewakili dirimu dalam game:
                </span>

                <div className="avatar-selection-grid">
                  {(['boy', 'girl', 'adventurer', 'scientist', 'wizard', 'princess'] as AvatarKey[]).map(
                    (avId) => {
                      const isUnlocked =
                        avId === 'boy' ||
                        avId === 'girl' ||
                        avId === 'adventurer' ||
                        avId === 'scientist' ||
                        (player.inventory?.unlockedAvatars || []).includes(avId);

                      const isSelected = tempAvatarId === avId;

                      const avatarLabel: Record<AvatarKey, string> = {
                        boy: 'Rizki (Siswa)',
                        girl: 'Siti (Siswi)',
                        adventurer: 'Petualang',
                        scientist: 'Ilmuwan',
                        wizard: 'Penyihir',
                        princess: 'Putri',
                      };

                      return (
                        <button
                          key={avId}
                          type="button"
                          className={`avatar-choice-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                          onClick={() => {
                            if (isUnlocked) {
                              setTempAvatarId(avId);
                              triggerHaptic(ImpactStyle.Light);
                            }
                          }}
                          disabled={!isUnlocked}
                        >
                          {!isUnlocked && (
                            <span className="avatar-locked-tag">
                              <Lock size={10} /> Gacha
                            </span>
                          )}
                          <div className="avatar-choice-circle">
                            <AvatarRenderer avatarId={avId} />
                          </div>
                          <span className="avatar-choice-name">{avatarLabel[avId]}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Footer Modal: Batal & Simpan */}
            <div className="edit-modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setIsEditModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-modal-save"
                onClick={handleSaveProfile}
              >
                <Check size={16} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DETAIL FAKTA & RUMUS BANGUN DATAR */}
      {selectedShape && (
        <div className="edit-profile-modal-overlay" onClick={() => setSelectedShape(null)}>
          <div className="shape-info-modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              className="shape-info-icon-large"
              style={{ background: selectedShape.color, color: '#ffffff' }}
            >
              {selectedShape.icon}
            </div>
            <h3 className="shape-info-title">{selectedShape.name}</h3>

            <div className="shape-info-formula-card">
              📐 <strong>Rumus:</strong> {selectedShape.formula}
            </div>

            <p className="shape-info-desc">
              💡 <strong>Ciri Khas:</strong> {selectedShape.facts}
            </p>

            <div className="shape-info-examples">
              🏠 <strong>Contoh Nyata:</strong> {selectedShape.examples}
            </div>

            <button
              type="button"
              className="btn-close-shape-info"
              onClick={() => setSelectedShape(null)}
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}

      {/* 6. TOAST NOTIFIKASI BERHASIL DISIMPAN */}
      {showSavedToast && (
        <div className="profile-toast-saved">
          <Check size={16} />
          <span>Profil & Karakter Berhasil Disimpan!</span>
        </div>
      )}
    </div>
  );
};
