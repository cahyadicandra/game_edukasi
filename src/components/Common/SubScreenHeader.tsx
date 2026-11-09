import React from 'react';
import './SubScreenHeader.css';

interface SubScreenHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const SubScreenHeader: React.FC<SubScreenHeaderProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div className="sub-screen-wood-banner" role="banner">
      {/* Papan Kayu Utama */}
      <div className="wood-board">
        <div className="wood-nail left-top" />
        <div className="wood-nail left-bottom" />
        
        {icon && <span className="wood-banner-icon">{icon}</span>}
        <h1 className="wood-title">{title}</h1>

        <div className="wood-nail right-top" />
        <div className="wood-nail right-bottom" />
      </div>

      {/* Pita Biru Subjudul */}
      <div className="wood-ribbon">
        <p className="wood-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};
