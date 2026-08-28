import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BottomCtaSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
      <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Ready to Accelerate Your Career?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 max-w-xl mx-auto">
          Build your ATS-optimized resume, test it with diagnostic scans, and launch your public portfolio today.
        </p>
        <div className="pt-2">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-98 cursor-pointer"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
