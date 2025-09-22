import { Project, ProjectTag, TagDetails, TimelineEvent, SkillCategory, LearningItem, ActiveProject, CareerGoal } from './types';
// FIX: Add FiFileText to imports
import { FiAward, FiBookOpen, FiGlobe, FiCpu, FiCode, FiFileText, FiBriefcase, FiTarget, FiUsers } from 'react-icons/fi';
import { FaJava } from 'react-icons/fa';
// FIX: Add SiMysql, SiSqlite, SiBlender to imports
import {
    SiJavascript, SiTypescript, SiPython, SiCplusplus,
    SiNodedotjs, SiReact, SiNextdotjs, SiTailwindcss, SiSupabase, SiVite, SiPandas,
    SiJupyter, SiScikitlearn, SiMongodb, SiPostgresql, SiFirebase, SiFlutter, SiDart,
    SiMysql, SiSqlite, SiBlender
} from 'react-icons/si';


export const PROFILE_PICTURE_URL = 'https://picsum.photos/seed/mouaid-profile/400/400';

export const TAG_DETAILS: Record<ProjectTag, TagDetails> = {
  [ProjectTag.AI]: { name: 'AI', className: 'bg-blue-500/80 text-blue-100' },
  [ProjectTag.React]: { name: 'React', className: 'bg-sky-500/80 text-sky-100' },
  [ProjectTag.Flutter]: { name: 'Flutter', className: 'bg-teal-500/80 text-teal-100' },
  [ProjectTag.Private]: { name: 'Private', className: 'bg-red-500/80 text-red-100' },
  [ProjectTag.WebApp]: { name: 'Web App', className: 'bg-purple-500/80 text-purple-100' },
  [ProjectTag.Mobile]: { name: 'Mobile', className: 'bg-green-500/80 text-green-100' },
  [ProjectTag.DataScience]: { name: 'Data Science', className: 'bg-orange-500/80 text-orange-100' },
  [ProjectTag.UXUI]: { name: 'UX/UI', className: 'bg-pink-500/80 text-pink-100' },
  [ProjectTag.Personal]: { name: 'Personal', className: 'bg-gray-500/80 text-gray-100' },
  [ProjectTag.Hobby]: { name: 'Hobby', className: 'bg-cyan-500/80 text-cyan-100' },
  [ProjectTag.ECommerce]: { name: 'E-Commerce', className: 'bg-lime-500/80 text-lime-100' },
};


export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Secure Messaging Website',
    description: 'A team project focused on building a secure web application for data transfer.',
    longDescription: 'This was a university project (CMSE353) that focused on how to build a secure running website. We worked as a team to create a teams-like website that encodes and decodes all data transferred from and to the server using the DES algorithm. The application ensures data integrity and confidentiality during transmission.',
    category: 'Web',
    tags: [ProjectTag.WebApp, ProjectTag.Personal],
    imageUrls: [
      'https://picsum.photos/seed/secure-web/600/400',
      'https://picsum.photos/seed/secure-web-2/600/400',
    ],
    technologies: ['Python', 'Flask', 'SQLite', 'DES Algorithm', 'Bootstrap', 'HTML', 'CSS'],
    repoUrl: '#',
    dateStarted: '2023-09-15',
    dateEnded: '2023-12-20',
  },
  {
    id: 2,
    name: 'Real Estate Portal Analysis & Design',
    description: 'A comprehensive report and design for a real estate search portal.',
    longDescription: 'For this project (CMSE321), we conducted a thorough analysis for a real estate search portal. This included defining the project\'s necessity, gathering and organizing functional and non-functional requirements, and designing the website architecture and user interface. We gained knowledge on how to analyze, interview, work as a team, and design a website.',
    category: 'Personal',
    tags: [ProjectTag.UXUI, ProjectTag.Personal],
    imageUrls: [
      'https://picsum.photos/seed/real-estate/600/400',
      'https://picsum.photos/seed/real-estate-2/600/400',
    ],
    technologies: ['Requirements Analysis', 'System Design', 'UI/UX Design', 'Team Collaboration'],
    dateStarted: '2023-02-01',
    dateEnded: '2023-05-20',
  },
  {
    id: 3,
    name: 'Software Project Fundamentals',
    description: 'An academic project on the software development lifecycle (SDLC).',
    longDescription: 'This project (CMSE201) focused on understanding how to build a software project from the ground up. We analyzed project feasibility, learned how to write clear and organized requirements, and performed basic design tasks. This provided a foundational understanding of different SDLC methodologies like waterfall and agile.',
    category: 'Personal',
    tags: [ProjectTag.Personal],
    imageUrls: [
      'https://picsum.photos/seed/sdlc-project/600/400',
    ],
    technologies: ['SDLC', 'Feasibility Analysis', 'Requirements Engineering', 'Agile', 'Waterfall'],
    dateStarted: '2022-09-15',
    dateEnded: '2022-12-20',
  },
  {
    id: 4,
    name: 'Hobbies',
    description: 'A social platform to connect people with similar hobbies.',
    longDescription: 'Hobbies is a community-focused platform where users can discover new activities, join groups, and attend local events related to their interests. The UX/UI is designed to be engaging and encourage interaction between users.',
    category: 'Web',
    tags: [ProjectTag.React, ProjectTag.WebApp, ProjectTag.UXUI, ProjectTag.Hobby],
    imageUrls: [
        'https://picsum.photos/seed/hobbies-1/600/400',
        'https://picsum.photos/seed/hobbies-2/600/400',
        'https://picsum.photos/seed/hobbies-3/600/400'
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Supabase'],
    liveUrl: '#',
    dateStarted: '2023-06-10',
    dateEnded: '2023-08-05',
  },
  {
    id: 5,
    name: 'Summer Training',
    description: 'Data science projects from a summer internship.',
    longDescription: 'A showcase of data analysis and machine learning projects from an intensive summer training program. This collection includes work on predictive modeling, sentiment analysis, and data visualization using various industry-standard tools and libraries.',
    category: 'AI/ML',
    tags: [ProjectTag.DataScience, ProjectTag.AI, ProjectTag.Private],
    imageUrls: [
      'https://picsum.photos/seed/summer-training-1/600/400',
      'https://picsum.photos/seed/summer-training-2/600/400'
    ],
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Jupyter', 'Matplotlib'],
    dateStarted: '2022-06-01',
    dateEnded: '2022-08-20',
  },
  {
    id: 6,
    name: 'University',
    description: 'Key projects from university coursework.',
    longDescription: 'This portfolio features significant academic projects, including a custom-built operating system kernel, an implementation of complex graph algorithms, and a compiler for a simple programming language. These projects demonstrate a strong foundation in computer science fundamentals.',
    category: 'Personal',
    tags: [ProjectTag.Personal],
    imageUrls: [
        'https://picsum.photos/seed/university-1/600/400',
        'https://picsum.photos/seed/university-2/600/400'
    ],
    technologies: ['C++', 'Java', 'Assembly', 'Data Structures', 'Algorithms'],
    repoUrl: '#',
    dateStarted: '2020-09-01',
    dateEnded: '2021-05-01',
  },
  {
    id: 7,
    name: 'Portfolio Site',
    description: 'This portfolio website, built with React and Tailwind CSS.',
    longDescription: 'The website you are currently viewing. It is a fully responsive single-page application built with modern web technologies to create a unique, macOS-inspired interface for showcasing my work.',
    category: 'Web',
    tags: [ProjectTag.React, ProjectTag.WebApp, ProjectTag.UXUI, ProjectTag.Personal],
    imageUrls: [
      'https://picsum.photos/seed/portfolio-1/600/400',
      'https://picsum.photos/seed/portfolio-2/600/400'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    repoUrl: '#',
    liveUrl: '#',
    dateStarted: '2023-09-01',
  },
  {
    id: 8,
    name: 'Weather App',
    description: 'A clean and simple weather forecasting app.',
    longDescription: 'A minimalist weather application for iOS and Android that provides current weather conditions, hourly forecasts, and a 7-day outlook. It features a clean, intuitive UI and fetches data from a reliable weather API.',
    category: 'Mobile',
    tags: [ProjectTag.Flutter, ProjectTag.Mobile, ProjectTag.Personal],
    imageUrls: [
      'https://picsum.photos/seed/weather-app-1/600/400',
      'https://picsum.photos/seed/weather-app-2/600/400'
    ],
    technologies: ['Flutter', 'Dart', 'OpenWeatherMap API'],
    repoUrl: '#',
    dateStarted: '2022-02-15',
    dateEnded: '2022-03-10',
  },
  {
    id: 9,
    name: 'GameHub',
    description: 'A marketplace for digital games and assets.',
    longDescription: 'GameHub is an e-commerce platform built for gamers. It allows users to buy and sell digital games, in-game items, and assets. Features a secure transaction system, user reviews, and a personalized recommendation engine.',
    category: 'Web',
    tags: [ProjectTag.WebApp, ProjectTag.ECommerce, ProjectTag.Hobby, ProjectTag.React],
    imageUrls: [
      'https://picsum.photos/seed/gamehub-1/600/400',
      'https://picsum.photos/seed/gamehub-2/600/400',
      'https://picsum.photos/seed/gamehub-3/600/400'
    ],
    technologies: ['React', 'Node.js', 'Stripe API', 'PostgreSQL', 'Redux'],
    repoUrl: '#',
    liveUrl: '#',
    dateStarted: '2023-03-01',
  },
];

export const SIDEBAR_CATEGORIES = {
  'All Projects': 'All Projects',
  'In Progress': 'In Progress',
  'Web Apps': 'Web',
  'Mobile Apps': 'Mobile',
  'AI/ML': 'AI/ML',
  'Personal': 'Personal',
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        date: '2021 - 2025 (Expected)',
        title: 'B.S. in Software Engineering',
        institution: 'Eastern Mediterranean University - Famagusta, Cyprus',
        description: 'Pursuing a comprehensive degree in software engineering, focusing on development methodologies, databases, and various programming paradigms.',
        icon: FiAward,
    },
    {
        date: 'Fall 2023',
        title: 'High Honor Award',
        institution: 'Eastern Mediterranean University',
        description: 'Recognized for outstanding academic performance during the semester.',
        icon: FiAward,
    },
    {
        date: 'Spring 2022',
        title: 'High Honor Award',
        institution: 'Eastern Mediterranean University',
        description: 'Recognized for outstanding academic performance during the semester.',
        icon: FiAward,
    },
    {
        date: 'Fall 2021',
        title: 'High Honor Award',
        institution: 'Eastern Mediterranean University',
        description: 'Recognized for outstanding academic performance during the semester.',
        icon: FiAward,
    },
    {
        date: '2018 - 2021',
        title: 'High School Diploma',
        institution: 'Saud International School – Riyadh',
        description: 'Completed secondary education with a focus on science and mathematics.',
        icon: FiBookOpen,
    },
];

export const SKILLS: SkillCategory[] = [
    {
        category: 'Programming',
        skills: [
            { name: 'HTML/CSS', icon: FiCode, level: 'Advanced' },
            { name: 'Python', icon: SiPython, level: 'Intermediate' },
            { name: 'Java', icon: FaJava, level: 'Intermediate' },
            { name: 'C++', icon: SiCplusplus, level: 'Intermediate' },
            { name: 'JavaScript', icon: SiJavascript, level: 'Beginner' },
            { name: 'TypeScript', icon: SiTypescript, level: 'Beginner' },
            { name: 'Node.js', icon: SiNodedotjs, level: 'Beginner' },
        ],
    },
    {
        category: 'Databases',
        skills: [
            { name: 'MySQL', icon: SiMysql, level: 'Intermediate' },
            { name: 'SQLite', icon: SiSqlite, level: 'Intermediate' },
        ],
    },
    {
        category: 'Software & Tools',
        skills: [
            { name: 'Microsoft Office', icon: FiFileText, level: 'Advanced' },
            { name: 'Fusion', icon: FiCpu, level: 'Advanced' },
            { name: 'Blender', icon: SiBlender, level: 'Intermediate' },
            { name: 'AutoCAD', icon: FiCpu, level: 'Intermediate' },
        ],
    },
    {
        category: 'Spoken Languages',
        skills: [
            { name: 'Arabic', icon: FiGlobe, level: 'Expert' },
            { name: 'English', icon: FiGlobe, level: 'Advanced' },
            { name: 'Turkish', icon: FiGlobe, level: 'Beginner' },
        ],
    },
];

export const CURRENTLY_LEARNING: LearningItem[] = [
    {
        name: 'Advanced Algorithms',
        source: 'University Course',
        type: 'course',
        progress: 75,
        description: 'Deepening my understanding of complex data structures and efficiency.',
    },
    {
        name: 'Clean Architecture',
        source: 'Book by Robert C. Martin',
        type: 'book',
        progress: 30,
        description: 'Learning principles for building scalable and maintainable software systems.',
        url: 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494166/',
    },
];

export const ACTIVE_PROJECTS: ActiveProject[] = [
    {
        name: 'This Portfolio Site',
        description: 'Continuously refining the design and functionality of my personal portfolio.',
        progress: 90,
        status: 'Ongoing Enhancements',
        projectId: 7,
    },
    {
        name: 'AI-Powered Study Planner',
        description: 'A personal project to help students organize their study schedules efficiently.',
        progress: 25,
        status: 'In Development',
    },
];

export const CAREER_GOALS: CareerGoal[] = [
    {
        icon: FiBriefcase,
        title: 'Internship Opportunities',
        description: 'Seeking a challenging internship to apply my academic knowledge to real-world projects.',
    },
    {
        icon: FiCode,
        title: 'Full-Stack Development',
        description: 'Eager to contribute to both frontend and backend development, creating seamless user experiences.',
    },
     {
        icon: FiUsers,
        title: 'Collaborative Team',
        description: 'Looking to join a forward-thinking team where I can learn from experienced mentors.',
    },
];