import {Link} from "react-router-dom";
import {useState, useRef} from "react";
import {motion, useReducedMotion} from "framer-motion";
import SEO from "../components/common/SEO";
import FAQSchema from "../components/common/FAQSchema";
import {
  Sparkles,
  Upload,
  Brain,
  TrendingUp,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// The high-res template screenshots we captured
const heroTemplates = [
  {id: "impact-pro", rotate: -10, x: -90, y: 15, zIndex: 10},
  {id: "strategic-leader", rotate: -3, x: -30, y: -5, zIndex: 20},
  {id: "modern", rotate: 3, x: 30, y: -5, zIndex: 30},
  {id: "structured-photo", rotate: 10, x: 90, y: 15, zIndex: 40},
];

const allTemplates = [
  "classic",
  "creative2",
  "github-style",
  "impact-pro",
  "minimal",
  "modern",
  "professional",
  "professional2",
  "strategic-leader",
  "structured-photo",
  "tech",
];

const faqs = [
  {
    question: "Is my resume data safe and private?",
    answer: "Absolutely! We use bank-level encryption. Your resume is stored securely and never shared with third parties. You can delete your data anytime."
  },
  {
    question: "Is SmartNShine really free?",
    answer: "Yes! Our free plan includes AI-powered parsing, basic enhancements, and access to all templates. Premium features like advanced AI scoring and unlimited downloads are available in our Pro plan."
  },
  {
    question: "How does the AI enhancement work?",
    answer: "We use Google's Gemini AI to analyze your resume content and suggest improvements. It adds action verbs, quantifies achievements, optimizes for ATS, and tailors content to your target role."
  },
  {
    question: "Will my resume pass ATS systems?",
    answer: "Yes! All our templates are ATS-optimized with proper formatting, no complex graphics, and keyword-friendly structure. Our scoring system tells you exactly how ATS-friendly your resume is."
  }
];

const trustHighlights = [
  "ATS-safe templates",
  "AI-assisted improvements",
  "Secure resume storage",
  "Designed for students, devs & managers",
  "Export-ready PDF output",
];

const testimonials = [
  { name: "Anshu Nagnurwar", role: "Student", company: "", text: "The clean structure exactly targets what technical recruiters look for. Dumped my visual CV immediately." },
  { name: "Anuj Nandgaonkar", role: "Student", company: "", text: "The absolute best parser I've seen. The Gemini enhancement actually preserved my tone while making it quantifiable." },
  { name: "Vibhanshu Titirmare", role: "Student", company: "", text: "Proof that great design doesn't mean chaotic layouts. The typography rules and constraints result in beautiful minimalism." }
];

const SectionDivider = () => (
  <div className="relative z-10 h-14 sm:h-16 bg-white dark:bg-black overflow-hidden" aria-hidden="true">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/20" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />
  </div>
);

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const scrollContainerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approx card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <SEO
        title="AI-Powered ATS Resume Builder - Engineered for Success"
        description="Create professional, ATS-optimized resumes in minutes with AI assistance. Built to industry standards to help you land interviews faster."
        keywords="resume builder, ATS optimization, AI resume, professional resume templates, tech resume maker"
        url="https://www.smartnshine.app"
      />
      <FAQSchema faqs={faqs} />

      {/* Main container handling background light/dark transition */}
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white selection:bg-black/10 dark:selection:bg-white/30 selection:text-black dark:selection:text-white font-sans overflow-x-hidden transition-colors duration-300">
        
        {/* Grid pattern background removed per design update */}

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 px-6 lg:px-12 min-h-[90vh] flex flex-col justify-center z-10">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Text */}
            <div className="space-y-8 relative z-20">
              <motion.div
                initial={reduceMotion ? false : {opacity: 0, y: 20}}
                animate={reduceMotion ? false : {opacity: 1, y: 0}}
                transition={reduceMotion ? {duration: 0} : {duration: 0.6}}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Powered by Gemini & OpenAI</span>
              </motion.div>

              <motion.h1
                initial={reduceMotion ? false : {opacity: 0, y: 20}}
                animate={reduceMotion ? false : {opacity: 1, y: 0}}
                transition={reduceMotion ? {duration: 0} : {duration: 0.6, delay: 0.1}}
                className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-gray-900 dark:text-white"
              >
                Your resume, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  engineered.
                </span>
              </motion.h1>

              <motion.p
                initial={reduceMotion ? false : {opacity: 0, y: 20}}
                animate={reduceMotion ? false : {opacity: 1, y: 0}}
                transition={reduceMotion ? {duration: 0} : {duration: 0.6, delay: 0.2}}
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-lg font-light leading-relaxed"
              >
                Build ATS-crushing resumes designed for tech, leadership, and modern professionals. Zero clutter, max impact.
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : {opacity: 0, y: 20}}
                animate={reduceMotion ? false : {opacity: 1, y: 0}}
                transition={reduceMotion ? {duration: 0} : {duration: 0.6, delay: 0.3}}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Link
                  to="/upload"
                  className="group relative w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                >
                  Start Building Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#templates"
                  className="w-full sm:w-auto text-center px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  View Templates
                </a>
              </motion.div>
            </div>

            {/* 3D Floating Fan (Actual Template Screenshots) */}
            <motion.div 
              initial={reduceMotion ? false : {opacity: 0}}
              animate={reduceMotion ? false : {opacity: 1}}
              transition={reduceMotion ? {duration: 0} : {duration: 1, delay: 0.4}}
              className="relative h-[400px] sm:h-[600px] w-full hidden lg:flex items-center justify-center perspective-[1200px] group"
            >
              {heroTemplates.map((t, index) => (
                <motion.div
                  key={t.id}
                  className="absolute w-[260px] xl:w-[280px] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out"
                  initial={{
                    rotateZ: t.rotate,
                    x: t.x,
                    y: t.y,
                    z: 0,
                  }}
                  animate={{
                    rotateZ: t.rotate,
                    x: t.x,
                    y: t.y,
                    zIndex: t.zIndex,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: t.y - 30,
                    zIndex: 50,
                    rotateZ: 0,
                    boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
                  }}
                  style={{
                    transformOrigin: "bottom center",
                  }}
                >
                  {/* Keep hero previews clear at load; hover now only adds lift/shadow */}
                  <div className="absolute inset-0 pointer-events-none"></div>
                  <picture>
                    <source srcSet={`/templates/${t.id}.webp`} type="image/webp" />
                    <img
                      src={`/templates/${t.id}.png`}
                      alt={`Template ${t.id}`}
                      className="w-full h-auto block object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchpriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                    />
                  </picture>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        <SectionDivider />

        {/* TRUST STRIP */}
        <section className="relative py-12 bg-white dark:bg-black z-10 shadow-sm dark:shadow-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <p className="text-center text-sm font-mono font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 mb-6">
              Built for real job outcomes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {trustHighlights.map((label) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* BENTO GRID - HOW IT WORKS */}
        <section className="relative py-24 sm:py-32 px-6 lg:px-12 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">The modern workflow.</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-light">Three steps to a flawless, data-rich resume.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl hover:border-gray-300 dark:hover:bg-black transition-all group shadow-sm hover:shadow-md dark:shadow-none">
                <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 mb-3">01</div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">Upload & Parse</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
                  Drop your existing PDF/DOCX or link your LinkedIn. Our strict parsing engine maps your data flawlessly into our structured format.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl hover:border-gray-300 dark:hover:bg-black transition-all group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none">
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                  <Brain className="w-32 h-32 text-indigo-600 dark:text-white" />
                </div>
                <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">
                  <Sparkles className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-3 relative z-10">02</div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white relative z-10">AI Enhancement</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed relative z-10 font-light">
                  Gemini analyzes your bullets, injects specific action verbs, quantifies impacts, and flags missing targeted keywords.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl hover:border-gray-300 dark:hover:bg-black transition-all group shadow-sm hover:shadow-md dark:shadow-none">
                <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400 mb-3">03</div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">Export & Shine</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
                  Select an industry-standard template. Our engine guarantees precise formatting and pure ATS compatibility on export.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* FEATURE SHOWCASES (Vercel Style Split Layout) */}
        <section className="relative py-20 z-10 [content-visibility:auto] [contain-intrinsic-size:1200px]">
          
          {/* Feature 1: The Templates */}
          <div className="py-20 sm:py-28 px-6 lg:px-12 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="order-2 lg:order-1 relative aspect-square sm:aspect-[4/3] flex items-center justify-center">
                {/* 3 staggered premium templates - proper absolute positioning to avoid clashing/spilling */}
                <div className="relative w-full h-[300px] sm:h-[450px]">
                  {/* Left, tilted back */}
                  <picture>
                    <source srcSet="/templates/tech.webp" type="image/webp" />
                    <img 
                      src="/templates/tech.png" 
                      className="absolute top-[10%] left-[5%] w-[45%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-white/10 -rotate-6 transition-transform duration-500 hover:-translate-y-4 hover:rotate-0 z-10 opacity-90 dark:opacity-80 bg-white" 
                      alt="tech template" 
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  {/* Right, tilted forward */}
                  <picture>
                    <source srcSet="/templates/impact-pro.webp" type="image/webp" />
                    <img 
                      src="/templates/impact-pro.png" 
                      className="absolute top-[20%] right-[5%] w-[45%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-white/10 rotate-6 transition-transform duration-500 hover:-translate-y-4 hover:rotate-0 z-20 opacity-90 dark:opacity-80 bg-white" 
                      alt="impact template" 
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  {/* Center, largest and on top */}
                  <picture>
                    <source srcSet="/templates/strategic-leader.webp" type="image/webp" />
                    <img 
                      src="/templates/strategic-leader.png" 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.6)] border border-gray-200 dark:border-white/20 transition-transform duration-500 hover:-translate-y-6 hover:scale-105 z-30 bg-white" 
                      alt="strategic template" 
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-[1.1]">Built for parsers. <br />Designed for humans.</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 font-light">
                  We stripped away the fluff. No confusing graphics, no bizarre multi-column layouts that break ATS systems. Just stark, highly readable, perfectly formatted typography that hiring managers respect and machines can parse seamlessly.
                </p>
                <div className="flex flex-wrap gap-4 sm:gap-8">
                  <div className="flex items-center gap-3 text-base text-gray-800 dark:text-gray-300 font-semibold">
                    <Check className="w-5 h-5 text-green-500 dark:text-green-400" /> 11+ Premium Themes
                  </div>
                  <div className="flex items-center gap-3 text-base text-gray-800 dark:text-gray-300 font-semibold">
                    <Check className="w-5 h-5 text-green-500 dark:text-green-400" /> Auto-Formatting
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Scoring */}
          <div className="py-20 sm:py-28 px-6 lg:px-12 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              <div className="order-2 lg:order-1 relative aspect-square sm:aspect-[4/3] bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-12 flex flex-col justify-center shadow-inner dark:shadow-none">
                <div className="p-8 border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-sm tracking-wide text-gray-500 dark:text-gray-400 font-bold">ATS COMPATIBILITY</span>
                    <span className="text-green-600 dark:text-green-400 font-bold font-mono text-2xl">95%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-black border border-gray-200 dark:border-white/10 rounded-full overflow-hidden mb-8">
                    <div className="w-[95%] h-full bg-green-500 dark:bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-base border-b border-gray-100 dark:border-white/10 pb-4">
                      <span className="text-gray-600 dark:text-gray-400">Action Verbs Found</span>
                      <span className="font-bold text-gray-900 dark:text-white">18 / 20</span>
                    </div>
                    <div className="flex justify-between text-base border-b border-gray-100 dark:border-white/10 pb-4">
                      <span className="text-gray-600 dark:text-gray-400">Metrics Included</span>
                      <span className="font-bold text-gray-900 dark:text-white">6 / 5</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 dark:text-gray-400">Formatting Issues</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-[1.1]">No more guessing. <br />Real feedback.</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 font-light">
                  Get absolute certainty before you click submit. Our scoring engine breaks down your resume line-by-line, scoring impact, measuring keyword density, and ensuring perfect compatibility with enterprise parsing tools.
                </p>
                <Link to="/upload" className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 font-bold inline-flex items-center gap-2 group text-lg pb-1 border-b-2 border-gray-900 dark:border-white transition-all hover:border-gray-500 dark:hover:border-gray-300">
                  Try the analyzer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* TEMPLATES CAROUSEL WITH ARROWS */}
        <section id="templates" className="relative py-24 sm:py-32 px-6 lg:px-12 z-10 bg-white dark:bg-black overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1000px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-6">
              <div className="text-center sm:text-left">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">The Catalog</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xl font-light">11 distinct architectures. Zero compromises.</p>
              </div>
              
              {/* Desktop Navigation Arrows */}
              <div className="hidden sm:flex items-center gap-3">
                <button 
                  onClick={() => scroll("left")}
                  className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center hover:bg-gray-50 dark:hover:bg-black transition-colors shadow-sm dark:shadow-none z-20"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button 
                  onClick={() => scroll("right")}
                  className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center hover:bg-gray-50 dark:hover:bg-black transition-colors shadow-sm dark:shadow-none z-20"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            
            <div className="relative group">
              {/* Left/Right masks for fade effect */}
              <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none"></div>

              {/* Mobile Arrows (inside image container) */}
              <button 
                  onClick={() => scroll("left")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 sm:hidden w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black backdrop-blur-md flex items-center justify-center shadow-lg z-20 active:scale-95 transition-transform"
              >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                  onClick={() => scroll("right")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 sm:hidden w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black backdrop-blur-md flex items-center justify-center shadow-lg z-20 active:scale-95 transition-transform"
              >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              {/* Carousel Container */}
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-6 pl-4 sm:pl-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {allTemplates.map((tid, idx) => (
                  <div key={`${tid}-${idx}`} className="w-[260px] sm:w-[320px] shrink-0 group/card snap-center sm:snap-start scroll-ml-4 sm:scroll-ml-0">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white hover:border-gray-300 dark:hover:border-white/30 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-none">
                      <picture>
                        <source srcSet={`/templates/${tid}.webp`} type="image/webp" />
                        <img src={`/templates/${tid}.png`} alt={tid} className="w-full h-[360px] sm:h-[450px] object-cover object-top opacity-100 transition-opacity" loading="lazy" decoding="async" />
                      </picture>
                      <div className="absolute inset-0 bg-white/60 dark:bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <Link to={`/editor?template=${tid}`} className="px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-bold rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2">
                          Use Template <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    {/* The Template name under the card now fades in strictly on hover! */}
                    <div className="mt-6 text-center text-sm font-bold font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {tid.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* STATS SECTION */}
        <section className="relative py-24 sm:py-32 bg-white dark:bg-black z-10 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
            <div className="py-8 md:py-0">
              <div className="text-7xl lg:text-8xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">5<span className="text-4xl text-gray-400">min</span></div>
              <div className="text-gray-500 dark:text-gray-400 font-mono text-sm tracking-widest uppercase font-bold">Avg Creation Time</div>
            </div>
            <div className="py-8 md:py-0">
              <div className="text-7xl lg:text-8xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">95<span className="text-4xl text-gray-400">%</span></div>
              <div className="text-gray-500 dark:text-gray-400 font-mono text-sm tracking-widest uppercase font-bold">ATS Pass Rate</div>
            </div>
            <div className="py-8 md:py-0">
              <div className="text-7xl lg:text-8xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">3<span className="text-4xl text-gray-400">x</span></div>
              <div className="text-gray-500 dark:text-gray-400 font-mono text-sm tracking-widest uppercase font-bold">More Interviews</div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* TESTIMONIALS */}
        <section className="relative py-24 sm:py-32 px-6 lg:px-12 z-10 bg-white dark:bg-black [content-visibility:auto] [contain-intrinsic-size:700px]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-16 text-center text-gray-900 dark:text-white">Engineered for your success.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div key={idx} className="p-8 sm:p-10 border border-gray-200 dark:border-white/10 rounded-3xl bg-white dark:bg-black transition-colors shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-black flex flex-col justify-between h-full">
                  <p className="text-gray-700 dark:text-gray-300 mb-10 text-lg leading-relaxed font-light">"{t.text}"</p>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white mb-1.5">{t.name}</div>
                    <div className="text-sm font-mono text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t.role} @ {t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* FAQ - Minimal */}
        <section className="relative py-24 sm:py-32 bg-white dark:bg-black z-10 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-12 sm:mb-16 text-center text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-black hover:border-gray-300 dark:hover:border-white/20 transition-all">
                  <button 
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-6 sm:p-8 text-left focus:outline-none"
                  >
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-200 pr-4">{faq.question}</span>
                    <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${openFAQ === idx ? "rotate-180" : ""}`} />
                  </button>
                  <motion.div 
                    initial={false}
                    animate={{ height: openFAQ === idx ? "auto" : 0, opacity: openFAQ === idx ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-base text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <SectionDivider />

        {/* FINAL CTA */}
        <section className="relative py-32 sm:py-48 z-10 px-6 lg:px-12 text-center bg-white dark:bg-black">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-8 text-gray-900 dark:text-white">Ready to deploy?</h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 font-light">Stop fighting layout bugs. Start getting interviews.</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-3 px-10 sm:px-12 py-5 sm:py-6 bg-gray-900 dark:bg-white text-white dark:text-black text-xl rounded-full font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Start Building Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
