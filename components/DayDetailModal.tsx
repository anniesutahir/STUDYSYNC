import React from 'react';
import type { StudyTask } from '../types';
import { XMarkIcon, PencilIcon, CheckCircleIcon } from './Icons';

interface DayDetailModalProps {
  date: Date;
  tasks: StudyTask[];
  onClose: () => void;
  onEditTask: (task: StudyTask) => void;
  onToggleComplete: (taskId: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ date, tasks, onClose, onEditTask, onToggleComplete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-secondary-light dark:bg-secondary-dark rounded-lg shadow-xl w-full max-w-md animate-pop border-2 border-blue-500 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold">
            Tasks for {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className={`p-3 rounded-md flex items-center justify-between ${task.completed ? 'opacity-60' : ''}`} style={{ backgroundColor: task.color + '33' /* Add alpha */ }}>
                <div className="flex items-center overflow-hidden">
                    <button onClick={() => onToggleComplete(task.id)} className="mr-3 flex-shrink-0">
                        <CheckCircleIcon className={`w-6 h-6 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
                    </button>
                    <div className="overflow-hidden">
                        <p className={`font-semibold truncate ${task.completed ? 'line-through' : ''}`} style={{color: task.color}}>{task.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{task.duration} minutes</p>
                    </div>
                </div>
                <button onClick={() => onEditTask(task)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 ml-2 flex-shrink-0">
                    <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};
