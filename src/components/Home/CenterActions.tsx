import React from 'react';
import './CenterActions.css';

interface CenterActionsProps {
  onStartAdventure: () => void;
  onExploreShapes?: () => void;
}

export const CenterActions: React.FC<CenterActionsProps> = ({
  onStartAdventure,
}) => {
  return (
    <div className="center-actions-area">
      {/* Main Play CTA Button */}
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
  );
};
