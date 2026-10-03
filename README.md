# Math Gen

A browser-based homework portal for a Swansea student moving from Grade 5 to Grade 6.

## Run locally

```sh
npm run dev
```

Open `http://localhost:8123`. No build step or account is required.

```sh
npm test
```

## Grade 6

The Grade 6 home page includes five sections:

- **This Week:** Add, edit, complete, and reopen tasks. Label each task as a teacher assignment or extra practice. Due dates are optional. Add focus topics from the subject pages.
- **Subjects:** Browse all 50 topics from the teacher's six-subject outline. Save responses to three prompts per topic. Record a self-check separately from completed work.
- **Practice:** Use 20 math topic entries, including mixed review. Each round has six questions. Core and larger-number ranges are available. Hints, retries, and completed answer records are saved.
- **Projects:** Use six planners for the Science Fair, novel project, persuasive essay, art project, performance, and Classroom Economy.
- **Progress:** Review topic self-checks and the most recent 200 completed practice rounds. Download a JSON copy of Grade 6 work.

The year plan does not include weekly dates. The portal does not invent teacher assignments or a lesson schedule. Activities are extra practice. Non-math topics use class materials and guided notes; they are not a complete lesson library. Written work and project steps are not automatically graded. The EQAO review questions are original practice, not official EQAO material.

### Storage

Grade 6 uses the separate `mathGenGrade6:v1` local-storage key. Work remains in the current browser and site origin. It does not sync between devices. Browser data removal also removes saved work. Downloaded JSON files are readable work records; this version has no import screen.

The Grade 5 archive retains the original worksheets, math practice, spelling game, speech, print functions, progress records, and storage keys. Opening Grade 6 does not overwrite an unfinished Grade 5 worksheet. Open the archive and use its resume action to continue it.

If browser storage fails, the portal shows a message. New work stays in memory for that session and can be downloaded. If the Grade 6 save cannot be read, the portal leaves the original saved data untouched.

## Content and code

- `data/grade6-plan.js`: Teacher scope, topic prompts, and project steps. Topic IDs are stable storage identifiers.
- `js/grade6-practice.js`: Worked examples, question generators, answer checking, and retries.
- `js/grade6-state.js`: Grade 6 data validation, persistence, and completion history.
- `js/grade6-render.js`: Grade 6 screens and print content.
- `js/grade6.js`: Grade 6 event handling.
- `js/app.js`: Shared entry point and Grade 5 behaviour.
- `grade6.css`: Grade 6 screen, mobile, and print styles.

All assets use relative paths so the portal can run at a domain root or a GitHub Pages subpath.

## Checks

The automated checks cover the legacy features, teacher-plan coverage, all math generators, equivalent fractions, prime factorization, retry records, separate storage, corrupt saves, user-text escaping, and screen rendering.

Browser checks also cover topic notes, task editing and completion, unfinished practice, answer reviews, project notes, mobile layouts, print output, and Grade 5 resume behaviour.
