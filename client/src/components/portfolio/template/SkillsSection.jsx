import { motion } from "framer-motion";
import { 
  SectionHeading,
  SkillBar,
  GlassCard
} from "./PortfolioTemplateComponents";

const SkillsSection = ({ portfolioContext }) => {
  const { skills = [] } = portfolioContext || {};

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Skills & Expertise" 
          subtitle="Technical Proficiencies"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {skills.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                  {category.category || category.name}
                </h3>

                <div className="space-y-8">
                  {(category.skills || []).map((skill, skillIdx) => (
                    <SkillBar
                      key={skillIdx}
                      name={skill.name || skill}
                      level={skill.level || 80}
                      delay={skillIdx * 0.05}
                    />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
