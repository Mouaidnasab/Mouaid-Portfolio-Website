import React, { useState, useEffect } from 'react';

interface ThemeTransitionProps {
  theme: 'default' | 'hobbies';
  animationOrigin: { x: number; y: number };
  onAnimationEnd: () => void;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({ theme, animationOrigin, onAnimationEnd }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount to allow for initial styles to be applied.
    const animationFrameId = requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const themeClass = theme === 'hobbies' ? 'theme-hobbies' : '';

  const clipPathValue = isAnimating
    ? `circle(150% at ${animationOrigin.x}px ${animationOrigin.y}px)`
    : `circle(0% at ${animationOrigin.x}px ${animationOrigin.y}px)`;

  return (
    <div
      className={`fixed inset-0 z-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] animate-gradient-bg ${themeClass}`}
      style={{
        clipPath: clipPathValue,
        transition: 'clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onTransitionEnd={onAnimationEnd}
    />
  );
};

export default ThemeTransition;