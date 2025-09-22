import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';


const ContactSection: React.FC = () => {
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

  return (
    <section ref={sectionRef} className="h-screen w-full flex flex-col items-center justify-center relative snap-start">
      <div className={`z-10 text-center px-4 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Get In Touch</h2>
        <p className="max-w-lg mx-auto text-white/80 mb-8">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
        </p>
        <div className="flex items-center justify-center gap-6">
          <a href="mailto:mouaidnasab@outlook.com" className="group flex flex-col items-center gap-2 text-gray-300 hover:text-accent transition-colors">
            <FiMail className="w-10 h-10" />
            <span className="text-sm">Email</span>
          </a>
          <a href="#" className="group flex flex-col items-center gap-2 text-gray-300 hover:text-accent transition-colors">
            <FaLinkedin className="w-10 h-10" />
            <span className="text-sm">LinkedIn</span>
          </a>
          <a href="#" className="group flex flex-col items-center gap-2 text-gray-300 hover:text-accent transition-colors">
            <FaGithub className="w-10 h-10" />
            <span className="text-sm">GitHub</span>
          </a>
        </div>
      </div>
       <footer className="absolute bottom-4 w-full px-4 text-center text-sm text-white/40">
        <p className="mb-1">Built by Mouaid Nasab with assistance from Google AI Studio.</p>
        <p>&copy; {new Date().getFullYear()} Mouaid Nasab. All Rights Reserved.</p>
      </footer>
    </section>
  );
};

export default ContactSection;