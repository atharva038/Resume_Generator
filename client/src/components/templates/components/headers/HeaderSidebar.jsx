/**
 * HeaderSidebar Component
 * Vertical sidebar header with photo support
 * Best for: Templates with sidebar layout, Creative roles
 */

import React from "react";
import {formatPhone, formatURL, getInitials} from "../../utils/templateHelpers";

const HeaderSidebar = ({
  name,
  title,
  email,
  phone,
  location,
  linkedin,
  github,
  portfolio,
  photo,
  theme,
}) => {
  const contactItems = [
    {icon: "📧", label: "Email", value: email, href: `mailto:${email}`},
    {icon: "📱", label: "Phone", value: phone && formatPhone(phone)},
    {icon: "📍", label: "Location", value: location},
    {
      icon: "💼",
      label: "LinkedIn",
      value: linkedin && formatURL(linkedin),
      href: linkedin,
    },
    {
      icon: "🔗",
      label: "GitHub",
      value: github && formatURL(github),
      href: github,
    },
    {
      icon: "🌐",
      label: "Portfolio",
      value: portfolio && formatURL(portfolio),
      href: portfolio,
    },
  ].filter((item) => item.value);

  return (
    <aside
      className="flex flex-col items-center text-center"
      style={{
        padding: theme.spacing.loose,
        backgroundColor: theme.colors.backgroundAlt,
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Photo or Initials */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: theme.colors.primary,
          marginBottom: theme.spacing.section,
          border: `4px solid ${theme.colors.background}`,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span
            style={{
              fontSize: "36pt",
              fontWeight: theme.fonts.weights.bold,
              color: "#ffffff",
              fontFamily: theme.fonts.heading,
            }}
          >
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* Name */}
      <h1
        className="font-bold"
        style={{
          fontSize: theme.fonts.sizes.name,
          fontFamily: theme.fonts.heading,
          fontWeight: theme.fonts.weights.bold,
          color: theme.colors.primary,
          marginBottom: theme.spacing.tight,
          lineHeight: "1.2",
        }}
      >
        {name || "Your Name"}
      </h1>

      {/* Title */}
      {title && (
        <p
          style={{
            fontSize: theme.fonts.sizes.subheading,
            fontFamily: theme.fonts.body,
            fontWeight: theme.fonts.weights.medium,
            color: theme.colors.textLight,
            marginBottom: theme.spacing.section,
          }}
        >
          {title}
        </p>
      )}

      {/* Divider */}
      <div
        style={{
          width: "80%",
          height: "1px",
          backgroundColor: theme.colors.border,
          marginBottom: theme.spacing.section,
        }}
      />

      {/* Contact Information - Vertical list */}
      <div
        className="w-full space-y-3"
        style={{
          fontSize: theme.fonts.sizes.small,
          fontFamily: theme.fonts.body,
        }}
      >
        {contactItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-left"
            style={{
              padding: `${theme.spacing.tight} 0`,
            }}
          >
            <span
              style={{
                fontSize: "14px",
                minWidth: "20px",
              }}
            >
              {item.icon}
            </span>
            <div className="flex-1">
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="hover:opacity-70 transition-opacity break-all"
                  style={{
                    color: theme.colors.text,
                    textDecoration: "none",
                    wordBreak: "break-word",
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <span
                  className="break-all"
                  style={{
                    color: theme.colors.text,
                    wordBreak: "break-word",
                  }}
                >
                  {item.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default HeaderSidebar;
