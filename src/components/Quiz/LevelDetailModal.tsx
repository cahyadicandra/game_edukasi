import React from 'react';
import { Star, Clock, Target, Swords, Flame, Puzzle, Crown } from 'lucide-react';
import type { WorldData, LevelNodeData } from '../../data/worlds';
import { getMonsterForLevel } from '../../data/monsters';
import './LevelDetail.css';

interface LevelDetailModalProps {
  isOpen: boolean;
  world: WorldData | null;
  level: LevelNodeData | null;
  onClose: () => void;
  onStart: () => void;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  isOpen,
  world,
  level,
  onClose,
  onStart,
}) => {
  if (!isOpen || !world || !level) return null;

  const nodeType = level.nodeType || 'battle';
  const monster = getMonsterForLevel(level.num);

  return (
    <div className="level-detail-backdrop" onClick={onClose}>
      <div className="level-detail-card" onClick={(e) => e.stopPropagation()}>
        {/* Spanduk judul level */}
        <div className="level-detail-banner">
          <span className="level-detail-banner-title">Level {level.num}</span>
        </div>
        <div className="level-detail-ribbon">
          Gerbang {world.name}
        </div>

        <div className="level-detail-body">
          {/* Badge Tipe Misi Petualangan RPG */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontFamily: 'var(--font-game-title)',
              fontWeight: 800,
              background:
                nodeType === 'boss'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : nodeType === 'puzzle'
                  ? '#8b5cf6'
                  : nodeType === 'campfire'
                  ? '#10b981'
                  : '#ef4444',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              marginBottom: '4px',
            }}
          >
            {nodeType === 'boss' && <Crown size={14} />}
            {nodeType === 'battle' && <Swords size={14} />}
            {nodeType === 'puzzle' && <Puzzle size={14} />}
            {nodeType === 'campfire' && <Flame size={14} />}
            <span>
              {nodeType === 'boss' && 'TANTANGAN BOS BESAR'}
              {nodeType === 'battle' && 'PERTARUNGAN RPG'}
              {nodeType === 'puzzle' && 'TEKA-TEKI TANGRAM'}
              {nodeType === 'campfire' && 'POS PERKEMAHAN'}
            </span>
          </div>

          <p className="level-detail-goal">
            {nodeType === 'battle' && (
              <>
                <strong>Lawan:</strong> {monster.name} ({monster.title}).
              </>
            )}
            {nodeType === 'boss' && (
              <>
                <strong>Bos Pulau:</strong> {monster.name}! Kalahkan dengan rumus sakti.
              </>
            )}
            {nodeType === 'puzzle' && (
              <>
                <strong>Misi:</strong> Rakit siluet bangunan dari potongan bangun datar.
              </>
            )}
            {nodeType === 'campfire' && (
              <>
                <strong>Misi:</strong> Pulihkan HP & SP bersama Kakek Archimedes.
              </>
            )}
          </p>

          {/* Pratinjau bintang */}
          <div className="level-detail-stars">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={30}
                fill={s <= (level.stars ?? 0) ? '#facc15' : '#ffffff'}
                color={s <= (level.stars ?? 0) ? '#ca8a04' : '#94a3b8'}
                strokeWidth={1.6}
              />
            ))}
          </div>

          {/* Info waktu & tantangan */}
          <div className="level-detail-info-row">
            <span className="level-detail-info-pill">
              <Clock size={14} strokeWidth={2.4} /> 2–3 menit
            </span>
            <span className="level-detail-info-pill">
              <Target size={14} strokeWidth={2.4} />
              {nodeType === 'battle' || nodeType === 'boss' ? 'Pertarungan Turn-Based' : 'Tantangan Visual'}
            </span>
          </div>

          <button className="level-detail-start-btn" onClick={onStart}>
            {nodeType === 'boss' && '⚔️ Hadapi Bos!'}
            {nodeType === 'battle' && '⚔️ Mulai Bertarung!'}
            {nodeType === 'puzzle' && '🧩 Pecahkan Tangram!'}
            {nodeType === 'campfire' && '🏕️ Masuk Berkemah!'}
          </button>
        </div>
      </div>
    </div>
  );
};
