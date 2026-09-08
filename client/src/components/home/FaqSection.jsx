import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const faqs = [
  {
    question: "Is my resume data safe and private?",
    answer:
      "Absolutely! We use bank-level encryption. Your resume and master career profile data are stored securely and never shared with third parties. You can export or delete your profile anytime.",
  },
  {
    question: "What makes SmartNShine ATS-optimized?",
    answer:
      "Every template is engineered without complex multi-layer floats or illegible fonts that confuse applicant tracking systems. Our ATS diagnostic engine gives you line-by-line feedback, keyword matching, and structure validation.",
  },
  {
    question: "How does the AI enhancement and interview prep work?",
    answer:
      "We utilize OpenAI GPT-4o to rewrite achievement bullets, quantify career impact, and generate customized role-specific mock interview questions with expert answers.",
  },
  {
    question: "Can I generate a public portfolio website?",
    answer:
      "Yes! You can turn your master career profile into a live, responsive portfolio website with custom themes and a shareable public URL with just 1 click.",
  },
];

export default function FaqSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Clear answers to common questions.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-zinc-900/90 overflow-hidden"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              className="w-full flex justify-between items-center p-5 sm:p-6 text-left cursor-pointer"
            >
              <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                  openFAQ === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFAQ === idx && (
              <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
