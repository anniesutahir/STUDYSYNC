import React, { useMemo, useState } from 'react';
import type { Exam } from '../types';
import { PencilIcon, TrashIcon, PlusIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { toYYYYMMDD } from '../utils/achievementUtils';

interface ExamScheduleProps {
  exams: Exam[];
  onAddExam: () => void;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

interface ExamItemProps {
  exam: Exam;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
}

const ExamItem: React.FC<ExamItemProps> = ({ exam, onEditExam, onDeleteExam }) => {
    return (
        <div 
            className="bg-secondary-light dark:bg-secondary-dark p-4 rounded-lg shadow-md flex items-center justify-between border-l-4"
            style={{ borderLeftColor: exam.color }}
        >
            <div className="overflow-hidden">
                <p className="font-bold truncate">{exam.subject}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2 mt-1 flex-wrap">
                    <span>{new Date(exam.date.replace(/-/g, '/')).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>|</span>
                    <span>{exam.time}</span>
                    {exam.location && (
                        <>
                            <span>|</span>
                            <span>{exam.location}</span>
                        </>
                    )}
                </div>
                 {exam.notes && <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{exam.notes}</p>}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <button onClick={() => onEditExam(exam)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={() => onDeleteExam(exam.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
            </div>
        </div>
    );
}

export const ExamSchedule: React.FC<ExamScheduleProps> = ({ exams, onAddExam, onEditExam, onDeleteExam, currentDate, setCurrentDate }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const examsByDate = useMemo(() => {
        return exams.reduce((acc, exam) => {
            const date = exam.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(exam);
            return acc;
        }, {} as Record<string, Exam[]>);
    }, [exams]);

    const selectedDateExams = useMemo(() => {
        const dateString = toYYYYMMDD(selectedDate);
        return examsByDate[dateString] || [];
    }, [selectedDate, examsByDate]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold">Exam Schedule</h2>
                <button onClick={onAddExam} className="flex items-center px-4 py-2 bg-[var(--theme-accent)] text-black rounded-lg shadow-md hover:opacity-90 transition-opacity">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Add Exam</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                            const dateString = toYYYYMMDD(date);
                            const hasExams = examsByDate[dateString]?.length > 0;
                            const isSelected = selectedDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];

                            return (
                                <div 
                                    key={dayNumber} 
                                    onClick={() => setSelectedDate(date)}
                                    className="h-16 pt-1 border-t border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-primary-light dark:hover:bg-primary-dark transition-colors flex flex-col items-center"
                                >
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-sm ${isSelected ? 'bg-[var(--theme-accent)] text-white' : ''}`}>
                                        {dayNumber}
                                    </div>
                                    {hasExams && <div className="w-4/5 h-1 bg-purple-500 rounded-full mt-1"></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                     <h3 className="text-xl font-semibold">Exams for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                     {selectedDateExams.length > 0 ? (
                        selectedDateExams.map(exam => <ExamItem key={exam.id} exam={exam} onEditExam={onEditExam} onDeleteExam={onDeleteExam} />)
                     ) : (
                        <div className="text-center py-16 px-4 bg-secondary-light dark:bg-secondary-dark rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 h-full flex flex-col justify-center">
                           <CalendarDaysIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
                           <p className="mt-4 font-semibold text-lg text-gray-600 dark:text-gray-300">No exams on this day.</p>
                           <p className="text-gray-500 dark:text-gray-400 mt-1">Select another day to view exams.</p>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};