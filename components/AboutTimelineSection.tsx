import React, { useEffect, useRef, useState } from 'react';
import { TIMELINE_EVENTS } from '../constants';

// A dedicated component for each timeline entry to handle its own animation state.
const TimelineItem: React.FC<{ event: typeof TIMELINE_EVENTS[0]; isVisible: boolean }> = ({ event, isVisible }) => {
    return (
        <div className={`bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl w-full transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-4 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-secondary">
                    <event.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-accent">{event.date}</p>
                    <h4 className="font-bold text-lg text-white leading-tight">{event.title}</h4>
                    <p className="text-sm text-white/70">{event.institution}</p>
                </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{event.description}</p>
        </div>
    );
};

const AboutTimelineSection: React.FC = () => {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setVisibleItems(prev => new Set(prev).add(index));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
        );

        const refs = itemRefs.current;
        refs.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            refs.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 md:px-8 snap-start">
            <div className="w-full max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
                    My Journey
                </h2>
                
                <div className="relative before:content-[''] before:absolute before:top-0 before:left-4 md:before:left-1/2 before:-ml-px before:w-0.5 before:h-full before:bg-accent/20">
                    {TIMELINE_EVENTS.map((event, index) => {
                        const isLeft = index % 2 === 0;
                        const isVisible = visibleItems.has(index);

                        return (
                            <div
                                key={index}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                data-index={index}
                                className={`relative mb-12 flex w-full items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                            >
                                {/* Dot */}
                                <div className="absolute top-5 left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-secondary ring-4 ring-primary z-10" />

                                {/* Card container */}
                                <div className={`w-full pl-12 md:w-1/2 ${isLeft ? 'md:pl-0 md:pr-8' : 'md:pl-8'}`}>
                                    <TimelineItem event={event} isVisible={isVisible} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AboutTimelineSection;