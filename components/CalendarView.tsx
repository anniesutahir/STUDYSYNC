import React from 'react';
import type { StudyTask } from '../types';
import { toYYYYMMDD } from '../utils/achievementUtils';

interface CalendarViewProps {
  tasks: StudyTask[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    
    const getTasksForDay = (day: Date) => {
        const dayString = toYYYYMMDD(day);
        return tasks.filter(task => task.date === dayString);
    };

    return (
        <div className="p-4 rounded-lg bg-secondary-light dark:bg-secondary-dark shadow-md border-2 border-blue-500">
            <h3 className="font-bold text-lg mb-4">This Week's Schedule</h3>
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs md:text-sm">
                {days.map(day => (
                    <div key={day.toISOString()} className="font-bold">
                        <p>{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="text-gray-500 dark:text-gray-400">{day.getDate()}</p>
                    </div>
                ))}

                {days.map(day => (
                    <div key={day.toISOString()} className="h-48 md:h-64 bg-primary-light dark:bg-primary-dark rounded-md p-1 space-y-1 overflow-y-auto border-2 border-blue-500">
                        {getTasksForDay(day).map(task => (
                            <div
                                key={task.id}
                                className={`p-1 rounded-md text-white text-xs cursor-pointer hover:opacity-80 ${task.completed ? 'opacity-50' : ''}`}
                                style={{ backgroundColor: task.color }}
                                title={`${task.title} (${task.duration} min)`}
                            >
                                <p className="font-semibold truncate">{task.title}</p>
                                <p className="truncate text-gray-200">{task.subject}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};