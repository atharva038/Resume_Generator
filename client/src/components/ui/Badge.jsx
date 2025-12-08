import React from "react";

const badgeVariants = {
  default:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
  primary:
    "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border border-primary-200 dark:border-primary-800",
  success:
    "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800",
  warning:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800",
  danger:
    "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800",
  gradient:
    "bg-gradient-to-r from-primary-500 to-accent-purple text-white border-0 shadow-sm",
};

export const Badge = ({
  variant = "default",
  children,
  className = "",
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        ${badgeVariants[variant]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
