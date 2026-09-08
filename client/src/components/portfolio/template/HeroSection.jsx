import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { getProfileImageSources } from "@/utils/profileImageUrl";
import { 
  stats 
} from "@/data/techPortfolioData";

const HeroSection = ({ portfolioContext }) => {
  const {
    title = "Full Stack Developer",
    bio = "Building digital experiences",
    accentColor,
    profileImage,
    image,
    avatar,
    socialLinks: contextSocialLinks = [],
  } = portfolioContext || {};
  const accent = accentColor || "#60a5fa";
  const imageValue = profileImage || image || avatar;
  const imageSources = getProfileImageSources(imageValue);
  const [safeImageUrl, setSafeImageUrl] = useState(imageSources[0]);
  const [imageError, setImageError] = useState(false);
  const hasProfileImage = Boolean(safeImageUrl) && !imageError;

  useEffect(() => {
    setSafeImageUrl(getProfileImageSources(imageValue)[0]);
    setImageError(false);
  }, [imageValue]);

  const handleImageError = () => {
    const nextSource = imageSources[imageSources.indexOf(safeImageUrl) + 1];
    if (nextSource) {
      setSafeImageUrl(nextSource);
      return;
    }
    setImageError(true);
  };

  const getSocialIcon = (linkName) => {
    switch (linkName?.toLowerCase()) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "email":
      case "mail":
        return Mail;
      default:
        return Github;
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(96, 165, 250, 0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.12), transparent 25%), linear-gradient(180deg, #020617 0%, #020817 100%)",
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold text-slate-200"
              style={{
                borderColor: `${accent}66`,
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                boxShadow: `0 0 0 1px ${accent}22`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
              {title}
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-[0.95] text-[#F5F5F5] md:text-7xl">
                <span>I Build</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(115deg, ${accent} 0%, #7dd3fc 45%, #c4b5fd 100%)`,
                  }}
                >
                  Scalable Digital Experiences
                </span>
                <br />
                <span style={{ color: "#f8fafc" }}>That Make Impact.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="max-w-lg text-xl leading-relaxed text-gray-300">
              {bio || "Transforming ideas into exceptional web applications with clean code, modern technologies and creative solutions."}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  const element = document.querySelector("#projects");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-md px-6 py-3 font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: accent, boxShadow: `0 12px 30px ${accent}40` }}
              >
                View My Work
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.querySelector("#contact");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-md border border-slate-700 px-6 py-3 font-medium text-[#F5F5F5] transition-colors hover:border-sky-400 hover:bg-slate-900"
              >
                Get In Touch
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {contextSocialLinks
                ?.filter((link) => link.name?.toLowerCase() !== "email")
                .map((link, idx) => {
                  const IconComponent = getSocialIcon(link.name);
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-gray-400 transition-colors hover:border-sky-400 hover:text-sky-400"
                      title={link.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Right Side - Profile Photo */}
          <div className="relative flex h-full min-h-[26rem] items-center justify-center md:min-h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative w-full max-w-[26rem]"
            >
              <div
                className="absolute inset-6 rounded-full blur-3xl opacity-70"
                style={{ background: `radial-gradient(circle, ${accent}66 0%, transparent 65%)` }}
              />

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -1.5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto w-[23rem] max-w-full"
              >
                <div className="absolute inset-3 rounded-full border border-white/15" />
                <div
                  className="absolute -inset-3 rounded-[2rem] opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${accent}55, rgba(255,255,255,0.06), rgba(255,255,255,0.08))`,
                    filter: "blur(24px)",
                  }}
                />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-3 shadow-[0_25px_80px_rgba(15,23,42,0.75)] backdrop-blur-sm">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-[10px] font-medium text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                      Portfolio
                    </span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Live
                    </span>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-2">
                    {hasProfileImage ? (
                      <motion.img
                        src={safeImageUrl}
                        alt={title || "Profile photo"}
                        onError={handleImageError}
                        initial={{ scale: 1.06, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-[24rem] w-full rounded-[1.25rem] object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-[24rem] w-full items-center justify-center rounded-[1.25rem] text-5xl font-black text-white" style={{ background: `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)` }}>
                        {title?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-3 right-2 rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 text-left shadow-lg shadow-slate-950/40"
                >
                  <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400">Focus</div>
                  <div className="mt-1 text-sm font-semibold text-white">Full Stack Dev</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats Row - Below Hero */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950/60 p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-[#F5F5F5] md:text-5xl">
                {stat.number}{stat.suffix}
              </div>
              <p className="text-sm text-gray-400 md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
