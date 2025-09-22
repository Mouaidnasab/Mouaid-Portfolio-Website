import type { ComponentType } from 'react';

export enum ProjectTag {
  Private = 'private',
  AI = 'ai',
  Flutter = 'flutter',
  React = 'react',
  WebApp = 'web-app',
  Mobile = 'mobile',
  DataScience = 'data-science',
  UXUI = 'ux/ui',
  Personal = 'personal',
  Hobby = 'hobby',
  ECommerce = 'e-commerce'
}

export interface TagDetails {
    name: string;
    className: string;
}

export interface Project {
  id: number;
  name:string;
  description: string;
  longDescription: string;
  category: 'Web' | 'Mobile' | 'AI/ML' | 'Personal';
  tags: ProjectTag[];
  imageUrls: string[];
  technologies: string[];
  repoUrl?: string;
  liveUrl?: string;
  dateStarted: string;
  dateEnded?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  institution: string;
  description:string;
  icon: ComponentType<{ className?: string }>;
}

export interface Skill {
  name: string;
  icon: ComponentType<{ className?: string }>;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface LearningItem {
  name: string;
  source: string;
  type: 'course' | 'book' | 'article';
  progress: number; // Percentage 0-100
  description?: string;
  url?: string;
}

export interface ActiveProject {
  name: string;
  description: string;
  progress: number; // Percentage 0-100
  status?: string;
  projectId?: number;
}

export interface CareerGoal {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}