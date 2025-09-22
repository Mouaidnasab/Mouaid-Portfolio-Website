import React from 'react';
import ScrollDownIndicator from './ScrollDownIndicator';

interface ProjectsIntroSectionProps {
  onScrollTo: (sectionId: string) => void;
}

const ProjectsIntroSection: React.FC<ProjectsIntroSectionProps> = ({ onScrollTo }) => {
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

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full flex flex-col items-center justify-center relative snap-start">
      <div className={`z-10 text-center px-4 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
          My Projects
        </h2>
        <p className="text-xl md:text-2xl text-white/80 font-light">
          A collection of my work across different technologies.
        </p>
      </div>
      <ScrollDownIndicator onClick={() => onScrollTo('projects')} />
    </section>
  );
};

export default ProjectsIntroSection;