import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroStatus } from '../types';
import { STUDY_DURATION, SHORT_BREAK_DURATION, LONG_BREAK_DURATION } from '../constants';
import { XMarkIcon } from './Icons';

interface TimerProps {
    onClose: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const Timer: React.FC<TimerProps> = ({ onClose }) => {
    const [status, setStatus] = useState<PomodoroStatus>(PomodoroStatus.STOPPED);
    const [timeLeft, setTimeLeft] = useState(STUDY_DURATION);
    const [pomodoroCount, setPomodoroCount] = useState(0);

    const intervalRef = useRef<number | null>(null);
    
    const getDuration = useCallback((currentStatus: PomodoroStatus) => {
        switch (currentStatus) {
            case PomodoroStatus.STUDY:
                return STUDY_DURATION;
            case PomodoroStatus.SHORT_BREAK:
                return SHORT_BREAK_DURATION;
            case PomodoroStatus.LONG_BREAK:
                return LONG_BREAK_DURATION;
            default:
                return STUDY_DURATION;
        }
    }, []);
    
    const startTimer = useCallback(() => {
        if (intervalRef.current !== null) return;

        setStatus(prev => prev === PomodoroStatus.PAUSED ? prev : PomodoroStatus.STUDY);
        intervalRef.current = window.setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
    }, []);
    
    const pauseTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setStatus(PomodoroStatus.PAUSED);
        }
    }, []);
    
    const resetTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setStatus(PomodoroStatus.STOPPED);
        setTimeLeft(STUDY_DURATION);
        setPomodoroCount(0);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;

            let nextStatus: PomodoroStatus;
            if (status === PomodoroStatus.STUDY) {
                const newCount = pomodoroCount + 1;
                setPomodoroCount(newCount);
                nextStatus = newCount % 4 === 0 ? PomodoroStatus.LONG_BREAK : PomodoroStatus.SHORT_BREAK;
            } else {
                nextStatus = PomodoroStatus.STUDY;
            }
            setStatus(nextStatus);
            setTimeLeft(getDuration(nextStatus));
            startTimer(); // auto start next phase
        }
    }, [timeLeft, pomodoroCount, getDuration, status, startTimer]);
    
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, []);

    const statusText = {
        [PomodoroStatus.STUDY]: "Time to Focus!",
        [PomodoroStatus.SHORT_BREAK]: "Take a Short Break!",
        [PomodoroStatus.LONG_BREAK]: "Take a Long Break!",
        [PomodoroStatus.PAUSED]: "Paused...",
        [PomodoroStatus.STOPPED]: "Ready to start?"
    };
    
    const timerBg = {
        [PomodoroStatus.STUDY]: "bg-red-500",
        [PomodoroStatus.SHORT_BREAK]: "bg-green-500",
        [PomodoroStatus.LONG_BREAK]: "bg-blue-500",
        [PomodoroStatus.PAUSED]: "bg-yellow-500",
        [PomodoroStatus.STOPPED]: "bg-gray-500"
    };

    return (
        <div className="fixed bottom-4 right-4 bg-secondary-light dark:bg-secondary-dark p-4 rounded-lg shadow-2xl w-80 animate-fade-in z-40 border-2 border-blue-500">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Focus Timer</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
            <div className={`text-white text-center p-4 rounded-lg mb-4 transition-colors ${timerBg[status]}`}>
                <p className="text-lg font-semibold">{statusText[status]}</p>
                <p className="text-5xl font-mono tracking-tighter">{formatTime(timeLeft)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={startTimer} disabled={status !== PomodoroStatus.STOPPED && status !== PomodoroStatus.PAUSED} className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">Start</button>
                <button onClick={pauseTimer} disabled={status === PomodoroStatus.STOPPED || status === PomodoroStatus.PAUSED} className="py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50">Pause</button>
                <button onClick={resetTimer} className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600">Reset</button>
            </div>
            <p className="text-center text-sm mt-3 text-gray-500 dark:text-gray-400">Pomodoros completed: {pomodoroCount}</p>
        </div>
    );
};