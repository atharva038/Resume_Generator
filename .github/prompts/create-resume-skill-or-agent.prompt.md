---
description: "Decide Skill vs Agent and scaffold a high-quality ATS resume-template workflow"
name: "Create Resume Skill Or Agent"
argument-hint: "Goal, target users, output format, and constraints"
agent: "agent"
model: ["GPT-5 (copilot)", "Claude Sonnet 4.5 (copilot)"]
---
Create a reusable workflow for building resume templates with excellent visual design, ATS-friendly structure, and maintainable implementation.

User input:
$ARGUMENTS

Follow this process strictly:
1. Decide whether this should be a Skill or an Agent.
2. Explain the decision in 3-5 bullets.
3. If no critical constraints are provided, default to Skill for this use case.
4. Produce a complete scaffold plan with file structure and starter content.
5. Include a quality checklist for design, ATS compatibility, and implementation quality.

Decision criteria:
- Choose Skill when the workflow is repeatable, domain-specific, and benefits from bundled instructions/templates/checklists.
- Choose Agent when broad autonomous behavior is required across many unrelated tasks and tool orchestration is the primary need.
- For resume-template architecture and standards, prefer Skill unless the user explicitly requests autonomous multi-domain execution.

Requirements for the generated solution:
- ATS correctness: clear section hierarchy, standard headings, keyword-friendly structure, readable ordering.
- Visual design system: typography scale, spacing scale, color tokens, component variants, print-safe defaults.
- Template architecture: modular sections, configurable blocks, optional variants (modern/classic/compact), localization-ready labels.
- Data contract: explicit schema for resume data, validation rules, sensible defaults, missing-data fallback behavior.
- Accessibility: semantic markup, contrast-safe defaults, predictable reading order.
- Output targets: web preview + PDF/print-friendly render.
- Maintainability: naming conventions, folder structure, lint/format rules, examples.

Output format (use exactly these headings):
## Recommendation
## Why This Choice
## Scaffold Structure
## Starter Files
## Resume Template Design Rules
## ATS Compliance Rules
## Validation Checklist
## Example Invocation

In Starter Files, include concise but concrete starter content snippets for each critical file.
In Validation Checklist, include measurable pass/fail checks.
If information is missing, add a short "Assumptions" note at the end.