// src/components/Projects/ProjectCard.jsx
import React from 'react';
import './Projects.css'; 


const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <img
        src={project.image}
        alt={project.title}
        className="project-image"
      />
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <a
          href={project.view}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link"
        >
          View Project
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;