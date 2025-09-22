import React from 'react';
import ScrollDownIndicator from './ScrollDownIndicator';

interface HeroSectionProps {
  onScrollTo: (sectionId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollTo }) => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onScrollTo(sectionId);
  };

  return (
    <section ref={sectionRef} className="h-screen w-full flex flex-col items-center justify-center relative snap-start">
      <div className={`z-10 text-center px-4 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
          Mouaid Nasab
        </h1>
        <p className="text-xl md:text-2xl text-accent font-light">
          Software Engineer
        </p>
        <p className="mt-6 max-w-2xl mx-auto text-white/80">
          Crafting elegant solutions for complex problems. Welcome to my digital workspace.
        </p>
        <div className={`mt-10 flex items-center justify-center gap-4 transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 delay-500' : 'opacity-0'}`}>
            <a 
              href="#projects" 
              onClick={(e) => handleScrollClick(e, 'projects')}
              className="flex-1 sm:flex-none sm:w-48 text-center py-3 rounded-xl font-semibold text-white bg-accent hover:bg-accent/80 transition-all transform hover:scale-105 shadow-lg">
              View My Work
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScrollClick(e, 'contact')}
              className="flex-1 sm:flex-none sm:w-48 text-center py-3 rounded-xl font-semibold text-white/90 bg-white/10 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 backdrop-blur-sm">
              Contact Me
            </a>
        </div>
      </div>
      <ScrollDownIndicator onClick={() => onScrollTo('about-intro')} />
    </section>
  );
};

export default HeroSection;