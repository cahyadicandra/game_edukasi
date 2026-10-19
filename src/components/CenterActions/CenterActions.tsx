import React from 'react';
import { ChevronRight } from 'lucide-react';
import './CenterActions.css';

interface CenterActionsProps {
  onStartAdventure: () => void;
  onExploreShapes: () => void;
}

export const CenterActions: React.FC<CenterActionsProps> = ({
  onStartAdventure,
  onExploreShapes,
}) => {
  return (
    <>
      {/* Wooden Signboard on the left path, perfectly placed on the illustrated board */}
      <div className="signboard-wrapper">
        <button 
          className="wooden-signboard" 
          onClick={onExploreShapes}
          title="Kenali Bangun Datar"
          aria-label="Kenali Bangun Datar"
        >
          <span className="signboard-text-top">Kenali</span>
          <span className="signboard-text-bottom">
            Bangun Datar
            <ChevronRight size={13} strokeWidth={3} />
          </span>
        </button>
      </div>

      {/* Main Play CTA Button */}
      <div className="center-actions-area">
        <button 
          className="play-btn-adventure animate-pulse-glow" 
          onClick={onStartAdventure}
          aria-label="Mulai Petualangan"
        >
          <div className="play-icon-bubble">
            <div className="play-icon-triangle" />
          </div>
          <span className="play-btn-text">Mulai Petualangan</span>
        </button>
      </div>
    </>
  );
};
