import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Play, Pause, Volume2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function AiInterviewShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="interview" className="scroll-mt-12 space-y-6 pt-10 pb-16">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              [ 05 // AI INTERVIEW STUDIO ]
            </span>
            <span className="text-xs text-zinc-400">• Voice & Behavioral Coach</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            Real-Time AI Voice Mock Interviews
          </h2>
        </div>
      </div>

      {/* AI Interview Studio Mockup */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141a] p-6 shadow-sm space-y-6">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* AI Question & Voice Simulator */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>AI RECRUITER (SYSTEM DESIGN & BEHAVIORAL)</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
              "How would you design a distributed rate limiter that handles 50,000 requests per second across multiple regional data centers?"
            </div>

            {/* Audio Waveform Simulation */}
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shrink-0 hover:opacity-90"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <div className="flex-1 flex items-center gap-1 h-6">
                {[40, 70, 30, 90, 60, 45, 80, 100, 50, 75, 30, 65, 85, 40, 95, 60, 30, 70, 85, 50, 60].map(
                  (val, i) => (
                    <span
                      key={i}
                      style={{ height: isPlaying ? `${val}%` : "30%" }}
                      className="flex-1 bg-emerald-500 rounded-full transition-all duration-150"
                    />
                  )
                )}
              </div>
              <span className="text-[11px] font-mono text-zinc-500">0:14 / 1:30</span>
            </div>
          </div>

          {/* Real-time Feedback Breakdown */}
          <div className="md:col-span-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
            <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              REAL-TIME STAR SCORE
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">Technical Accuracy</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">9.4 / 10</span>
              </div>
              <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-zinc-600 dark:text-zinc-400">STAR Structure Adherence</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">92%</span>
              </div>
              <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[92%]" />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-zinc-600 dark:text-zinc-400">Filler Word Count</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">&lt; 1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <span className="text-xs text-zinc-500">Practice full mock interview sessions with instant feedback</span>
          <Link
            to="/ai-interview"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Start Free Mock Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
