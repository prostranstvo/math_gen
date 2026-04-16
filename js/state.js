const STORAGE_KEYS = Object.freeze({
    activeWorksheet: "mathGenActiveWorksheet",
    trophies: "mathGenTrophyCount",
    history: "mathGenCompletionHistory",
    stats: "mathGenProgressStats"
});

function createDefaultProgressStats() {
    return {
        completedPages: 0,
        completedHomework: 0,
        completedPractice: 0,
        completedTests: 0,
        perfectSpellingRounds: 0
    };
}

function normalizeProgressStats(stats, history = []) {
    const defaults = createDefaultProgressStats();

    if (!stats || typeof stats !== "object") {
        return history.reduce((accumulator, entry) => {
            if (entry?.type === "full-homework") {
                accumulator.completedPages += 1;
                accumulator.completedHomework += 1;
            }

            if (entry?.type === "math-practice") {
                accumulator.completedPages += 1;
                accumulator.completedPractice += 1;
            }

            if (entry?.type === "spelling-test") {
                accumulator.completedTests += 1;
                if (/perfect round/i.test(String(entry.label || ""))) {
                    accumulator.perfectSpellingRounds += 1;
                }
            }

            return accumulator;
        }, defaults);
    }

    return {
        completedPages: Number(stats.completedPages) || 0,
        completedHomework: Number(stats.completedHomework) || 0,
        completedPractice: Number(stats.completedPractice) || 0,
        completedTests: Number(stats.completedTests) || 0,
        perfectSpellingRounds: Number(stats.perfectSpellingRounds) || 0
    };
}

/**
 * @typedef {Object} CompletionEntry
 * @property {string} id
 * @property {string} type
 * @property {string|null} weekId
 * @property {string} label
 * @property {string} completedAt
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {string[]} invalidAnswerIds
 * @property {string[]} invalidSpellingIds
 * @property {string[]} invalidTextIds
 * @property {string[]} invalidTaskIds
 * @property {string[]} messages
 * @property {string|null} focusTargetId
 * @property {"answer"|"text"|"task"|null} focusTargetType
 */

export function createMemoryStorage() {
    const values = new Map();

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
        removeItem(key) {
            values.delete(key);
        },
        clear() {
            values.clear();
        }
    };
}

function getLocalStorage() {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage;
}

function getSessionStorage() {
    if (typeof window === "undefined") {
        return null;
    }

    return window.sessionStorage;
}

function readJson(storage, key, fallbackValue) {
    if (!storage) {
        return fallbackValue;
    }

    try {
        const rawValue = storage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : fallbackValue;
    } catch (error) {
        return fallbackValue;
    }
}

function writeJson(storage, key, value) {
    if (!storage) {
        return;
    }

    try {
        storage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Unable to write ${key}`, error);
    }
}

function removeValue(storage, key) {
    if (!storage) {
        return;
    }

    try {
        storage.removeItem(key);
    } catch (error) {
        console.warn(`Unable to clear ${key}`, error);
    }
}

function isWorksheetPayload(payload) {
    return Boolean(
        payload &&
        typeof payload.id === "string" &&
        typeof payload.type === "string" &&
        Array.isArray(payload.sections) &&
        payload.responses &&
        typeof payload.responses === "object" &&
        payload.responses.answers &&
        payload.responses.tasks
    );
}

function collectProblems(payload) {
    return payload.sections.flatMap((section) => section.kind === "problems" ? section.problems : []);
}

function collectSpellingEntries(payload) {
    return payload.sections.flatMap((section) => (
        section.kind === "spelling"
            ? section.practiceRows.flatMap((row) => row.entries)
            : []
    ));
}

function collectTextFields(payload) {
    return payload.sections.flatMap((section) => section.responseField ? [section.responseField] : []);
}

function collectManualTasks(payload) {
    return payload.sections.flatMap((section) => section.manualTask ? [section.manualTask] : []);
}

function buildLegacySpellingEntryId(payload, sectionId, rowIndex, entryIndex) {
    return `${payload.id}-${sectionId}-spelling-${rowIndex + 1}-${entryIndex + 1}`;
}

function buildLegacyTextFieldId(payload, sectionId) {
    return `${payload.id}-${sectionId}-text`;
}

function normalizeWorksheetPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return payload;
    }

    payload.responses = payload.responses && typeof payload.responses === "object" ? payload.responses : {};
    payload.responses.answers = payload.responses.answers && typeof payload.responses.answers === "object" ? payload.responses.answers : {};
    payload.responses.tasks = payload.responses.tasks && typeof payload.responses.tasks === "object" ? payload.responses.tasks : {};
    payload.responses.text = payload.responses.text && typeof payload.responses.text === "object" ? payload.responses.text : {};
    payload.trophyPoints = Number(payload.trophyPoints) > 0 ? Number(payload.trophyPoints) : 1;

    if (payload.type === "spelling-test") {
        const game = payload.game && typeof payload.game === "object" ? payload.game : {};
        game.phase = typeof game.phase === "string" ? game.phase : "ready";
        game.revealDurationMs = Number(game.revealDurationMs) > 0 ? Number(game.revealDurationMs) : 3000;
        game.currentIndex = Number.isFinite(Number(game.currentIndex)) ? Math.max(0, Number(game.currentIndex)) : 0;
        game.currentInput = typeof game.currentInput === "string" ? game.currentInput : "";
        game.feedback = game.feedback && typeof game.feedback === "object" && typeof game.feedback.message === "string"
            ? {
                tone: typeof game.feedback.tone === "string" ? game.feedback.tone : "neutral",
                message: game.feedback.message
            }
            : null;
        game.words = Array.isArray(game.words)
            ? game.words.map((entry, index) => ({
                id: typeof entry.id === "string" ? entry.id : `${payload.id}-word-${index + 1}`,
                word: String(entry.word || ""),
                status: entry.status === "correct" ? "correct" : "pending",
                attempts: Number(entry.attempts) > 0 ? Number(entry.attempts) : 0,
                solvedOnAttempt: Number(entry.solvedOnAttempt) > 0 ? Number(entry.solvedOnAttempt) : null,
                guesses: Array.isArray(entry.guesses) ? entry.guesses.map((guess) => String(guess)) : []
            }))
            : [];
        if (game.currentIndex >= game.words.length) {
            game.currentIndex = Math.max(0, game.words.length - 1);
        }
        payload.game = game;
    }

    if (!Array.isArray(payload.sections)) {
        payload.sections = [];
        return payload;
    }

    payload.sections.forEach((section) => {
        if (section.kind === "problems" && Array.isArray(section.problems)) {
            section.problems.forEach((problem) => {
                if (!(problem.id in payload.responses.answers)) {
                    payload.responses.answers[problem.id] = "";
                }
            });
        }

        if (section.kind === "spelling") {
            if (!Array.isArray(section.practiceRows) && Array.isArray(section.words)) {
                section.practiceRows = section.words.map((word, rowIndex) => ({
                    word,
                    entries: Array.from({ length: 3 }, (_, entryIndex) => ({
                        id: buildLegacySpellingEntryId(payload, section.id || "spelling", rowIndex, entryIndex),
                        prompt: word,
                        expectedAnswer: word,
                        inputMode: "text"
                    }))
                }));
            }

            section.practiceRows = Array.isArray(section.practiceRows) ? section.practiceRows : [];

            section.practiceRows.forEach((row) => {
                row.entries.forEach((entry) => {
                    if (!(entry.id in payload.responses.answers)) {
                        payload.responses.answers[entry.id] = "";
                    }
                });
            });
        }

        if ((section.kind === "review" || section.kind === "writing") && !section.responseField) {
            section.responseField = {
                id: buildLegacyTextFieldId(payload, section.id || section.kind),
                label: section.kind === "review" ? "Your ideas" : "Your draft",
                minWords: section.kind === "review" ? 3 : 8,
                placeholder: section.kind === "review" ? "List a few facts, ideas, or reminders here." : "Write your first draft here.",
                rows: section.kind === "review" ? 7 : (section.lines || 8),
                lined: section.kind === "review" || section.kind === "writing"
            };
        }

        if (section.kind === "review" && section.responseField) {
            section.responseField.rows = Math.max(Number(section.responseField.rows) || 0, 7);
            section.responseField.lined = true;
        }

        if (section.responseField && !(section.responseField.id in payload.responses.text)) {
            payload.responses.text[section.responseField.id] = "";
        }

        if (section.kind === "spelling" || section.kind === "review" || section.kind === "writing") {
            delete section.manualTask;
        }

        if (section.manualTask && !(section.manualTask.id in payload.responses.tasks)) {
            payload.responses.tasks[section.manualTask.id] = false;
        }
    });

    return payload;
}

function countWords(value) {
    return String(value || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;
}

function hasEnoughText(value, minWords = 1) {
    return countWords(value) >= minWords;
}

export function answerMatches(userAnswer, expectedAnswer) {
    const trimmedAnswer = String(userAnswer || "").trim();
    const trimmedExpected = String(expectedAnswer || "").trim();

    if (!trimmedAnswer) {
        return false;
    }

    const numericAnswer = Number(trimmedAnswer);
    const numericExpected = Number(trimmedExpected);

    if (!Number.isNaN(numericAnswer) && !Number.isNaN(numericExpected)) {
        return numericAnswer === numericExpected;
    }

    return trimmedAnswer.toLowerCase() === trimmedExpected.toLowerCase();
}

export function setAnswerResponse(payload, answerId, value) {
    payload.responses.answers[answerId] = String(value);
    return payload;
}

export function setTaskResponse(payload, taskId, checked) {
    payload.responses.tasks[taskId] = Boolean(checked);
    return payload;
}

export function setTextResponse(payload, textId, value) {
    payload.responses.text[textId] = String(value);
    return payload;
}

export function validateWorksheet(payload) {
    normalizeWorksheetPayload(payload);
    const invalidAnswerIds = [];
    const invalidSpellingIds = [];
    const invalidTextIds = [];
    const invalidTaskIds = [];
    let focusTargetId = null;
    let focusTargetType = null;

    const rememberFocus = (type, id) => {
        if (!focusTargetId) {
            focusTargetId = id;
            focusTargetType = type;
        }
    };

    payload.sections.forEach((section) => {
        if (section.kind === "spelling") {
            section.practiceRows.forEach((row) => {
                row.entries.forEach((entry) => {
                    const currentAnswer = payload.responses.answers[entry.id];
                    if (!answerMatches(currentAnswer, entry.expectedAnswer)) {
                        invalidSpellingIds.push(entry.id);
                        rememberFocus("answer", entry.id);
                    }
                });
            });
        }

        if (section.kind === "problems") {
            section.problems.forEach((problem) => {
                const currentAnswer = payload.responses.answers[problem.id];
                if (!answerMatches(currentAnswer, problem.expectedAnswer)) {
                    invalidAnswerIds.push(problem.id);
                    rememberFocus("answer", problem.id);
                }
            });
        }

        if (section.responseField) {
            const currentValue = payload.responses.text[section.responseField.id];
            if (!hasEnoughText(currentValue, section.responseField.minWords)) {
                invalidTextIds.push(section.responseField.id);
                rememberFocus("text", section.responseField.id);
            }
        }

        if (section.manualTask && !payload.responses.tasks[section.manualTask.id]) {
            invalidTaskIds.push(section.manualTask.id);
            rememberFocus("task", section.manualTask.id);
        }
    });

    const messages = [];

    if (invalidAnswerIds.length > 0) {
        messages.push(`${invalidAnswerIds.length} math ${invalidAnswerIds.length === 1 ? "answer needs" : "answers need"} attention.`);
    }

    if (invalidSpellingIds.length > 0) {
        messages.push(`${invalidSpellingIds.length} spelling ${invalidSpellingIds.length === 1 ? "box needs" : "boxes need"} the correct word.`);
    }

    if (invalidTextIds.length > 0) {
        messages.push(`${invalidTextIds.length} writing ${invalidTextIds.length === 1 ? "section needs" : "sections need"} a little more text.`);
    }

    if (invalidTaskIds.length > 0) {
        messages.push(`${invalidTaskIds.length} checked ${invalidTaskIds.length === 1 ? "task is" : "tasks are"} still missing.`);
    }

    return {
        isValid: invalidAnswerIds.length === 0 && invalidSpellingIds.length === 0 && invalidTextIds.length === 0 && invalidTaskIds.length === 0,
        invalidAnswerIds,
        invalidSpellingIds,
        invalidTextIds,
        invalidTaskIds,
        messages,
        focusTargetId,
        focusTargetType
    };
}

export function getProgressShelf(storage = getLocalStorage()) {
    const history = readJson(storage, STORAGE_KEYS.history, []);

    return {
        trophies: Number(readJson(storage, STORAGE_KEYS.trophies, 0)) || 0,
        history,
        stats: normalizeProgressStats(readJson(storage, STORAGE_KEYS.stats, null), history)
    };
}

export function saveActiveWorksheet(payload, storage = getSessionStorage()) {
    normalizeWorksheetPayload(payload);
    writeJson(storage, STORAGE_KEYS.activeWorksheet, payload);
    return payload;
}

export function restoreActiveWorksheet(storage = getSessionStorage()) {
    const payload = readJson(storage, STORAGE_KEYS.activeWorksheet, null);

    if (!isWorksheetPayload(payload)) {
        removeValue(storage, STORAGE_KEYS.activeWorksheet);
        return null;
    }

    return normalizeWorksheetPayload(payload);
}

export function clearActiveWorksheet(storage = getSessionStorage()) {
    removeValue(storage, STORAGE_KEYS.activeWorksheet);
}

export function buildCompletionEntry(payload) {
    return {
        id: payload.id,
        type: payload.type,
        weekId: payload.selectedWeekId || null,
        label: payload.completionLabel,
        completedAt: new Date().toISOString()
    };
}

export function recordCompletion(payload, storage = getLocalStorage()) {
    const shelf = getProgressShelf(storage);
    const entry = buildCompletionEntry(payload);
    const trophyPoints = Number(payload.trophyPoints) > 0 ? Number(payload.trophyPoints) : 1;
    const trophies = shelf.trophies + trophyPoints;
    const history = [entry, ...shelf.history].slice(0, 12);
    const stats = {
        ...shelf.stats
    };

    if (payload.type === "full-homework") {
        stats.completedPages += 1;
        stats.completedHomework += 1;
    }

    if (payload.type === "math-practice") {
        stats.completedPages += 1;
        stats.completedPractice += 1;
    }

    if (payload.type === "spelling-test") {
        stats.completedTests += 1;

        if (payload.completionDetails?.bonusAwarded) {
            stats.perfectSpellingRounds += 1;
        }
    }

    writeJson(storage, STORAGE_KEYS.trophies, trophies);
    writeJson(storage, STORAGE_KEYS.history, history);
    writeJson(storage, STORAGE_KEYS.stats, stats);

    return {
        entry,
        trophies,
        history,
        trophyPoints,
        details: payload.completionDetails || null,
        stats
    };
}
