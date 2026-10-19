import React from 'react';
import { Award, Zap, Flame, ShieldCheck } from 'lucide-react';
import './ScreenCommon.css';

export const AchievementScreen: React.FC = () => {
  const achievements = [
    {
      id: 1,
      title: 'Pemula Geometri',
      desc: 'Selesaikan level pertama dengan sempurna',
      icon: <Award size={24} color="#f59e0b" />,
      progress: '1/1',
      completed: true,
    },
    {
      id: 2,
      title: 'Kolektor Bintang',
      desc: 'Kumpulkan 100 bintang petualangan',
      icon: <Zap size={24} color="#eab308" />,
      progress: '120/100',
      completed: true,
    },
    {
      id: 3,
      title: 'Pantang Menyerah',
      desc: 'Bermain 3 hari berturut-turut',
      icon: <Flame size={24} color="#ef4444" />,
      progress: '2/3',
      completed: false,
    },
    {
      id: 4,
      title: 'Master Segitiga',
      desc: 'Jawab 10 kuis segitiga tanpa salah',
      icon: <ShieldCheck size={24} color="#3b82f6" />,
      progress: '4/10',
      completed: false,
    },
  ];

  return (
    <div className="sub-screen-container">
      <div className="sub-screen-header">
        <h1 className="sub-screen-title">🏆 Prestasi & Lencana</h1>
        <p className="sub-screen-subtitle">Buktikan kehebatanmu dalam memahami bangun datar!</p>
      </div>

      <div className="achievement-list">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`achievement-card ${item.completed ? 'completed' : 'in-progress'}`}
          >
            <div className="achievement-icon-wrapper">{item.icon}</div>
            <div className="achievement-info">
              <span className="achievement-title">{item.title}</span>
              <p className="achievement-desc">{item.desc}</p>
            </div>
            <div className="achievement-status">
              <span className={`achievement-badge ${item.completed ? 'done' : 'ongoing'}`}>
                {item.completed ? 'Selesai' : item.progress}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
