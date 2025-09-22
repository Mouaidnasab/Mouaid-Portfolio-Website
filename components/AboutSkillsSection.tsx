import React from 'react';
import { SKILLS } from '../constants';
import { FiCode } from 'react-icons/fi';
import { Skill } from '../types';

const PROFICIENCY_LEVELS: Record<Skill['level'], number> = {
    'Novice': 1,
    'Beginner': 2,
    'Intermediate': 3,
    'Advanced': 4,
    'Expert': 5,
};

const PROFICIENCY_STYLES: Record<Skill['level'], string> = {
    'Novice': 'bg-gray-500',
    'Beginner': 'bg-teal-600',
    'Intermediate': 'bg-green-600',
    'Advanced': 'bg-lime-500',
    'Expert': 'bg-yellow-400',
};

const SkillItem: React.FC<{ skill: Skill }> = ({ skill }) => {
    const level = PROFICIENCY_LEVELS[skill.level];
    const activeDotClass = PROFICIENCY_STYLES[skill.level];

    return (
        <div
            className="group relative flex items-center gap-3 bg-secondary text-white/90 text-base font-medium px-4 py-2.5 rounded-lg border border-transparent hover:border-accent transition-all duration-300 cursor-default shadow-lg"
            aria-label={`${skill.name}, proficiency level: ${skill.level}`}
        >
            <skill.icon className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="flex-grow">{skill.name}</span>
            <div className="flex gap-1.5 items-center ml-auto pl-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300" role="img" aria-label={`${skill.level}`}>
                {[1, 2, 3, 4, 5].map(dotLevel => (
                    <span key={dotLevel} className={`w-2.5 h-2.5 rounded-full transition-colors ${level >= dotLevel ? activeDotClass : 'bg-white/40'}`}></span>
                ))}
            </div>
            <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-neutral-dark/80 backdrop-blur-md text-white text-sm rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                role="tooltip"
            >
                {skill.level}
            </span>
        </div>
    );
};


const AboutSkillsSection: React.FC = () => {
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
            <div className={`w-full max-w-5xl mx-auto transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
                    <h3 className="text-3xl font-semibold mb-8 text-center text-white flex items-center justify-center"><FiCode className="mr-4 text-accent" /> My Skills &amp; Proficiencies</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                        {SKILLS.map(skillCategory => (
                            <div key={skillCategory.category}>
                                <h4 className="text-xl font-bold text-white/90 mb-5 border-b-2 border-accent/20 pb-2">{skillCategory.category}</h4>
                                <div className="flex flex-col gap-4">
                                    {skillCategory.skills.map(skill => (
                                        <SkillItem key={skill.name} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSkillsSection;