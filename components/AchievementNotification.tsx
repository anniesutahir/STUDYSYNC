import React, { useEffect, useState } from 'react';
import type { Achievement } from '../types';
import { AcademicCapIcon } from './Icons';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);
  
  return (
    <div className={`fixed bottom-20 md:bottom-4 left-4 bg-secondary-light dark:bg-secondary-dark p-4 rounded-lg shadow-2xl w-80 z-50 border border-yellow-400 dark:border-yellow-600 transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AcademicCapIcon className="w-8 h-8 text-yellow-500"/>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-text-light dark:text-text-dark">Achievement Unlocked!</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{achievement.name}</p>
        </div>
      </div>
    </div>
  );
};