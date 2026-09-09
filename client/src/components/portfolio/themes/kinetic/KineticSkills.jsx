import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass } from "lucide-react";
import KineticFieldShader from "./KineticFieldShader";

/**
 * KineticSkills & Capabilities Chapter
 * Features the Second Generative Environment (KineticFieldShader),
 * Pure dynamic data extraction, and clean typographic capabilities.
 */
export default function KineticSkills({
  bio = "",
  headline = "",
  location = "",
  role = "",
  skills = [],
  stats = [],
  isDark = false,
  accentColor = "#2563eb",
}) {
  // Robust dynamic normalization of skills across all data structures
  const skillCategories = useMemo(() => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return [];
    }

    // 1. Array of categorized groups (e.g. [{ category: "Languages", skills: ["JS", "TS"] }])
    const isCategoryGrouped = skills.some(
      (s) => s && typeof s === "object" && (Array.isArray(s.skills) || Array.isArray(s.items))
    );

    if (isCategoryGrouped) {
      return skills
        .map((group) => {
          if (!group || typeof group !== "object") return null;
          const catName = group.category || group.name || group.title || "CAPABILITIES";
          const rawItems = group.skills || group.items || [];
          const items = rawItems
            .map((item) => {
              if (typeof item === "string") return item.trim();
              if (item && typeof item === "object") return (item.name || item.skill || item.title || "").trim();
              return "";
            })
            .filter(Boolean);

          return items.length > 0 ? { category: catName.toUpperCase(), items } : null;
        })
        .filter(Boolean);
    }

    // 2. Array of objects with individual category property: [{ name: "React", category: "Frontend" }]
    const hasIndividualCategories = skills.some(
      (s) => s && typeof s === "object" && s.category && (s.name || s.skill || s.title)
    );

    if (hasIndividualCategories) {
      const grouped = {};
      skills.forEach((s) => {
        if (!s || typeof s !== "object") return;
        const cat = (s.category || "CAPABILITIES").toUpperCase();
        const skillName = (s.name || s.skill || s.title || "").trim();
        if (!skillName) return;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(skillName);
      });

      return Object.entries(grouped)
        .map(([category, items]) => ({ category, items }))
        .filter((g) => g.items.length > 0);
    }

    // 3. Flat array of strings or objects: ["JavaScript", "Python"] or [{ name: "JavaScript" }]
    const flat = skills
      .map((s) => {
        if (typeof s === "string") return s.trim();
        if (s && typeof s === "object") return (s.name || s.skill || s.title || "").trim();
        return "";
      })
      .filter(Boolean);

    if (flat.length === 0) return [];

    const chunkSize = Math.max(3, Math.ceil(flat.length / 4));
    const groups = [];
    for (let i = 0; i < flat.length; i += chunkSize) {
      const slice = flat.slice(i, i + chunkSize);
      const groupNum = Math.floor(i / chunkSize) + 1;
      groups.push({
        category: groupNum === 1 ? "CORE CAPABILITIES" : `TECHNICAL SKILLS ${groupNum}`,
        items: slice,
      });
    }
    return groups;
  }, [skills]);

  const hasMeta = Boolean(location || role);
  const hasHeadline = Boolean(headline);
  const hasStats = Array.isArray(stats) && stats.length > 0;

  return (
    <section
      id="kinetic-about-section"
      className="relative min-h-[60vh] w-full overflow-hidden bg-[var(--kn-bg)] py-24 sm:py-28"
    >
      {/* Generative Shader Environment 02 (Fine Particle Light Field) */}
      <KineticFieldShader isDark={isDark} accentColor={accentColor} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-20">
        
        {/* CHAPTER 01: STATEMENT (Only if headline provided) */}
        {(hasHeadline || hasMeta) && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="kn-meta-tag text-[var(--kn-accent)] font-semibold">
                03 / PROFILE & CAPABILITIES
              </span>
              <span className="h-px w-12 bg-[var(--kn-border-strong)]" />
            </div>

            {hasHeadline && (
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="kn-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-[var(--kn-text-primary)] max-w-5xl"
              >
                “{headline}”
              </motion.h2>
            )}

            {hasMeta && (
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--kn-border)] text-xs sm:text-sm font-mono text-[var(--kn-text-muted)]">
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[var(--kn-accent)]" />
                    <span className="text-[var(--kn-text-primary)]">LOCATION: {location}</span>
                  </div>
                )}
                {role && (
                  <div className="flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-[var(--kn-accent)]" />
                    <span className="text-[var(--kn-text-primary)]">FOCUS: {role}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CHAPTER 02: STATISTICS (Only if real stats exist) */}
        {hasStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-[var(--kn-border)] py-10">
            {stats.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="space-y-1"
              >
                <div className="kn-headline text-3xl sm:text-5xl font-bold text-[var(--kn-text-primary)]">
                  {item.value || item.count || item.number}
                </div>
                <div className="kn-meta-tag text-[10px] text-[var(--kn-text-muted)] uppercase">
                  {item.label || item.title || item.name}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CHAPTER 03: TYPOGRAPHIC SKILLS & CAPABILITIES */}
        {skillCategories.length > 0 && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-[var(--kn-border)] pb-4">
              <span className="kn-meta-tag text-[var(--kn-accent)] font-semibold uppercase tracking-wider">
                SKILLS & CAPABILITIES
              </span>
              <span className="kn-mono text-xs text-[var(--kn-text-muted)]">
                {skillCategories.reduce((acc, g) => acc + g.items.length, 0)} TECHNOLOGIES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {skillCategories.map((group, gIdx) => (
                <motion.div
                  key={gIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: gIdx * 0.08 }}
                  className="space-y-4"
                >
                  <h3 className="kn-display text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--kn-text-primary)] border-b border-[var(--kn-border-strong)] pb-2.5">
                    {group.category}
                  </h3>

                  <ul className="space-y-2">
                    {group.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        className="group flex items-center justify-between text-xs sm:text-sm font-mono text-[var(--kn-text-secondary)] transition-colors hover:text-[var(--kn-text-primary)]"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[var(--kn-border-strong)] group-hover:bg-[var(--kn-accent)] transition-colors" />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
