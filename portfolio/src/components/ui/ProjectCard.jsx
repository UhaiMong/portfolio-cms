import React from "react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
      <img
        loading="lazy"
        src={project.image}
        alt={project.title}
        className="w-full h-56 object-cover rounded-t-xl"
      />

      <div className="p-6 flex flex-col gap-3">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-5">
          <a
            href={project.live}
            target="_blank"
            className="text-sm underline hover:opacity-70"
          >
            Live
          </a>
          <a
            href={project.github}
            target="_blank"
            className="text-sm underline hover:opacity-70"
          >
            Code
          </a>
        </div>
      </div>
    </div>
  );
}
