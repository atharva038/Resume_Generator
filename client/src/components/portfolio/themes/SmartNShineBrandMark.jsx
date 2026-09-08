import PropTypes from "prop-types";

/**
 * SmartNShineBrandMark
 * Minimal brand wordmark and abstract symbol representing: Light + Intelligence + Creation.
 * Works seamlessly within the Retro-Futuristic and modern template ecosystem.
 */
export function SmartNShineSymbol({ className = "w-3.5 h-3.5", size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rf-brandmark-symbol inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* 4-pointed radiant spark representing light + intelligence + creation */}
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
      />
      {/* Central diamond core node */}
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

SmartNShineSymbol.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

export default function SmartNShineBrandMark({
  variant = "hud",
  showSubtext = true,
  subtext = "PORTFOLIO",
  className = "",
  onClick,
}) {
  if (variant === "badge") {
    return (
      <span className={`rf-badge-gold ${className}`}>
        <SmartNShineSymbol size={10} className="text-[var(--rf-accent-gold)]" />
        <span>SN // 026</span>
      </span>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-mono text-[var(--rf-text-muted)] ${className}`}>
        <SmartNShineSymbol size={12} className="text-[var(--rf-accent-gold)]" />
        <span className="tracking-wider">DESIGNED WITH <strong className="text-[var(--rf-text-secondary)] font-semibold">SMARTNSHINE</strong></span>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider ${className}`}>
        <SmartNShineSymbol size={12} className="text-[var(--rf-accent-gold)]" />
        <span>SMARTNSHINE</span>
      </div>
    );
  }

  // Default: HUD Header mark
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      title="SmartNShine OS Portfolio Engine"
    >
      <SmartNShineSymbol size={14} className="text-[var(--rf-accent-gold)]" />
      <div className="flex items-center gap-1.5 font-mono">
        <span className="text-sm font-bold tracking-wider text-[var(--rf-text-primary)] hover:text-[var(--rf-accent-primary)] transition-colors">
          SMARTNSHINE
        </span>
        {showSubtext && (
          <span className="text-[10px] text-[var(--rf-text-muted)] tracking-widest uppercase hidden sm:inline border-l border-[var(--rf-border-secondary)] pl-1.5">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

SmartNShineBrandMark.propTypes = {
  variant: PropTypes.oneOf(["hud", "minimal", "badge", "footer"]),
  showSubtext: PropTypes.bool,
  subtext: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
