import React from "react";
import SEO from "../components/common/SEO";
import LandingNavbar from "../components/landing-v2/LandingNavbar";
import EvilChartsLandingMatrix from "../components/landing-v2/EvilChartsLandingMatrix";
import PlayfulColorfulBento from "../components/landing-v2/PlayfulColorfulBento";
import HowItWorksSection from "../components/landing-v2/HowItWorksSection";
import { TestimonialsHomeSection } from "../components/home";
import PricingSection from "../components/landing-v2/PricingSection";
import FAQSection, { SYSTEM_FAQS } from "../components/landing-v2/FAQSection";
import FAQSchema from "../components/common/FAQSchema";
import FinalCTABanner from "../components/landing-v2/FinalCTABanner";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <>
      <SEO
        title="SmartNShine - #1 ATS Resume Builder & Career Intelligence Platform"
        description="Build ATS-proof resumes, deploy live developer portfolios, and run keyword gap audits."
        keywords="ATS resume templates, resume optimizer, developer portfolio generator, ATS score analyzer, Workday ATS scanner"
        url="https://www.smartnshine.app"
      />
      <FAQSchema faqs={SYSTEM_FAQS} />

      {/* 0. Sleek Floating Glassmorphic Top Navbar */}
      <LandingNavbar />

      {/* 1. Hero Section Matrix with Hardware-Accelerated Gliding Reels & Specular Shader */}
      <EvilChartsLandingMatrix />

      {/* 2. Colorful Bento Grid — Platform Capabilities */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}>
        <PlayfulColorfulBento />
      </div>

      {/* 3. How It Works — 3-step visual flow */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1px 650px" }}>
        <HowItWorksSection />
      </div>

      {/* 4. Testimonials — Real Social Proof */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1px 600px" }}>
        <TestimonialsHomeSection />
      </div>

      {/* 5. Pricing — Real Tiers with Live Data */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1px 800px" }}>
        <PricingSection />
      </div>

      {/* 6. FAQ Accordion */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1px 750px" }}>
        <FAQSection />
      </div>

      {/* 7. Final CTA Banner */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1px 450px" }}>
        <FinalCTABanner />
      </div>

      {/* 8. Global Footer */}
      <Footer />
    </>
  );
}
