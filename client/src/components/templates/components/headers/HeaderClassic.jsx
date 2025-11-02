/**
 * HeaderClassic Component
 * Traditional centered header with divider lines
 * Best for: Corporate, Conservative, Traditional roles
 */

import React from "react";
import {formatPhone, formatURL} from "../../utils/templateHelpers";

const HeaderClassic = ({
  name,
  title,
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
    linkedin && {icon: "💼", value: formatURL(linkedin), href: linkedin},
    github && {icon: "🔗", value: formatURL(github), href: github},
    portfolio && {icon: "🌐", value: formatURL(portfolio), href: portfolio},
  ].filter(Boolean);

  return (
    <header
      className="text-center"
      style={{
        padding: `${theme.spacing.loose} ${theme.layout.padding}`,
        backgroundColor: theme.colors.background,
        borderBottom: `${theme.borders.width.medium} solid ${theme.colors.border}`,
      }}
    >
      {/* Name */}
      <h1
        className="font-bold uppercase tracking-wide"
        style={{
          fontSize: theme.fonts.sizes.name,
          fontFamily: theme.fonts.heading,
          fontWeight: theme.fonts.weights.bold,
          color: theme.colors.primary,
          marginBottom: theme.spacing.tight,
          letterSpacing: "2px",
        }}
      >
        {name || "Your Name"}
      </h1>

      {/* Decorative line under name */}
      <div
        className="mx-auto"
        style={{
          width: "60px",
          height: "3px",
          backgroundColor: theme.colors.accent,
          marginBottom: theme.spacing.element,
        }}
      />

      {/* Title */}
      {title && (
        <p
          className="uppercase tracking-wide"
          style={{
            fontSize: theme.fonts.sizes.title,
            fontFamily: theme.fonts.body,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text,
            marginBottom: theme.spacing.element,
            letterSpacing: "1px",
          }}
        >
          {title}
        </p>
      )}

      {/* Contact Information - Separated by bullets */}
      {contactItems.length > 0 && (
        <div
          className="flex flex-wrap justify-center items-center gap-3"
          style={{
            fontSize: theme.fonts.sizes.body,
            fontFamily: theme.fonts.body,
            color: theme.colors.textLight,
            marginTop: theme.spacing.element,
          }}
        >
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span
                  style={{
                    color: theme.colors.border,
                    fontWeight: theme.fonts.weights.bold,
                  }}
                >
                  •
                </span>
              )}
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
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                  }}
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
    </header>
  );
};

export default HeaderClassic;
