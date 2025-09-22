import React from 'react';
import { Project } from '../types';
import { TAG_DETAILS } from '../constants';

interface ProjectPreviewProps {
  project: Project | null;
  position: { x: number; y: number };
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, position }) => {
  if (!project) {
    return null;
  }

  const offsetX = 15;
  const offsetY = 15;
  const previewWidth = 256; // w-64 in tailwind
  const previewHeight = 230; // Estimated height, adjusted for tags

  let x = position.x + offsetX;
  let y = position.y + offsetY;

  // Adjust position to prevent going off-screen to the right or bottom
  if (typeof window !== 'undefined') {
    if (x + previewWidth > window.innerWidth) {
      x = position.x - previewWidth - offsetX;
    }
    if (y + previewHeight > window.innerHeight) {
      y = position.y - previewHeight - offsetY;
    }

    // Ensure it's not off-screen to the left or top after adjustments
    if (x < 0) x = offsetX;
    if (y < 0) y = offsetY;
  }

  const previewStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
    pointerEvents: 'none',
    zIndex: 50,
    willChange: 'transform, opacity',
  };

  return (
    <div
      style={previewStyle}
      className="w-64 bg-neutral-dark/80 backdrop-blur-md border border-glass-stroke rounded-xl shadow-2xl p-3 overflow-hidden animate-fade-in"
      aria-hidden="true"
    >
      <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
        <img
          src={project.imageUrls[0]}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-white text-base font-semibold truncate mb-2">
        {project.name}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-md text-xs ${TAG_DETAILS[tag]?.className || 'bg-gray-500/80 text-gray-100'}`}
          >
            {TAG_DETAILS[tag]?.name || tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectPreview;
