import React from "react";
import {motion} from "framer-motion";

export const Card = ({
  children,
  className = "",
  hover = true,
  gradient = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? {y: -4} : {}}
      transition={{duration: 0.2, ease: "easeOut"}}
      className={`
        bg-white dark:bg-gray-900 
        rounded-2xl border border-gray-200 dark:border-gray-800
        ${
          hover
            ? "hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700"
            : "shadow-sm"
        }
        ${
          gradient
            ? "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            : ""
        }
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({children, className = ""}) => (
  <div
    className={`p-6 border-b border-gray-100 dark:border-gray-800 ${className}`}
  >
    {children}
  </div>
);

export const CardBody = ({children, className = ""}) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({children, className = ""}) => (
  <div
    className={`p-6 border-t border-gray-100 dark:border-gray-800 ${className}`}
  >
    {children}
  </div>
);

export default Card;
