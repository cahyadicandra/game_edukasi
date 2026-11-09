import React from 'react';
import './GameLogo.css';

export const GameLogo: React.FC = () => {
  return (
    <div className="game-logo-wrapper">
      <img
        src="/assets/game_logo.png"
        alt="Petualangan Bangun Datar - Jelajahi Dunia, Temukan Bentuknya!"
        className="game-logo-img"
      />
    </div>
  );
};
