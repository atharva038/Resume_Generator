import {Link} from "react-router-dom";
import {
  Sparkles,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Github,
  Shield,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useToggle} from "@/hooks";

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, toggleVisible, setIsVisibleTrue, setIsVisibleFalse] =
    useToggle(false);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleTrue();
        }
      },
      {threshold: 0.1}
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, [setIsVisibleTrue]);

  const productLinks = [
    {name: "AI Resume Builder", path: "/upload"},
    {name: "ATS Checker", path: "/upload"},
    {name: "Resume Templates", path: "/templates"},
    {name: "AI Enhancer", path: "/upload"},
    {name: "Pricing", path: "/pricing"},
  ];

  // Legal & Policies (REQUIRED FOR RAZORPAY APPROVAL)
  const resourceLinks = [
    {name: "Terms & Conditions", path: "/terms-and-conditions"},
    {name: "Privacy Policy", path: "/privacy-policy"},
    {name: "Refund Policy", path: "/refund-policy"},
    {name: "Shipping Policy", path: "/shipping-policy"},
  ];

  // Hidden until connected to real data
  const socialLinks = [
    // {
    //   name: "LinkedIn",
    //   icon: Linkedin,
    //   url: "https://linkedin.com/company/smartnshine",
    //   color: "hover:text-blue-400",
    // },
    // {
    //   name: "Twitter",
    //   icon: Twitter,
    //   url: "https://twitter.com/smartnshine",
    //   color: "hover:text-sky-400",
    // },
    // {
    //   name: "GitHub",
    //   icon: Github,
    //   url: "https://github.com/smartnshine",
    //   color: "hover:text-purple-400",
    // },
  ];

  return (
    <footer
      ref={footerRef}
      className={`bg-white dark:bg-black border-t border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 transition-all duration-1000 no-print ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                SmartNShine
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              Build resumes that shine in every interview. Powered by AI to help
              you land your dream job.
            </p>
            {/* Social Media Icons - Hidden until connected to real data */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 transition-all duration-200"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-4 tracking-tight">
              Product
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies Column (REQUIRED FOR RAZORPAY) */}
          {resourceLinks.length > 0 && (
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-4 tracking-tight">
                Legal & Policies
              </h3>
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => {
                  const isHash = link.path.startsWith("/#");
                  return (
                    <li key={link.name}>
                      {isHash ? (
                        <a
                          href={link.path}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Contact Column */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-4 tracking-tight">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@smartnshine.app"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@smartnshine.app</span>
                </a>
              </li>
              {/* Hidden until connected to real data */}
              {/* <li>
                <a
                  href="https://discord.gg/smartnshine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="relative">
                    Join Our Community
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-zinc-800 mt-10 lg:mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-500 dark:text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} SmartNShine. All rights reserved.
            </p>

            {/* Built with Love */}
            <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
              Built with
              <span className="text-red-500">❤️</span>
              for job seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
