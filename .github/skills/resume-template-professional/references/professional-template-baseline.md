# Professional Template Baseline (Project Reference)

Use these existing components as implementation reference and parity targets:

- client/src/components/templates/ProfessionalTemplate.jsx
- client/src/components/templates/ProfessionalV2Template.jsx
- client/src/components/templates/Professional2Template.jsx

## Shared Strong Patterns To Preserve
- ATS-safe section structure with standard headings.
- Content-density aware spacing/typography strategies.
- Theme-token approach for professional palettes.
- Overflow/page-usage measurement and callback reporting.
- Conditional section rendering based on real content.
- Print/PDF-oriented style choices and readable metadata hierarchy.

## Gaps To Watch During New Work
- Inconsistent naming between templates (section labels, theme keys, prop naming).
- Divergent formatting logic for skills and custom sections.
- Potentially different overflow thresholds or page-size assumptions.
- Style drift between medium/high-density modes.

## Recommended Standardization Targets
- One canonical section order and title mapping layer.
- One shared data-normalization utility for mixed input shapes.
- One theme contract (required color keys) used by all professional variants.
- One overflow contract returned to parent components.
    