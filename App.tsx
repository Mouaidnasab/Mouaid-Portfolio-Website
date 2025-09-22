import React, { useState, useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import ThemeTransition from './components/ThemeTransition';
import AboutIntroSection from './components/AboutIntroSection';
import AboutTimelineSection from './components/AboutTimelineSection';
import AboutSkillsSection from './components/AboutSkillsSection';
import AboutCurrentSection from './components/AboutCurrentSection';
import ProjectsIntroSection from './components/ProjectsIntroSection';
import ScrollIndicator from './components/ScrollIndicator';
import DownloadCVButton from './components/DownloadCVButton';

interface TransitionState {
  isTransitioning: boolean;
  nextTheme: 'default' | 'hobbies';
  origin: { x: number; y: number };
}

const SECTIONS = [
  { id: 'hero', name: 'Home' },
  { id: 'about-intro', name: 'About' },
  { id: 'about-timeline', name: 'Timeline' },
  { id: 'about-skills', name: 'Skills' },
  { id: 'about-current', name: 'Current Focus' },
  { id: 'projects-intro', name: 'Projects' },
  { id: 'projects', name: 'Portfolio' },
  { id: 'contact', name: 'Contact' },
];

const App: React.FC = () => {
  const [theme, setThemeState] = useState<'default' | 'hobbies'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [isBgTransitioning, setIsBgTransitioning] = useState(false);
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    nextTheme: 'default',
    origin: { x: 0, y: 0 },
  });
  
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isIndicatorHovered, setIsIndicatorHovered] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const mainContainerRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement | null>());

  const projectsSectionRef = useRef<HTMLElement>(null);
  
  const [projectToHighlight, setProjectToHighlight] = useState<number | null>(null);

  // Scroll activity listener for scroll indicator visibility
  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };
    mainContainer?.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      mainContainer?.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // IntersectionObserver for tracking active section for scroll indicator
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: mainContainerRef.current,
        threshold: 0.5,
      }
    );
    const refs = sectionRefs.current;
    refs.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => {
      refs.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);
  
  useEffect(() => {
    const isProjectsSectionActive = ['projects-intro', 'projects'].includes(activeSection);
    if (!isProjectsSectionActive) {
      if (selectedCategory !== 'All Projects') {
        setSelectedCategory('All Projects');
      }
      if (theme !== 'default') {
        setThemeState('default');
      }
    }
  }, [activeSection, selectedCategory, theme]);


  const handleSetTheme = (newTheme: 'default' | 'hobbies', event: React.MouseEvent) => {
    if (newTheme === theme) return;

    // Apply new theme immediately to start content color transitions
    setThemeState(newTheme);
    setIsBgTransitioning(true); // Temporarily hide main background

    setTransitionState({
      isTransitioning: true,
      nextTheme: newTheme,
      origin: { x: event.clientX, y: event.clientY },
    });
  };

  const handleAnimationEnd = () => {
    setTransitionState({ ...transitionState, isTransitioning: false });
    setIsBgTransitioning(false); // Restore main background
  };
  
  const handleScrollTo = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    // The main container is the scrolling element
    if (sectionElement && mainContainerRef.current) {
        mainContainerRef.current.scrollTo({
            top: sectionElement.offsetTop,
            behavior: 'smooth',
        });
    }
  };

  const handleCategorySelect = (category: string, event: React.MouseEvent) => {
    setSelectedCategory(category);
    const newTheme = category === 'Hobbies' ? 'hobbies' : 'default';
    if (newTheme !== theme) {
      handleSetTheme(newTheme, event);
    }
  };

  const handleSelectProject = (projectId: number) => {
    handleScrollTo('projects');
    // A short delay allows the scroll to begin before the state update,
    // which can feel smoother to the user.
    setTimeout(() => {
      setProjectToHighlight(projectId);
    }, 300);
  };


  const backgroundClasses = isBgTransitioning
    ? 'bg-transparent'
    : 'bg-gradient-to-r from-primary via-secondary to-primary';
    
  const isAboutSectionVisible = ['about-intro', 'about-timeline', 'about-skills', 'about-current'].includes(activeSection);

  return (
    <div className={`h-screen overflow-hidden bg-[length:400%_400%] animate-gradient-bg text-white/90 font-sans relative transition-colors duration-500 ${theme === 'hobbies' ? 'theme-hobbies' : ''} ${backgroundClasses}`}>
      <DownloadCVButton isVisible={isAboutSectionVisible} />
      <ScrollIndicator
        sections={SECTIONS}
        activeSection={activeSection}
        isVisible={isScrolling || isIndicatorHovered}
        onHoverChange={setIsIndicatorHovered}
        onScrollTo={handleScrollTo}
      />
      <div className="absolute inset-0 bg-grid-accent/10"></div>
      <main ref={mainContainerRef} className="relative z-10 h-full overflow-y-auto snap-y snap-mandatory">
        <div id="hero" ref={(el) => { sectionRefs.current.set('hero', el); }}><HeroSection onScrollTo={handleScrollTo} /></div>
        <div id="about-intro" ref={(el) => { sectionRefs.current.set('about-intro', el); }}><AboutIntroSection /></div>
        <div id="about-timeline" ref={(el) => { sectionRefs.current.set('about-timeline', el); }}><AboutTimelineSection /></div>
        <div id="about-skills" ref={(el) => { sectionRefs.current.set('about-skills', el); }}><AboutSkillsSection /></div>
        <div id="about-current" ref={(el) => { sectionRefs.current.set('about-current', el); }}><AboutCurrentSection onSelectProject={handleSelectProject} /></div>
        <div id="projects-intro" ref={(el) => { sectionRefs.current.set('projects-intro', el); }}><ProjectsIntroSection onScrollTo={handleScrollTo} /></div>
        <div id="projects" ref={(el) => { sectionRefs.current.set('projects', el); }}>
          <ProjectsSection
            ref={projectsSectionRef}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            projectToHighlight={projectToHighlight}
            onHighlightComplete={() => setProjectToHighlight(null)}
          />
        </div>
        <div id="contact" ref={(el) => { sectionRefs.current.set('contact', el); }}><ContactSection /></div>
      </main>
      {transitionState.isTransitioning && (
        <ThemeTransition
          theme={transitionState.nextTheme}
          animationOrigin={transitionState.origin}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
    </div>
  );
};

export default App;
