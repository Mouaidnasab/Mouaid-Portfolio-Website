import React, { useEffect, useState, useRef } from 'react';
import { PROFILE_PICTURE_URL } from '../constants';

const StatCounter: React.FC<{ target: number; duration?: number; isVisible: boolean }> = ({ target, duration = 1500, isVisible }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = target;
        // Calculate increment time, ensuring it's not too fast for small numbers
        const incrementTime = Math.max(10, Math.floor(duration / end));

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) {
                clearInterval(timer);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [isVisible, target, duration]);

    return <>{count}</>;
};

const AboutIntroSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 md:px-8 snap-start">
            <div className={`w-full max-w-5xl mx-auto transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-shrink-0">
                            <div className="relative p-2 bg-gradient-to-br from-white/20 to-transparent rounded-3xl shadow-lg">
                                <img
                                    src={PROFILE_PICTURE_URL}
                                    alt="Mouaid Nasab"
                                    className="w-52 h-52 lg:w-64 lg:h-64 rounded-2xl object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-grow text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                                About Me
                            </h2>
                            <p className="text-xl text-accent font-semibold mb-6">
                                A Proactive Software Engineering Student
                            </p>
                            <p className="text-white/80 leading-relaxed text-lg mb-8">
                                I am a 21-year-old, proactive third-year software engineering student at Eastern Mediterranean University, with a strong passion for developing innovative projects. I possess a diverse range of experiences in databases, frontend and backend development, and proficiency in programming languages such as Python, Java, and C++. Seeking opportunities to contribute my skills and knowledge to impactful projects.
                            </p>
                            <div className="grid grid-cols-2 gap-6 text-center border-t border-white/10 pt-6">
                                <div>
                                    <span className="text-4xl font-bold text-white"><StatCounter target={9} isVisible={isVisible} />+</span>
                                    <p className="text-sm text-white/60 mt-1">Projects Completed</p>
                                </div>
                                <div>
                                    <span className="text-4xl font-bold text-white"><StatCounter target={9} isVisible={isVisible} />+</span>
                                    <p className="text-sm text-white/60 mt-1">Core Technologies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutIntroSection;