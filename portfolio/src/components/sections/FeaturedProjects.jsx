import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import { featuredProjects } from "../../hooks/data/projects";
import ProjectCard from "../ui/ProjectCard";

export default function FeaturedProjects() {
  return (
    <section className="py-10">
      <SectionTitle title="Featured Projects" />

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
