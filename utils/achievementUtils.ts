import type { StudyTask, Achievement } from '../types';

export const toYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'dateUnlocked'>[] = [
    { id: 'first_task', name: 'Getting Started', description: 'Complete your first study task.' },
    { id: 'ten_tasks', name: 'Study Novice', description: 'Complete 10 study tasks.' },
    { id: 'fifty_tasks', name: 'Study Adept', description: 'Complete 50 study tasks.' },
    { id: 'five_streak', name: 'On a Roll', description: 'Maintain a 5-day study streak.' },
    { id: 'ten_hours', name: 'Time Well Spent', description: 'Log 10 hours of study time.' },
    { id: 'early_bird', name: 'Early Bird', description: 'Complete a task before 8 AM.' },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete a task after 10 PM.' },
    { id: 'subject_master', name: 'Subject Specialist', description: 'Complete 10 tasks in a single subject.' },
];


export function checkAchievements(tasks: StudyTask[], currentAchievements: Achievement[]): Achievement[] {
    const completedTasks = tasks.filter(t => t.completed);
    const updatedAchievements = JSON.parse(JSON.stringify(currentAchievements));

    const findAndUnlock = (id: string) => {
        const achievement = updatedAchievements.find((a: Achievement) => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.dateUnlocked = new Date().toISOString();
        }
    };
    
    // First task
    if (completedTasks.length >= 1) {
        findAndUnlock('first_task');
    }
    // 10 tasks
    if (completedTasks.length >= 10) {
        findAndUnlock('ten_tasks');
    }
    // 50 tasks
    if (completedTasks.length >= 50) {
        findAndUnlock('fifty_tasks');
    }
    
    // Total study hours
    const totalMinutes = completedTasks.reduce((sum, task) => sum + task.duration, 0);
    if (totalMinutes >= 10 * 60) {
        findAndUnlock('ten_hours');
    }

    // Streak
    const completedDates = [...new Set(completedTasks
        .filter(t => t.completedAt)
        .map(t => new Date(t.completedAt!).setHours(0,0,0,0))
    )].sort((a,b) => b - a);
    
    if (completedDates.length > 0) {
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
        if (streak >= 5) {
            findAndUnlock('five_streak');
        }
    }

    // Early bird / Night owl
    if (completedTasks.some(t => t.completedAt && new Date(t.completedAt).getHours() < 8)) {
        findAndUnlock('early_bird');
    }
    if (completedTasks.some(t => t.completedAt && new Date(t.completedAt).getHours() >= 22)) {
        findAndUnlock('night_owl');
    }
    
    // Subject master
    const subjectCounts = completedTasks.reduce((acc, task) => {
        acc[task.subject] = (acc[task.subject] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (Object.values(subjectCounts).some(count => count >= 10)) {
        findAndUnlock('subject_master');
    }


    return updatedAchievements;
}