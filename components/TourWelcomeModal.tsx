import React, { useEffect, useState } from 'react';

interface TourWelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

const TourWelcomeModal: React.FC<TourWelcomeModalProps> = ({ onStart, onSkip }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-welcome-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className={`relative w-full max-w-md bg-neutral-dark/80 backdrop-blur-xl border border-glass-stroke rounded-2xl shadow-2xl p-8 text-center transition-transform duration-300 transform ${isMounted ? 'scale-100' : 'scale-95'}`}>
        <h2 id="tour-welcome-title" className="text-2xl font-bold text-white mb-3">Welcome to My Portfolio!</h2>
        <p className="text-white/70 mb-8">
          Would you like a quick tour to see how everything works?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full px-8 py-3 rounded-xl font-semibold text-white bg-accent hover:bg-accent/80 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Tour
          </button>
          <button
            onClick={onSkip}
            className="w-full px-8 py-3 rounded-xl font-semibold text-white/90 bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            No, thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourWelcomeModal;