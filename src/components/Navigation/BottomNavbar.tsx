import React from 'react';
import { Home, Map, Trophy, BookOpen, User } from 'lucide-react';
import type { NavTabId } from '../../types/game';
import './BottomNavbar.css';

interface BottomNavbarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Array<{ id: NavTabId; label: string; icon: React.ReactNode }> = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: <Home size={21} strokeWidth={2.4} fill={activeTab === 'beranda' ? '#0284c7' : 'none'} />,
    },
    {
      id: 'peta',
      label: 'Peta',
      icon: <Map size={21} strokeWidth={2.2} />,
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      icon: <Trophy size={21} strokeWidth={2.2} />,
    },
    {
      id: 'materi',
      label: 'Materi',
      icon: <BookOpen size={21} strokeWidth={2.2} />,
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: <User size={21} strokeWidth={2.2} />,
    },
  ];

  return (
    <nav className="bottom-navbar-container">
      <div className="bottom-navbar" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="nav-tab-icon">{tab.icon}</div>
              <span className="nav-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
