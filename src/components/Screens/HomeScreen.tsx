import React from 'react';
import type { PlayerProfile, DailyMission } from '../../types/game';
import { TopHeader } from '../Header/TopHeader';
import { DailyMissionCard } from '../Mission/DailyMissionCard';
import { GameLogo } from '../Hero/GameLogo';
import { CenterActions } from '../CenterActions/CenterActions';
import { GameMascots } from '../Hero/GameMascots';
import './HomeScreen.css';

interface HomeScreenProps {
  player: PlayerProfile;
  mission: DailyMission;
  onOpenProfile: () => void;
  onAddStars: () => void;
  onAddDiamonds: () => void;
  onOpenSettings: () => void;
  onOpenMission: () => void;
  onOpenGacha: () => void;
  onStartAdventure: () => void;
  onExploreShapes?: () => void;
  onOpenMascotPlayground?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  mission,
  onOpenProfile,
  onAddStars,
  onAddDiamonds,
  onOpenSettings,
  onOpenMission,
  onOpenGacha,
  onStartAdventure,
  onOpenMascotPlayground,
}) => {
  return (
    <div className="home-screen-layout">
      {/* High-res Clean Scenic Background */}
      <img
        src="/game_background.jpg"
        alt="Petualangan Bangun Datar Background"
        className="game-bg-image"
      />

      {/* Animated Shape Mascots (Walking Triangle and friends) */}
      <GameMascots onOpenPlayground={onOpenMascotPlayground} />

      {/* Interactive UI Overlays */}
      <div className="game-overlay">
        {/* Top Header Section */}
        <div className="header-section-wrapper">
          <TopHeader
            player={player}
            onOpenProfile={onOpenProfile}
            onAddStars={onAddStars}
            onAddDiamonds={onAddDiamonds}
            onOpenSettings={onOpenSettings}
          />
          <div className="header-cards-row">
            <button
              className="gacha-quick-banner"
              onClick={onOpenGacha}
              title="Buka Peti Misteri Geometri"
            >
              <span className="gacha-quick-icon">🎁</span>
              <div className="gacha-quick-text">
                <span className="gacha-quick-title">Peti Misteri</span>
                <span className="gacha-quick-sub">Gacha Hadiah!</span>
              </div>
            </button>
            <DailyMissionCard
              mission={mission}
              onClick={onOpenMission}
            />
          </div>
        </div>

        {/* 3D Game Title Logo with Crest and Ribbon */}
        <GameLogo />

        {/* Play CTA Button */}
        <CenterActions
          onStartAdventure={onStartAdventure}
        />
      </div>
    </div>
  );
};
