# MathGen Design Direction

## Product

- MathGen is a static GitHub Pages homework app.
- The child is around 10 years old.
- The main jobs are: open this week's homework, do a little extra practice, test spelling, print if needed, and return later.

## Tone

- Calm
- Premium
- Clear
- Gentle
- Never corporate

Use Apple-style compositional restraint as a reference, not as a cloning target.

## Keep

- Large, confident headlines
- Clear primary versus secondary choices
- Quiet saved-progress treatment
- Warm, light surfaces
- Simple copy
- One-task-at-a-time rhythm

## Avoid

- Portal dashboards
- Equal-weight status panels everywhere
- Tiny utility labels repeated on every row
- Busy icon grids
- "Productivity app" language
- Adult school-management metaphors

## Surface Priorities

### Home

- Hero first
- Choice area second
- Why section third
- Saved area last

### Weekly sheet

- Step order must stay obvious
- Spelling should feel concrete and easy to scan
- Math rows should feel like separate tasks, not database rows
- Review and writing should support actual drafting

### Game

- The word is the star
- Typing should visually echo the remembered word
- Motion should be light and supportive

## File map

- `data/home-content.js`: product voice and home labels
- `js/render.js`: markup structure and screen hierarchy
- `styles.css`: tokens, spacing, responsive rules, print rules

## Review questions

- Does this feel like homework help, not software?
- Is the main action still obvious?
- Would a 10-year-old understand the wording without explanation?
- Is mobile using its space well?
- If printed, does the result still feel like a clean worksheet?
