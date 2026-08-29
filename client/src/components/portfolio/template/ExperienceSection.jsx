import { motion } from "framer-motion";
import { 
  SectionHeading,
  TimelineItem
} from "./PortfolioTemplateComponents";

const ExperienceSection = ({ portfolioContext }) => {
  const { experience = [] } = portfolioContext || {};

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Experience" 
          subtitle="My Professional Journey"
        />

        {/* Timeline */}
        <div className="relative">
          {/* Center line (hidden on mobile) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400/20 via-purple-400/40 to-transparent transform -translate-x-1/2" />

          <div className="space-y-12">
            {experience.map((exp, idx) => (
              <TimelineItem
                key={idx}
                {...exp}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
