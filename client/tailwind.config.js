/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Linear-inspired color palette
        primary: {
          50: "#f5f7ff",
          100: "#ebf0ff",
          200: "#d6e0ff",
          300: "#b3c7ff",
          400: "#8aa3ff",
          500: "#5e7aff", // Main brand color (Linear purple-blue)
          600: "#4d5fdb",
          700: "#3d49b7",
          800: "#2f3793",
          900: "#232978",
        },
        accent: {
          purple: "#8B5CF6",
          blue: "#3B82F6",
          cyan: "#06B6D4",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
      },
      fontFamily: {
        sans: [
          "Inter var",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: ["Inter var", "Inter", "sans-serif"],
        resume: ["Arial", "Helvetica", "sans-serif"],
      },
      fontSize: {
        "display-2xl": [
          "4.5rem",
          {lineHeight: "1.1", letterSpacing: "-0.02em"},
        ],
        "display-xl": [
          "3.75rem",
          {lineHeight: "1.1", letterSpacing: "-0.02em"},
        ],
        "display-lg": ["3rem", {lineHeight: "1.2", letterSpacing: "-0.02em"}],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {opacity: "0"},
          "100%": {opacity: "1"},
        },
        slideUp: {
          "0%": {transform: "translateY(20px)", opacity: "0"},
          "100%": {transform: "translateY(0)", opacity: "1"},
        },
        slideDown: {
          "0%": {transform: "translateY(-20px)", opacity: "0"},
          "100%": {transform: "translateY(0)", opacity: "1"},
        },
        scaleIn: {
          "0%": {transform: "scale(0.95)", opacity: "0"},
          "100%": {transform: "scale(1)", opacity: "1"},
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-linear": "linear-gradient(180deg, var(--tw-gradient-stops))",
        "mesh-gradient":
          "radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 0%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.15) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.1) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
