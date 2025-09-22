import React from 'react';
import { FiDownload } from 'react-icons/fi';

interface DownloadCVButtonProps {
  isVisible: boolean;
}

const DownloadCVButton: React.FC<DownloadCVButtonProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ease-out hidden md:block ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <a
        href="/Mouaid_Nasab_CV.pdf" // Assuming CV is in the public folder
        download="Mouaid_Nasab_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 rounded-xl border border-glass-stroke bg-glass-overlay px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-lg transition-colors hover:bg-white/20 hover:text-white"
      >
        <FiDownload className="h-5 w-5" />
        <span>Download CV</span>
      </a>
    </div>
  );
};

export default DownloadCVButton;