import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface LightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setPortalRoot(document.getElementById('portal-root'));
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match duration of closing animation
  };

  const content = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Image container */}
      <div className={`relative w-full max-w-5xl max-h-full transition-transform transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <img
          src={imageUrl}
          alt="Enlarged project view"
          className="w-full h-auto object-contain max-h-[90vh] rounded-lg shadow-2xl"
        />
      </div>

       {/* Close Button */}
       <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        aria-label="Close image viewer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  if (!portalRoot) return null;

  return ReactDOM.createPortal(content, portalRoot);
};

export default Lightbox;
