import React from 'react';
import { Star, Target, Crown, Sparkles, BookOpen, Coins } from 'lucide-react';
import type { WorldData, LevelNodeData } from '../../data/worlds';
import { LEVEL_CURRICULUM_DATA } from '../../data/rpgLevelConfigs';
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

  const isBossLevel = level.num % 5 === 0 || level.nodeType === 'boss';
  const curriculum = LEVEL_CURRICULUM_DATA[level.num] || {
    levelNum: level.num,
    title: `Level ${level.num}`,
    learningGoal: 'Jelajahi arena, kumpulkan koin dan bangun datar, lalu selesaikan soal evaluasi!',
    targetShapes: ['Bangun Datar'],
    targetShapesDesc: 'Koleksi token geometri',
    isBossLevel,
    bossName: isBossLevel ? 'Bos Geometri' : undefined,
  };

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
          {/* Judul Topik Pembelajaran */}
          <h3 className="level-detail-topic-title">
            {curriculum.title}
          </h3>

          {/* Badge Tipe Level */}
          <div
            className={`level-detail-type-badge ${isBossLevel ? 'boss-type' : 'regular-type'}`}
          >
            {isBossLevel ? (
              <>
                <Crown size={14} />
                <span>TANTANGAN BOS PULAU</span>
              </>
            ) : (
              <>
                <BookOpen size={14} />
                <span>BELAJAR & KUIS KONSEP</span>
              </>
            )}
          </div>

          {/* Kartu Tujuan Pembelajaran (Briefing Edukasi) */}
          <div className="level-briefing-box">
            <div className="briefing-box-header">
              <Target size={14} color="#0284c7" />
              <span>Tujuan Belajar Hari Ini:</span>
            </div>
            <p className="briefing-goal-text">
              {curriculum.learningGoal}
            </p>
          </div>

          {/* Kartu Misi Koleksi Token & Koin */}
          <div className="briefing-mission-row">
            <div className="briefing-mission-chip coin-chip">
              <Coins size={13} color="#d97706" />
              <span>Kumpulkan Koin</span>
            </div>
            <div className="briefing-mission-chip shape-chip">
              <Sparkles size={13} color="#2563eb" />
              <span>{curriculum.targetShapesDesc}</span>
            </div>
          </div>

          {/* Pratinjau bintang perolehan */}
          <div className="level-detail-stars">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={28}
                fill={s <= (level.stars ?? 0) ? '#facc15' : '#ffffff'}
                color={s <= (level.stars ?? 0) ? '#ca8a04' : '#94a3b8'}
                strokeWidth={1.6}
              />
            ))}
          </div>

          {/* Petunjuk Akhir Level */}
          <div className="level-detail-end-hint">
            {isBossLevel ? (
              <span>⚔️ Kalahkan <strong>{curriculum.bossName}</strong> di gerbang akhir!</span>
            ) : (
              <span>📝 Jawab <strong>3 Soal Evaluasi</strong> di gerbang akhir tanpa bos.</span>
            )}
          </div>

          <button
            type="button"
            className="level-detail-start-btn"
            onClick={onStart}
          >
            {isBossLevel ? '👑 Hadapi Bos Pulau!' : '🚀 Mulai Belajar & Main!'}
          </button>
        </div>
      </div>
    </div>
  );
};
