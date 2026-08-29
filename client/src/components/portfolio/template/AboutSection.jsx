import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { 
  SectionHeading, 
  GlassCard,
  AnimatedButton 
} from "./PortfolioTemplateComponents";
import { capabilities } from "@/data/techPortfolioData";

const AboutSection = ({ portfolioContext }) => {
  const { name = "Developer", bio = "" } = portfolioContext || {};

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden">
              {/* Glowing circular background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
              
              {/* Placeholder avatar with name initial */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400/50 to-purple-400/50 border-2 border-white/20 flex items-center justify-center text-6xl font-bold text-white/30">
                  {name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeading
              title="About Me"
              subtitle=""
              centered={false}
            />

            <div className="space-y-4">
              <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Hi, I'm {name}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {bio || "Passionate about building exceptional digital experiences with clean code and modern technologies. Always learning, always growing."}
              </p>
            </div>

            <AnimatedButton
              variant="secondary"
              icon={ArrowRight}
            >
              Connect With Me →
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400/30 to-purple-400/30 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {capability.title}
                    </h3>
                    <p className="text-gray-400">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { AboutSection };
export default AboutSection;
