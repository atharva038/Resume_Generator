/**
 * HeaderModern Component
 * Modern gradient header with bold name and contact info
 * Best for: Tech, Creative, Modern roles
 */

import React from "react";
import {formatPhone, formatURL} from "../../utils/templateHelpers";

const HeaderModern = ({
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
  return (
    <header
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
        color: "#ffffff",
        padding: `${theme.spacing.loose} ${theme.layout.padding}`,
      }}
    >
      {/* Name and Title */}
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-bold mb-2"
          style={{
            fontSize: theme.fonts.sizes.name,
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.weights.bold,
            lineHeight: "1.2",
            letterSpacing: "-0.5px",
          }}
        >
          {name || "Your Name"}
        </h1>

        {title && (
          <p
            className="opacity-95 mb-4"
            style={{
              fontSize: theme.fonts.sizes.title,
              fontFamily: theme.fonts.body,
              fontWeight: theme.fonts.weights.medium,
            }}
          >
            {title}
          </p>
        )}

        {/* Contact Information */}
        <div
          className="flex flex-wrap gap-4 mt-4"
          style={{
            fontSize: theme.fonts.sizes.body,
            fontFamily: theme.fonts.body,
            opacity: 0.9,
          }}
        >
          {email && (
            <a
              href={`mailto:${email}`}
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{color: "inherit", textDecoration: "none"}}
            >
              <span>📧</span>
              <span>{email}</span>
            </a>
          )}

          {phone && (
            <span className="flex items-center gap-1">
              <span>📱</span>
              <span>{formatPhone(phone)}</span>
            </span>
          )}

          {location && (
            <span className="flex items-center gap-1">
              <span>📍</span>
              <span>{location}</span>
            </span>
          )}

          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{color: "inherit", textDecoration: "none"}}
            >
              <span>💼</span>
              <span>{formatURL(linkedin)}</span>
            </a>
          )}

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{color: "inherit", textDecoration: "none"}}
            >
              <span>🔗</span>
              <span>{formatURL(github)}</span>
            </a>
          )}

          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{color: "inherit", textDecoration: "none"}}
            >
              <span>🌐</span>
              <span>{formatURL(portfolio)}</span>
            </a>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 right-0 opacity-10"
        style={{
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
    </header>
  );
};

export default HeaderModern;
