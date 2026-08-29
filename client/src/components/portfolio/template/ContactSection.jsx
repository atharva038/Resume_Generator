import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Github, Linkedin, ArrowRight } from "lucide-react";
import { 
  SectionHeading,
  GlassCard,
  AnimatedButton
} from "./PortfolioTemplateComponents";

const ContactSection = ({ portfolioContext }) => {
  const { email = "", socialLinks = [] } = portfolioContext || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add form submission logic
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Let's Build Something Great Together." 
          subtitle="Get In Touch"
          centered
        />

        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
          Have an idea, project or opportunity? Let's turn it into something meaningful. Reach out and let's start a conversation.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={false}
            whileInView={{ x: [0, -10, 0] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="tech-form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none"
                    placeholder="Enter your name"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="tech-form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.35 }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="tech-form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none"
                    placeholder="Enter subject"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.35 }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="tech-form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none"
                    placeholder="Enter your message"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.35 }}
                >
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    icon={Send}
                    className="w-full justify-center"
                  >
                    Send Message
                  </AnimatedButton>
                </motion.div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={false}
            whileInView={{ x: [0, 10, 0] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8"
          >
            {/* Email Card */}
            <GlassCard className="p-8">
              <div className="flex items-start gap-4">
                <div className="tech-accent-icon w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Email</h3>
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {email || "your.email@example.com"}
                  </a>
                </div>
              </div>
            </GlassCard>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Connect With Me</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                  >
                    <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-white font-semibold">{link.name}</p>
                    </GlassCard>
                  </a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <GlassCard className="tech-accent-surface p-8">
              <p className="text-gray-300 mb-4">
                Ready to work together? Let's connect and create something amazing!
              </p>
              <AnimatedButton
                href={`mailto:${email}`}
                variant="primary"
                icon={ArrowRight}
              >
                Send Email
              </AnimatedButton>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
