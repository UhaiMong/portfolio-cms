// src/components/projects/ProjectsPage.jsx
import ProjectCard from "./ProjectCard";
import { featuredProjects } from "../hooks/data/projects";

const Projects = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
