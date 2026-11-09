import React from 'react';
import { Home, Map, User, Sparkles } from 'lucide-react';
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
      icon: <Home size={22} strokeWidth={2.4} fill={activeTab === 'beranda' ? '#0284c7' : 'none'} />,
    },
    {
      id: 'peta',
      label: 'Peta',
      icon: <Map size={22} strokeWidth={2.2} />,
    },
    {
      id: 'bengkel',
      label: 'Bengkel',
      icon: <Sparkles size={22} strokeWidth={2.2} fill={activeTab === 'bengkel' ? '#0284c7' : 'none'} />,
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: <User size={22} strokeWidth={2.2} fill={activeTab === 'profil' ? '#0284c7' : 'none'} />,
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
