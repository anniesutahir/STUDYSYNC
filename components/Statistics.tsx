import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUpIcon, BookOpenIcon, ClockIcon, CycloneIcon } from './Icons';
import type { StudyTask } from '../types';

interface StatisticsProps {
  studySessions: StudyTask[];
  subjects: { name: string; color: string }[];
  userStats: { totalHoursStudied: number; currentStreak: number };
  theme: 'dark' | 'light';
}

export const Statistics: React.FC<StatisticsProps> = ({ studySessions, subjects, userStats, theme }) => {
  const subjectData = subjects.map(subject => {
    const sessions = studySessions.filter(s => s.subject === subject.name);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    return {
      name: subject.name,
      hours: Math.round(totalTime / 60 * 10) / 10,
      sessions: sessions.length,
      color: subject.color
    };
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = studySessions.filter(s => s.date === dateStr);
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Math.round(totalMinutes / 60 * 10) / 10,
      sessions: daySessions.length
    };
  });

  const COLORS = ['#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const statCards = [
      { icon: ClockIcon, label: 'Total Hours', value: Math.floor(userStats.totalHoursStudied), color: 'teal' },
      { icon: BookOpenIcon, label: 'Study Sessions', value: studySessions.length, color: 'emerald' },
      { icon: TrendingUpIcon, label: 'Avg. Session', value: `${Math.round(userStats.totalHoursStudied * 60 / studySessions.length) || 0}m`, color: 'amber' },
      { icon: CycloneIcon, label: 'Best Streak', value: `${userStats.currentStreak} days`, color: 'violet' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">
        Statistics & Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl border-2 border-blue-500 bg-secondary-light dark:bg-secondary-dark"
            >
              <Icon className={`w-8 h-8 text-${stat.color}-500 mb-3`} />
              <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-text-light dark:text-text-dark">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-xl border-2 border-blue-500 bg-secondary-light dark:bg-secondary-dark"
        >
          <h3 className="text-xl font-bold mb-6 text-text-light dark:text-text-dark">
            Study Time by Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 rounded-xl border-2 border-blue-500 bg-secondary-light dark:bg-secondary-dark"
        >
          <h3 className="text-xl font-bold mb-6 text-text-light dark:text-text-dark">
            Subject Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="hours"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 rounded-xl border-2 border-blue-500 bg-secondary-light dark:bg-secondary-dark"
      >
        <h3 className="text-xl font-bold mb-6 text-text-light dark:text-text-dark">
          Weekly Study Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="day" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="hours" stroke="#14b8a6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};