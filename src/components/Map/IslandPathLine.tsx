import React from 'react';
import type { LevelNodeData } from '../../data/worlds';
import './IslandPathLine.css';

interface IslandPathLineProps {
  levels: LevelNodeData[];
}

export const IslandPathLine: React.FC<IslandPathLineProps> = ({ levels }) => {
  if (levels.length < 2) return null;

  // Bangun segmen kurva antar node level
  const segments = [];
  for (let i = 0; i < levels.length - 1; i++) {
    const p1 = levels[i];
    const p2 = levels[i + 1];

    // Titik tengah
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    // Vektor tegak lurus untuk kelengkungan alami (bergantian kanan-kiri)
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const sign = i % 2 === 0 ? 1 : -1;
    const cx = mx - dy * 0.16 * sign;
    const cy = my + dx * 0.16 * sign;

    const d = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;

    // Jalur aktif / terbuka
    const isUnlocked =
      p1.state === 'completed' &&
      (p2.state === 'completed' || p2.state === 'active');

    segments.push({
      key: `seg-${p1.num}-${p2.num}`,
      d,
      isUnlocked,
    });
  }

  return (
    <svg
      className="island-path-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* 1. Bayangan tipis garis putus-putus agar kontras */}
      {segments.map((seg) => (
        <path
          key={`shadow-${seg.key}`}
          d={seg.d}
          className="path-dashed-shadow"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* 2. Garis putus-putus kecil & halus (non-scaling-stroke) */}
      {segments.map((seg) => (
        <path
          key={`dash-${seg.key}`}
          d={seg.d}
          className={`path-dashed-main ${seg.isUnlocked ? 'unlocked' : 'locked'}`}
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
};
