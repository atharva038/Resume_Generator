/**
 * Tech Portfolio Template - Theme Integration
 * Data-driven portfolio theme using extracted resume information
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "@/styles/portfolio-template.css";
import HeroSection from "@/components/portfolio/template/HeroSection";
import TechStackSection from "@/components/portfolio/template/TechStackSection";
import AboutSection from "@/components/portfolio/template/AboutSection";
import ServicesSection from "@/components/portfolio/template/ServicesSection";
import ExperienceSection from "@/components/portfolio/template/ExperienceSection";
import ProjectsSection from "@/components/portfolio/template/ProjectsSection";
import SkillsSection from "@/components/portfolio/template/SkillsSection";
import AchievementsSection from "@/components/portfolio/template/AchievementsSection";
import ContactSection from "@/components/portfolio/template/ContactSection";
import PortfolioFooter from "@/components/portfolio/template/PortfolioFooter";
import TechPortfolioNavbar from "@/components/portfolio/template/TechPortfolioNavbar";

const TechPortfolioTheme = ({ data, isDarkMode, toggleDarkMode, accentColor }) => {
  const {
    profile,
    settings,
    projects,
    experience,
    skills,
    education,
    customSections,
    links,
    themeAccent,
  } = data || {};

  const [portfolioContext, setPortfolioContext] = useState(null);

  useEffect(() => {
    // Prepare portfolio context with extracted data
    const context = {
      name: profile?.name || "Developer",
      title: profile?.title || "Full Stack Developer",
      bio: profile?.bio || "",
      email: profile?.email || "",
      location: profile?.location || "",
      accentColor: themeAccent || "",
      socialLinks: links?.social || [],
      projects: projects || [],
      experience: experience || [],
      skills: skills || [],
      education: education || [],
    };
    setPortfolioContext(context);
  }, [profile, projects, experience, skills, education, links, themeAccent]);

  if (!portfolioContext) {
    return <div className="bg-black text-white min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{portfolioContext.name} - {portfolioContext.title} | Portfolio</title>
        <meta name="description" content={portfolioContext.bio} />
        <meta name="theme-color" content="#000000" />
      </Helmet>

      <div
        className="tech-portfolio-theme bg-black text-white overflow-x-hidden"
        style={{ "--tech-accent": portfolioContext.accentColor || "#3b82f6" }}
      >
        <TechPortfolioNavbar
          data={data}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          accentColor={accentColor}
        />
        {/* Main Content */}
        <main className="relative">
          {/* Hero Section */}
          <HeroSection portfolioContext={portfolioContext} />

          {/* Tech Stack Section */}
          <section className="bg-gradient-to-b from-black/50 to-black py-20">
            <TechStackSection />
          </section>

          {/* About Section */}
          {portfolioContext.bio && (
            <section className="bg-gradient-to-b from-black to-black/50 py-20">
              <AboutSection portfolioContext={portfolioContext} />
            </section>
          )}

          {/* Services Section */}
          <section className="bg-gradient-to-b from-black/50 to-black py-20">
            <ServicesSection />
          </section>

          {/* Experience Section */}
          {portfolioContext.experience?.length > 0 && (
            <section className="bg-gradient-to-b from-black to-black/50 py-20">
              <ExperienceSection portfolioContext={portfolioContext} />
            </section>
          )}

          {/* Projects Section */}
          {portfolioContext.projects?.length > 0 && (
            <section className="bg-gradient-to-b from-black/50 to-black py-20">
              <ProjectsSection portfolioContext={portfolioContext} />
            </section>
          )}

          {/* Skills Section */}
          {portfolioContext.skills?.length > 0 && (
            <section className="bg-gradient-to-b from-black to-black/50 py-20">
              <SkillsSection portfolioContext={portfolioContext} />
            </section>
          )}

          {/* Achievements Section */}
          <section className="bg-gradient-to-b from-black/50 to-black py-20">
            <AchievementsSection portfolioContext={portfolioContext} />
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-b from-black to-black/50 py-20">
            <ContactSection portfolioContext={portfolioContext} />
          </section>
        </main>

        {/* Footer */}
        <PortfolioFooter portfolioContext={portfolioContext} />
      </div>
    </>
  );
};

export default TechPortfolioTheme;
