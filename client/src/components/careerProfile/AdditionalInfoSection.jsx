export default function AdditionalInfoSection({ profile, setProfile }) {
  const additional = profile.additionalInfo || {};

  const updateLanguages = (val) => {
    const langs = val
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => ({ language: l, proficiency: "Fluent" }));
    setProfile({
      ...profile,
      additionalInfo: { ...additional, languages: langs },
    });
  };

  const updateHobbies = (val) => {
    const hobbies = val
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    setProfile({
      ...profile,
      additionalInfo: { ...additional, hobbies },
    });
  };

  const languagesValue = (additional.languages || [])
    .map((l) => (typeof l === "string" ? l : l.language))
    .join(", ");

  const hobbiesValue = (additional.hobbies || []).join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/[0.08]">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Additional Information
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Spoken languages, hobbies, and personal career interests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Spoken Languages (comma-separated)
          </label>
          <input
            type="text"
            value={languagesValue}
            onChange={(e) => updateLanguages(e.target.value)}
            placeholder="English, Spanish, German, Hindi"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 block">
            Hobbies & Interests (comma-separated)
          </label>
          <input
            type="text"
            value={hobbiesValue}
            onChange={(e) => updateHobbies(e.target.value)}
            placeholder="Competitive Coding, Open Source, UI Design, Chess, Hiking"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}
