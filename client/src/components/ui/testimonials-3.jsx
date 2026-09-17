import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const defaultTestimonials = [
  {
    quote:
      "The ATS diagnostic engine caught 4 crucial missing keywords before my recruiter screen. Landed the offer in 2 weeks.",
    name: "Anshu Nagnurwar",
    role: "Software Engineer",
    company: "Tech Lead",
  },
  {
    quote:
      "The AI bullet enhancement preserved my authentic voice while making every single impact quantifiable.",
    name: "Anuj Nandgaonkar",
    role: "Full Stack Developer",
    company: "Student",
  },
  {
    quote:
      "Being able to generate both an ATS resume and a live portfolio website from one master profile is game-changing.",
    name: "Vibhanshu Titirmare",
    role: "Frontend Developer",
    company: "Design Systems",
  },
];

function DecorIcon({ className, ...props }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-1 size-3.5 shrink-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)] stroke-1 stroke-gray-400 dark:stroke-zinc-600",
        className
      )}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function QuoteIcon({ className, ...props }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

export function TestimonialsSection({ items = defaultTestimonials }) {
  return (
    <div className="mx-auto mt-6 grid w-full max-w-6xl gap-8 md:grid-cols-3 md:gap-6">
      {items.map((testimonial, index) => (
        <TestimonialCard
          index={index}
          key={testimonial.name}
          testimonial={testimonial}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial, index, className, ...props }) {
  const { quote, name, role, company } = testimonial;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 55, scale: 0.94, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={cn(
        "group relative flex flex-col justify-between gap-6 p-7 sm:p-8 shadow-xs bg-white dark:bg-zinc-900/80 rounded-3xl border border-gray-200/90 dark:border-white/10 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/40",
        "md:translate-y-[calc(1.5rem*var(--t-card-index))]",
        className
      )}
      style={{
        "--t-card-index": index,
      }}
      {...props}
    >
      <div className="absolute -inset-y-4 -left-px w-px bg-gray-200/60 dark:bg-white/10 hidden md:block" />
      <div className="absolute -inset-y-4 -right-px w-px bg-gray-200/60 dark:bg-white/10 hidden md:block" />
      <div className="absolute -inset-x-4 -top-px h-px bg-gray-200/60 dark:bg-white/10 hidden md:block" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-gray-200/60 dark:bg-white/10 hidden md:block" />
      <DecorIcon className="hidden md:block" />

      <blockquote className="flex gap-4 items-start">
        <QuoteIcon
          aria-hidden="true"
          className="size-5 shrink-0 stroke-1 text-blue-600 dark:text-blue-400 mt-1"
        />

        <p className="flex-1 font-light text-base sm:text-[16px] text-gray-700 dark:text-zinc-300 leading-relaxed">
          "{quote}"
        </p>
      </blockquote>

      <figcaption className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-white/5">
        <div className="flex flex-col text-left">
          <cite className="font-normal text-gray-900 dark:text-white text-base not-italic">
            {name}
          </cite>
          <p className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm font-light mt-0.5">
            {role} <span className="text-gray-400 dark:text-zinc-500">•</span> <span className="text-gray-800 dark:text-zinc-200 font-medium">{company}</span>
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
          {name.charAt(0)}
        </div>
      </figcaption>
    </motion.figure>
  );
}

export default TestimonialsSection;
