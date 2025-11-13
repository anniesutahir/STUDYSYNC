import React, { useEffect, useMemo } from 'react';

// Using subject colors for confetti to match the app's theme
const CONFETTI_COLORS = ['#EF9A9A', '#A5D6A7', '#90CAF9', '#FFF59D', '#CE93D8', '#F48FB1', '#FFAB91', '#80CBC4'];
const CONFETTI_COUNT = 150;
const DURATION = 5000; // 5 seconds

interface Particle {
  id: number;
  color: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  transform: string;
}

const ConfettiParticle: React.FC<{ particle: Particle }> = ({ particle }) => {
    // A mix of squares and rectangles for variety
    const dimensions = particle.id % 2 === 0 ? 'w-2 h-2' : 'w-2 h-4';
    
    return (
        <div
            className={`absolute rounded-sm animate-fall ${dimensions}`}
            style={{
              backgroundColor: particle.color,
              left: particle.left,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
              transform: particle.transform,
            }}
        />
    );
}

export const Confetti: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    
    const particles = useMemo(() => {
        return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
            id: i,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 3}s`, // 3s to 5s
            animationDelay: `${Math.random() * 1}s`, // Start falling within the first second
            transform: `rotate(${Math.random() * 360}deg)`,
        }));
    }, []);

    useEffect(() => {
        const timer = setTimeout(onComplete, DURATION);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100] overflow-hidden">
            {particles.map(p => <ConfettiParticle key={p.id} particle={p} />)}
        </div>
    );
};
