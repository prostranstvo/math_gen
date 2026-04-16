---
name: design-kids-homework-app
description: Design and redesign MathGen's homework screens for a 10-year-old using a calm, premium, Apple-inspired tone without turning the app into a portal or dashboard. Use when changing home page hierarchy, worksheet or completion layouts, copy, spacing, colors, responsive behavior, or visual polish in this repo.
---

# Design Kids Homework App

Use this skill for product and visual design work inside `math_gen`. Keep the app feeling like a calm homework helper for one child at home, not a school admin tool, learning management system, or productivity dashboard.

## Start Here

- Read `data/home-content.js` for the product voice and section hierarchy.
- Read `js/render.js` for the current page structure.
- Read `styles.css` for tokens, breakpoints, print rules, and compatibility fallbacks.
- Read `references/mathgen-design-direction.md` before large layout, copy, or hierarchy changes.

## Core Rules

- Keep `Full Homework` as the primary action.
- Keep `Math Practice` and `Test Yourself` secondary and clearly separate from the weekly sheet.
- Design for a 10-year-old and a parent nearby, not for teachers, teams, or "power users."
- Prefer calm, premium, editorial layouts over dashboards, portal chrome, or dense control surfaces.
- Use child-friendly wording. Avoid terms like `workflow`, `activity feed`, `browser state`, `admin`, or `analytics`.
- Use cards only when they help make choices or separate tasks. Do not card every section by default.
- Fill mobile space intentionally. Do not leave large dead gutters or tiny headings that feel desktop-scaled.
- Preserve GitHub Pages compatibility. Do not add frameworks, build tooling, or runtime dependencies for design-only work.

## Workflow

### 1. Identify the surface

- Home page: strengthen decision-making, pacing, and section hierarchy.
- Worksheet page: reduce noise, protect reading order, and keep inputs easy to scan.
- Completion or saved areas: keep them supportive and quiet, never equal to the main homework action.
- Spelling game: make memory and reconstruction feel visual, clear, and a little playful without becoming chaotic.

### 2. Shape hierarchy before decoration

- Make the primary action obvious within two seconds.
- Use spacing, type scale, and placement before adding extra color or surfaces.
- Give supporting sections lighter treatment than the main decision area.
- Remove redundant labels when the structure already makes the meaning obvious.

### 3. Keep the MathGen tone

- Use oversized editorial headlines, quiet surfaces, and restrained color.
- Favor warm light backgrounds, soft separators, and subtle depth.
- Let the app feel premium, but still approachable for a child doing homework.
- If an interaction starts to resemble a SaaS portal, simplify it.

### 4. Protect mobile and print

- Check narrow widths whenever a headline, stage, or worksheet header changes.
- Keep touch targets comfortable and avoid overlapping header elements.
- When changing visual treatments, make sure print still becomes a plain worksheet.
- When adding newer CSS color features, preserve the fallback pattern already used in `styles.css`.

## Verification

- Run `npm test`.
- Run `npm run dev` and review the changed surface locally.
- Check phone-width layout for hierarchy, overlap, and wasted space.
- Check print preview when the change touches worksheets or section framing.
