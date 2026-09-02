import React from "react";
import SEO from "../components/common/SEO";
import EvilChartsLandingMatrix from "../components/landing-v2/EvilChartsLandingMatrix";
import PlayfulColorfulBento from "../components/landing-v2/PlayfulColorfulBento";
import HowItWorksSection from "../components/landing-v2/HowItWorksSection";
import { TestimonialsHomeSection } from "../components/home";
import PricingSection from "../components/landing-v2/PricingSection";
import FAQSection from "../components/landing-v2/FAQSection";
import FinalCTABanner from "../components/landing-v2/FinalCTABanner";
import Footer from "../components/layout/Footer";

export default function LandingPreview() {
  return (
    <>
      <SEO
        title="SmartNShine - #1 ATS Resume Builder & Career Intelligence Platform"
        description="Build ATS-proof resumes, deploy live developer portfolios, run keyword gap audits, and practice real AI mock interviews."
        keywords="ATS resume templates, resume optimizer, developer portfolio generator, AI mock interview, Workday ATS scanner"
        url="https://www.smartnshine.app/landing-preview"
      />

      {/* 1. Hero Section Matrix with Hardware-Accelerated Gliding Reels */}
      <EvilChartsLandingMatrix />

      {/* 2. Colorful Bento Grid — Platform Capabilities */}
      <PlayfulColorfulBento />

      {/* 3. How It Works — 3-step visual flow */}
      <HowItWorksSection />

      {/* 4. Testimonials — Real Social Proof from Home */}
      <TestimonialsHomeSection />

      {/* 5. Pricing — Real Tiers with Live Data */}
      <PricingSection />

      {/* 6. FAQ Accordion */}
      <FAQSection />

      {/* 7. Final CTA Banner */}
      <FinalCTABanner />

      {/* 8. Global Footer */}
      <Footer />
    </>
  );
}
