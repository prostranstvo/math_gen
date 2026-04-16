# Worksheet Architecture

## Core contracts

- `generateFullHomework(weekId)` builds the weekly sheet.
- `generateSpellingTestGame()` builds the spelling memory game.
- `renderWorksheetView()` renders the worksheet shell and sections.
- `validateWorksheet()` checks answers, text, and task completion.
- `restoreActiveWorksheet()` restores in-progress work from session storage.

## Section anatomy

### Problems

- Generated in `js/generator.js`
- Rendered through `renderProblemRows()` in `js/render.js`
- Used for weekly math and math practice
- Prefer separated task panels over row-numbering clutter

### Spelling

- Uses `practiceRows`
- Each row has one target word and three entries
- Visible word can be spoken through `data-speak-text`

### Review

- Uses a `responseField`
- Should stay short and draft-friendly
- Current preferred treatment is lined space without extra repeated prompt blocks

### Writing

- Uses a `responseField`
- Should feel like a drafting area, not a compact note box

### Game

- Uses `payload.game`
- Current phases: ready, preview-all, preview-word, typing, complete
- Wrong answers re-show the same word before retry

## Persistence rules

- Active worksheet or game: `sessionStorage`
- Trophies and completion history: `localStorage`
- If a new field or section is added, update normalization in `js/state.js`

## Print rules

- Keep headings, tasks, writing lines, answer areas
- Remove navigation, saved-progress UI, and decorative chrome
- Preserve logical page breaks when adding large sections

## Tests to update

- `tests/generator.test.js` for payload changes
- `tests/render.test.js` for new markup or section behavior
- `tests/state.test.js` for restore and validation changes
