import { motion } from "framer-motion";
import { Github, Code2, Award } from "lucide-react";
import { 
  SectionHeading,
  GlassCard,
  AnimatedButton
} from "./PortfolioTemplateComponents";

export default function AchievementsSection({ portfolioContext }) {
  const { socialLinks = [] } = portfolioContext || {};

  const getProfileLink = (name) => {
    const link = socialLinks.find(l => l.name?.toLowerCase() === name.toLowerCase());
    return link?.url || "#";
  };

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Achievements & Coding" 
          subtitle="DSA & Problem Solving"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Problems Solved Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Code2 className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                450+
              </div>
              <p className="text-gray-400 mb-6">DSA Problems Solved</p>
              <AnimatedButton
                href={getProfileLink("leetcode")}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full justify-center"
              >
                View LeetCode
              </AnimatedButton>
            </GlassCard>
          </motion.div>

          {/* Coding Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
                className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Consistent
              </div>
              <p className="text-gray-400 mb-6">Problem Solver & Learner</p>
              <AnimatedButton
                href={getProfileLink("github")}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full justify-center"
              >
                <Github className="w-4 h-4" /> View GitHub
              </AnimatedButton>
            </GlassCard>
          </motion.div>
        </div>

        {/* Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {socialLinks.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">
              <GlassCard className="p-6 text-center hover:scale-105 transition-transform">
                <p className="text-white font-semibold">{link.name}</p>
                <p className="text-gray-400 text-sm">{link.label}</p>
              </GlassCard>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
