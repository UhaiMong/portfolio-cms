// src/components/projects/ProjectCard.jsx

const ProjectCard = ({ project }) => {
  return (
    <div className="rounded-xl shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <img
        loading="lazy"
        src={project.image}
        alt={project.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-xs rounded-md"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm border rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Live
          </a>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm border rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
