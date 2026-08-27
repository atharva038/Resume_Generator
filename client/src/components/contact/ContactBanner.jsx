import { Mail, MessageSquare, Sparkles, Clock, ShieldCheck } from "lucide-react";

export default function ContactBanner({ activeTab, setActiveTab }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold w-fit">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>We're Here to Help</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Get in Touch
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
              Have questions regarding AI resume optimization, subscription billing, or bug reports? Our specialized engineering and career support teams are standing by.
            </p>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap md:flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/80 dark:border-white/5 text-xs font-bold text-gray-700 dark:text-zinc-300">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Average Response: &lt; 2 Hours</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/80 dark:border-white/5 text-xs font-bold text-gray-700 dark:text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Direct Support & Encryption</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => setActiveTab("contact")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === "contact"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md shadow-black/10 dark:shadow-white/10"
                : "bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Direct Contact</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === "feedback"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md shadow-black/10 dark:shadow-white/10"
                : "bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Product Feedback & Bugs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
