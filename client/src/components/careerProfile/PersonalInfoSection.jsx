import { Sparkles, User } from "lucide-react";

export default function PersonalInfoSection({ profile, setProfile, onOpenAIModal }) {
  const info = profile.personalInfo || {};

  const updateField = (field, val) => {
    setProfile({
      ...profile,
      personalInfo: { ...info, [field]: val },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/[0.08]">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Personal & Contact Information
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Primary details, career objective, and social portfolio links.
          </p>
        </div>
        <button
          onClick={() => onOpenAIModal("personal")}
          className="text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold transition-all hover:bg-purple-100 dark:hover:bg-purple-900/50 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Paste & Structure</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Full Name *
          </label>
          <input
            type="text"
            value={info.fullName || ""}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="e.g. Atharva Kulkarni"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Preferred Name
          </label>
          <input
            type="text"
            value={info.preferredName || ""}
            onChange={(e) => updateField("preferredName", e.target.value)}
            placeholder="e.g. Atharva"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Professional Headline
          </label>
          <input
            type="text"
            value={info.headline || ""}
            onChange={(e) => updateField("headline", e.target.value)}
            placeholder="e.g. Full-Stack Engineer | React, Node.js & Cloud Architectures"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Bio / Summary
          </label>
          <textarea
            rows={3}
            value={info.bio || ""}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="Concise overview of your professional background, engineering philosophy, and strengths..."
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm leading-relaxed transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Career Objective
          </label>
          <input
            type="text"
            value={info.careerObjective || ""}
            onChange={(e) => updateField("careerObjective", e.target.value)}
            placeholder="e.g. Seeking high-impact software engineering roles building scalable distributed systems"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Email Address
          </label>
          <input
            type="email"
            value={info.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Phone Number
          </label>
          <input
            type="text"
            value={info.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Location / City, Country
          </label>
          <input
            type="text"
            value={info.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={info.linkedin || ""}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            GitHub URL
          </label>
          <input
            type="url"
            value={info.github || ""}
            onChange={(e) => updateField("github", e.target.value)}
            placeholder="https://github.com/username"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Portfolio URL
          </label>
          <input
            type="url"
            value={info.portfolio || ""}
            onChange={(e) => updateField("portfolio", e.target.value)}
            placeholder="https://yourportfolio.com"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}
