
import React from 'react';
import type { Theme } from '../types';
import { THEMES } from '../constants';
import { ClockIcon, BookOpenIcon, SunIcon, MoonIcon, SearchIcon, LogoutIcon } from './Icons';

interface HeaderProps {
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
    onTimerClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTheme, setTheme, onTimerClick, searchQuery, onSearchChange, onLogout }) => {
  const toggleTheme = () => {
    const newThemeName = currentTheme.isDark ? 'Light' : 'Dark';
    const newTheme = THEMES.find(t => t.name === newThemeName);
    if (newTheme) {
        setTheme(newTheme);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-secondary-light dark:bg-secondary-dark px-4 md:pl-28 py-3 shadow-md flex justify-between items-center border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center flex-shrink-0">
        <BookOpenIcon className="w-9 h-9 mr-3 text-[var(--theme-accent)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">STUDYSYNC</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Streamline your Studies by Syncing your Goals, Time and Progress</p>
        </div>
      </div>

      <div className="flex-1 px-4 lg:px-12">
        <div className="relative w-full max-w-lg mx-auto">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="search"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-11 pr-4 py-2 rounded-full bg-primary-light dark:bg-primary-dark border-2 border-gray-300 dark:border-gray-600 focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50 focus:outline-none transition-colors"
            />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {currentTheme.isDark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={onTimerClick}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open Timer"
        >
          <ClockIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
