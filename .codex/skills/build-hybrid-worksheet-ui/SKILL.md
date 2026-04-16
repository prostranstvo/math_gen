---
name: build-hybrid-worksheet-ui
description: Build and revise MathGen's hybrid worksheet interfaces that must work on screen and in print. Use when changing worksheet payload structure, section rendering, answer checking, persistence, validation, lined writing areas, spelling rows, game flows, print styles, or mobile worksheet behavior in this repo.
---

# Build Hybrid Worksheet UI

Use this skill when work touches how MathGen worksheets are generated, rendered, validated, saved, restored, or printed. Treat the worksheet as a paired experience: calm on screen, plain on paper.

## Start Here

- Read `js/generator.js` for payload structure and section generation.
- Read `js/render.js` for worksheet, game, and home rendering.
- Read `js/state.js` for validation, persistence, and legacy payload normalization.
- Read `styles.css` for section layout, mobile rules, and print rules.
- Read `references/worksheet-architecture.md` before structural changes.

## File Ownership

- `js/generator.js`: decide what the worksheet is.
- `js/render.js`: decide how the worksheet looks.
- `js/state.js`: decide how the worksheet validates, restores, and completes.
- `styles.css`: decide how the worksheet behaves across screen and print.
- `tests/*.test.js`: lock behavior after changes.

## Workflow

### 1. Start from the payload

- Put new worksheet behavior into the generated payload first.
- Keep `WorksheetPayload` as the single source of truth.
- Extend section metadata before adding one-off rendering branches.

### 2. Match the right section pattern

- `problems`: prompt plus answer input, separated into calm task blocks.
- `spelling`: one visible target word with multiple writing attempts.
- `review`: lined text space for short idea capture.
- `writing`: larger lined draft area.
- `spelling-test`: timed game state with preview, hide, type, retry.

### 3. Keep screen and print together

- Build the digital interaction first, then make sure print collapses into a clean worksheet.
- Do not let decorative framing leak into print.
- Do not hide critical worksheet content on mobile; adapt it instead.

### 4. Protect restore and validation

- If payload structure changes, update normalization in `js/state.js`.
- Keep unfinished work restorable from `sessionStorage`.
- Keep trophies and completion history in `localStorage`.
- Make blank answers invalid unless a section explicitly allows otherwise.

### 5. Keep the child experience simple

- Remove redundant labels when the row structure already explains itself.
- Use lined writing areas when the child is expected to draft or list ideas.
- Keep math, spelling, review, and writing visually distinct without making them feel like enterprise forms.

## Verification

- Run `npm test`.
- Review the changed worksheet in `npm run dev`.
- Refresh mid-worksheet to confirm restore still works.
- Check print preview whenever section structure or styling changes.
- Check a narrow mobile width if headers, rows, or answer inputs moved.
