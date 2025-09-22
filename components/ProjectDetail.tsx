import React, { useState, useEffect } from 'react';
import { Project, ProjectTag } from '../types';
import { FaGithub } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { TAG_DETAILS } from '../constants';
import Lightbox from './Lightbox';

interface ProjectDetailProps {
  project: Project | null;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    // Reset to the first image whenever the project changes
    setActiveImage(0);
  }, [project]);

  if (!project) {
    return (
      <aside className="w-full h-full flex flex-col items-center justify-center text-center bg-zinc-800/30 p-8">
        <h3 className="text-xl font-semibold text-white/80">Select a project</h3>
        <p className="text-base text-white/50 mt-2">Choose a project from the list to see more details.</p>
      </aside>
    );
  }

  const isPrivate = project.tags.includes(ProjectTag.Private);
  const hasRepoUrl = !!project.repoUrl;

  return (
    <>
      <aside className="w-full h-full flex flex-col bg-zinc-800/30 overflow-y-auto p-4 md:p-8">
        <div className="flex-1">
          {/* Main Image */}
          <div className="mb-4 aspect-video w-full overflow-hidden rounded-2xl shadow-lg bg-secondary cursor-pointer" onClick={() => setLightboxImage(project.imageUrls[activeImage])}>
            {project.imageUrls && project.imageUrls.length > 0 && (
              <img src={project.imageUrls[activeImage]} alt={`${project.name} screenshot ${activeImage + 1}`} className="w-full h-full object-cover" />
            )}
          </div>

          {/* Thumbnails */}
          {project.imageUrls && project.imageUrls.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mb-8">
              {project.imageUrls.map((url, index) => (
                <button 
                  key={index} 
                  onClick={() => {
                    setActiveImage(index);
                    setLightboxImage(url);
                  }} 
                  className={`aspect-square w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-zinc-800/30 transition-all ${
                    activeImage === index ? 'ring-2 ring-accent' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`${project.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h2 className="text-3xl font-bold text-white mb-4">{project.name}</h2>

          <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-black/20">
              <div className="text-center">
                  <h4 className="text-sm text-white/50 mb-1">Status</h4>
                  <p className={`text-sm font-semibold ${project.dateEnded ? 'text-green-400' : 'text-blue-400'}`}>
                      {project.dateEnded ? 'Completed' : 'In Progress'}
                  </p>
              </div>
              <div className="text-center">
                  <h4 className="text-sm text-white/50 mb-1">Started</h4>
                  <p className="text-sm font-semibold text-white/80">{formatDate(project.dateStarted)}</p>
              </div>
              <div className="text-center">
                  <h4 className="text-sm text-white/50 mb-1">Finished</h4>
                  <p className="text-sm font-semibold text-white/80">{project.dateEnded ? formatDate(project.dateEnded) : '—'}</p>
              </div>
          </div>

          <p className="text-white/70 text-base leading-relaxed mb-8">{project.longDescription}</p>
          
          <h3 className="text-base font-semibold text-white/90 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {project.tags.map(tag => (
              <span key={tag} className={`px-3 py-1 rounded-lg text-sm ${TAG_DETAILS[tag].className}`}>
                {TAG_DETAILS[tag].name}
              </span>
            ))}
          </div>

          <h3 className="text-base font-semibold text-white/90 mb-3">Technologies Used</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {project.technologies.map(tech => (
              <span key={tech} className="bg-secondary text-accent text-sm font-medium px-3.5 py-1.5 rounded-lg">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className={`flex-shrink-0 grid grid-cols-1 ${project.liveUrl && (isPrivate || hasRepoUrl) ? 'sm:grid-cols-2' : ''} gap-4 mt-auto pt-6`}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-white bg-accent rounded-xl hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-neutral-dark"
            >
              <FiLink className="w-5 h-5" />
              Live Demo
            </a>
          )}
          {isPrivate ? (
            <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-white/40 bg-zinc-800 rounded-xl cursor-not-allowed">
              <FaGithub className="w-5 h-5" />
              Private
            </div>
          ) : hasRepoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-white bg-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-neutral-dark"
            >
              <FaGithub className="w-5 h-5" />
              Source Code
            </a>
          ) : null}
        </div>
      </aside>
      {lightboxImage && (
        <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </>
  );
};

export default ProjectDetail;