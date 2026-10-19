import { useState } from 'react';
import type { PlayerProfile, DailyMission, NavTabId } from './types/game';
import { initialPlayer, initialMission } from './data/mockData';
import { HomeScreen } from './components/Screens/HomeScreen';
import { MapScreen } from './components/Screens/MapScreen';
import { MaterialScreen } from './components/Screens/MaterialScreen';
import { AchievementScreen } from './components/Screens/AchievementScreen';
import { ProfileScreen } from './components/Screens/ProfileScreen';
import { BottomNavbar } from './components/Navigation/BottomNavbar';
import { GameModal } from './components/Modals/GameModal';
import { Volume2, VolumeX, Shield, Info, Check, Sparkles } from 'lucide-react';
import './styles/game-theme.css';

export default function App() {
  // Game states
  const [player, setPlayer] = useState<PlayerProfile>(initialPlayer);
  const [mission, setMission] = useState<DailyMission>(initialMission);
  const [activeTab, setActiveTab] = useState<NavTabId>('beranda');

  // Interactive Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isShapesModalOpen, setIsShapesModalOpen] = useState(false);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Currency Handlers
  const handleAddStars = () => {
    setPlayer((prev) => ({ ...prev, stars: prev.stars + 10 }));
  };

  const handleAddDiamonds = () => {
    setPlayer((prev) => ({ ...prev, diamonds: prev.diamonds + 5 }));
  };

  // Start adventure action
  const handleStartAdventure = () => {
    setIsPlayModalOpen(true);
  };

  const handleStartLevel = () => {
    setIsPlayModalOpen(false);
    setActiveTab('peta');
  };

  return (
    <div className="game-viewport">
      <main className="game-scene-container">
        {/* Active Screen rendering */}
        {activeTab === 'beranda' && (
          <HomeScreen
            player={player}
            mission={mission}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onAddStars={handleAddStars}
            onAddDiamonds={handleAddDiamonds}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenMission={() => setIsMissionModalOpen(true)}
            onStartAdventure={handleStartAdventure}
            onExploreShapes={() => setIsShapesModalOpen(true)}
          />
        )}

        {activeTab === 'peta' && (
          <MapScreen
            onSelectLevel={(lvl) => {
              alert(`Memulai Level ${lvl}! Bersiaplah menjelajahi bangun datar!`);
            }}
          />
        )}

        {activeTab === 'prestasi' && <AchievementScreen />}

        {activeTab === 'materi' && <MaterialScreen />}

        {activeTab === 'profil' && <ProfileScreen player={player} />}

        {/* Floating Bottom Navigation Bar */}
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </main>

      {/* --- MODAL: Mulai Petualangan --- */}
      <GameModal
        isOpen={isPlayModalOpen}
        title="🎮 Mulai Petualangan!"
        onClose={() => setIsPlayModalOpen(false)}
        footerActionLabel="Buka Peta Petualangan 🚀"
        onFooterAction={handleStartLevel}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏕️</div>
          <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--font-game-title)', color: '#0f172a' }}>
            Siap Menjelajah Dunia Geometri?
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
            Temani si <strong>Kuning Segitiga</strong> menaklukkan tantangan dan mengumpulkan semua bintang di Lembah Geometri!
          </p>
        </div>
      </GameModal>

      {/* --- MODAL: Kenali Bangun Datar --- */}
      <GameModal
        isOpen={isShapesModalOpen}
        title="🔺 Kenali Bangun Datar"
        onClose={() => setIsShapesModalOpen(false)}
        footerActionLabel="Pelajari Selengkapnya 📖"
        onFooterAction={() => {
          setIsShapesModalOpen(false);
          setActiveTab('materi');
        }}
      >
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
          Sentuh bentuk untuk memahami karakteristik utamanya:
        </p>
        <div className="shape-grid">
          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <polygon points="50,15 90,85 10,85" fill="#facc15" stroke="#ca8a04" strokeWidth="6" />
            </svg>
            <span className="shape-name">Segitiga</span>
            <span className="shape-desc">3 sisi & 3 sudut</span>
          </div>

          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect x="15" y="15" width="70" height="70" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
            </svg>
            <span className="shape-name">Persegi</span>
            <span className="shape-desc">4 sisi sama panjang</span>
          </div>

          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="#f87171" stroke="#dc2626" strokeWidth="6" />
            </svg>
            <span className="shape-name">Lingkaran</span>
            <span className="shape-desc">1 sisi lengkung, tanpa sudut</span>
          </div>

          <div className="shape-item">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect x="10" y="25" width="80" height="50" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="6" />
            </svg>
            <span className="shape-name">Persegi Panjang</span>
            <span className="shape-desc">2 pasang sisi sejajar</span>
          </div>
        </div>
      </GameModal>

      {/* --- MODAL: Misi Hari Ini --- */}
      <GameModal
        isOpen={isMissionModalOpen}
        title="📋 Misi Hari Ini"
        onClose={() => setIsMissionModalOpen(false)}
        footerActionLabel="Klaim Hadiah ✨"
        onFooterAction={() => {
          if (mission.current < mission.target) {
            setMission((m) => ({ ...m, current: Math.min(m.target, m.current + 1) }));
          } else {
            alert('🎉 Selamat! Kamu mendapatkan bonus 10 Permata!');
            setPlayer((p) => ({ ...p, diamonds: p.diamonds + 10 }));
            setIsMissionModalOpen(false);
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontFamily: 'var(--font-game-title)' }}>
              {mission.title}
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              {mission.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
                Progres: {mission.current} dari {mission.target}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={14} /> +{mission.rewardDiamonds} Permata
              </span>
            </div>
          </div>
        </div>
      </GameModal>

      {/* --- MODAL: Pengaturan --- */}
      <GameModal
        isOpen={isSettingsModalOpen}
        title="⚙️ Pengaturan"
        onClose={() => setIsSettingsModalOpen(false)}
        footerActionLabel="Simpan"
        onFooterAction={() => setIsSettingsModalOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {soundEnabled ? <Volume2 size={18} color="#0284c7" /> : <VolumeX size={18} color="#94a3b8" />}
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Suara & Musik Game</span>
            </div>
            <button
              style={{
                background: soundEnabled ? '#22c55e' : '#cbd5e1',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <Shield size={16} color="#0284c7" />
            <span>Mode Aman Anak & Edukasi Aktif</span>
            <Check size={16} color="#16a34a" style={{ marginLeft: 'auto' }} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <Info size={16} color="#0284c7" />
            <span>Versi Game: 1.0.0 (Capacitor Mobile)</span>
          </div>
        </div>
      </GameModal>

      {/* --- MODAL: Profil Siswa --- */}
      <GameModal
        isOpen={isProfileModalOpen}
        title="🎓 Kartu Siswa"
        onClose={() => setIsProfileModalOpen(false)}
        footerActionLabel="Buka Profil Lengkap"
        onFooterAction={() => {
          setIsProfileModalOpen(false);
          setActiveTab('profil');
        }}
      >
        <div style={{ textAlign: 'center', padding: '6px 0' }}>
          <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-game-title)', fontSize: '18px' }}>
            {player.name}
          </h3>
          <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>
            {player.role} • Level {player.level}
          </span>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', lineHeight: 1.4 }}>
            Pengalaman (EXP): {player.currentExp} / {player.maxExp} EXP
          </p>
        </div>
      </GameModal>
    </div>
  );
}