import React, { useEffect, useMemo } from 'react';
import type { Achievement } from '../types';
import { AcademicCapIcon } from './Icons';

const STAR_COUNT = 30;
const DURATION = 4000; // 4 seconds

const STAR_COLORS = ['#FFD700', '#FFC700', '#F8B600', '#F0A500'];

const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-star-burst"
    style={style}
  />
);

export const AchievementCelebration: React.FC<{ achievement: Achievement, onComplete: () => void }> = ({ achievement, onComplete }) => {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => {
      const angle = Math.random() * 360;
      const radius = Math.random() * 300 + 50; // 50 to 350px radius from center
      return {
        id: i,
        style: {
          top: `calc(50% + ${Math.sin(angle) * radius}px)`,
          left: `calc(50% + ${Math.cos(angle) * radius}px)`,
          backgroundColor: STAR_COLORS[i % STAR_COLORS.length],
          animationDuration: `${Math.random() * 1 + 0.5}s`, // 0.5 to 1.5s
          animationDelay: `${Math.random() * 0.2}s`,
        }
      };
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100] pointer-events-none">
      {stars.map(star => <Star key={star.id} style={star.style} />)}
      <div className="relative text-center p-8 bg-secondary-light dark:bg-secondary-dark rounded-xl shadow-2xl border-2 border-yellow-400 dark:border-yellow-500 animate-[fade-in-out-pop_4s_ease-in-out_forwards]">
        <AcademicCapIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">Achievement Unlocked!</h2>
        <p className="text-lg font-semibold mt-1">{achievement.name}</p>
      </div>
    </div>
  );
};
