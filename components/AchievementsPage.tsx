import React from 'react';
import type { Achievement } from '../types';
import { AcademicCapIcon, XMarkIcon } from './Icons';

interface AchievementsPageProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    return (
        <div className={`p-4 rounded-lg shadow-md flex items-center border-2 border-blue-500 ${achievement.unlocked ? 'bg-green-100 dark:bg-green-900/50' : 'bg-primary-light dark:bg-primary-dark opacity-60'}`}>
            <AcademicCapIcon className={`w-10 h-10 mr-4 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'}`} />
            <div>
                <h4 className="font-bold">{achievement.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                {achievement.unlocked && achievement.dateUnlocked && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unlocked on: {new Date(achievement.dateUnlocked).toLocaleDateString()}</p>
                )}
            </div>
        </div>
    );
};

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ achievements, onClose }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in p-4">
            <div className="bg-secondary-light dark:bg-secondary-dark rounded-lg shadow-xl w-full max-w-2xl animate-pop border-2 border-blue-500 flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold">My Achievements ({unlockedCount} / {totalCount})</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto space-y-3">
                    {achievements.sort((a,b) => Number(b.unlocked) - Number(a.unlocked)).map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
                </div>
            </div>
        </div>
    );
};