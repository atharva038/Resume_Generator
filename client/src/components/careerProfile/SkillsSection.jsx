import { Sparkles, Plus, Trash2 } from "lucide-react";

export default function SkillsSection({
  profile,
  setProfile,
  skillCategories,
  newSkillName,
  setNewSkillName,
  newSkillCategory,
  setNewSkillCategory,
  onAddSkill,
  onRemoveSkill,
  onOpenAIModal,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/[0.08]">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Categorized Skills Bank
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Add technical skills, frameworks, cloud platforms, and tools.
          </p>
        </div>
        <button
          onClick={() => onOpenAIModal("skills")}
          className="text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold transition-all hover:bg-purple-100 dark:hover:bg-purple-900/50 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Paste & Categorize</span>
        </button>
      </div>

      {/* Quick Add Form */}
      <div className="p-5 rounded-3xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-white/[0.08] space-y-3 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
          Quick Add New Skill
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Skill Name (e.g. React, Docker, Python)"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddSkill()}
            className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-xs"
          />
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-xs"
          >
            {skillCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={onAddSkill}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Display Skills by Category */}
      <div className="space-y-5">
        {skillCategories.map((cat) => {
          const categorySkills = (profile.skills || []).filter((s) => s.category === cat);
          if (categorySkills.length === 0) return null;

          return (
            <div key={cat} className="space-y-2.5">
              <div className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>{cat}</span>
                <span className="text-[11px] bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full font-semibold">
                  {categorySkills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {categorySkills.map((s, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-white/[0.08] rounded-2xl text-xs shadow-xs hover:border-gray-300 dark:hover:border-white/20 transition-all"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{s.name}</span>
                    {s.proficiency && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                        {s.proficiency}
                      </span>
                    )}
                    <button
                      onClick={() => onRemoveSkill(s.name)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer p-0.5"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {(!profile.skills || profile.skills.length === 0) && (
          <div className="text-center py-12 text-gray-400 dark:text-zinc-500 text-xs">
            No skills added yet. Use the quick add box above or click "Paste & Categorize".
          </div>
        )}
      </div>
    </div>
  );
}
