/**
 * HeaderCentered Component
 * Elegant centered header with optional tagline and decorative dividers
 * Best for: Executive roles, Professional services
 */

import React from "react";
import {formatPhone, formatURL} from "../../utils/templateHelpers";

const HeaderCentered = ({
  name,
  title,
  tagline,
  email,
  phone,
  location,
  linkedin,
  github,
  portfolio,
  theme,
}) => {
  const contactItems = [
    email && {icon: "📧", value: email, href: `mailto:${email}`},
    phone && {icon: "📱", value: formatPhone(phone)},
    location && {icon: "📍", value: location},
  ].filter(Boolean);

  const socialItems = [
    linkedin && {icon: "💼", value: "LinkedIn", href: linkedin},
    github && {icon: "🔗", value: "GitHub", href: github},
    portfolio && {icon: "🌐", value: "Portfolio", href: portfolio},
  ].filter(Boolean);

  return (
    <header
      className="text-center"
      style={{
        padding: `${theme.spacing.loose} ${theme.layout.padding}`,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Top decorative line */}
      <div
        className="mx-auto mb-6"
        style={{
          width: "100px",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent)`,
        }}
      />

      {/* Name */}
      <h1
        className="font-bold"
        style={{
          fontSize: theme.fonts.sizes.name,
          fontFamily: theme.fonts.heading,
          fontWeight: theme.fonts.weights.bold,
          color: theme.colors.primary,
          marginBottom: theme.spacing.tight,
          letterSpacing: "1px",
          lineHeight: "1.2",
        }}
      >
        {name || "Your Name"}
      </h1>

      {/* Title */}
      {title && (
        <p
          className="uppercase tracking-wider"
          style={{
            fontSize: theme.fonts.sizes.subheading,
            fontFamily: theme.fonts.body,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.textLight,
            marginBottom: tagline ? theme.spacing.tight : theme.spacing.element,
            letterSpacing: "2px",
          }}
        >
          {title}
        </p>
      )}

      {/* Optional Tagline */}
      {tagline && (
        <p
          className="italic"
          style={{
            fontSize: theme.fonts.sizes.body,
            fontFamily: theme.fonts.body,
            fontWeight: theme.fonts.weights.normal,
            color: theme.colors.textLight,
            marginBottom: theme.spacing.element,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          "{tagline}"
        </p>
      )}

      {/* Middle decorative divider */}
      <div className="flex items-center justify-center gap-3 my-4">
        <div
          style={{
            width: "40px",
            height: "1px",
            backgroundColor: theme.colors.border,
          }}
        />
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: theme.colors.accent,
          }}
        />
        <div
          style={{
            width: "40px",
            height: "1px",
            backgroundColor: theme.colors.border,
          }}
        />
      </div>

      {/* Contact Information */}
      {contactItems.length > 0 && (
        <div
          className="flex flex-wrap justify-center items-center gap-4 mb-2"
          style={{
            fontSize: theme.fonts.sizes.body,
            fontFamily: theme.fonts.body,
            color: theme.colors.text,
          }}
        >
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span style={{color: theme.colors.border}}>•</span>}
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="hover:opacity-70 transition-opacity flex items-center gap-1"
                  style={{color: "inherit", textDecoration: "none"}}
                >
                  <span>{item.icon}</span>
                  <span>{item.value}</span>
                </a>
              ) : (
                <span className="flex items-center gap-1">
                  <span>{item.icon}</span>
                  <span>{item.value}</span>
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Social Links */}
      {socialItems.length > 0 && (
        <div
          className="flex justify-center items-center gap-3"
          style={{
            fontSize: theme.fonts.sizes.small,
            fontFamily: theme.fonts.body,
            color: theme.colors.textLight,
          }}
        >
          {socialItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>•</span>}
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity flex items-center gap-1"
                style={{color: "inherit", textDecoration: "none"}}
              >
                <span>{item.icon}</span>
                <span>{item.value}</span>
              </a>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Bottom decorative line */}
      <div
        className="mx-auto mt-6"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "1px",
          backgroundColor: theme.colors.border,
        }}
      />
    </header>
  );
};

export default HeaderCentered;
