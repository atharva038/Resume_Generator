import { Star } from "lucide-react";
import TestimonialsSection from "../ui/testimonials-3";

export default function TestimonialsHomeSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="mx-auto max-w-xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Proven Career Outcomes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Loved by Engineers & Leaders Worldwide
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
          Don't take our word for it — here's how candidates unlocked dream interviews and accelerated offers with SmartNShine.
        </p>
      </div>

      <TestimonialsSection />
    </section>
  );
}
