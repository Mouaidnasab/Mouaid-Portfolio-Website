import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiX } from 'react-icons/fi';

interface MobileWarningModalProps {
  onClose: () => void;
}

const MobileWarningModal: React.FC<MobileWarningModalProps> = ({ onClose }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setPortalRoot(document.getElementById('portal-root'));
    const timer = setTimeout(() => setIsMounted(true), 100); // Delay to trigger animation
    return () => clearTimeout(timer);
  }, []);

  // Handle close with exit animation
  const handleClose = () => {
    setIsMounted(false);
    setTimeout(onClose, 300); // Match animation duration
  };

  const content = (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-transform duration-300 ease-out ${
        isMounted ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="alert"
    >
      <div className="w-full max-w-md bg-neutral-dark/80 backdrop-blur-xl border border-glass-stroke rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex-grow">
          <h2 className="font-bold text-white text-base">Optimal Viewing Experience</h2>
          <p className="text-sm text-white/70">
            For the best experience, please view this on a desktop or tablet.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss message"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  if (!portalRoot) return null;

  return ReactDOM.createPortal(content, portalRoot);
};

export default MobileWarningModal;
