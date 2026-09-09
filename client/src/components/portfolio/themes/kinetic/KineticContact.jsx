import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Copy,
  Check,
  Send,
  X,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Code2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

const resolveSocialInfo = (link = {}) => {
  const url = (link.url || link.link || "").toLowerCase();
  const platform = (link.platform || link.name || link.type || "").toLowerCase();

  if (platform.includes("git") || url.includes("github.com") || url.includes("gitlab.com")) {
    return { label: link.platform || link.name || "GITHUB", icon: Github };
  }
  if (platform.includes("link") || url.includes("linkedin.com")) {
    return { label: link.platform || link.name || "LINKEDIN", icon: Linkedin };
  }
  if (
    platform.includes("twit") ||
    platform.includes(" x") ||
    url.includes("twitter.com") ||
    url.includes("x.com")
  ) {
    return { label: link.platform || link.name || "TWITTER / X", icon: Twitter };
  }
  if (platform.includes("insta") || url.includes("instagram.com")) {
    return { label: link.platform || link.name || "INSTAGRAM", icon: Instagram };
  }
  if (platform.includes("you") || url.includes("youtube.com")) {
    return { label: link.platform || link.name || "YOUTUBE", icon: Youtube };
  }
  if (
    platform.includes("leet") ||
    url.includes("leetcode.com") ||
    url.includes("hackerrank.com") ||
    url.includes("codeforces.com")
  ) {
    return { label: link.platform || link.name || "LEETCODE", icon: Code2 };
  }
  if (platform.includes("mail") || url.startsWith("mailto:")) {
    return { label: link.platform || link.name || "EMAIL", icon: Mail };
  }
  if (platform.includes("web") || platform.includes("port") || url.includes("http")) {
    return { label: link.platform || link.name || "WEBSITE", icon: Globe };
  }
  return { label: link.platform || link.name || "LINK", icon: ExternalLink };
};

/**
 * KineticContact
 * Final Transformation & Kinetic Call-To-Action.
 * The persistent traveling 3D card lands in the center stage to deliver the final invitation.
 */
export default function KineticContact({
  email = "",
  socialLinks = [],
  name = "",
  onContactClick,
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message transmitted successfully!");
      setContactModalOpen(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <section
      id="kinetic-contact-section"
      className="relative min-h-screen w-full overflow-hidden bg-[var(--kn-bg)] pt-20 pb-16 flex flex-col justify-between"
    >
      {/* Background Kinetic Grid Lines */}
      <div className="kinetic-line-h top-0 left-0 right-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center justify-between min-h-[82vh]">
        
        {/* Section Tag */}
        <div className="w-full flex items-center justify-between border-b border-[var(--kn-border)] pb-3">
          <span className="kn-meta-tag text-[var(--kn-accent)] font-semibold">
            04 / CONTACT
          </span>
          <span className="kn-mono text-xs text-[var(--kn-text-muted)]">
            GET IN TOUCH
          </span>
        </div>

        {/* Central Stage: The Final Convergence Stage & Monumental CTA */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-10 pb-6 my-auto">
          
          {/* Spatial Clearance Buffer for 3D Card (Guarantees card sits completely above LET'S BUILD) */}
          <div className="h-[270px] sm:h-[310px] md:h-[330px] w-full pointer-events-none" aria-hidden="true" />

          {/* Monumental Kinetic CTA Header */}
          <div className="space-y-2 pt-2">
            <h2 className="kn-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.035em] text-[var(--kn-text-primary)] leading-[0.92] uppercase">
              LET'S <br />
              <span className="text-[var(--kn-accent)] hover:underline decoration-1 underline-offset-8 transition-all">
                BUILD.
              </span>
            </h2>

            <p className="kn-mono text-xs sm:text-sm text-[var(--kn-text-secondary)] max-w-md mx-auto pt-1 font-medium">
              HAVE A PROJECT, INQUIRY, OR AMBITIOUS VISION IN MIND? LET'S TALK.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                if (onContactClick) onContactClick();
                else setContactModalOpen(true);
              }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-[var(--kn-text-primary)] px-7 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[var(--kn-bg)] shadow-xl transition-all hover:bg-[var(--kn-accent)] hover:text-white cursor-pointer"
            >
              <span>START A CONVERSATION</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

            {email && (
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] px-5 py-3.5 text-xs font-mono text-[var(--kn-text-primary)] transition-all hover:border-[var(--kn-accent)] hover:text-[var(--kn-accent)] cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>COPY {email}</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Footer & Social Channels */}
        <footer className="w-full border-t border-[var(--kn-border)] pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[var(--kn-text-muted)]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {name}</span>
            <span className="opacity-30">•</span>
            <span className="text-[var(--kn-text-secondary)]">DESIGNED WITH SMARTNSHINE</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--kn-border)] bg-[var(--kn-bg-subtle)] px-3.5 py-1.5 text-xs font-mono text-[var(--kn-text-secondary)] hover:border-[var(--kn-accent)] hover:text-[var(--kn-accent)] hover:bg-[var(--kn-bg-surface)] transition-all"
              >
                <Mail className="h-3.5 w-3.5 text-[var(--kn-accent)]" />
                <span>EMAIL</span>
              </a>
            )}

            {socialLinks &&
              socialLinks.length > 0 &&
              socialLinks.map((link, idx) => {
                const { label, icon: IconComponent } = resolveSocialInfo(link);
                const href = link.url || link.link || "#";

                return (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--kn-border)] bg-[var(--kn-bg-subtle)] px-3.5 py-1.5 text-xs font-mono text-[var(--kn-text-secondary)] hover:border-[var(--kn-accent)] hover:text-[var(--kn-accent)] hover:bg-[var(--kn-bg-surface)] transition-all"
                  >
                    <IconComponent className="h-3.5 w-3.5 text-[var(--kn-accent)]" />
                    <span className="uppercase">{label}</span>
                  </a>
                );
              })}
          </div>
        </footer>

      </div>

      {/* Quick Contact Form Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg)] p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--kn-border)] pb-4">
                <div>
                  <span className="kn-meta-tag text-[var(--kn-accent)]">DIRECT INQUIRY</span>
                  <h3 className="kn-display text-2xl font-bold text-[var(--kn-text-primary)] mt-1">
                    START A CONVERSATION
                  </h3>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="rounded-full p-2 text-[var(--kn-text-muted)] hover:bg-[var(--kn-bg-subtle)] hover:text-[var(--kn-text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitMessage} className="mt-6 space-y-4">
                <div>
                  <label className="kn-meta-tag block mb-1.5 text-[10px]">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] px-4 py-3 text-sm text-[var(--kn-text-primary)] outline-none focus:border-[var(--kn-accent)] transition-colors"
                  />
                </div>

                <div>
                  <label className="kn-meta-tag block mb-1.5 text-[10px]">
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] px-4 py-3 text-sm text-[var(--kn-text-primary)] outline-none focus:border-[var(--kn-accent)] transition-colors"
                  />
                </div>

                <div>
                  <label className="kn-meta-tag block mb-1.5 text-[10px]">
                    MESSAGE / PROJECT BRIEF
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, and goals..."
                    className="w-full resize-none rounded-xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-subtle)] px-4 py-3 text-sm text-[var(--kn-text-primary)] outline-none focus:border-[var(--kn-accent)] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--kn-accent)] py-3.5 text-xs font-mono font-medium text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <>
                      <span>TRANSMIT MESSAGE</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
