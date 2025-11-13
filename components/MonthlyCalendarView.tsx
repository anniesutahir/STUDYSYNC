import React, { useState } from 'react';
import type { StudyTask } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { toYYYYMMDD } from '../utils/achievementUtils';

interface MonthlyCalendarViewProps {
  tasks: StudyTask[];
  onDayClick: (date: Date) => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({ tasks, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDayOfWeek = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const getTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = toYYYYMMDD(date);
    return tasks.filter(task => task.date === dateString);
  };

  const today = new Date();

  return (
    <div className="p-4 rounded-lg bg-secondary-light dark:bg-secondary-dark shadow-md border-2 border-blue-500">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h3 className="font-bold text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-start-${i}`} className="border-t border-gray-200 dark:border-gray-700"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const isToday = today.getFullYear() === currentDate.getFullYear() &&
                          today.getMonth() === currentDate.getMonth() &&
                          today.getDate() === dayNumber;
          const dayTasks = getTasksForDay(dayNumber);
          
          return (
            <div 
              key={dayNumber} 
              onClick={() => onDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber))}
              className="h-24 p-1 border-t border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
            >
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-sm ${isToday ? 'bg-[var(--theme-accent)] text-white' : ''}`}>
                {dayNumber}
              </div>
              <div className="mt-1 space-y-0.5 overflow-hidden">
                {dayTasks.slice(0, 2).map(task => (
                    <div key={task.id} className="w-full h-1.5 rounded-full" style={{backgroundColor: task.color}} title={task.title}></div>
                ))}
                {dayTasks.length > 2 && <div className="text-xs text-gray-500">+{dayTasks.length - 2} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};