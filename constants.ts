import type { Theme, Quote } from './types';

export const THEMES: Theme[] = [
    { name: 'Light', isDark: false },
    { name: 'Dark', isDark: true },
];

export const MOTIVATIONAL_QUOTES: Quote[] = [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" },
    { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "Strive for progress, not perfection.", author: "Unknown" },
    { quote: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { quote: "A little progress each day adds up to big results.", author: "Satya Nani" },
    { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { quote: "What seems impossible today will one day become your warm-up.", author: "Unknown" },
    { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { quote: "Focus on your goal. Don’t look in any direction but ahead.", author: "Unknown" },
    { quote: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { quote: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "You are capable of more than you know.", author: "Unknown" },
    { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "If you get tired, learn to rest, not to quit.", author: "Banksy" },
    { quote: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
    { quote: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { quote: "Your positive action combined with positive thinking results in success.", author: "Shiv Khera" },
    { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" }
];

export const SUBJECT_COLORS: string[] = [
    '#EF9A9A', // red
    '#A5D6A7', // green
    '#90CAF9', // blue
    '#FFF59D', // yellow
    '#CE93D8', // purple
    '#F48FB1', // pink
    '#FFAB91', // orange
    '#80CBC4'  // teal
];

export const STUDY_DURATION = 25 * 60; // 25 minutes
export const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
export const LONG_BREAK_DURATION = 15 * 60; // 15 minutes