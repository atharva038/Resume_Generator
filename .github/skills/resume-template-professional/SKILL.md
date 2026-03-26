---
name: resume-template-professional
description: 'Create or refine professional ATS resume template pages using a complete multi-step workflow: baseline analysis, section architecture, typography and spacing system, color themes, density modes, overflow control, print/PDF safety, and validation checks. Use when building or improving resume templates for production quality.'
argument-hint: 'Template goal, target audience, style direction, and constraints'
user-invocable: true
---

# Professional Resume Template Skill

## What This Skill Produces
- A complete, production-ready resume template page design and implementation plan.
- A structured section architecture with ATS-safe ordering and labels.
- A tokenized visual system (typography, spacing, color themes).
- Dynamic behavior guidance (content-density mode, overflow tracking, page-break safety).
- Measurable completion checks before shipping.

## When To Use
- Building a new professional resume template from scratch.
- Refactoring an existing template page to improve readability, ATS compatibility, and print fidelity.
- Standardizing multiple templates under one design and implementation system.

## Inputs Expected
- Goal: new template, redesign, or parity with an existing template.
- Target audience: fresher, software engineer, manager, executive, etc.
- Style direction: classic, modern, premium corporate, or compact.
- Constraints: single-page preference, strict ATS mode, print/PDF requirements.

## Procedure
1. Baseline and Constraints
- Identify whether to optimize for strict ATS parsing, visual polish, or balanced mode.
- Capture hard limits: one page preferred, safe heading language, semantic section order.
- If a reference template exists, map what must stay unchanged.

2. Section Architecture First
- Use this default order unless requirements override it:
  1. Professional Summary
  2. Skills
  3. Experience
  4. Projects
  5. Education
  6. Certifications
  7. Achievements
  8. Optional custom sections
- Enforce section-level visibility: render only when content exists.
- Keep heading labels ATS-readable (no decorative-only titles).

3. Data Contract and Rendering Rules
- Define expected shape for each section (arrays, strings, dates, bullets, links).
- Add safe formatters for variable inputs (string vs array vs nested categories).
- Add fallback behavior for missing fields (hide line or collapse block).

4. Visual System
- Define typography scale:
  - Name: largest and most prominent.
  - Section title: clearly distinct from item titles.
  - Metadata (dates/locations/links): reduced contrast but readable.
- Define spacing scale:
  - Strong spacing between sections.
  - Tight but readable spacing inside repeated items.
- Define theme tokens:
  - primary, secondary/accent, text, textLight, textMuted, border, linkColor.
- Keep contrast conservative and print-safe.

5. Density and Overflow Logic
- Compute a content-density score from section volume (experience/projects/bullets/etc.).
- Apply density-specific style packs (low, medium, high) to prevent visual crowding.
- Add overflow measurement and report page usage to parent when available.
- Protect critical blocks with page-break controls (`pageBreakInside: avoid`, `breakInside: avoid`).

6. Interaction and Accessibility
- Keep semantics clean (`section`, heading hierarchy, list markup for bullets).
- Ensure reading order remains linear and predictable.
- Use iconography only as support, not as the only carrier of information.

7. Output and Print Fidelity
- Validate A4/Letter rendering assumptions and min-height strategy.
- Ensure links, dates, and bullet lists remain readable when exported.
- Avoid effects that degrade PDF clarity (heavy shadows, low-contrast text).

8. Validation Gate (Must Pass)
- ATS Gate:
  - Standard section headings present and machine-readable.
  - No essential content encoded only in decorative elements.
- Design Gate:
  - Typography hierarchy is obvious within 3 seconds.
  - Spacing rhythm is consistent across all sections.
- Data Gate:
  - Missing optional fields do not leave broken UI artifacts.
  - Mixed input formats (array/string/object) render safely.
- Output Gate:
  - No overflow in representative low/medium/high density samples.
  - PDF/print output remains legible and structurally intact.

## Branching Logic
- If user asks for maximum ATS score:
  - Minimize decorative flourishes, prioritize plain headings and consistent labels.
  - Prefer single-column layout and explicit bullets.
- If user asks for premium visual style:
  - Keep ATS headings unchanged but allow richer spacing and controlled accents.
  - Maintain print-safe contrast and section clarity.
- If content is very dense:
  - Switch to compact density pack, tighten spacing, shorten summaries, prioritize core sections.
- If content is sparse:
  - Use low-density pack, increase whitespace, avoid oversized empty gaps.

## Completion Criteria
- Template is fully renderable with partial and full datasets.
- Section order and titles are ATS-compliant by default.
- Theme and density system are documented and deterministic.
- Overflow behavior is measurable and surfaced.
- Print/PDF checks pass with representative sample resumes.

## References
- [Professional template baseline](./references/professional-template-baseline.md)
