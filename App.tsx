





import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';
import type { StudyTask, Theme, View, Achievement, Exam } from './types';
import { THEMES, SUBJECT_COLORS } from './constants';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { TaskModal } from './components/TaskModal';
import { ExamModal } from './components/ExamModal';
import { ExamSchedule } from './components/ExamSchedule';
import { Timer } from './components/Timer';
import { AchievementsPage } from './components/AchievementsPage';
import { AchievementNotification } from './components/AchievementNotification';
import { AchievementCelebration } from './components/AchievementCelebration';
import { Confetti } from './components/Confetti';
import { ALL_ACHIEVEMENTS, checkAchievements, toYYYYMMDD } from './utils/achievementUtils';
import { Statistics } from './components/Statistics';
import { MonthlyCalendarView } from './components/MonthlyCalendarView';
import { DayDetailModal } from './components/DayDetailModal';
import { getAITip } from './services/geminiService';
import { LightBulbIcon } from './components/Icons';
import { LoginPage } from './components/LoginPage';
import { auth, db, firebase } from './services/firebase';

const AppContent: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-light dark:bg-primary-dark flex justify-center items-center">
                <div className="text-xl font-bold">Loading StudySync...</div>
            </div>
        )
    }

    return user ? <StudySyncApp user={user} /> : <LoginPage />;
};


// FIX: The User type is not exported from 'firebase/compat/auth'. Use firebase.User instead.
const StudySyncApp: React.FC<{ user: firebase.User }> = ({ user }) => {
    // State management from Firestore
    const [theme, setThemeState] = useState<Theme>(THEMES[0]);
    const [tasks, setTasks] = useState<StudyTask[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    
    // UI State
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [isAchievementsPageVisible, setIsAchievementsPageVisible] = useState(false);
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
    const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [aiTip, setAiTip] = useState<string>('');
    const [isLoadingTip, setIsLoadingTip] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [examCalendarDate, setExamCalendarDate] = useState(new Date());

    const userDocRef = useMemo(() => db.collection('users').doc(user.uid), [user.uid]);
    const tasksCollectionRef = useMemo(() => userDocRef.collection('tasks'), [userDocRef]);
    const examsCollectionRef = useMemo(() => userDocRef.collection('exams'), [userDocRef]);

    // Fetch initial data from Firestore
    useEffect(() => {
        if (!user || !user.uid) return;
        setLoadingData(true);
        const unsubscribeTasks = tasksCollectionRef
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const fetchedTasks = snapshot.docs.map(doc => {
                     const data = doc.data();
                     return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                        completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : undefined,
                     } as StudyTask
                });
                setTasks(fetchedTasks);
            }, (error) => {
                console.error("Error fetching tasks:", error);
            });

        const unsubscribeExams = examsCollectionRef
            .orderBy('date', 'asc')
            .onSnapshot(snapshot => {
                const fetchedExams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
                setExams(fetchedExams);
            }, (error) => {
                console.error("Error fetching exams:", error);
            });

        const unsubscribeUser = userDocRef.onSnapshot(doc => {
            const userData = doc.data();
            if (userData) {
                setThemeState(userData.theme || THEMES[0]);
                const userAchievements = userData.achievements || ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
                setAchievements(userAchievements);
            } else {
                 setAchievements(ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
            }
            setLoadingData(false);
        }, (error) => {
            console.error("Error fetching user data:", error);
        });

        return () => {
            unsubscribeTasks();
            unsubscribeExams();
            unsubscribeUser();
        };
    }, [user, tasksCollectionRef, examsCollectionRef, userDocRef]);


    // Theme Handlers
    const setTheme = useCallback(async (newTheme: Theme) => {
        setThemeState(newTheme);
        await userDocRef.update({ theme: newTheme });
    }, [userDocRef]);

    useEffect(() => {
        if (theme.isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Search logic
    const searchedTasks = useMemo(() => {
        if (!searchQuery.trim()) {
            return tasks;
        }
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        return tasks.filter(task => 
            task.title.toLowerCase().includes(lowercasedQuery) ||
            task.subject.toLowerCase().includes(lowercasedQuery) ||
            (task.notes && task.notes.toLowerCase().includes(lowercasedQuery))
        );
    }, [tasks, searchQuery]);

    useEffect(() => {
        if (searchQuery.trim() && currentView !== 'tasks') {
            setCurrentView('tasks');
        }
    }, [searchQuery, currentView]);


    // Achievement checking
    useEffect(() => {
        if (!achievements.length || !tasks || loadingData) return;
    
        const originalAchievements = JSON.parse(JSON.stringify(achievements)); // Deep copy
        const updatedAchievements = checkAchievements(tasks, originalAchievements);
        
        const newlyUnlocked = updatedAchievements.filter(updatedAch => {
            const originalAch = achievements.find(oa => oa.id === updatedAch.id);
            return updatedAch.unlocked && (!originalAch || !originalAch.unlocked);
        });
    
        if (newlyUnlocked.length > 0) {
            userDocRef.update({ achievements: updatedAchievements });
            setNewlyUnlockedAchievement(newlyUnlocked[0]);
            setCelebratingAchievement(newlyUnlocked[0]);
        }
    }, [tasks, achievements, userDocRef, loadingData]);
    
    // Fetch AI Tip
    const fetchAITip = useCallback(async () => {
        setIsLoadingTip(true);
        try {
            const tip = await getAITip();
            setAiTip(tip);
        } catch (error) {
            console.error(error);
            setAiTip('Could not fetch a tip right now. Keep up the great work!');
        } finally {
            setIsLoadingTip(false);
        }
    }, []);
    
    useEffect(() => {
      if (currentView === 'dashboard') {
        fetchAITip();
      }
    }, [currentView, fetchAITip]);

    // Task Handlers
    const handleOpenTaskModal = (task: StudyTask | null = null) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = async (taskData: Partial<StudyTask>) => {
        if (editingTask) {
            await tasksCollectionRef.doc(editingTask.id).update(taskData);
        } else {
            const { id, ...dataToSave } = {
                id: `task-${Date.now()}`,
                title: 'New Task',
                subject: 'General',
                date: new Date().toISOString().split('T')[0],
                duration: 60,
                priority: 'Medium',
                notes: '',
                color: SUBJECT_COLORS[0],
                completed: false,
                ...taskData,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            await tasksCollectionRef.add(dataToSave);
        }
        setIsTaskModalOpen(false);
        setEditingTask(null);
    };

    const handleDeleteTask = async (taskId: string) => {
        await tasksCollectionRef.doc(taskId).delete();
    };

    const handleToggleComplete = async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        const newCompletedStatus = !task.completed;

        await tasksCollectionRef.doc(taskId).update({
            completed: newCompletedStatus,
            completedAt: newCompletedStatus ? firebase.firestore.FieldValue.serverTimestamp() : null
        });

        if (newCompletedStatus) {
            setShowConfetti(true);
        }
    };
    
    // Exam Handlers
    const handleOpenExamModal = (exam: Exam | null = null) => {
        setEditingExam(exam);
        setIsExamModalOpen(true);
    };

    const handleSaveExam = async (examData: Partial<Exam>) => {
        if (editingExam) {
            await examsCollectionRef.doc(editingExam.id).update(examData);
        } else {
             const { id, ...dataToSave } = {
                id: `exam-${Date.now()}`,
                subject: '',
                date: new Date().toISOString().split('T')[0],
                time: '09:00',
                location: '',
                notes: '',
                color: SUBJECT_COLORS[0],
                ...examData,
                userId: user.uid,
            };
            await examsCollectionRef.add(dataToSave);
        }
        setIsExamModalOpen(false);
        setEditingExam(null);
    };

    const handleDeleteExam = async (examId: string) => {
        await examsCollectionRef.doc(examId).delete();
    };

    // Derived state with useMemo for performance
    const completedTasksCount = useMemo(() => searchedTasks.filter(t => t.completed).length, [searchedTasks]);
    const totalStudyHours = useMemo(() => searchedTasks.filter(t => t.completed).reduce((sum: number, task) => sum + Number(task.duration || 0), 0) / 60, [searchedTasks]);
    const studyStreak = useMemo(() => {
        const completedDates = [...new Set(tasks
            .filter(t => t.completed && t.completedAt)
            .map(t => new Date(String(t.completedAt)).setHours(0,0,0,0))
        )].sort((a,b) => b - a);

        if (completedDates.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0,0,0,0);

        if (completedDates[0] === today.getTime() || completedDates[0] === yesterday.getTime()) {
            streak = 1;
            for (let i = 0; i < completedDates.length - 1; i++) {
                const currentDay = new Date(completedDates[i]);
                const nextDayInStreak = new Date(currentDay);
                nextDayInStreak.setDate(nextDayInStreak.getDate() - 1);
                
                if (completedDates[i+1] === nextDayInStreak.getTime()) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        return streak;
    }, [tasks]);
    const subjects = useMemo(() => {
        const uniqueSubjects = [...new Set(searchedTasks.map(t => t.subject))];
        return uniqueSubjects.map(name => ({
            name, 
            color: searchedTasks.find(t => t.subject === name)?.color || SUBJECT_COLORS[0]
        }));
    }, [searchedTasks]);

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard tasks={searchedTasks} exams={exams} completedTasks={completedTasksCount} totalStudyHours={totalStudyHours} studyStreak={studyStreak} />;
            case 'tasks':
                return <TaskList tasks={searchedTasks} onAddTask={() => handleOpenTaskModal()} onEditTask={handleOpenTaskModal} onDeleteTask={handleDeleteTask} onToggleComplete={handleToggleComplete} />;
            case 'calendar':
                return <CalendarView tasks={searchedTasks} />;
            case 'monthly':
                return <MonthlyCalendarView tasks={searchedTasks} onDayClick={(date) => setSelectedDate(date)} />;
            case 'exams':
                return <ExamSchedule exams={exams} onAddExam={() => handleOpenExamModal()} onEditExam={handleOpenExamModal} onDeleteExam={handleDeleteExam} currentDate={examCalendarDate} setCurrentDate={setExamCalendarDate} />;
            case 'statistics':
                return <Statistics studySessions={searchedTasks.filter(t=>t.completed)} subjects={subjects} userStats={{ totalHoursStudied: totalStudyHours, currentStreak: studyStreak }} theme={theme.isDark ? 'dark' : 'light'} />;
            default:
                return <Dashboard tasks={searchedTasks} exams={exams} completedTasks={completedTasksCount} totalStudyHours={totalStudyHours} studyStreak={studyStreak} />;
        }
    };
    
    const tasksForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        const dateStr = toYYYYMMDD(selectedDate);
        return searchedTasks.filter(t => t.date === dateStr);
    }, [selectedDate, searchedTasks]);

    const handleLogout = () => {
        auth.signOut();
    };
    
    if (loadingData) {
        return (
             <div className="min-h-screen bg-primary-light dark:bg-primary-dark flex justify-center items-center">
                <div className="text-xl font-bold">Loading your study space...</div>
            </div>
        )
    }

    return (
        <div 
            className={`min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark font-sans transition-colors`}
            style={{ '--theme-accent': theme.isDark ? '#3b82f6' : '#14b8a6' } as React.CSSProperties}
        >
            <Header 
              currentTheme={theme} 
              setTheme={setTheme} 
              onTimerClick={() => setIsTimerVisible(p => !p)} 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLogout={handleLogout}
            />
            
            <main className="pt-24 pb-24 md:pb-8 md:pl-28 px-4 md:px-8">
                {renderView()}
                
                <div className="mt-8 p-4 rounded-lg bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-500 flex items-start">
                    <LightBulbIcon className="w-6 h-6 mr-3 text-purple-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-purple-800 dark:text-purple-200">AI Study Tip</h4>
                        <p className="text-sm mt-1 text-purple-700 dark:text-purple-300">
                            {isLoadingTip ? 'Generating a fresh tip for you...' : aiTip}
                        </p>
                    </div>
                </div>

            </main>
            
            <Navbar currentView={currentView} setCurrentView={setCurrentView} onAchievementsClick={() => setIsAchievementsPageVisible(true)} />

            {isTimerVisible && <Timer onClose={() => setIsTimerVisible(false)} />}
            {isTaskModalOpen && <TaskModal task={editingTask} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} />}
            {isExamModalOpen && <ExamModal exam={editingExam} onClose={() => setIsExamModalOpen(false)} onSave={handleSaveExam} />}
            {selectedDate && <DayDetailModal date={selectedDate} tasks={tasksForSelectedDate} onClose={() => setSelectedDate(null)} onEditTask={handleOpenTaskModal} onToggleComplete={handleToggleComplete} />}
            {isAchievementsPageVisible && <AchievementsPage achievements={achievements} onClose={() => setIsAchievementsPageVisible(false)} />}
            {newlyUnlockedAchievement && <AchievementNotification achievement={newlyUnlockedAchievement} onClose={() => setNewlyUnlockedAchievement(null)} />}
            {celebratingAchievement && <AchievementCelebration achievement={celebratingAchievement} onComplete={() => setCelebratingAchievement(null)} />}
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
        </div>
    );
};


export default AppContent;