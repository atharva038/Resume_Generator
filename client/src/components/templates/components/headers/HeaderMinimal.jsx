/**
 * HeaderMinimal Component
 * Ultra-clean single-line header with maximum space efficiency
 * Best for: Modern roles, Startups, Minimalist design
 */

import React from "react";
import {formatPhone, formatURL} from "../../utils/templateHelpers";

const HeaderMinimal = ({
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
  // Combine contact items into a single string
  const contactParts = [
    email,
    phone && formatPhone(phone),
    location,
    linkedin && formatURL(linkedin),
    github && formatURL(github),
    portfolio && formatURL(portfolio),
  ].filter(Boolean);

  return (
    <header
      className="flex flex-col gap-1"
      style={{
        padding: `${theme.spacing.section} ${theme.layout.padding}`,
        backgroundColor: theme.colors.background,
        borderBottom: `${theme.borders.width.thin} solid ${theme.colors.border}`,
      }}
    >
      {/* Name and Title on one line */}
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1
          className="font-bold"
          style={{
            fontSize: theme.fonts.sizes.name,
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.weights.bold,
            color: theme.colors.text,
            lineHeight: "1",
          }}
        >
          {name || "Your Name"}
        </h1>

        {title && (
          <p
            className="font-medium"
            style={{
              fontSize: theme.fonts.sizes.subheading,
              fontFamily: theme.fonts.body,
              fontWeight: theme.fonts.weights.medium,
              color: theme.colors.textLight,
            }}
          >
            {title}
          </p>
        )}
      </div>

      {/* Contact info - single line */}
      {contactParts.length > 0 && (
        <div
          className="flex items-center gap-2 flex-wrap"
          style={{
            fontSize: theme.fonts.sizes.small,
            fontFamily: theme.fonts.body,
            color: theme.colors.textLight,
          }}
        >
          {contactParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span style={{color: theme.colors.border}}>|</span>}
              <span>{part}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
};

export default HeaderMinimal;
