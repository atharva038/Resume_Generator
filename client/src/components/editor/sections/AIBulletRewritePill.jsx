import React, { useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import AIBulletPolishModal from "./AIBulletPolishModal";

export default function AIBulletRewritePill({
  text,
  onApply,
  sectionType = "experience",
  context = {},
  resumeData = null,
  className = "",
  buttonText = "AI Rewrite",
  alwaysVisible = false,
  size = "sm",
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={!text || !text.trim()}
        title="Polish with AI (Quantified, Executive, ATS Keyword-Enriched)"
        className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-200 cursor-pointer ${
          alwaysVisible
            ? "opacity-100 scale-100"
            : "opacity-0 group-hover:opacity-100 focus:opacity-100 group-focus-within:opacity-100 scale-95 group-hover:scale-100"
        } ${
          size === "xs"
            ? "px-2 py-0.5 text-[11px]"
            : "px-2.5 py-1 text-xs"
        } bg-zinc-900 hover:bg-black text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 border border-zinc-700 dark:border-zinc-600 shadow-xs hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
      >
        <Sparkles className={`${size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"} text-amber-400 shrink-0`} />
        <span>{buttonText}</span>
      </button>

      {modalOpen && (
        <AIBulletPolishModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          originalText={text}
          onApply={onApply}
          sectionType={sectionType}
          context={context}
          resumeData={resumeData}
        />
      )}
    </>
  );
}
