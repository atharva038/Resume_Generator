import SEO from "../components/common/SEO";
import FAQSchema from "../components/common/FAQSchema";
import {
  HeroSection,
  InteractiveStudioSection,
  CorePillarsSection,
  TemplatesShowcaseSection,
  TestimonialsHomeSection,
  FaqSection,
  BottomCtaSection,
  SectionDivider,
  faqs,
} from "../components/home";

export default function Home() {
  return (
    <>
      <SEO
        title="SmartNShine - AI Resume Builder, ATS Scanner & Career Hub"
        description="Build ATS-crushing resumes, practice AI mock interviews, and launch personal portfolio websites with SmartNShine."
        keywords="resume builder, ATS optimization, AI resume, career profile, portfolio builder, mock interviews"
        url="https://www.smartnshine.app"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 font-sans overflow-x-hidden transition-colors duration-200">
        {/* HERO SECTION: UNIFIED CAREER CONTROL CENTER */}
        <HeroSection />

        <SectionDivider />

        {/* NEXT-LEVEL INTERACTIVE CAREER STUDIO WORKBENCH */}
        <InteractiveStudioSection />

        <SectionDivider />

        {/* THE 6 CORE PILLARS BENTO GRID */}
        <CorePillarsSection />

        <SectionDivider />

        {/* 3D INTERACTIVE TEMPLATES SHOWCASE & CAROUSEL */}
        <TemplatesShowcaseSection />

        <SectionDivider />

        {/* TESTIMONIALS */}
        <TestimonialsHomeSection />

        <SectionDivider />

        {/* FAQ ACCORDION */}
        <FaqSection />

        <SectionDivider />

        {/* FINAL CALL TO ACTION */}
        <BottomCtaSection />
      </div>
    </>
  );
}
