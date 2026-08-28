import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function PersonalInfoSection({ profile, setProfile, onOpenAIModal }) {
  const info = profile.personalInfo || {};
  const [copiedField, setCopiedField] = useState(null);

  const updateField = (field, val) => {
    setProfile({
      ...profile,
      personalInfo: { ...info, [field]: val },
    });
  };

  const copyValue = (val, label, key) => {
    if (!val) {
      toast.error(`No ${label} to copy`);
      return;
    }
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const CopyBtn = ({ val, label, fieldKey }) => (
    <button
      type="button"
      onClick={() => copyValue(val, label, fieldKey)}
      disabled={!val}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
        val
          ? "bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400"
          : "opacity-40 cursor-not-allowed text-gray-400"
      }`}
      title={`Copy ${label}`}
    >
      {copiedField === fieldKey ? (
        <>
          <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-2.5 h-2.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/[0.08]">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Personal & Contact Information</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
              1-Click Copy Ready
            </span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Primary details, career objective, and social portfolio links. Click [Copy] next to any field to paste into job portals.
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Full Name *
            </label>
            <CopyBtn val={info.fullName} label="Full Name" fieldKey="fullName" />
          </div>
          <input
            type="text"
            value={info.fullName || ""}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="e.g. Atharva Kulkarni"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Preferred Name
            </label>
            <CopyBtn val={info.preferredName} label="Preferred Name" fieldKey="preferredName" />
          </div>
          <input
            type="text"
            value={info.preferredName || ""}
            onChange={(e) => updateField("preferredName", e.target.value)}
            placeholder="e.g. Atharva"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Professional Headline
            </label>
            <CopyBtn val={info.headline} label="Headline" fieldKey="headline" />
          </div>
          <input
            type="text"
            value={info.headline || ""}
            onChange={(e) => updateField("headline", e.target.value)}
            placeholder="e.g. Full-Stack Engineer | React, Node.js & Cloud Architectures"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Bio / Summary
            </label>
            <CopyBtn val={info.bio} label="Bio / Summary" fieldKey="bio" />
          </div>
          <textarea
            rows={3}
            value={info.bio || ""}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="Concise overview of your professional background, engineering philosophy, and strengths..."
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm leading-relaxed transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Career Objective
            </label>
            <CopyBtn val={info.careerObjective} label="Career Objective" fieldKey="careerObjective" />
          </div>
          <input
            type="text"
            value={info.careerObjective || ""}
            onChange={(e) => updateField("careerObjective", e.target.value)}
            placeholder="e.g. Seeking high-impact software engineering roles building scalable distributed systems"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Email Address
            </label>
            <CopyBtn val={info.email} label="Email Address" fieldKey="email" />
          </div>
          <input
            type="email"
            value={info.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Phone Number
            </label>
            <CopyBtn val={info.phone} label="Phone Number" fieldKey="phone" />
          </div>
          <input
            type="text"
            value={info.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Location / City, Country
            </label>
            <CopyBtn val={info.location} label="Location" fieldKey="location" />
          </div>
          <input
            type="text"
            value={info.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              LinkedIn URL
            </label>
            <CopyBtn val={info.linkedin} label="LinkedIn URL" fieldKey="linkedin" />
          </div>
          <input
            type="url"
            value={info.linkedin || ""}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              GitHub URL
            </label>
            <CopyBtn val={info.github} label="GitHub URL" fieldKey="github" />
          </div>
          <input
            type="url"
            value={info.github || ""}
            onChange={(e) => updateField("github", e.target.value)}
            placeholder="https://github.com/username"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              Portfolio URL
            </label>
            <CopyBtn val={info.portfolio} label="Portfolio URL" fieldKey="portfolio" />
          </div>
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
