---
name: import-weekly-school-pdfs
description: Import new Swansea weekly school PDFs into MathGen's structured week data. Use when new homework PDFs arrive, when running or updating scripts/import-weekly-updates.js, when merging data/swansea-weeks.import.json into data/swansea-weeks.js, or when adding generator support for new weekly math topics in this repo.
---

# Import Weekly School PDFs

Use this skill when fresh weekly homework PDFs arrive from school and MathGen needs new week data. The runtime app should not parse PDFs in the browser; import and clean the data locally, then merge the cleaned result into the repo.

## Start Here

- Read `scripts/import-weekly-updates.js`.
- Read `data/swansea-weeks.js`.
- Read `js/generator.js`, especially `buildWeeklyMathSectionByTopic()` and `buildWeeklyMathSection()`.
- Read `references/import-workflow.md` before the first merge pass.

## Workflow

### 1. Keep source files outside the public site

- Treat the PDFs as source documents, not app assets.
- If the repo stays public for GitHub Pages, avoid committing the raw school PDFs unless that is explicitly wanted.

### 2. Run the importer

- From the repo root, run `npm run import:weeks`.
- The default source folder is `../homework files PDF`.
- The draft output is `data/swansea-weeks.import.json`.

### 3. Review the draft before merging

- Check skipped files and missing `weekId` values.
- Clean wording so the exported week data stays child-friendly and readable.
- Keep `spelling` as a clean word list.
- Keep `grammar`, `writingPrompt`, and `reviewPrompt` concise.

### 4. Merge into the live app data

- Update `data/swansea-weeks.js`.
- Keep `weekOrder` in sync with any new week IDs.
- Preserve the public app structure: `weekId`, `date`, `spelling`, `grammar`, `writingTopic`, `writingPrompt`, `mathTopic`, `scienceTopic`, `reviewPrompt`.

### 5. Extend math logic when needed

- If a new PDF introduces a math topic not already supported, add generator support in `js/generator.js`.
- Match the weekly topic to an actual worksheet pattern instead of falling back to generic output.

## Verification

- Run `npm test`.
- Check `tests/importer.test.js` if parser behavior changed.
- Open the local app and verify the new weeks show up in the week selector.
- Generate at least one new week and confirm the math section matches the intended topic.
