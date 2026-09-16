import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import TestimonialsSection from "../ui/testimonials-3";

export default function TestimonialsHomeSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center space-y-4"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 dark:text-white tracking-tight leading-tight">
          Loved by Engineers & Leaders <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">Worldwide</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
          Real reviews from developers and job seekers who unlocked dream interviews and accelerated offers with SmartNShine.
        </p>
      </motion.div>

      <TestimonialsSection />
    </section>
  );
}
