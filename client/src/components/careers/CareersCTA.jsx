import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Mail, Rocket } from "lucide-react";

export default function CareersCTA({ onExploreRoles, onGeneralApply }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl sm:rounded-[36px] bg-zinc-950 text-white p-8 sm:p-14 lg:p-18 overflow-hidden border border-zinc-800 shadow-2xl">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-xs font-medium mb-6 border border-white/10 backdrop-blur-md">
              <Rocket className="w-3.5 h-3.5 text-blue-400" />
              <span>Founding Cohort</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15]">
              Have the drive to co-build from{" "}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Zero to One?
              </span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl">
              We have the tech and live working product ready. Now let's turn this into an industry-leading AI career ecosystem together. Join the founding team today.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExploreRoles}
                className="px-7 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-medium text-sm sm:text-base shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Explore Founding Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGeneralApply}
                className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-sm sm:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>Pitch Yourself (Wildcard)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
