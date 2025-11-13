import React from 'react';
import type { View } from '../types';
import { BookOpenIcon, AcademicCapIcon, ListBulletIcon, CalendarDaysIcon, ChartPieIcon, CalendarMonthIcon, ClipboardListIcon } from './Icons';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onAchievementsClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onAchievementsClick }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpenIcon },
    { id: 'tasks', label: 'Tasks', icon: ListBulletIcon },
    { id: 'calendar', label: 'Week', icon: CalendarDaysIcon },
    { id: 'monthly', label: 'Month', icon: CalendarMonthIcon },
    { id: 'exams', label: 'Exams', icon: ClipboardListIcon },
    { id: 'statistics', label: 'Stats', icon: ChartPieIcon },
    { id: 'achievements', label: 'Awards', icon: AcademicCapIcon },
  ];

  const NavButton: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isAchievements = item.id === 'achievements';
    const action = isAchievements ? onAchievementsClick : () => setCurrentView(item.id as View);
    const isActive = !isAchievements && currentView === item.id;
    const Icon = item.icon;

    return (
      <button
        onClick={action}
        aria-current={isActive ? 'page' : undefined}
        className={`group flex flex-col items-center justify-center p-2 my-1 rounded-lg w-full transition-colors ${
          isActive
            ? 'bg-teal-100 dark:bg-blue-900/50 text-[var(--theme-accent)]'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="text-xs mt-1 md:hidden">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary-light dark:bg-secondary-dark border-t-2 border-blue-500 z-30
                   md:top-0 md:w-20 md:bottom-auto md:border-t-0 md:border-r-2">
      <div className="flex justify-around md:flex-col md:items-center md:h-full md:py-4">
        {navItems.map(item => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
};