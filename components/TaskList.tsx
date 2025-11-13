
import React, { useState, useMemo } from 'react';
import type { StudyTask } from '../types';
import { PencilIcon, TrashIcon, CheckCircleIcon, PlusIcon } from './Icons';

interface TaskListProps {
  tasks: StudyTask[];
  onAddTask: () => void;
  onEditTask: (task: StudyTask) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

interface TaskItemProps {
  task: StudyTask;
  onEditTask: (task: StudyTask) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEditTask, onDeleteTask, onToggleComplete }) => {
    const priorityClasses = {
        High: 'border-l-red-500',
        Medium: 'border-l-yellow-500',
        Low: 'border-l-green-500'
    };

    return (
        <div className={`bg-secondary-light dark:bg-secondary-dark p-4 rounded-lg shadow-md flex items-center justify-between border-l-4 ${priorityClasses[task.priority]} ${task.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center overflow-hidden">
                <button onClick={() => onToggleComplete(task.id)} className="mr-4 flex-shrink-0">
                    <CheckCircleIcon className={`w-7 h-7 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-green-400'}`} />
                </button>
                <div className="overflow-hidden">
                    <p className={`font-bold truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2 mt-1 flex-wrap">
                        <span className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1 flex-shrink-0" style={{ backgroundColor: task.color }}></div>
                            {task.subject}
                        </span>
                        <span className="hidden sm:inline">|</span>
                        <span className="hidden sm:inline">{task.date}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>{task.duration} mins</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <button onClick={() => onEditTask(task)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={() => onDeleteTask(task.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
            </div>
        </div>
    );
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onEditTask, onDeleteTask, onToggleComplete }) => {
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [sortOption, setSortOption] = useState('dueDateAsc');

    const subjects = useMemo(() => ['All', ...new Set(tasks.map(t => t.subject))], [tasks]);

    const filteredTasks = useMemo(() => {
      return tasks.filter(task => {
        const subjectMatch = filterSubject === 'All' || task.subject === filterSubject;
        const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
        return subjectMatch && priorityMatch;
      });
    }, [tasks, filterSubject, filterPriority]);

    const upcomingTasks = useMemo(() => {
        const priorityValues = { High: 3, Medium: 2, Low: 1 };
        return filteredTasks
            .filter(t => !t.completed)
            .sort((a, b) => {
                switch (sortOption) {
                    case 'priority':
                        return priorityValues[b.priority] - priorityValues[a.priority];
                    case 'dueDateDesc':
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    case 'creationDate':
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                    case 'dueDateAsc':
                    default:
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                }
            });
    }, [filteredTasks, sortOption]);
    
    const completedTasks = filteredTasks.filter(t => t.completed).sort((a,b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold">My Tasks</h2>
                <button onClick={onAddTask} className="flex items-center px-4 py-2 bg-[var(--theme-accent)] text-black rounded-lg shadow-md hover:opacity-90 transition-opacity">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Add Task</span>
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 p-4 bg-secondary-light dark:bg-secondary-dark rounded-lg border-2 border-blue-500">
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="subject-filter" className="block text-sm font-medium">Filter by Subject</label>
                    <select
                        id="subject-filter"
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50"
                    >
                        {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="priority-filter" className="block text-sm font-medium">Filter by Priority</label>
                    <select
                        id="priority-filter"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50"
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="sort-tasks" className="block text-sm font-medium">Sort by</label>
                    <select
                        id="sort-tasks"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50"
                    >
                        <option value="dueDateAsc">Due Date (Soonest)</option>
                        <option value="dueDateDesc">Due Date (Latest)</option>
                        <option value="priority">Priority (High-Low)</option>
                        <option value="creationDate">Creation Date (Newest)</option>
                    </select>
                </div>
            </div>


            <div>
                <h3 className="text-xl font-semibold mb-3">Upcoming</h3>
                <div className="space-y-3">
                    {upcomingTasks.length > 0 ? (
                        upcomingTasks.map(task => <TaskItem key={task.id} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onToggleComplete={onToggleComplete} />)
                    ) : (
                        <div className="text-center py-8 px-4 bg-secondary-light dark:bg-secondary-dark rounded-lg">
                           <p className="text-gray-500 dark:text-gray-400">No matching tasks found. Try adjusting your filters!</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-3 mt-6">Completed</h3>
                <div className="space-y-3">
                     {completedTasks.length > 0 ? (
                        completedTasks.map(task => <TaskItem key={task.id} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onToggleComplete={onToggleComplete} />)
                    ) : (
                         <div className="text-center py-8 px-4 bg-secondary-light dark:bg-secondary-dark rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">No matching completed tasks found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};