import { motion } from "framer-motion";
import { SectionHeading, TechBadge } from "./PortfolioTemplateComponents";
import { technologies } from "@/data/techPortfolioData";

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Tech Stack" 
          subtitle="Technologies I Work With"
        />

        {/* Animated marquee-like container */}
        <div className="tech-stack-marquee relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md">
          <div className="tech-marquee-track py-8">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-4 pr-4">
                {technologies.map((tech) => (
                  <div key={`${copy}-${tech}`} className="flex-shrink-0">
                    <TechBadge name={tech} delay={0} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Grid of technologies */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {technologies.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={false}
              whileInView={{ y: [0, -8, 0], scale: [1, 1.015, 1] }}
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true, amount: 0.2 }}
              className="tech-stack-grid-card p-4 rounded-xl border border-white/10 bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.12] hover:border-white/20 transition-all duration-300 text-center"
            >
              <p className="tech-stack-grid-label text-gray-300 font-medium text-sm">{tech}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
