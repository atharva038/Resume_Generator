import React from "react";

/**
 * SmartNShine Brand Logo Component
 * Seamlessly adapts to Light and Dark mode using Tailwind CSS utility classes.
 * Ensures zero-flash transitions and crisp rendering across all screen densities.
 */
export default function Logo({
  className = "w-8 h-8",
  alt = "SmartNShine Logo",
  ...props
}) {
  return (
    <>
      <img
        src="/logo-light.png"
        alt={alt}
        className={`rounded-lg object-contain ${className} dark:hidden`}
        {...props}
      />
      <img
        src="/logo-dark.png"
        alt={alt}
        className={`rounded-lg object-contain ${className} hidden dark:block`}
        {...props}
      />
    </>
  );
}
