import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface ScrollDownIndicatorProps {
  onClick: () => void;
}

const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-10 left-0 right-0 mx-auto w-max z-20 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors animate-bounce"
      aria-label="Scroll to next section"
    >
      <span className="text-sm font-medium">Scroll Down</span>
      <FiChevronDown className="w-6 h-6" />
    </button>
  );
};

export default ScrollDownIndicator;