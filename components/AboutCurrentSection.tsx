import React from 'react';
import { ACTIVE_PROJECTS, CURRENTLY_LEARNING, CAREER_GOALS } from '../constants';
import { FiTrendingUp, FiBookOpen, FiAward, FiFileText, FiCode, FiExternalLink } from 'react-icons/fi';
import { LearningItem, ActiveProject, CareerGoal } from '../types';

interface AboutCurrentSectionProps {
  onSelectProject: (projectId: number) => void;
}

const getLearningIcon = (type: LearningItem['type']) => {
    switch (type) {
        case 'course': return <FiAward className="w-5 h-5 text-accent flex-shrink-0" />;
        case 'book': return <FiBookOpen className="w-5 h-5 text-accent flex-shrink-0" />;
        case 'article': return <FiFileText className="w-5 h-5 text-accent flex-shrink-0" />;
        default: return <FiBookOpen className="w-5 h-5 text-accent flex-shrink-0" />;
    }
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-accent/80 tracking-wider">PROGRESS</span>
            <span className="text-xs font-semibold text-white/80">{progress}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-1.5">
            <div
                className="bg-accent h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

const LearningCard: React.FC<{ item: LearningItem }> = ({ item }) => {
    const CardContent = () => (
        <div className="bg-secondary/40 p-5 rounded-xl border border-glass-stroke h-full flex flex-col gap-4 transition-transform duration-300 hover:scale-105 group">
            <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                    <h5 className="font-bold text-white text-base leading-tight">{item.name}</h5>
                    <p className="text-xs text-white/70">{item.source}</p>
                </div>
                {getLearningIcon(item.type)}
            </div>
            {item.description && <p className="text-sm text-white/70 mt-2">{item.description}</p>}
            <div className="mt-auto">
                <ProgressBar progress={item.progress} />
            </div>
            {item.url && <FiExternalLink className="absolute top-3 right-3 w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
    );

    if (item.url) {
        return (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative">
                <CardContent />
            </a>
        );
    }
    return <CardContent />;
};

const ProjectCard: React.FC<{ item: ActiveProject; onClick: () => void }> = ({ item, onClick }) => (
    <button onClick={onClick} className="bg-secondary/40 p-5 rounded-xl border border-glass-stroke h-full flex flex-col gap-4 transition-transform duration-300 hover:scale-105 w-full text-left">
         <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
                <h5 className="font-bold text-white text-base leading-tight">{item.name}</h5>
                <p className="text-xs text-white/70">{item.description}</p>
            </div>
            <FiCode className="w-5 h-5 text-accent flex-shrink-0" />
        </div>
        {item.status && <div className="text-xs font-semibold text-white/90 bg-accent/20 px-2 py-1 rounded-md self-start">{item.status}</div>}
        <div className="mt-auto">
            <ProgressBar progress={item.progress} />
        </div>
    </button>
);

const CareerCard: React.FC<{ item: CareerGoal }> = ({ item }) => (
    <div className="bg-secondary/40 p-4 rounded-xl border border-glass-stroke flex items-center gap-4 transition-transform duration-300 hover:scale-105">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20">
             <item.icon className="w-5 h-5 text-accent" />
        </div>
        <div>
            <h5 className="font-semibold text-white text-base leading-tight">{item.title}</h5>
            <p className="text-sm text-white/70">{item.description}</p>
        </div>
    </div>
);


const AboutCurrentSection: React.FC<AboutCurrentSectionProps> = ({ onSelectProject }) => {
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
        <section ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 md:px-8 snap-start">
            <div className={`w-full max-w-6xl mx-auto transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-3xl font-semibold mb-8 text-center text-white flex items-center justify-center"><FiTrendingUp className="mr-4 text-accent" /> Current Focus</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-2xl font-bold text-white/90 mb-6 text-center lg:text-left">Learning</h4>
                            <div className="flex flex-col gap-6">
                                {CURRENTLY_LEARNING.map(item => (
                                    <LearningCard key={item.name} item={item} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white/90 mb-6 text-center lg:text-left">Building</h4>
                            <div className="flex flex-col gap-6">
                                {ACTIVE_PROJECTS.map(item => (
                                    <ProjectCard 
                                      key={item.name} 
                                      item={item} 
                                      onClick={() => item.projectId && onSelectProject(item.projectId)} 
                                    />
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="text-2xl font-bold text-white/90 mb-6 text-center lg:text-left">Career Goals</h4>
                            <div className="flex flex-col gap-6">
                                {CAREER_GOALS.map(item => (
                                    <CareerCard key={item.title} item={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutCurrentSection;