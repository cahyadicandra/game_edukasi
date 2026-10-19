import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { DailyMission } from '../../types/game';
import './DailyMissionCard.css';

interface DailyMissionCardProps {
  mission: DailyMission;
  onClick: () => void;
}

export const DailyMissionCard: React.FC<DailyMissionCardProps> = ({
  mission,
  onClick,
}) => {
  const percent = Math.min(100, Math.round((mission.current / mission.target) * 100));

  return (
    <div className="daily-mission-wrapper">
      <div 
        className="daily-mission-card" 
        onClick={onClick}
        title="Lihat Rincian Misi"
      >
        <div className="mission-top-row">
          {/* Clipboard SVG icon */}
          <div className="mission-icon-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="4" width="14" height="17" rx="3" fill="#38bdf8" />
              <rect x="7" y="6" width="10" height="13" rx="1.5" fill="#ffffff" />
              {/* Clipboard clip */}
              <rect x="8.5" y="2" width="7" height="3.5" rx="1" fill="#f59e0b" />
              {/* Lines */}
              <rect x="9" y="9" width="6" height="1.5" rx="0.75" fill="#94a3b8" />
              <rect x="9" y="12" width="6" height="1.5" rx="0.75" fill="#94a3b8" />
              <rect x="9" y="15" width="4" height="1.5" rx="0.75" fill="#94a3b8" />
            </svg>
          </div>

          <div className="mission-text-container">
            <div className="mission-header-line">
              <span className="mission-title">{mission.title}</span>
              <span className="mission-arrow">
                <ChevronRight size={13} strokeWidth={2.5} />
              </span>
            </div>
            <p className="mission-desc">{mission.description}</p>
          </div>
        </div>

        {/* Progress bar and counter */}
        <div className="mission-progress-row">
          <div className="mission-progress-bar">
            <div 
              className="mission-progress-fill" 
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="mission-progress-text">
            {mission.current}/{mission.target}
          </span>
        </div>
      </div>
    </div>
  );
};
