function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
}

function formatCompletionDate(dateString) {
    return new Date(dateString).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function renderHistoryList(history, emptyMessage, variantClass = "") {
    if (!history.length) {
        return `<p class="history-note">${escapeHtml(emptyMessage)}</p>`;
    }

    return `
        <ol class="history-list ${variantClass}">
            ${history.map((entry) => `
                <li class="history-item">
                    <strong>${escapeHtml(entry.label)}</strong>
                    <span>${escapeHtml(formatCompletionDate(entry.completedAt))}</span>
                </li>
            `).join("")}
        </ol>
    `;
}

function renderLocalNav(content) {
    return `
        <nav class="home-local-nav no-print" aria-label="Home sections">
            <span class="home-local-brand">${escapeHtml(content.brand)}</span>
            <div class="home-local-links">
                ${content.navLinks.map((item) => `
                    <a href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a>
                `).join("")}
            </div>
        </nav>
    `;
}

function renderTaskRow(task, payload, validation) {
    const isInvalid = Boolean(validation && validation.invalidTaskIds.includes(task.id));
    const checked = Boolean(payload.responses.tasks[task.id]);

    return `
        <label class="task-row ${isInvalid ? "task-row--invalid" : ""}" data-task-row="${escapeHtml(task.id)}">
            <input
                type="checkbox"
                data-task-id="${escapeHtml(task.id)}"
                ${checked ? "checked" : ""}
                ${isInvalid ? 'aria-invalid="true"' : ""}
            >
            <span>
                <strong>Mark this part when it is done</strong>
                <span class="field-note">${escapeHtml(task.label)}</span>
            </span>
        </label>
    `;
}

function getTextFieldNote(field) {
    if (field.minWords && field.minWords > 1) {
        return `Write at least ${field.minWords} words here before you finish the page.`;
    }

    return "Write something here before you finish the page.";
}

function renderProblemRows(section, payload, validation, isGrid) {
    const wrapperTag = isGrid ? "div" : "ol";
    const rowTag = isGrid ? "div" : "li";
    const wrapperClass = isGrid ? "problem-grid" : "problem-list";

    return `
        <${wrapperTag} class="${wrapperClass}">
            ${section.problems.map((problem, index) => {
                const currentValue = payload.responses.answers[problem.id] || "";
                const isInvalid = Boolean(validation && validation.invalidAnswerIds.includes(problem.id));
                const isValid = Boolean(validation && !isInvalid && currentValue.trim());
                const rowClass = [
                    "problem-row",
                    isGrid ? "problem-row--grid" : "",
                    isInvalid ? "problem-row--invalid" : "",
                    isValid ? "problem-row--valid" : ""
                ].filter(Boolean).join(" ");
                const fieldNote = isInvalid
                    ? `<p class="field-note" id="${escapeHtml(problem.id)}-note">Check this answer before you finish the page.</p>`
                    : "";

                return `
                    <${rowTag} class="${rowClass}" data-answer-row="${escapeHtml(problem.id)}">
                        <div class="problem-stem">
                            <span class="problem-number">Problem ${index + 1}</span>
                            <div class="problem-prompt">${escapeHtml(problem.prompt)}</div>
                        </div>
                        <div class="answer-wrap">
                            <label class="answer-label" for="${escapeHtml(problem.id)}">Answer</label>
                            <input
                                class="answer-input"
                                id="${escapeHtml(problem.id)}"
                                type="text"
                                inputmode="${escapeHtml(problem.inputMode)}"
                                autocomplete="off"
                                data-answer-id="${escapeHtml(problem.id)}"
                                value="${escapeHtml(currentValue)}"
                                ${isInvalid ? `aria-invalid="true" aria-describedby="${escapeHtml(problem.id)}-note"` : ""}
                            >
                        </div>
                        ${fieldNote}
                    </${rowTag}>
                `;
            }).join("")}
        </${wrapperTag}>
    `;
}

function renderSpellingRows(section, payload, validation) {
    return `
        <div class="spelling-practice">
            ${section.practiceRows.map((row) => {
                const rowInvalid = Boolean(validation && row.entries.some((entry) => validation.invalidSpellingIds.includes(entry.id)));
                const rowValid = Boolean(
                    validation &&
                    row.entries.every((entry) => {
                        const value = payload.responses.answers[entry.id] || "";
                        return value.trim() && !validation.invalidSpellingIds.includes(entry.id);
                    })
                );
                const rowNoteId = `${row.entries[0].id}-note`;

                return `
                    <div class="spelling-row ${rowInvalid ? "spelling-row--invalid" : ""} ${rowValid ? "spelling-row--valid" : ""}">
                        <div class="spelling-word-wrap">
                            <span class="spelling-word">${escapeHtml(row.word)}</span>
                        </div>

                        <div class="spelling-attempts">
                            ${row.entries.map((entry, attemptIndex) => {
                                const currentValue = payload.responses.answers[entry.id] || "";
                                const isInvalid = Boolean(validation && validation.invalidSpellingIds.includes(entry.id));
                                const isValid = Boolean(validation && !isInvalid && currentValue.trim());

                                return `
                                    <div class="spelling-attempt ${isInvalid ? "spelling-attempt--invalid" : ""} ${isValid ? "spelling-attempt--valid" : ""}" data-answer-row="${escapeHtml(entry.id)}">
                                        <label class="sr-only" for="${escapeHtml(entry.id)}">${escapeHtml(row.word)} attempt ${attemptIndex + 1}</label>
                                        <input
                                            class="answer-input spelling-input"
                                            id="${escapeHtml(entry.id)}"
                                            type="text"
                                            inputmode="text"
                                            autocomplete="off"
                                            data-answer-id="${escapeHtml(entry.id)}"
                                            value="${escapeHtml(currentValue)}"
                                            placeholder=""
                                            ${isInvalid ? `aria-invalid="true" aria-describedby="${escapeHtml(rowNoteId)}"` : ""}
                                        >
                                    </div>
                                `;
                            }).join("")}
                        </div>

                        ${rowInvalid ? `<p class="field-note" id="${escapeHtml(rowNoteId)}">Check each spelling box so it matches "${escapeHtml(row.word)}".</p>` : ""}
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function renderTextEntry(field, payload, validation, options = {}) {
    const currentValue = payload.responses.text?.[field.id] || "";
    const isInvalid = Boolean(validation && validation.invalidTextIds.includes(field.id));
    const isValid = Boolean(validation && !isInvalid && currentValue.trim());
    const noteId = `${field.id}-note`;

    return `
        <div class="text-entry ${isInvalid ? "text-entry--invalid" : ""} ${isValid ? "text-entry--valid" : ""}" data-text-row="${escapeHtml(field.id)}">
            <label class="text-entry-label" for="${escapeHtml(field.id)}">${escapeHtml(options.label || field.label)}</label>
            <textarea
                class="text-entry-input ${options.lined || field.lined ? "text-entry-input--lined" : ""}"
                id="${escapeHtml(field.id)}"
                rows="${Number(field.rows || 5)}"
                data-text-id="${escapeHtml(field.id)}"
                placeholder="${escapeHtml(field.placeholder || "")}"
                ${isInvalid ? `aria-invalid="true" aria-describedby="${escapeHtml(noteId)}"` : ""}
            >${escapeHtml(currentValue)}</textarea>
            ${isInvalid ? `<p class="field-note" id="${escapeHtml(noteId)}">${escapeHtml(getTextFieldNote(field))}</p>` : ""}
        </div>
    `;
}

function renderSection(section, payload, validation) {
    const pageBreakClass = section.pageBreakBefore ? "page-break-before" : "";
    const surfaceClass = section.surfaceVariant ? `section-sheet--${section.surfaceVariant}` : "";
    const sectionHeader = `
        <div class="section-header">
            ${section.stepLabel ? `<p class="section-step">${escapeHtml(section.stepLabel)}</p>` : ""}
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
            ${section.hint ? `<p class="section-copy">${escapeHtml(section.hint)}</p>` : ""}
            ${section.intro ? `<p class="section-copy">${escapeHtml(section.intro)}</p>` : ""}
        </div>
    `;

    switch (section.kind) {
        case "problems":
            return `
                <section class="section-sheet ${surfaceClass} ${pageBreakClass}">
                    ${sectionHeader}
                    ${renderProblemRows(section, payload, validation, section.layout === "grid")}
                </section>
            `;
        case "spelling":
            return `
                <section class="section-sheet ${surfaceClass} ${pageBreakClass}">
                    ${sectionHeader}
                    ${renderSpellingRows(section, payload, validation)}
                </section>
            `;
        case "review":
            return `
                <section class="section-sheet ${surfaceClass} ${pageBreakClass}">
                    ${sectionHeader}
                    <div class="review-box">${escapeHtml(section.prompt)}</div>
                    ${renderTextEntry(section.responseField, payload, validation, { label: "Your ideas" })}
                </section>
            `;
        case "writing":
            return `
                <section class="section-sheet ${surfaceClass} ${pageBreakClass}">
                    ${sectionHeader}
                    ${renderTextEntry(section.responseField, payload, validation, { label: "Your draft", lined: true })}
                </section>
            `;
        default:
            return "";
    }
}

export function renderHomeView({ content, weeks, selectedWeekId, progress, activeWorksheet }) {
    const selectedWeek = weeks[selectedWeekId] || weeks[Object.keys(weeks).at(-1)];
    const resumeLabel = activeWorksheet?.type === "spelling-test" ? "Resume this test" : content.saved.resumeLabel;

    return `
        <div class="page-shell home-shell">
            ${renderLocalNav(content)}

            <section class="hero-panel hero-panel--apple">
                <div class="hero-layout">
                    <div class="hero-copy-wrap">
                        <p class="eyebrow">${escapeHtml(content.hero.eyebrow)}</p>
                        <h1 class="hero-title">${escapeHtml(content.hero.title)}</h1>
                        <p class="hero-copy">${escapeHtml(content.hero.copy)}</p>
                        <div class="hero-actions no-print">
                            <button class="button button--primary" type="button" data-action="generate-full">Open Week ${escapeHtml(selectedWeek.weekId)}</button>
                            <a class="button button--link" href="#choose">${escapeHtml(content.hero.secondaryActionLabel)}</a>
                        </div>
                    </div>

                    <div class="hero-stage" aria-hidden="true">
                        <div class="hero-preview hero-preview--primary">
                            <span class="preview-kicker">${escapeHtml(content.modules.homework.kicker)}</span>
                            <strong>Week ${escapeHtml(selectedWeek.weekId)}</strong>
                            <p>${escapeHtml(content.modules.homework.preview)}</p>
                        </div>
                        <div class="hero-preview hero-preview--secondary">
                            <span class="preview-kicker">${escapeHtml(content.modules.practice.kicker)}</span>
                            <strong>${escapeHtml(content.modules.practice.title)}</strong>
                            <p>${escapeHtml(content.modules.practice.preview)}</p>
                        </div>
                        <div class="hero-preview hero-preview--tertiary">
                            <span class="preview-kicker">${escapeHtml(content.modules.test.kicker)}</span>
                            <strong>${escapeHtml(content.modules.test.title)}</strong>
                            <p>${escapeHtml(content.modules.test.preview)}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="choose" class="home-section home-section--band">
                <div class="section-intro">
                    <p class="eyebrow">${escapeHtml(content.choose.eyebrow)}</p>
                    <h2 class="panel-title">${escapeHtml(content.choose.title)}</h2>
                    <p class="panel-copy">${escapeHtml(content.choose.copy)}</p>
                </div>

                <div class="product-grid">
                    <article class="product-panel product-panel--primary">
                        <span class="product-kicker">${escapeHtml(content.modules.homework.kicker)}</span>
                        <h3>${escapeHtml(content.modules.homework.title)}</h3>
                        <p>${escapeHtml(content.modules.homework.copy)}</p>
                        <div class="select-wrap">
                            <label class="select-label" for="week-selector">${escapeHtml(content.modules.homework.selectorLabel)}</label>
                            <select class="select-field" id="week-selector" data-action="choose-week">
                                ${Object.values(weeks).map((week) => `
                                    <option value="${escapeHtml(week.weekId)}" ${week.weekId === selectedWeek.weekId ? "selected" : ""}>
                                        Week ${escapeHtml(week.weekId)} | ${escapeHtml(week.date)} | ${escapeHtml(week.mathTopic)}
                                    </option>
                                `).join("")}
                            </select>
                        </div>
                        <div class="product-footnote">${escapeHtml(content.modules.homework.dynamicFootnotePrefix)} ${escapeHtml(selectedWeek.writingTopic)}</div>
                        <button class="button button--primary" type="button" data-action="generate-full">Open Week ${escapeHtml(selectedWeek.weekId)}</button>
                    </article>

                    <article class="product-panel product-panel--secondary">
                        <span class="product-kicker">${escapeHtml(content.modules.practice.kicker)}</span>
                        <h3>${escapeHtml(content.modules.practice.title)}</h3>
                        <p>${escapeHtml(content.modules.practice.copy)}</p>
                        <div class="product-footnote">${escapeHtml(content.modules.practice.footnote)}</div>
                        <button class="button button--secondary" type="button" data-action="generate-math">${escapeHtml(content.modules.practice.ctaLabel)}</button>
                    </article>

                    <article class="product-panel product-panel--tertiary">
                        <span class="product-kicker">${escapeHtml(content.modules.test.kicker)}</span>
                        <h3>${escapeHtml(content.modules.test.title)}</h3>
                        <p>${escapeHtml(content.modules.test.copy)}</p>
                        <div class="product-footnote">${escapeHtml(content.modules.test.footnote)}</div>
                        <button class="button button--tertiary" type="button" data-action="generate-test">${escapeHtml(content.modules.test.ctaLabel)}</button>
                    </article>
                </div>
            </section>

            <section id="why" class="home-section home-section--band">
                <div class="section-intro section-intro--compact">
                    <p class="eyebrow">${escapeHtml(content.why.eyebrow)}</p>
                    <h2 class="panel-title">${escapeHtml(content.why.title)}</h2>
                    <p class="panel-copy">${escapeHtml(content.why.copy)}</p>
                </div>

                <div class="reason-grid">
                    ${content.why.items.map((item) => `
                        <article class="reason-tile">
                            <h3>${escapeHtml(item.title)}</h3>
                            <p>${escapeHtml(item.copy)}</p>
                        </article>
                    `).join("")}
                </div>
            </section>

            <section id="saved" class="home-section home-section--band home-section--saved">
                <div class="saved-header">
                    <div>
                        <p class="eyebrow">${escapeHtml(content.saved.eyebrow)}</p>
                        <h2 class="panel-title">${escapeHtml(content.saved.title)}</h2>
                        <p class="panel-copy">${escapeHtml(content.saved.copy)}</p>
                    </div>
                    <div class="saved-total">${progress.trophies} ${progress.trophies === 1 ? "trophy earned here" : "trophies earned here"}</div>
                </div>

                ${activeWorksheet ? `
                    <div class="saved-resume no-print">
                        <div>
                            <strong>${escapeHtml(content.saved.resumeTitle)}</strong>
                            <p>${escapeHtml(activeWorksheet.displayLabel || activeWorksheet.completionLabel)} is still ready to open again.</p>
                        </div>
                        <button class="button button--ghost" type="button" data-action="resume-active">${escapeHtml(resumeLabel)}</button>
                    </div>
                ` : ""}

                ${renderHistoryList(progress.history.slice(0, 5), content.saved.emptyMessage, "history-list--saved")}
            </section>
        </div>
    `;
}

export function renderWorksheetView({ payload, validation }) {
    const navLabel = payload.navLabel || (payload.type === "math-practice" ? "Practice" : "Homework");
    const helperNote = payload.helperNote || {
        title: payload.type === "math-practice" ? "Work one section at a time." : "Finish the math, then complete the spelling, review, and writing boxes.",
        copy: payload.type === "math-practice" ? "When every answer looks ready, use Check My Page." : "This page stays saved on this device until every step has real work in it.",
        actionLabel: payload.type === "math-practice" ? "Check My Page" : "Finish This Page"
    };
    const worksheetBadge = payload.selectedWeekId ? `Week ${escapeHtml(payload.selectedWeekId)}` : "Extra practice";

    return `
        <div class="page-shell worksheet-shell">
            <header class="sheet-hero sheet-hero--${escapeHtml(payload.accent)}">
                <div class="sheet-controls no-print">
                    <button class="button button--ghost" type="button" data-action="go-home">Sheets</button>
                    <button class="button button--ghost" type="button" data-action="print-sheet">Print</button>
                    <button class="button button--primary" type="button" data-action="finish-worksheet">${escapeHtml(helperNote.actionLabel)}</button>
                </div>

                <div class="sheet-topline">
                    <div>
                        <p class="eyebrow">${escapeHtml(navLabel)}</p>
                        <h1 class="sheet-title">${escapeHtml(payload.title)}</h1>
                        <p class="sheet-subtitle">${escapeHtml(payload.subtitle)}</p>
                    </div>
                    <div class="sheet-corner">
                        <span class="sheet-badge">${worksheetBadge}</span>
                        <div class="name-lines">
                            <span>Name __________________</span>
                            <span>Date __________________</span>
                        </div>
                    </div>
                </div>

                <div class="sheet-helper">
                    <strong>${escapeHtml(helperNote.title)}</strong>
                    <span>${escapeHtml(helperNote.copy)}</span>
                </div>
            </header>

            <div class="status-region" aria-live="polite">
                ${validation && !validation.isValid ? `
                    <section class="validation-summary" id="validation-summary" tabindex="-1">
                        <h2 class="status-title">A few spots still need checking.</h2>
                        <ul>
                            ${validation.messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}
                        </ul>
                    </section>
                ` : ""}
            </div>

            <main class="worksheet-sections">
                ${payload.sections.map((section) => renderSection(section, payload, validation)).join("")}
            </main>
        </div>
    `;
}

export function renderGameView({ payload }) {
    const game = payload.game || { words: [], currentIndex: 0, phase: "ready", currentInput: "", feedback: null };
    const helperNote = payload.helperNote || {
        title: "Look, remember, then type.",
        copy: "You will see all 10 words for 3 seconds, then one word at a time.",
        actionLabel: "Start Test"
    };
    const completedWords = game.words.filter((word) => word.status === "correct").length;
    const firstTryWords = game.words.filter((word) => word.solvedOnAttempt === 1).length;
    const currentWord = game.words[game.currentIndex] || null;
    const isReady = game.phase === "ready";
    const isShowingAll = game.phase === "preview-all";
    const isShowingOne = game.phase === "preview-word";
    const isTyping = game.phase === "typing";
    const statusToneClass = game.feedback?.tone ? `game-status--${escapeHtml(game.feedback.tone)}` : "";

    return `
        <div class="page-shell worksheet-shell game-shell">
            <header class="sheet-hero sheet-hero--game">
                <div class="sheet-controls no-print">
                    <button class="button button--ghost" type="button" data-action="go-home">Sheets</button>
                    <button class="button button--ghost" type="button" data-action="restart-spelling-test">${isReady ? "Pick New Words" : "Start Over"}</button>
                    ${isReady ? `<button class="button button--tertiary" type="button" data-action="start-spelling-test">${escapeHtml(helperNote.actionLabel)}</button>` : ""}
                </div>

                <div class="sheet-topline">
                    <div>
                        <p class="eyebrow">${escapeHtml(payload.navLabel || "Test")}</p>
                        <h1 class="sheet-title">${escapeHtml(payload.title)}</h1>
                        <p class="sheet-subtitle">${escapeHtml(payload.subtitle)}</p>
                    </div>
                    <div class="sheet-corner">
                        <span class="sheet-badge">${game.words.length} random spelling words</span>
                        <div class="name-lines game-lines">
                            <span>${completedWords} of ${game.words.length} finished</span>
                            <span>${firstTryWords} first try so far</span>
                        </div>
                    </div>
                </div>

                <div class="sheet-helper">
                    <strong>${escapeHtml(helperNote.title)}</strong>
                    <span>${escapeHtml(helperNote.copy)}</span>
                </div>
            </header>

            <main class="worksheet-sections">
                <section class="section-sheet section-sheet--game">
                    <div class="game-progress-strip">
                        <div class="summary-item">
                            <span>Words</span>
                            <strong>${game.words.length}</strong>
                        </div>
                        <div class="summary-item">
                            <span>Finished</span>
                            <strong>${completedWords}</strong>
                        </div>
                        <div class="summary-item">
                            <span>First try</span>
                            <strong>${firstTryWords}</strong>
                        </div>
                        <div class="summary-item">
                            <span>Bonus</span>
                            <strong>${firstTryWords === game.words.length && game.words.length ? "+1 trophy" : "Perfect round = +1"}</strong>
                        </div>
                    </div>

                    <div class="game-progress-dots" aria-hidden="true">
                        ${game.words.map((word, index) => `
                            <span class="game-progress-dot ${word.status === "correct" ? "game-progress-dot--done" : ""} ${index === game.currentIndex ? "game-progress-dot--current" : ""}"></span>
                        `).join("")}
                    </div>

                    <section class="game-status ${statusToneClass}" aria-live="polite">
                        <p class="eyebrow">Round status</p>
                        <strong>${isReady ? "Ready when you are." : `Word ${Math.min(game.currentIndex + 1, game.words.length)} of ${game.words.length}`}</strong>
                        <p>${escapeHtml(game.feedback?.message || "Look closely, then type from memory.")}</p>
                    </section>

                    ${isReady ? `
                        <div class="game-card game-card--intro">
                            <h2 class="section-title">A short spelling memory round.</h2>
                            <p class="panel-copy">You will see all 10 words for 3 seconds. After that, each word shows by itself for 3 seconds, then disappears until you type it correctly.</p>
                            <ul class="game-rule-list">
                                <li>Ten random spelling words are chosen from across all weeks.</li>
                                <li>Each word moves on only after it is typed correctly.</li>
                                <li>If all 10 are right on the first try, you earn one bonus trophy.</li>
                            </ul>
                        </div>
                    ` : ""}

                    ${isShowingAll ? `
                        <div class="game-card">
                            <p class="eyebrow">Look quickly</p>
                            <h2 class="section-title">These are your 10 words.</h2>
                            <div class="game-word-grid">
                                ${game.words.map((word) => `<span class="game-word-chip">${escapeHtml(word.word)}</span>`).join("")}
                            </div>
                        </div>
                    ` : ""}

                    ${isShowingOne && currentWord ? `
                        <div class="game-card game-card--focus">
                            <p class="eyebrow">Look closely</p>
                            <h2 class="section-title">Remember this word.</h2>
                            <div class="game-focus-word">${escapeHtml(currentWord.word)}</div>
                        </div>
                    ` : ""}

                    ${isTyping && currentWord ? `
                        <form class="game-entry-form" data-game-form>
                            <div class="game-entry-header">
                                <p class="eyebrow">Type it back</p>
                                <h2 class="section-title">Type the word you just saw.</h2>
                                <p class="panel-copy">If it is not right yet, the same word comes back for 3 more seconds.</p>
                            </div>
                            <div class="game-entry-stage">
                                <label class="sr-only" for="spelling-test-input">Type the hidden word</label>
                                <input
                                    class="game-entry-input"
                                    id="spelling-test-input"
                                    type="text"
                                    autocomplete="off"
                                    autocorrect="off"
                                    autocapitalize="off"
                                    spellcheck="false"
                                    inputmode="text"
                                    data-game-input="current"
                                    value="${escapeHtml(game.currentInput || "")}"
                                    placeholder="Type the word"
                                >
                            </div>
                            <button class="button button--tertiary" type="submit">Submit word</button>
                        </form>
                    ` : ""}
                </section>
            </main>
        </div>
    `;
}

export function renderCompletionView({ completionData, progress }) {
    const isHomework = completionData.entry.type === "full-homework";
    const isGame = completionData.entry.type === "spelling-test";
    const repeatLabel = isHomework
        ? "Open another homework page"
        : isGame
            ? "Play another spelling test"
            : "Make another practice page";
    const title = isHomework
        ? "Homework finished."
        : isGame
            ? "Spelling test finished."
            : "Practice finished.";
    const details = completionData.details || null;
    const summaryItems = isGame
        ? [
            {
                label: "First-try score",
                value: `${details?.score || 0} / ${details?.totalWords || 10}`
            },
            {
                label: "Total tries",
                value: String(details?.totalAttempts || 0)
            },
            {
                label: "Bonus",
                value: details?.bonusAwarded ? "+1 extra trophy" : "No bonus this round"
            },
            {
                label: "Trophies here",
                value: String(completionData.trophies)
            }
        ]
        : [
            {
                label: "Finished page",
                value: completionData.entry.label
            },
            {
                label: "Trophies here",
                value: String(completionData.trophies)
            },
            {
                label: "Finished at",
                value: formatCompletionDate(completionData.entry.completedAt)
            }
        ];

    return `
        <div class="page-shell completion-shell">
            <section class="completion-hero">
                <p class="eyebrow">Done</p>
                <h1 class="completion-title">${escapeHtml(title)}</h1>
                <p class="panel-copy">${escapeHtml(isGame ? "This round is saved on this device now. You can head back to the sheet chooser or start another spelling test right away." : "This page is saved on this device now. You can head back to the sheet chooser or start one more page right away.")}</p>

                <div class="summary-strip">
                    ${summaryItems.map((item) => `
                        <div class="summary-item">
                            <span>${escapeHtml(item.label)}</span>
                            <strong>${escapeHtml(item.value)}</strong>
                        </div>
                    `).join("")}
                </div>

                <div class="toolbar no-print">
                    <button class="button button--ghost" type="button" data-action="go-home">Back to Sheets</button>
                    <button class="button button--primary" type="button" data-action="generate-another">${repeatLabel}</button>
                </div>
            </section>

            <section class="home-section home-section--saved completion-saved">
                <div class="saved-header">
                    <div>
                        <p class="eyebrow">Saved</p>
                        <h2 class="panel-title">Recent finished work</h2>
                        <p class="panel-copy">Only the newest finished pages and tests stay in view, so the list stays small and easy to scan.</p>
                    </div>
                </div>
                ${renderHistoryList(progress.history.slice(0, 5), "No work finished yet.", "history-list--saved")}
            </section>
        </div>
    `;
}
