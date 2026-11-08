import React from 'react';
import { Star, Coins, Sparkles, RotateCcw, Play } from 'lucide-react';
import type { LevelResult } from '../../data/questions';
import './Result.css';

interface ResultScreenProps {
  result: LevelResult;
  levelTitle: string;
  onContinue: () => void;
  onRetry: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  levelTitle,
  onContinue,
  onRetry,
}) => {
  return (
    <div className="result-screen">
      <div className="result-sky" />

      <div className="result-content">
        {/* Pita bintang */}
        <div className="result-stars-row">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={s === 2 ? 52 : 40}
              className="result-star"
              fill={s <= result.stars ? '#facc15' : 'rgba(255,255,255,0.35)'}
              color={s <= result.stars ? '#ca8a04' : 'rgba(255,255,255,0.6)'}
              strokeWidth={1.4}
            />
          ))}
        </div>

        {/* Evaluasi Bintang Bertingkat */}
        <div
          style={{
            margin: '4px auto 8px',
            padding: '5px 14px',
            borderRadius: '9999px',
            background: result.stars === 3 ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255, 255, 255, 0.15)',
            border: `1px solid ${result.stars === 3 ? '#facc15' : 'rgba(255, 255, 255, 0.25)'}`,
            color: result.stars === 3 ? '#fef08a' : '#f8fafc',
            fontSize: '12.5px',
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          {result.stars === 3
            ? '🌟 Sempurna! Benar semua di percobaan pertama!'
            : result.stars === 2
            ? '✨ Bagus! Selesai dengan sedikit coba lagi'
            : '👍 Selesai! Ayo coba lagi untuk 3 bintang'}
        </div>

        <div className="result-banner">
          <span>Level Selesai!</span>
        </div>
        <span className="result-level-label">{levelTitle}</span>

        {/* Maskot Segitiga Petualang dalam Medali Juara Keemasan */}
        <div className="result-hero-wrap">
          <div className="result-hero-aura" />
          <div className="result-hero-emblem">
            <img
              className="result-hero-img"
              src="/assets/mascot_triangle.png"
              alt="Maskot Petualang Segitiga"
              draggable={false}
            />
          </div>
          <div className="result-hero-badge">
            <Sparkles size={13} color="#ca8a04" />
            <span>Petualang Hebat!</span>
          </div>
          <div className="result-hero-shadow" />
        </div>

        {/* Kartu skor */}
        <div className="result-card">
          <div className="result-row">
            <span className="result-row-label">
              <Star size={17} fill="#facc15" color="#ca8a04" strokeWidth={1} /> Skor
            </span>
            <span className="result-row-value">
              <Coins size={16} color="#f59e0b" fill="#fcd34d" strokeWidth={1.5} />
              {result.score}
            </span>
          </div>
          <div className="result-row">
            <span className="result-row-label">
              <Sparkles size={16} color="#7c3aed" fill="#c4b5fd" strokeWidth={1.5} /> XP
            </span>
            <span className="result-row-value xp">+{result.xp}</span>
          </div>
          <div className="result-row answer">
            <span className="result-row-label">Jawaban</span>
            <span className="result-row-value good">
              ✓ {result.correct} / {result.total}
              {result.firstTryCorrect !== undefined && (
                <span style={{ fontSize: '11px', opacity: 0.85, marginLeft: '6px' }}>
                  ({result.firstTryCorrect} sekali coba)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Tombol aksi */}
        <button className="result-btn continue" onClick={onContinue}>
          <Play size={17} fill="#ffffff" strokeWidth={0} /> Lanjutkan
        </button>
        <button className="result-btn retry" onClick={onRetry}>
          <RotateCcw size={15} strokeWidth={2.6} /> Ulangi
        </button>
      </div>
    </div>
  );
};
