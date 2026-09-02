import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";
import EvilChartsLandingMatrix from "../components/landing-v2/EvilChartsLandingMatrix";
import PlayfulColorfulBento from "../components/landing-v2/PlayfulColorfulBento";
import HowItWorksSection from "../components/landing-v2/HowItWorksSection";
import { TestimonialsHomeSection } from "../components/home";
import PricingSection from "../components/landing-v2/PricingSection";
import FAQSection from "../components/landing-v2/FAQSection";
import FinalCTABanner from "../components/landing-v2/FinalCTABanner";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isExplicitPreview =
    location.pathname === "/landing-preview" ||
    location.pathname === "/landing-v2";

  if (!isExplicitPreview && !loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEO
        title="SmartNShine - #1 ATS Resume Builder & Career Intelligence Platform"
        description="Build ATS-proof resumes, deploy live developer portfolios, run keyword gap audits, and practice real AI mock interviews."
        keywords="ATS resume templates, resume optimizer, developer portfolio generator, AI mock interview, Workday ATS scanner"
        url="https://www.smartnshine.app"
      />

      {/* 1. Hero Section Matrix with Hardware-Accelerated Gliding Reels & Specular Shader */}
      <EvilChartsLandingMatrix />

      {/* 2. Colorful Bento Grid — Platform Capabilities */}
      <PlayfulColorfulBento />

      {/* 3. How It Works — 3-step visual flow */}
      <HowItWorksSection />

      {/* 4. Testimonials — Real Social Proof */}
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
