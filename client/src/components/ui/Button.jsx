import React from "react";
import {motion} from "framer-motion";

const buttonVariants = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md border border-primary-600/20",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700",
  outline:
    "border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
  ghost:
    "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  link: "text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline-offset-4 hover:underline",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-xl",
  xl: "px-8 py-4 text-xl rounded-xl",
};

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  asChild = false,
  ...props
}) => {
  const Component = asChild ? "div" : motion.button;

  return (
    <Component
      whileHover={{scale: variant !== "link" ? 1.02 : 1}}
      whileTap={{scale: variant !== "link" ? 0.98 : 1}}
      className={`
        inline-flex items-center justify-center gap-2 font-medium 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
        dark:focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${buttonVariants[variant]} 
        ${buttonSizes[size]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
