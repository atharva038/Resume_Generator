import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Copy,
  Check,
  Zap,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  Rocket,
  GraduationCap,
  Sparkles,
  MessageSquareQuote,
  Layers,
  ChevronRight,
  Star,
} from "lucide-react";

export default function ApplicationCopilotDrawer({ profile = {}, qaItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeCopilotTab, setActiveCopilotTab] = useState(qaItems?.length > 0 ? "qa" : "quick");

  const info = profile.personalInfo || {};
  const skills = profile.skills || [];
  const experience = profile.experience || [];
  const projects = profile.projects || [];

  const copyToClipboard = (text, label, key) => {
    if (!text) {
      toast.error(`No ${label} data to copy`);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied ${label} to clipboard`, {
      duration: 2000,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Comma-separated skills string
  const allSkillsString = skills.map((s) => s.name).join(", ");

  const savedQAList = (qaItems || []).filter(
    (item) => Boolean(item.savedAnswer?.trim()) || Boolean(item.aiDraft?.trim())
  );

  return (
    <>
      {/* Floating Launcher Button */}
      <aside aria-label="Job Application Copilot Dock" className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-xs shadow-xl shadow-blue-500/30 border border-white/20 hover:shadow-2xl transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300 animate-pulse" />
          </div>
          <span>Application Copilot Dock</span>
          <span className="px-2 py-0.5 rounded-full bg-black/25 text-[10px] uppercase font-mono tracking-wider">
            {isOpen ? "Close" : "1-Click Copy"}
          </span>
        </motion.button>
      </aside>

      {/* Floating Copilot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-h-[82vh] rounded-3xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-gray-200/90 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans"
          >
            {/* Top Dock Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-500/10 dark:from-zinc-900 dark:to-zinc-950 border-b border-gray-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 fill-current text-yellow-300" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight flex items-center gap-1.5">
                    Job Application Quick-Copy Dock
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium">
                    1-Click copy into Workday, Greenhouse, Lever & LinkedIn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Category Filter Tabs */}
            <div className="flex p-1.5 bg-gray-100 dark:bg-zinc-900/90 border-b border-gray-200/60 dark:border-white/5 gap-1 text-[11px] font-bold overflow-x-auto">
              {[
                { id: "qa", label: `Q&A Answers (${savedQAList.length})` },
                { id: "quick", label: "Contact & Bio" },
                { id: "skills", label: "Skills" },
                { id: "experience", label: "Experience" },
                { id: "projects", label: "Projects" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCopilotTab(tab.id)}
                  className={`py-1.5 px-2.5 rounded-lg text-center whitespace-nowrap transition-all cursor-pointer ${
                    activeCopilotTab === tab.id
                      ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-cyan-400 font-black shadow-xs"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs max-h-[52vh]">
              {/* TAB 0: Q&A ANSWERS */}
              {activeCopilotTab === "qa" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Application Question Answers
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {savedQAList.length} ready
                    </span>
                  </div>

                  {savedQAList.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 space-y-2">
                      <MessageSquareQuote className="w-8 h-8 mx-auto opacity-40 text-indigo-400" />
                      <p className="text-xs">No saved answers yet.</p>
                      <Link
                        to="/career-qa"
                        className="inline-block text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Generate answers in Career Q&A →
                      </Link>
                    </div>
                  ) : (
                    savedQAList.map((qa, idx) => {
                      const ansText = qa.savedAnswer || qa.aiDraft || "";
                      return (
                        <div
                          key={qa._id || idx}
                          className="p-3 rounded-2xl bg-indigo-500/5 dark:bg-zinc-900/60 border border-indigo-500/20 dark:border-white/5 space-y-2"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="font-bold text-gray-900 dark:text-white text-xs leading-snug">
                              {qa.question}
                            </h5>
                            <button
                              onClick={() => copyToClipboard(ansText, `Answer for "${qa.question}"`, `qa-${idx}`)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                            >
                              {copiedKey === `qa-${idx}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-300 stroke-[3]" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Answer</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                            {ansText}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 1: CONTACT & BIO */}
              {activeCopilotTab === "quick" && (
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-1">
                    Click to Copy Any Field:
                  </div>

                  {[
                    { label: "Full Name", val: info.fullName, icon: User, key: "name" },
                    { label: "Email Address", val: info.email, icon: Mail, key: "email" },
                    { label: "Phone Number", val: info.phone, icon: Phone, key: "phone" },
                    { label: "Location", val: info.location, icon: MapPin, key: "loc" },
                    { label: "LinkedIn URL", val: info.linkedin, icon: Linkedin, key: "linkedin" },
                    { label: "GitHub URL", val: info.github, icon: Github, key: "github" },
                    { label: "Portfolio URL", val: info.portfolio, icon: Globe, key: "port" },
                    { label: "Headline", val: info.headline, icon: Sparkles, key: "head" },
                    { label: "Bio / Summary", val: info.bio, icon: Layers, key: "bio" },
                  ].map((field) => (
                    <button
                      key={field.key}
                      onClick={() => copyToClipboard(field.val, field.label, field.key)}
                      disabled={!field.val}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-2 text-left transition-all cursor-pointer group ${
                        field.val
                          ? "bg-gray-50/80 dark:bg-zinc-900/60 border-gray-200/80 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-500/30"
                          : "opacity-40 bg-gray-50/40 dark:bg-zinc-900/20 border-dashed border-gray-200 dark:border-white/5 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <field.icon className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400 shrink-0 group-hover:text-blue-500" />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                            {field.label}
                          </span>
                          <span className="block text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {field.val || "Not provided"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1 transition-all ${
                          copiedKey === field.key
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 group-hover:bg-blue-600 group-hover:text-white"
                        }`}
                      >
                        {copiedKey === field.key ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 2: SKILLS LIST */}
              {activeCopilotTab === "skills" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                        All Skills (Comma-Separated)
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {skills.length} skills total
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-300 font-mono line-clamp-2 leading-relaxed">
                      {allSkillsString || "No skills added yet."}
                    </p>
                    <button
                      onClick={() => copyToClipboard(allSkillsString, "All Skills List", "all-skills")}
                      disabled={skills.length === 0}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      {copiedKey === "all-skills" ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Copied All Skills!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy All Skills for Job Application</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500">
                      Copy Individual Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => copyToClipboard(s.name, s.name, `skill-${idx}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 hover:border-blue-500 text-gray-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <span>{s.name}</span>
                          {copiedKey === `skill-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-50" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WORK EXPERIENCE */}
              {activeCopilotTab === "experience" && (
                <div className="space-y-3">
                  {experience.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">No experience records found</div>
                  ) : (
                    experience.map((exp, idx) => {
                      const bulletsText = Array.isArray(exp.responsibilities)
                        ? exp.responsibilities.join("\n")
                        : exp.responsibilities || "";

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-gray-50/80 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-white/5 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-gray-900 dark:text-white text-xs">
                                {exp.position || exp.jobTitle}
                              </h5>
                              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                                {exp.company} • {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(bulletsText, `${exp.company} Bullets`, `exp-bullets-${idx}`)
                              }
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100 cursor-pointer"
                            >
                              {copiedKey === `exp-bullets-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy Bullets</span>
                            </button>
                          </div>

                          <p className="text-[11px] text-gray-600 dark:text-zinc-300 font-mono line-clamp-3 leading-relaxed whitespace-pre-line">
                            {bulletsText || "No bullet points"}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 4: PROJECTS */}
              {activeCopilotTab === "projects" && (
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">No project records found</div>
                  ) : (
                    projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-gray-50/80 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-white/5 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-gray-900 dark:text-white text-xs">
                              {proj.name}
                            </h5>
                            <p className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono truncate">
                              {proj.liveUrl || proj.githubUrl || "Project"}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${proj.name}: ${proj.shortDescription || proj.description || ""}\nTech Stack: ${
                                  Array.isArray(proj.technologies)
                                    ? proj.technologies.join(", ")
                                    : proj.technologies || ""
                                }`,
                                `${proj.name} Summary`,
                                `proj-${idx}`
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100 cursor-pointer"
                          >
                            {copiedKey === `proj-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                          {proj.shortDescription || proj.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bottom Quick Jump Bar */}
            <div className="p-3 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200/80 dark:border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-gray-600 dark:text-zinc-400">
                1-Click Application Copilot
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to="/career-profile"
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  Master Profile
                </Link>
                <span className="text-gray-400">•</span>
                <Link
                  to="/career-qa"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Career Q&A
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
