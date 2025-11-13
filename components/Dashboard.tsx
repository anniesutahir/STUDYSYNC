import React, { useMemo, useState, useEffect } from 'react';
import type { StudyTask, Exam } from '../types';
import { MOTIVATIONAL_QUOTES } from '../constants';
import { CheckCircleIcon, CycloneIcon, AcademicCapIcon, ClockIcon, QuoteIcon, CalendarDaysIcon } from './Icons';
import { toYYYYMMDD } from '../utils/achievementUtils';

interface DashboardProps {
  tasks: StudyTask[];
  exams: Exam[];
  completedTasks: number;
  totalStudyHours: number;
  studyStreak: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number, colorClass: string }> = ({ icon, label, value, colorClass }) => (
    <div className="bg-secondary-light dark:bg-secondary-dark p-4 rounded-lg shadow-md flex items-center animate-fade-in border-2 border-blue-500">
        <div className={`mr-4 p-2 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ tasks, exams, completedTasks, totalStudyHours, studyStreak }) => {
    const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    }, []);
    
    const { tasksCompletedToday, studyMinutesToday, totalTasksForToday } = useMemo(() => {
        const todayStr = toYYYYMMDD(new Date());
        
        const tasksForToday = tasks.filter(t => t.date === todayStr);
        const completedForToday = tasksForToday.filter(t => t.completed);

        const allCompletedOnThisDay = tasks.filter(t => t.completed && t.completedAt && toYYYYMMDD(new Date(t.completedAt)) === todayStr);

        return {
            tasksCompletedToday: completedForToday.length,
            studyMinutesToday: allCompletedOnThisDay.reduce((sum, task) => sum + Number(task.duration || 0), 0),
            totalTasksForToday: tasksForToday.length
        };
    }, [tasks]);
    
    const daysUntil = (dateStr: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const examDate = new Date(dateStr.replace(/-/g, '/'));
      examDate.setHours(0, 0, 0, 0);
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const upcomingExams = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return exams
            .filter(exam => new Date(exam.date.replace(/-/g, '/')) >= today)
            .sort((a, b) => new Date(a.date.replace(/-/g, '/')).getTime() - new Date(b.date.replace(/-/g, '/')).getTime())
            .slice(0, 3);
    }, [exams]);


    return (
        <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Welcome back🎯</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<ClockIcon className="w-6 h-6 text-white"/>} label="Hours Studied" value={totalStudyHours.toFixed(1)} colorClass="bg-teal-500" />
                <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-white"/>} label="Tasks Done" value={completedTasks} colorClass="bg-emerald-500" />
                <StatCard icon={<CycloneIcon className="w-6 h-6 text-white"/>} label="Study Streak" value={`${studyStreak} day(s)`} colorClass="bg-amber-500"/>
                <StatCard icon={<AcademicCapIcon className="w-6 h-6 text-white"/>} label="Total Tasks" value={tasks.length} colorClass="bg-violet-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="p-3 md:p-6 rounded-lg bg-secondary-light dark:bg-secondary-dark shadow-md border-2 border-blue-500">
                    <h3 className="font-bold text-lg mb-4">Today's Progress</h3>
                    <div className="space-y-5">
                        <div>
                            <div className="flex flex-wrap justify-between items-center mb-1 font-medium">
                                <span className="text-sm">Tasks Completed</span>
                                <span className="text-sm">{tasksCompletedToday} / {totalTasksForToday}</span>
                            </div>
                            <div className="w-full bg-primary-light dark:bg-primary-dark rounded-full h-2.5">
                                <div className="bg-[var(--theme-accent)] h-2.5 rounded-full transition-all duration-500" style={{ width: `${totalTasksForToday > 0 ? (tasksCompletedToday / totalTasksForToday) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Study Time Today</p>
                            <p className="text-2xl font-bold">{Math.floor(studyMinutesToday / 60)}h {studyMinutesToday % 60}m</p>
                        </div>
                    </div>
                </div>
                <div className="p-3 md:p-6 rounded-lg bg-teal-100 dark:bg-blue-900/50 shadow-md flex flex-col justify-center relative overflow-hidden border-2 border-blue-500">
                    <QuoteIcon className="absolute -top-2 -left-2 w-16 h-16 text-teal-200 dark:text-blue-800 opacity-75" />
                    <div className="relative z-10 text-center">
                        <h3 className="font-bold text-lg mb-2 text-teal-800 dark:text-blue-200">Quote of the Day</h3>
                        <p className="italic text-teal-700 dark:text-blue-300">"{quote.quote}"</p>
                        <p className="mt-2 text-sm font-semibold text-teal-800 dark:text-blue-200">- {quote.author}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 rounded-lg bg-secondary-light dark:bg-secondary-dark shadow-md border-2 border-blue-500">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  Upcoming Exams
                </h3>
                {upcomingExams.length > 0 ? (
                    <div className="space-y-3">
                        {upcomingExams.map(exam => {
                            const daysLeft = daysUntil(exam.date);
                            let countdownText = `${daysLeft} days left`;
                            if (daysLeft === 0) countdownText = "Today!";
                            if (daysLeft === 1) countdownText = "Tomorrow!";
                            if (daysLeft < 0) countdownText = "Past";
                            
                            return (
                                <div key={exam.id} className="flex justify-between items-center p-2 rounded-md bg-primary-light dark:bg-primary-dark">
                                    <div>
                                        <p className="font-semibold">{exam.subject}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(exam.date.replace(/-/g, '/')).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} at {exam.time}</p>
                                    </div>
                                    <span className={`font-bold text-sm px-2 py-1 rounded-full ${daysLeft <= 7 ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-700'}`}>{countdownText}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming exams scheduled. Time to relax (or get planning)!</p>
                )}
            </div>
        </div>
    );
};