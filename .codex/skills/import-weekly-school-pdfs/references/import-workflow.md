# Import Workflow

## Command path

- Run `npm run import:weeks`
- Script entry: `scripts/import-weekly-updates.js`
- Default PDF source: `../homework files PDF`
- Draft output: `data/swansea-weeks.import.json`

## Imported shape

Each week should end up with:

- `weekId`
- `date`
- `spelling`
- `grammar`
- `writingTopic`
- `writingPrompt`
- `mathTopic`
- `scienceTopic`
- `reviewPrompt`

## Merge heuristics

- Prefer clean classroom wording over raw PDF phrasing.
- Keep spelling lists trimmed and readable.
- Keep grammar notes short.
- Keep writing prompts actionable for a child.
- Keep review prompts simple enough for the lined review field.

## Math topic sync

Importer output alone is not enough. After merging week data:

- inspect `mathTopic`
- compare it to `buildWeeklyMathSectionByTopic()` in `js/generator.js`
- add or refine a branch if the topic is new

## Common follow-up files

- `data/swansea-weeks.js`
- `js/generator.js`
- `tests/importer.test.js`
- `tests/generator.test.js`

## Final check

- The new week appears in the selector
- The new week is ordered correctly in `weekOrder`
- The weekly sheet uses the right math pattern
- The wording reads like MathGen, not like raw OCR text
