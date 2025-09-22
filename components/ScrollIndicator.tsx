import React from 'react';

interface ScrollIndicatorProps {
  sections: { id: string; name: string }[];
  activeSection: string;
  isVisible: boolean;
  onHoverChange: (isHovering: boolean) => void;
  onScrollTo: (sectionId: string) => void;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ sections, activeSection, isVisible, onHoverChange, onScrollTo }) => {
    const activeIndex = sections.findIndex(s => s.id === activeSection);
    const activeSectionData = sections[activeIndex];

    const blobTopPosition = activeIndex !== -1 ? `${activeIndex * 2 + 0.5}rem` : '0.5rem';

    const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
        e.preventDefault();
        onScrollTo(sectionId);
    };

    return (
        <div 
            className={`fixed right-0 md:right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16 pointer-events-none'}`}
            aria-hidden={!isVisible}
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
        >
            <div 
                className={`mr-3 px-3 py-1 bg-neutral-dark/80 backdrop-blur-md text-white text-sm rounded-md whitespace-nowrap shadow-md transition-all duration-300 ${activeSectionData ? 'opacity-100' : 'opacity-0'}`}
                aria-live="polite"
            >
                {activeSectionData?.name}
            </div>
            <div className="relative bg-black/25 backdrop-blur-xl p-2 rounded-full border border-glass-stroke shadow-2xl">
                <div 
                    className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-accent/40 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-accent/60"
                    style={{ top: blobTopPosition }}
                    aria-hidden="true"
                />
                <ul className="relative flex flex-col gap-4" role="navigation" aria-label="Page sections">
                    {sections.map(section => (
                        <li key={section.id} className="group w-4 h-4 flex items-center justify-center">
                            <a 
                                href={`#${section.id}`} 
                                onClick={(e) => handleSectionClick(e, section.id)}
                                aria-label={`Go to ${section.name} section`}
                                className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 transform cursor-pointer ${activeSection === section.id ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white'}`} 
                            />
                            <span 
                                className={`absolute right-full mr-4 px-3 py-1 bg-neutral-dark/80 backdrop-blur-md text-white text-sm rounded-md transition-all whitespace-nowrap pointer-events-none -translate-x-2 group-hover:translate-x-0 opacity-0 ${activeSection !== section.id ? 'group-hover:opacity-100' : ''}`}
                                role="tooltip"
                            >
                                {section.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ScrollIndicator;
