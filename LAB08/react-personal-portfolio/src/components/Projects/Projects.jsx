// src/components/Projects/Projects.jsx
import './Projects.css';
import { useState } from 'react';
import ProjectCard from './ProjectCard';
import portfolioData, { categories } from '../../data/portfolioData';

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? portfolioData
      : portfolioData.filter((project) => project.category === selectedCategory);

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <p className="section-subtitle">
          Here are some of the projects I've worked on recently.
        </p>

        {/* Category Filter */}
        <div className="projects-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;