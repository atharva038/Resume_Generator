import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Eye } from "lucide-react";

export default function TemplatesGridShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templatesList = [
    {
      id: "classic",
      name: "Classic ATS",
      category: "Professional",
      atsScore: 98,
      desc: "Traditional single-column serif format optimized for Taleo & Workday.",
      image: "/templates/classic.webp",
      tag: "Top Recruiter Choice",
    },
    {
      id: "minimal",
      name: "Minimalist Pro",
      category: "Modern",
      atsScore: 99,
      desc: "High-density clean typography with maximum whitespace clarity.",
      image: "/templates/minimal.webp",
      tag: "99% Pass Rate",
    },
    {
      id: "tech",
      name: "Tech Stack Developer",
      category: "Engineering",
      atsScore: 97,
      desc: "Tailored for software engineers with dedicated GitHub & system architecture blocks.",
      image: "/templates/tech.webp",
      tag: "Developer Favorite",
    },
    {
      id: "modern",
      name: "Modern Two-Column",
      category: "Modern",
      atsScore: 95,
      desc: "Contemporary sidebar layout for Product, Marketing, and Tech Leads.",
      image: "/templates/modern.webp",
      tag: "High Visual Appeal",
    },
    {
      id: "professional",
      name: "Executive Elite",
      category: "Executive",
      atsScore: 97,
      desc: "Strategic leadership layout emphasizing revenue growth and ROI metrics.",
      image: "/templates/professional.webp",
      tag: "Leadership Standard",
    },
    {
      id: "impact-pro",
      name: "Impact Pro Metrics",
      category: "Engineering",
      atsScore: 98,
      desc: "STAR-method driven format highlighting quantifiable impact and metrics.",
      image: "/templates/impact-pro.webp",
      tag: "Metrics-First",
    },
  ];

  const filtered =
    selectedCategory === "all"
      ? templatesList
      : templatesList.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="templates" className="scroll-mt-12 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              [ 01 // TEMPLATES CATALOG ]
            </span>
            <span className="text-xs text-zinc-400">• 12+ Verified Formats</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            Recruiter-Approved ATS Templates
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          {["all", "Professional", "Engineering", "Modern", "Executive"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {cat === "all" ? "All Formats" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141a] p-4 shadow-sm hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Template Mockup Card */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 mb-3 group-hover:scale-[1.01] transition-transform">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback to minimal SVG representation if image is missing
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Score Pill Overlay */}
                <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900/90 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{item.atsScore}% ATS</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 inline-flex items-center px-2 py-0.5 rounded bg-blue-600/90 text-white text-[10px] font-semibold backdrop-blur-xs">
                  {item.tag}
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {item.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            {/* Action link */}
            <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                {item.category}
              </span>
              <Link
                to={`/templates?template=${item.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
