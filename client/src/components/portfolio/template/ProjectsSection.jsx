import { motion } from "framer-motion";
import { 
  SectionHeading,
  ProjectCard
} from "./PortfolioTemplateComponents";

const ProjectsSection = ({ portfolioContext }) => {
  const { projects = [] } = portfolioContext || {};

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Featured Projects" 
          subtitle="Showcasing My Best Work"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <ProjectCard
              key={idx}
              {...project}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
