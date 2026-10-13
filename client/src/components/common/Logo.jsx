import React from "react";

/**
 * SmartNShine Brand Logo Component
 * Seamlessly adapts to Light and Dark mode using Tailwind CSS utility classes.
 * Ensures zero-flash transitions, explicit dimensions, and modern WebP format.
 */
export default function Logo({
  className = "w-8 h-8",
  alt = "SmartNShine Logo",
  width = 32,
  height = 32,
  ...props
}) {
  return (
    <>
      <picture className="dark:hidden">
        <source srcSet="/logo-light.webp" type="image/webp" />
        <img
          src="/logo-light.png"
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          className={`rounded-lg object-contain ${className}`}
          {...props}
        />
      </picture>
      <picture className="hidden dark:block">
        <source srcSet="/logo-dark.webp" type="image/webp" />
        <img
          src="/logo-dark.png"
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          className={`rounded-lg object-contain ${className}`}
          {...props}
        />
      </picture>
    </>
  );
}
