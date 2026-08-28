import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Star,
  Copy,
  Check,
  Clock,
  Volume2,
  RefreshCw,
  HelpCircle,
  Target,
  Edit3,
  Bookmark,
  Lightbulb,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import QAVoicePractice from "./QAVoicePractice";

export default function QAStudio({
  selectedItem,
  editedAnswer,
  setEditedAnswer,
  generating,
  savingAnswer,
  copied,
  onCopy,
  onToggleStar,
  answerLength,
  setAnswerLength,
  answerTone,
  setAnswerTone,
  durationOptions,
  toneOptions,
  onGenerateAnswer,
  onSaveToAnswerBank,
  missingInfoTip,
  talkingPoints,
  categoryBadgeStyles,
}) {
  const [copiedType, setCopiedType] = useState(null);

  if (!selectedItem) {
    return (
      <div className="bg-white dark:bg-zinc-950/90 rounded-3xl p-16 border border-gray-200/80 dark:border-white/[0.08] shadow-sm text-center text-gray-400 space-y-3">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700" />
        <h3 className="text-base font-bold text-gray-700 dark:text-zinc-300">
          Select a question from the left bank
        </h3>
        <p className="text-xs max-w-sm mx-auto text-gray-500 dark:text-zinc-500 leading-relaxed">
          Choose any HR, behavioral, or project question to generate answers grounded in your verified career history.
        </p>
      </div>
    );
  }

  const categoryStyle =
    categoryBadgeStyles[selectedItem.category] ||
    "bg-purple-500/10 text-purple-600 border-purple-500/20";

  // Helper for quick-copying variations
  const copyVariation = (type) => {
    if (!editedAnswer?.trim()) {
      toast.error("No answer content to copy");
      return;
    }

    let textToCopy = editedAnswer;
    if (type === "elevator") {
      const sentences = editedAnswer.match(/[^.!?]+[.!?]+/g) || [editedAnswer];
      textToCopy = sentences.slice(0, 2).join(" ").trim();
    } else if (type === "bullets") {
      const sentences = editedAnswer.match(/[^.!?]+[.!?]+/g) || [editedAnswer];
      textToCopy = sentences.map((s) => `• ${s.trim()}`).join("\n");
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    toast.success(
      type === "elevator"
        ? "Copied Elevator Pitch (Short Form)!"
        : type === "bullets"
        ? "Copied as Bullet Points!"
        : "Copied Full Answer to Clipboard!",
      { icon: "📋", duration: 1500 }
    );
    setTimeout(() => setCopiedType(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-zinc-950/90 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-2xl space-y-6">
      {/* Active Question Header Card */}
      <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-white/[0.08]">
        <div className="flex items-center justify-between gap-4">
          <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border ${categoryStyle}`}>
            Category: {selectedItem.category}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyVariation("full")}
              disabled={!editedAnswer}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-200 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all disabled:opacity-40 cursor-pointer shadow-xs"
            >
              {copiedType === "full" || copied ? (
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copiedType === "full" || copied ? "Copied!" : "1-Click Copy Answer"}</span>
            </button>

            <button
              onClick={(e) => onToggleStar(selectedItem, e)}
              className={`p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                selectedItem.isStarred ? "text-amber-400" : "text-gray-400"
              }`}
              title="Star favorite"
            >
              <Star className={`w-4 h-4 ${selectedItem.isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white leading-snug tracking-tight">
          "{selectedItem.question}"
        </h2>

        {/* Interviewer Tip */}
        {selectedItem.hint && (
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Interviewer Tip:</span> {selectedItem.hint}
            </div>
          </div>
        )}

        {/* Tags */}
        {selectedItem.tags && selectedItem.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {selectedItem.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200/50 dark:border-white/[0.05]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Length & Tone Segmented Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-white/[0.08] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>Response Duration</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200/60 dark:border-white/[0.06]">
              {durationOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswerLength(opt.id)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    answerLength === opt.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {opt.id === "short" ? "Short" : opt.id === "standard" ? "Standard" : "Detailed"}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Speaking Tone</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200/60 dark:border-white/[0.06]">
              {toneOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswerTone(opt.id)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    answerTone === opt.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {opt.id === "conversational"
                    ? "Conversational"
                    : opt.id === "professional"
                    ? "Professional"
                    : "Concise"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate / Regenerate Action Trigger */}
        <button
          onClick={onGenerateAnswer}
          disabled={generating}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {generating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-yellow-300" />
          )}
          <span>
            {generating
              ? "Synthesizing answer from your Career Profile..."
              : editedAnswer
              ? "Regenerate Answer with AI"
              : "✨ Generate Personalized Answer"}
          </span>
        </button>
      </div>

      {/* 🎙️ Voice Practice & Audio Playback Studio */}
      {editedAnswer.trim() && (
        <QAVoicePractice
          answerText={editedAnswer}
          questionText={selectedItem.question}
        />
      )}

      {/* Missing Info Feedback / Coach Tip */}
      {missingInfoTip && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Coach Feedback:</span> {missingInfoTip}
          </div>
        </div>
      )}

      {/* Key Strategy & Talking Points */}
      {talkingPoints && talkingPoints.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-white/[0.08] rounded-2xl space-y-2 text-xs">
          <div className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Key Strategy & Talking Points:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-zinc-300 leading-relaxed text-xs">
            {talkingPoints.map((tp, idx) => (
              <li key={idx}>{tp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Editable Answer Studio Box with Quick-Copy AI Formats */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <label className="font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
            <Edit3 className="w-3.5 h-3.5 text-purple-500" />
            <span>Your Custom / Final Saved Answer</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-900 text-[10px] text-gray-500 font-normal">
              {editedAnswer.split(/\s+/).filter(Boolean).length} words
            </span>
          </label>

          {/* Quick-Copy AI Formats Toolbar */}
          {editedAnswer.trim() && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => copyVariation("elevator")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-500/20 text-[10px] font-bold hover:bg-blue-100 transition-all cursor-pointer"
                title="Copy first 2 sentences for short application boxes"
              >
                {copiedType === "elevator" ? (
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                ) : (
                  <Zap className="w-3 h-3 text-amber-500" />
                )}
                <span>Copy Short Form (2 sentences)</span>
              </button>

              <button
                type="button"
                onClick={() => copyVariation("bullets")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-white/5 text-[10px] font-bold hover:bg-gray-200 transition-all cursor-pointer"
                title="Copy as bullet points"
              >
                {copiedType === "bullets" ? (
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copy Bullets</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all shadow-xs">
          <textarea
            rows={9}
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
            placeholder="Click 'Generate Personalized Answer' or write your custom talking points here..."
            className="w-full p-4 sm:p-5 bg-transparent text-sm leading-relaxed text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none font-sans resize-y"
          />
        </div>
      </div>

      {/* Save Final Answer Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onSaveToAnswerBank}
          disabled={savingAnswer || !editedAnswer.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {savingAnswer ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          <span>Save to My Answer Bank ⭐</span>
        </button>
      </div>
    </div>
  );
}
