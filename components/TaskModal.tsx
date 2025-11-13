import React, { useState, useEffect } from 'react';
import type { StudyTask } from '../types';
import { SUBJECT_COLORS } from '../constants';
import { XMarkIcon } from './Icons';

interface TaskModalProps {
  task: StudyTask | null;
  onClose: () => void;
  onSave: (task: Partial<StudyTask>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<StudyTask>>({
    title: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    priority: 'Medium',
    notes: '',
    color: SUBJECT_COLORS[0],
    completed: false
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, duration: parseInt(e.target.value, 10) || 0 }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-secondary-light dark:bg-secondary-dark rounded-lg shadow-xl p-6 w-full max-w-md m-4 animate-pop border-2 border-blue-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium">Duration (minutes)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleDurationChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50" />
            </div>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium">Color</label>
            <div className="mt-2 flex flex-wrap gap-2">
                {SUBJECT_COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setFormData(p => ({...p, color}))} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${formData.color === color ? 'ring-2 ring-offset-2 ring-[var(--theme-accent)] dark:ring-offset-secondary-dark' : ''}`} style={{backgroundColor: color}}></button>
                ))}
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium">Notes & Reflections</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-primary-light dark:bg-primary-dark shadow-sm focus:border-[var(--theme-accent)] focus:ring focus:ring-[var(--theme-accent)] focus:ring-opacity-50" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[var(--theme-accent)] hover:opacity-90">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};