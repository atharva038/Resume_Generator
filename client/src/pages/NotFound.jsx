import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {
  Home,
  ArrowLeft,
  FileText,
  Search,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import SEO from "../components/common/SEO";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="404 - Page Not Found | SmartNShine"
        description="The page you're looking for doesn't exist. Return to SmartNShine to create your perfect ATS-optimized resume."
        noindex={true}
      />

      <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-40 right-20 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-500/3 dark:bg-pink-500/3 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
          <div className="max-w-4xl w-full">
            {/* Main Content */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
              className="text-center"
            >
              {/* 404 Illustration with Emoji */}
              <motion.div
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{delay: 0.2, duration: 0.5}}
                className="mb-8"
              >
                <div className="relative inline-block">
                  {/* Lost Document Emoji/Illustration */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-8xl md:text-9xl mb-4"
                  >
                    📄❓
                  </motion.div>

                  {/* Glowing 404 */}
                  <h1 className="text-[8rem] md:text-[12rem] lg:text-[14rem] font-black leading-none mb-2">
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent">
                      404
                    </span>
                  </h1>

                  {/* Sparkles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                      }}
                      className="absolute"
                      style={{
                        top: `${15 + (i % 4) * 25}%`,
                        left: `${i < 4 ? 5 + i * 10 : 65 + (i - 4) * 10}%`,
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-purple-400 dark:text-purple-300" />
                    </motion.div>
                  ))}

                  {/* Floating Search Icon */}
                  <motion.div
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/4 right-0 text-4xl md:text-5xl"
                  >
                    🔍
                  </motion.div>

                  {/* Confused Face */}
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-1/4 left-0 text-4xl md:text-5xl"
                  >
                    😕
                  </motion.div>
                </div>
              </motion.div>

              {/* Error Message Card */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3, duration: 0.5}}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white dark:bg-black backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 md:p-12">
                  {/* Alert Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 mb-6">
                    <AlertTriangle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>

                  {/* Main Message */}
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Oops! Page Not Found
                  </h2>

                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                    The resume you're looking for seems to have gone missing.
                    Don't worry, let's get you back on track!
                  </p>

                  {/* Quick Links */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        icon: Home,
                        title: "Homepage",
                        desc: "Start fresh",
                        path: "/",
                        gradient: "from-purple-500 to-blue-500",
                      },
                      {
                        icon: FileText,
                        title: "Dashboard",
                        desc: "Your resumes",
                        path: "/dashboard",
                        gradient: "from-blue-500 to-cyan-500",
                      },
                      {
                        icon: Sparkles,
                        title: "Create Resume",
                        desc: "Build new",
                        path: "/upload",
                        gradient: "from-pink-500 to-purple-500",
                      },
                    ].map((link, index) => (
                      <motion.button
                        key={link.path}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.4 + index * 0.1}}
                        onClick={() => navigate(link.path)}
                        className="group relative p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}
                        >
                          <link.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {link.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {link.desc}
                        </p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Primary Actions */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <motion.button
                      initial={{opacity: 0, scale: 0.9}}
                      animate={{opacity: 1, scale: 1}}
                      transition={{delay: 0.7}}
                      onClick={() => window.history.back()}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-100 font-semibold rounded-xl border-2 border-gray-200 dark:border-zinc-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      Go Back
                    </motion.button>

                    <motion.button
                      initial={{opacity: 0, scale: 0.9}}
                      animate={{opacity: 1, scale: 1}}
                      transition={{delay: 0.8}}
                      onClick={() => navigate("/")}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                    >
                      <Home className="w-5 h-5" />
                      Go to Homepage
                      <motion.span
                        animate={{x: [0, 5, 0]}}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.9}}
                className="mt-8"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Still can't find what you're looking for?{" "}
                  <a
                    href="/contact"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                  >
                    Contact our support team
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
