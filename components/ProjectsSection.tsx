import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Project, ProjectTag } from '../types';
import { PROJECTS, SIDEBAR_CATEGORIES } from '../constants';
import {
  FiClock, FiFolder, FiSearch, FiSmartphone, FiGrid, FiList, FiCloud,
  FiChevronLeft, FiChevronRight, FiFileText, FiArrowUp, FiArrowDown,
  FiCalendar, FiX, FiMinus, FiMaximize2, FiMinimize2, FiHeart, FiZap, FiHelpCircle, FiFilter
} from 'react-icons/fi';
import { FaTag } from 'react-icons/fa';
import ProjectDetail from './ProjectDetail';
import ProjectPreview from './ProjectPreview';
import Tour from './Tour';
import TourWelcomeModal from './TourWelcomeModal';

type ViewMode = 'grid' | 'list';
type SortKey = keyof Pick<Project, 'name' | 'category' | 'dateStarted'>;
type SortDirection = 'asc' | 'desc';

interface ProjectsSectionProps {
  setTheme: (theme: 'default' | 'hobbies', event: React.MouseEvent) => void;
  projectToHighlight?: number | null;
  onHighlightComplete?: () => void;
}

const TOUR_STEPS = [
    { selector: '[data-tour-id="sidebar-nav"]', title: 'Project Categories', content: 'Navigate between different project categories. You can view all projects, or focus on specific types like Web Apps or AI/ML.' },
    { selector: '[data-tour-id="sidebar-tags"]', title: 'Filter by Tags', content: 'Refine your search by selecting specific tags. You can combine multiple tags to narrow down the results.' },
    { selector: '[data-tour-id="sidebar-techs"]', title: 'Filter by Technology', content: 'Filter projects by the technologies used. This is great for seeing examples of my work with a particular framework or language.' },
    { selector: '[data-tour-id="hobbies-toggle"]', title: 'Hobbies Section', content: 'Click here to switch to a special view for my hobby projects. It even has its own color theme!' },
    { selector: '[data-tour-id="search-bar"]', title: 'Search Projects', content: 'Use the search bar to find projects by name or description.' },
    { selector: '[data-tour-id="view-switcher"]', title: 'Switch Views', content: 'Toggle between a visual grid view and a compact list view to browse projects.' },
    { selector: '[data-tour-id="project-grid"]', title: 'Project Grid', content: 'This is the main area where projects are displayed. Click on any project to see more details.' },
    { selector: '[data-tour-id="project-detail"]', title: 'Project Details', content: 'Detailed information about the selected project will appear here, including descriptions, image galleries, and links.' },
];

const SortableHeader: React.FC<{
    label: string;
    sortKey: SortKey;
    currentSortKey: SortKey;
    currentSortDirection: SortDirection;
    onSort: (key: SortKey) => void;
    className?: string;
    icon?: React.ReactNode;
}> = ({ label, sortKey, currentSortKey, currentSortDirection, onSort, className, icon }) => {
    const isActive = sortKey === currentSortKey;
    return (
        <button onClick={() => onSort(sortKey)} className={`flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors ${className}`}>
            {icon}
            <span>{label}</span>
            {isActive && (
                currentSortDirection === 'asc'
                    ? <FiArrowUp className="w-3.5 h-3.5" />
                    : <FiArrowDown className="w-3.5 h-3.5" />
            )}
        </button>
    );
};


const ProjectsSection = React.forwardRef<HTMLElement, ProjectsSectionProps>(({ setTheme, projectToHighlight, onHighlightComplete }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(PROJECTS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const [detailWidth, setDetailWidth] = useState(450);
  const isResizingDetail = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);


  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isTechsExpanded, setIsTechsExpanded] = useState(false);
  const [showMoreTagsButton, setShowMoreTagsButton] = useState(false);
  const [showMoreTechsButton, setShowMoreTechsButton] = useState(false);

  const tagsListRef = useRef<HTMLDivElement>(null);
  const techsListRef = useRef<HTMLDivElement>(null);

  // Tour State
  const [showTourWelcome, setShowTourWelcome] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Mobile State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Corresponds to md breakpoint
        setIsMobileFiltersOpen(false);
        setIsMobileDetailOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    if (window.innerWidth < 768) {
      setIsMobileDetailOpen(true);
    }
  };

  useEffect(() => {
    const tourSeen = localStorage.getItem('portfolio-tour-seen');
    if (!tourSeen && isVisible) {
      setShowTourWelcome(true);
    }
  }, [isVisible]);

  const handleStartTour = () => {
    localStorage.setItem('portfolio-tour-seen', 'true');
    setShowTourWelcome(false);
    setIsTourActive(true);
    setTourStepIndex(0);
  };

  const handleSkipTour = () => {
    localStorage.setItem('portfolio-tour-seen', 'true');
    setShowTourWelcome(false);
  };

  const handleFinishTour = () => {
    setIsTourActive(false);
  };

  const isHobbiesMode = selectedCategory === 'Hobbies';

  const handleCategorySelect = (category: string, event: React.MouseEvent) => {
    setSelectedCategory(category);
    if (category === 'Hobbies') {
      setTheme('hobbies', event);
    } else {
      setTheme('default', event);
    }
    if (window.innerWidth < 768) {
        setIsMobileFiltersOpen(false);
    }
  };

  const handleHobbiesToggle = (event: React.MouseEvent) => {
    if (isHobbiesMode) {
      handleCategorySelect('All Projects', event);
    } else {
      handleCategorySelect('Hobbies', event);
    }
  };

  const handleCloseOrMinimize = () => {
    if (ref && 'current' in ref && ref.current?.nextElementSibling) {
        ref.current.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMaximize = () => {
      setIsMaximized(prev => !prev);
  };

  useEffect(() => {
    const currentRef = (ref as React.RefObject<HTMLElement>)?.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  useEffect(() => {
    if (projectToHighlight && onHighlightComplete) {
      const projectToSelect = PROJECTS.find(p => p.id === projectToHighlight);
      if (projectToSelect) {
        // Reset filters to ensure the selected project is visible
        setSelectedCategory('All Projects');
        setSearchTerm('');
        setSelectedTags([]);
        setSelectedTechs([]);
        handleProjectSelect(projectToSelect);
      }
      onHighlightComplete(); // Reset the highlight trigger
    }
  }, [projectToHighlight, onHighlightComplete]);


  const { allTags, allTechs } = useMemo(() => {
    if (isHobbiesMode) {
      const hobbyProjects = PROJECTS.filter(p => p.tags.includes(ProjectTag.Hobby));
      const tags = [...new Set(hobbyProjects.flatMap(p => p.tags))];
      const techs = [...new Set(hobbyProjects.flatMap(p => p.technologies))];
      return { allTags: tags, allTechs: techs };
    } else {
      // Default mode
      const professionalProjects = PROJECTS.filter(p => !p.tags.includes(ProjectTag.Hobby));
      const tags = [...new Set(professionalProjects.flatMap(p => p.tags))];
      const techs = [...new Set(professionalProjects.flatMap(p => p.technologies))];
      return { allTags: tags, allTechs: techs };
    }
  }, [isHobbiesMode]);
  
  // Clear filters when category/mode changes
  useEffect(() => {
    setSelectedTags([]);
    setSelectedTechs([]);
  }, [selectedCategory]);

  const TWO_ROWS_HEIGHT_THRESHOLD_PX = 60;

  // Re-implement the "Show More" logic with scrollHeight and resize listener.
  useEffect(() => {
    const checkFiltersOverflow = () => {
        // Use scrollHeight to get the full height of the content, even if it's clipped
        if (tagsListRef.current) {
            setShowMoreTagsButton(tagsListRef.current.scrollHeight > TWO_ROWS_HEIGHT_THRESHOLD_PX);
        }
        if (techsListRef.current) {
            setShowMoreTechsButton(techsListRef.current.scrollHeight > TWO_ROWS_HEIGHT_THRESHOLD_PX);
        }
    };
    
    // Check after a short delay to allow for rendering, and on window resize.
    const timeoutId = setTimeout(checkFiltersOverflow, 50);
    window.addEventListener('resize', checkFiltersOverflow);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkFiltersOverflow);
    };
  }, [allTags, allTechs]); // Rerun when the list of tags/techs changes.


  const sortedAndFilteredProjects = useMemo(() => {
    const filtered = PROJECTS.filter(project => {
      const isHobbyProject = project.tags.includes(ProjectTag.Hobby);

      let categoryMatch;
      if (selectedCategory === 'Hobbies') {
        categoryMatch = isHobbyProject;
      } else if (selectedCategory === 'In Progress') {
        categoryMatch = !isHobbyProject && !project.dateEnded;
      } else if (selectedCategory === 'Personal') {
        categoryMatch = !isHobbyProject && project.tags.includes(ProjectTag.Personal);
      }
      else {
        const standardCategoryMatch = selectedCategory === 'All Projects' || project.category === SIDEBAR_CATEGORIES[selectedCategory as keyof typeof SIDEBAR_CATEGORIES];
        categoryMatch = !isHobbyProject && standardCategoryMatch;
      }
      
      const searchMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => project.tags.includes(tag));
      const techsMatch = selectedTechs.length === 0 || selectedTechs.every(tech => project.technologies.includes(tech));
      
      return categoryMatch && searchMatch && tagsMatch && techsMatch;
    });

    return [...filtered].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        let comparison = 0;
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [selectedCategory, searchTerm, sortKey, sortDirection, selectedTags, selectedTechs]);

  useEffect(() => {
    if (selectedProject && !sortedAndFilteredProjects.find(p => p.id === selectedProject.id)) {
        setSelectedProject(sortedAndFilteredProjects[0] || null);
    }
    else if (!selectedProject && sortedAndFilteredProjects.length > 0) {
        setSelectedProject(sortedAndFilteredProjects[0]);
    }
  }, [sortedAndFilteredProjects, selectedProject]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setSortDirection('asc');
    }
  };

  const handleTagToggle = (tag: ProjectTag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  
  const handleTechToggle = (tech: string) => {
    setSelectedTechs(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  };

  const handleGridMouseMove = (e: React.MouseEvent) => {
    setPreviewPosition({ x: e.clientX, y: e.clientY });
  };

  // Resizing logic
  const handleMouseMoveDetail = useCallback((e: MouseEvent) => {
      if (!isResizingDetail.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      const mainMinWidth = 400; // Minimum width for the project list
      const sidebarFixedWidth = 240; // Corresponds to w-60
      const maxDetailWidth = containerRect.width - sidebarFixedWidth - mainMinWidth;
      
      if (newWidth >= 320 && newWidth <= maxDetailWidth) { // Min/Max
          setDetailWidth(newWidth);
      }
  }, []);

  const handleMouseUpDetail = useCallback(() => {
      isResizingDetail.current = false;
      document.removeEventListener('mousemove', handleMouseMoveDetail);
      document.removeEventListener('mouseup', handleMouseUpDetail);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
  }, [handleMouseMoveDetail]);

  const handleMouseDownDetail = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      isResizingDetail.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMoveDetail);
      document.addEventListener('mouseup', handleMouseUpDetail);
  }, [handleMouseMoveDetail, handleMouseUpDetail]);

  useEffect(() => {
      return () => {
          document.removeEventListener('mousemove', handleMouseMoveDetail);
          document.removeEventListener('mouseup', handleMouseUpDetail);
      };
  }, [handleMouseMoveDetail, handleMouseUpDetail]);

  const sidebarProps = {
    selectedCategory, handleCategorySelect, isHobbiesMode, handleHobbiesToggle, allTags,
    selectedTags, handleTagToggle, isTagsExpanded, setIsTagsExpanded, tagsListRef, showMoreTagsButton,
    allTechs, selectedTechs, handleTechToggle, isTechsExpanded, setIsTechsExpanded, techsListRef, showMoreTechsButton,
  };

  return (
    <section ref={ref} className={`h-screen w-full flex items-center justify-center snap-start transition-all duration-300 ${isMaximized ? 'p-0' : 'p-0 md:p-8'}`}>
      <Tour
        steps={TOUR_STEPS}
        isActive={isTourActive}
        stepIndex={tourStepIndex}
        onNext={() => setTourStepIndex(i => i + 1)}
        onPrev={() => setTourStepIndex(i => i - 1)}
        onFinish={handleFinishTour}
      />
      <div ref={containerRef} className={`relative w-full h-full bg-neutral-dark/60 backdrop-blur-2xl border border-glass-stroke shadow-2xl flex flex-col overflow-hidden transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${isMaximized ? 'max-w-full max-h-full rounded-none' : 'max-h-full md:max-h-[95vh] rounded-none md:rounded-3xl'}`}>
        {/* Title Bar */}
        <header className="group/header flex-shrink-0 h-11 hidden md:grid grid-cols-3 items-center px-5 bg-zinc-800/50 border-b border-glass-stroke">
          <div className="flex items-center gap-2.5">
            <button onClick={handleCloseOrMinimize} className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-black/60" aria-label="Close window">
              <FiX className="w-2 h-2 opacity-0 group-hover/header:opacity-100 transition-opacity" strokeWidth={3} />
            </button>
            <button onClick={handleCloseOrMinimize} className="w-3.5 h-3.5 rounded-full bg-yellow-500 flex items-center justify-center text-black/60" aria-label="Minimize window">
              <FiMinus className="w-2 h-2 opacity-0 group-hover/header:opacity-100 transition-opacity" strokeWidth={3} />
            </button>
            <button onClick={handleMaximize} className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center text-black/60" aria-label="Maximize window">
              {isMaximized
                ? <FiMinimize2 className="w-2 h-2 opacity-0 group-hover/header:opacity-100 transition-opacity" strokeWidth={3} />
                : <FiMaximize2 className="w-2 h-2 opacity-0 group-hover/header:opacity-100 transition-opacity" strokeWidth={3} />
              }
            </button>
          </div>
          <div className="text-center text-base text-white/80 font-medium">
            My Projects
          </div>
          <div className="flex justify-end">
            <button onClick={handleStartTour} className="text-white/60 hover:text-white transition-colors" aria-label="Start guided tour">
              <FiHelpCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-60 flex-shrink-0 bg-black/20 p-3 overflow-y-auto hidden md:flex flex-col border-r border-glass-stroke">
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Project Grid and Toolbar */}
            <main className="flex-1 flex flex-col bg-zinc-900/50 overflow-hidden">
              {/* Toolbar */}
              <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-glass-stroke">
                <div className="flex items-center gap-2">
                   <button className="p-1.5 rounded-lg bg-zinc-700/50 text-gray-300 md:hidden" onClick={() => setIsMobileFiltersOpen(true)} aria-label="Open filters">
                        <FiFilter className="w-5 h-5" />
                   </button>
                  <div className="hidden md:flex items-center gap-3">
                    <button className="p-1.5 rounded-lg bg-zinc-700/50 text-gray-400" disabled><FiChevronLeft className="w-6 h-6" /></button>
                    <button className="p-1.5 rounded-lg bg-zinc-700/50 text-gray-400" disabled><FiChevronRight className="w-6 h-6" /></button>
                  </div>
                  <h2 className="text-xl font-semibold ml-2 text-white">{selectedCategory}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div data-tour-id="search-bar" className="relative">
                    <FiSearch className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-zinc-700/80 rounded-lg pl-10 pr-3 py-2 text-base w-48 focus:ring-2 focus:ring-accent focus:outline-none"
                    />
                  </div>
                  <div data-tour-id="view-switcher" className="flex items-center bg-zinc-700/80 p-1 rounded-lg">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-accent/80 text-white' : 'text-gray-300 hover:bg-white/10'}`}><FiGrid className="w-6 h-6"/></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-accent/80 text-white' : 'text-gray-300 hover:bg-white/10'}`}><FiList className="w-6 h-6"/></button>
                  </div>
                </div>
              </div>

              {/* File Content */}
              <div className="flex-1 overflow-y-auto">
                {sortedAndFilteredProjects.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                      <p className="text-white/50">No projects found.</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div
                    data-tour-id="project-grid"
                    className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
                    onMouseMove={handleGridMouseMove}
                  >
                    {sortedAndFilteredProjects.map(project => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        onMouseEnter={() => setHoveredProject(project)}
                        onMouseLeave={() => setHoveredProject(null)}
                        className={`group flex flex-col gap-3 text-center cursor-pointer rounded-xl transition-all duration-300 ${
                          selectedProject?.id === project.id ? 'transform scale-105' : ''
                        }`}
                      >
                        <div className={`aspect-square w-full bg-secondary rounded-xl overflow-hidden transition-all duration-300 ring-offset-zinc-900/50 ring-offset-4 ${selectedProject?.id === project.id ? 'ring-2 ring-accent' : 'hover:ring-2 ring-accent/50'}`}>
                            <img
                                src={project.imageUrls[0]}
                                alt={project.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-base text-white/90 break-words w-full">{project.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-base text-white/90">
                    <div className="sticky top-0 grid grid-cols-[minmax(0,_3fr)_minmax(0,_1fr)_minmax(0,_1fr)] gap-4 px-6 py-3 bg-zinc-900/70 backdrop-blur-sm border-b border-glass-stroke z-10">
                        <SortableHeader label="Name" sortKey="name" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} icon={<FiFolder className="w-5 h-5"/>} />
                        <SortableHeader label="Category" sortKey="category" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} icon={<FaTag className="w-5 h-5"/>}/>
                        <SortableHeader label="Date Started" sortKey="dateStarted" currentSortKey={sortKey} currentSortDirection={sortDirection} onSort={handleSort} icon={<FiCalendar className="w-5 h-5"/>}/>
                    </div>
                     <ul>
                        {sortedAndFilteredProjects.map(project => (
                            <li key={project.id}
                                onClick={() => handleProjectSelect(project)}
                                className={`grid grid-cols-[minmax(0,_3fr)_minmax(0,_1fr)_minmax(0,_1fr)] gap-4 px-6 py-3 border-b border-glass-stroke/50 cursor-pointer transition-colors ${selectedProject?.id === project.id ? 'bg-accent/30' : 'hover:bg-glass-overlay'}`}
                            >
                                <span className="truncate">{project.name}</span>
                                <span className="truncate">{project.category}</span>
                                <span className="truncate">{new Date(project.dateStarted).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              <footer className="flex-shrink-0 flex items-center justify-end px-4 py-1.5 border-t border-glass-stroke bg-zinc-900/50">
                <span className="text-sm text-white/50">
                  {sortedAndFilteredProjects.length} {sortedAndFilteredProjects.length === 1 ? 'item' : 'items'}
                </span>
              </footer>
            </main>
            
            <div
                className="w-2 flex-shrink-0 cursor-col-resize group hidden md:flex items-center"
                onMouseDown={handleMouseDownDetail}
                >
                <div className="w-px h-full bg-glass-stroke group-hover:bg-accent transition-colors" />
            </div>

            <div data-tour-id="project-detail" style={{ width: `${detailWidth}px` }} className="flex-shrink-0 flex-col md:flex hidden border-l border-glass-stroke">
                <ProjectDetail project={selectedProject} />
            </div>
          </div>
        </div>
        {showTourWelcome && <TourWelcomeModal onStart={handleStartTour} onSkip={handleSkipTour} />}
        
        {isMobileFiltersOpen && <MobileFiltersPane onClose={() => setIsMobileFiltersOpen(false)} {...sidebarProps} />}
        {isMobileDetailOpen && <MobileDetailPane project={selectedProject} onClose={() => setIsMobileDetailOpen(false)} />}
      </div>
      {viewMode === 'grid' && <ProjectPreview project={hoveredProject} position={previewPosition} />}
    </section>
  );
});

const SidebarContent: React.FC<any> = ({
  selectedCategory, handleCategorySelect, isHobbiesMode, handleHobbiesToggle, allTags,
  selectedTags, handleTagToggle, isTagsExpanded, setIsTagsExpanded, tagsListRef, showMoreTagsButton,
  allTechs, selectedTechs, handleTechToggle, isTechsExpanded, setIsTechsExpanded, techsListRef, showMoreTechsButton
}) => (
  <>
    <nav data-tour-id="sidebar-nav" className="flex flex-col gap-3">
      <div >
        <h3 className="px-3 text-sm text-gray-400 font-semibold mb-2">Favorites</h3>
          {Object.keys(SIDEBAR_CATEGORIES).map(category => (
            <button
            key={category}
            onClick={(e) => handleCategorySelect(category, e)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-base rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-accent/80 text-white'
                : 'text-gray-200 hover:bg-glass-overlay'
            }`}
          >
            {category === 'All Projects' && <FiFolder className="w-5 h-5" />}
            {category === 'In Progress' && <FiZap className="w-5 h-5" />}
            {category === 'Web Apps' && <FiCloud className="w-5 h-5" />}
            {category === 'Mobile Apps' && <FiSmartphone className="w-5 h-5" />}
            {category === 'AI/ML' && <FiClock className="w-5 h-5" />}
            {category === 'Personal' && <FiFileText className="w-5 h-5" />}
            <span>{category}</span>
          </button>
        ))}
      </div>
      <div className="border-t border-glass-stroke" />
      <div data-tour-id="sidebar-tags">
        <h3 className="px-3 text-sm text-gray-400 font-semibold mb-2">Tags</h3>
        <div
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{ maxHeight: showMoreTagsButton && !isTagsExpanded ? `60px` : `${tagsListRef.current?.scrollHeight}px` }}
        >
          <div ref={tagsListRef} className="flex flex-wrap gap-2 px-2 pb-1">
              {allTags.map((tag: ProjectTag) => (
                <button 
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${selectedTags.includes(tag) ? 'bg-accent text-white' : 'bg-zinc-700/80 text-gray-300 hover:bg-zinc-700'}`}
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
        {showMoreTagsButton && (
          <button
            onClick={() => setIsTagsExpanded((p: boolean) => !p)}
            className="text-accent text-sm font-medium mt-1 px-3 hover:underline w-full text-left"
          >
            {isTagsExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
      <div className="border-t border-glass-stroke" />
      <div data-tour-id="sidebar-techs">
        <h3 className="px-3 text-sm text-gray-400 font-semibold mb-2">Technologies</h3>
        <div
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{ maxHeight: showMoreTechsButton && !isTechsExpanded ? `60px` : `${techsListRef.current?.scrollHeight}px` }}
        >
          <div ref={techsListRef} className="flex flex-wrap gap-2 px-2 pb-1">
              {allTechs.map((tech: string) => (
                <button 
                  key={tech}
                  onClick={() => handleTechToggle(tech)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${selectedTechs.includes(tech) ? 'bg-accent text-white' : 'bg-zinc-700/80 text-gray-300 hover:bg-zinc-700'}`}
                >
                  {tech}
                </button>
              ))}
          </div>
        </div>
        {showMoreTechsButton && (
          <button
            onClick={() => setIsTechsExpanded((p: boolean) => !p)}
            className="text-accent text-sm font-medium mt-1 px-3 hover:underline w-full text-left"
          >
            {isTechsExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </nav>
    <div className="mt-auto pt-3 border-t border-glass-stroke">
        <button
        data-tour-id="hobbies-toggle"
        key="HobbiesToggle"
        onClick={handleHobbiesToggle}
        className={`w-full flex items-center gap-3 px-3 py-2 text-base rounded-lg transition-colors ${
            isHobbiesMode
            ? 'bg-accent/80 text-white'
            : 'text-gray-200 hover:bg-glass-overlay'
        }`}
        >
          {isHobbiesMode ? <FiFolder className="w-5 h-5" /> : <FiHeart className="w-5 h-5" />}
          <span>{isHobbiesMode ? 'All Projects' : 'Hobbies'}</span>
        </button>
    </div>
  </>
);

const MobileFiltersPane: React.FC<any> = ({ onClose, ...props }) => (
    <div className="md:hidden fixed inset-0 z-50 bg-neutral-dark flex flex-col animate-fade-in">
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-glass-stroke">
            <h2 className="text-xl font-semibold text-white">Filters</h2>
            <button onClick={onClose} className="px-4 py-2 text-base rounded-lg font-semibold text-white bg-accent hover:bg-accent/80">
                Done
            </button>
        </header>
        <div className="flex-1 overflow-y-auto p-3">
            <SidebarContent {...props} />
        </div>
    </div>
);

const MobileDetailPane: React.FC<{
    project: Project | null;
    onClose: () => void;
}> = ({ project, onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);
    const handleClose = () => { setIsMounted(false); setTimeout(onClose, 300); };
    return (
        <div className={`md:hidden fixed inset-0 z-[51] bg-neutral-dark flex flex-col transition-transform duration-300 ease-out ${isMounted ? 'translate-x-0' : 'translate-x-full'}`}>
             <header className="flex-shrink-0 h-14 flex items-center px-4 border-b border-glass-stroke">
                <button onClick={handleClose} className="flex items-center gap-2 text-base font-semibold text-white hover:text-accent">
                    <FiChevronLeft className="w-6 h-6" />
                    Projects
                </button>
            </header>
            <div className="flex-1 overflow-hidden">
                <ProjectDetail project={project} />
            </div>
        </div>
    );
};

export default ProjectsSection;