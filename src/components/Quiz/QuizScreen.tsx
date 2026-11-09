import React, { useMemo, useState } from 'react';
import { Pause, Check, X, Target, Lightbulb, Sparkles } from 'lucide-react';
import type { QuizQuestion } from '../../data/questions';
import type { PlayerInventory } from '../../types/game';
import { QuestionVisual } from './QuestionVisual';
import './Quiz.css';

const ShapeSwatch: React.FC<{ shape?: string }> = ({ shape }) => {
  if (!shape) return null;
  return <span className={`option-shape shape-${shape}`} aria-hidden="true" />;
};

interface QuizScreenProps {
  questions: QuizQuestion[];
  levelTitle: string;
  onFinish: (correctCount: number, firstTryCorrect?: number, retryCount?: number) => void;
  onQuit: () => void;
  inventory?: PlayerInventory;
  diamonds?: number;
  onUseFiftyFifty?: () => boolean;
  onUseHint?: () => boolean;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  levelTitle,
  onFinish,
  onQuit,
  inventory,
  diamonds = 0,
  onUseFiftyFifty,
  onUseHint,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasRetriedCurrentQ, setHasRetriedCurrentQ] = useState(false);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [totalRetryCount, setTotalRetryCount] = useState(0);
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const question = questions[index];
  const total = questions.length;

  const fiftyFiftyCount = inventory?.fiftyFiftyTickets ?? 0;
  const hintCount = inventory?.hintTickets ?? 0;

  const progressPct = useMemo(
    () => Math.round(((index + (selectedId ? 1 : 0)) / total) * 100),
    [index, selectedId, total]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleFiftyFifty = () => {
    if (selectedId) return;
    if (eliminatedIds.length > 0) {
      showToast('Bantuan 50:50 sudah dipakai pada soal ini!');
      return;
    }

    const success = onUseFiftyFifty ? onUseFiftyFifty() : false;
    if (!success) {
      showToast(`Tiket 50:50 habis! (Perlu 5 💎, kamu punya ${diamonds} 💎)`);
      return;
    }

    // Ambil 2 pilihan salah untuk dieliminasi
    const wrongOptions = question.options.filter((opt) => opt.id !== question.correctId);
    const shuffled = [...wrongOptions].sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2).map((opt) => opt.id);
    setEliminatedIds(toEliminate);
    showToast('✨ 2 pilihan yang salah telah dieliminasi!');
  };

  const handleHint = () => {
    if (selectedId) return;
    if (showHintModal) return;

    const success = onUseHint ? onUseHint() : false;
    if (!success) {
      showToast(`Tiket Petunjuk habis! (Perlu 3 💎, kamu punya ${diamonds} 💎)`);
      return;
    }

    setShowHintModal(true);
  };

  const handleSelect = (optionId: string) => {
    if (selectedId || eliminatedIds.includes(optionId)) return;
    const correct = optionId === question.correctId;
    setSelectedId(optionId);
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount((c) => c + 1);
      if (!hasRetriedCurrentQ) {
        setFirstTryCorrectCount((c) => c + 1);
      }
    }
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      onFinish(correctCount, firstTryCorrectCount, totalRetryCount);
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setIsCorrect(null);
    setEliminatedIds([]);
    setShowHintModal(false);
    setHasRetriedCurrentQ(false);
  };

  const handleRetry = () => {
    setHasRetriedCurrentQ(true);
    setTotalRetryCount((r) => r + 1);
    setSelectedId(null);
    setIsCorrect(null);
  };

  return (
    <div className="quiz-screen">
      <div className="quiz-sky" />

      {/* Bar atas: pause + progres */}
      <div className="quiz-topbar">
        <button className="quiz-pause-btn" onClick={onQuit} aria-label="Jeda / Keluar">
          <Pause size={18} fill="#ffffff" strokeWidth={0} />
        </button>
        <div className="quiz-progress-wrap">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="quiz-progress-text">
            {index + (selectedId ? 1 : 0)}/{total}
          </span>
        </div>
      </div>

      <div className="quiz-content">
        {/* Toast Notifikasi Bantuan */}
        {toastMessage && (
          <div className="quiz-toast animate-toast">
            <span>{toastMessage}</span>
          </div>
        )}

        <h2 className="quiz-question">{question.prompt}</h2>

        {/* Visual benda */}
        <div className="quiz-visual-card">
          <QuestionVisual type={question.visual} prompt={question.prompt} />
        </div>

        {/* Bar Tombol Lifeline Bantuan Kuis (Fungsional & Terhubung ke Inventori) */}
        <div className="quiz-lifelines-bar">
          <button
            className={`quiz-lifeline-btn ${eliminatedIds.length > 0 ? 'used' : ''}`}
            onClick={handleFiftyFifty}
            disabled={!!selectedId || eliminatedIds.length > 0}
            title="Hilangkan 2 jawaban salah"
          >
            <div className="lifeline-icon-badge">
              <Target size={16} strokeWidth={2.5} color="#0284c7" />
            </div>
            <span className="lifeline-title">50:50</span>
            <span className="lifeline-qty-badge">
              {fiftyFiftyCount > 0 ? `${fiftyFiftyCount}x` : '5 💎'}
            </span>
          </button>

          <button
            className={`quiz-lifeline-btn ${showHintModal ? 'used' : ''}`}
            onClick={handleHint}
            disabled={!!selectedId}
            title="Lihat petunjuk rumus bangun datar"
          >
            <div className="lifeline-icon-badge yellow">
              <Lightbulb size={16} strokeWidth={2.5} color="#b45309" />
            </div>
            <span className="lifeline-title">Petunjuk</span>
            <span className="lifeline-qty-badge yellow">
              {hintCount > 0 ? `${hintCount}x` : '3 💎'}
            </span>
          </button>
        </div>

        {/* Modal Petunjuk Rumus Terbuka */}
        {showHintModal && (
          <div className="quiz-hint-card animate-pop">
            <div className="quiz-hint-header">
              <Sparkles size={16} color="#f59e0b" />
              <strong>Petunjuk Rumus Geometri</strong>
            </div>
            <p className="quiz-hint-text">
              {question.formulaHint || question.explanation}
            </p>
            <button
              className="quiz-hint-dismiss-btn"
              onClick={() => setShowHintModal(false)}
            >
              Paham, Lanjut Jawab! 👍
            </button>
          </div>
        )}

        {/* Pilihan jawaban */}
        <div className="quiz-options">
          {question.options.map((opt) => {
            const isPicked = selectedId === opt.id;
            const isRightAnswer = selectedId && opt.id === question.correctId;
            const isEliminated = eliminatedIds.includes(opt.id);

            const cls = [
              'quiz-option',
              isPicked && isCorrect ? 'correct' : '',
              isPicked && !isCorrect ? 'wrong' : '',
              isRightAnswer && !isPicked ? 'reveal' : '',
              isEliminated ? 'eliminated' : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={opt.id}
                className={cls}
                style={{ ['--opt-color' as string]: opt.color }}
                onClick={() => handleSelect(opt.id)}
                disabled={!!selectedId || isEliminated}
              >
                <ShapeSwatch shape={opt.shape} />
                <span className="option-label">
                  {isEliminated ? '— Tereliminasi 50:50 —' : opt.label}
                </span>
                {isPicked && isCorrect && <Check size={18} strokeWidth={3.5} />}
                {isPicked && !isCorrect && <X size={18} strokeWidth={3.5} />}
              </button>
            );
          })}
        </div>

        {/* Umpan balik */}
        {selectedId && (
          <div className={`quiz-feedback ${isCorrect ? 'good' : 'bad'}`}>
            <p className="quiz-feedback-text">
              {isCorrect
                ? 'Benar! Hebat sekali! 🎉'
                : question.explanation}
            </p>
            {isCorrect ? (
              <button className="quiz-feedback-btn next" onClick={handleNext}>
                {index + 1 >= total ? 'Lihat Hasil' : 'Lanjut'}
              </button>
            ) : (
              <button className="quiz-feedback-btn retry" onClick={handleRetry}>
                Coba Lagi
              </button>
            )}
          </div>
        )}

        <span className="quiz-level-label">{levelTitle}</span>
      </div>
    </div>
  );
};
