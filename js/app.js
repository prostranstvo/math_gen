import { homeContent } from "../data/home-content.js";
import { swanseaWeeks, weekOrder } from "../data/swansea-weeks.js";
import { generateFullHomework, generateMathWorksheet, generateSpellingTestGame, getDefaultWeekId } from "./generator.js";
import { renderCompletionView, renderGameView, renderHomeView, renderWorksheetView } from "./render.js";
import {
    answerMatches,
    clearActiveWorksheet,
    getProgressShelf,
    recordCompletion,
    restoreActiveWorksheet,
    saveActiveWorksheet,
    setAnswerResponse,
    setTextResponse,
    setTaskResponse,
    validateWorksheet
} from "./state.js";

const app = document.getElementById("app");

const uiState = {
    view: "home",
    selectedWeekId: getDefaultWeekId(),
    activeWorksheet: null,
    validation: null,
    completionData: null,
    pendingFocus: null
};

let gameTimerId = null;
let preferredSpeechVoice = null;
let lastSpokenWord = "";
let lastSpokenAt = 0;

function isSpellingTest(payload = uiState.activeWorksheet) {
    return Boolean(payload && payload.type === "spelling-test" && payload.game);
}

function clearGameTimer() {
    if (gameTimerId) {
        window.clearTimeout(gameTimerId);
        gameTimerId = null;
    }
}

function canSpeakText() {
    return typeof window !== "undefined"
        && "speechSynthesis" in window
        && typeof window.SpeechSynthesisUtterance !== "undefined";
}

function resolveSpeechVoice() {
    if (!canSpeakText()) {
        return null;
    }

    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
        return null;
    }

    if (preferredSpeechVoice && voices.some((voice) => voice.voiceURI === preferredSpeechVoice.voiceURI)) {
        return preferredSpeechVoice;
    }

    preferredSpeechVoice = voices.find((voice) => /^en(-|_)/i.test(voice.lang) && /samantha|karen|ava|moira|siri|female/i.test(voice.name))
        || voices.find((voice) => /^en(-|_)/i.test(voice.lang))
        || voices[0];

    return preferredSpeechVoice;
}

function speakText(text, options = {}) {
    if (!canSpeakText()) {
        return;
    }

    const normalizedText = String(text || "").trim();
    if (!normalizedText) {
        return;
    }

    const now = Date.now();
    const isRecentRepeat = normalizedText.toLowerCase() === lastSpokenWord && (now - lastSpokenAt) < 800;
    if (isRecentRepeat && !options.force) {
        return;
    }

    lastSpokenWord = normalizedText.toLowerCase();
    lastSpokenAt = now;

    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(normalizedText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    const voice = resolveSpeechVoice();
    if (voice) {
        utterance.voice = voice;
    }
    window.speechSynthesis.speak(utterance);
}

function syncGameDebugHooks() {
    window.render_game_to_text = () => {
        const payload = uiState.activeWorksheet;

        if (!isSpellingTest(payload)) {
            return JSON.stringify({
                view: uiState.view,
                activeType: payload?.type || null
            });
        }

        const game = payload.game;
        return JSON.stringify({
            view: uiState.view,
            type: payload.type,
            phase: game.phase,
            revealDurationMs: game.revealDurationMs,
            currentIndex: game.currentIndex,
            currentWord: game.phase === "preview-word" ? game.words[game.currentIndex]?.word || null : null,
            currentInput: game.currentInput,
            firstTryScore: game.words.filter((word) => word.solvedOnAttempt === 1).length,
            completedCount: game.words.filter((word) => word.status === "correct").length,
            words: game.words.map((word) => ({
                word: word.word,
                status: word.status,
                attempts: word.attempts,
                solvedOnAttempt: word.solvedOnAttempt
            }))
        });
    };

    window.advanceTime = (ms) => {
        if (!isSpellingTest() || !Number.isFinite(Number(ms))) {
            return;
        }

        const game = uiState.activeWorksheet.game;
        if ((game.phase === "preview-all" || game.phase === "preview-word") && Number(ms) >= game.revealDurationMs) {
            clearGameTimer();
            advanceGameRevealPhase();
        }
    };
}

function renderApp() {
    const progress = getProgressShelf();
    let markup = "";

    clearGameTimer();

    if (uiState.view === "worksheet" && uiState.activeWorksheet) {
        markup = renderWorksheetView({
            payload: uiState.activeWorksheet,
            validation: uiState.validation
        });
    } else if (uiState.view === "game" && isSpellingTest()) {
        markup = renderGameView({
            payload: uiState.activeWorksheet
        });
    } else if (uiState.view === "completion" && uiState.completionData) {
        markup = renderCompletionView({
            completionData: uiState.completionData,
            progress
        });
    } else {
        markup = renderHomeView({
            content: homeContent,
            weeks: swanseaWeeks,
            selectedWeekId: uiState.selectedWeekId,
            progress,
            activeWorksheet: uiState.activeWorksheet
        });
    }

    app.dataset.view = uiState.view;
    app.innerHTML = markup;
    applyPendingFocus();
    syncGameDebugHooks();
    applyGamePhaseEffect();
}

function applyPendingFocus() {
    if (!uiState.pendingFocus) {
        return;
    }

    const { type, id } = uiState.pendingFocus;
    uiState.pendingFocus = null;

    requestAnimationFrame(() => {
        if (type === "validation-summary") {
            document.getElementById("validation-summary")?.focus();
            return;
        }

        if (type === "text") {
            document.querySelector(`[data-text-id="${id}"]`)?.focus();
            return;
        }

        if (type === "game-input") {
            document.getElementById(id)?.focus();
            return;
        }

        const selector = type === "task" ? `[data-task-id="${id}"]` : `[data-answer-id="${id}"]`;
        document.querySelector(selector)?.focus();
    });
}

function openWorksheet(payload) {
    uiState.activeWorksheet = payload;
    uiState.validation = null;
    uiState.completionData = null;
    uiState.view = payload.type === "spelling-test" ? "game" : "worksheet";
    uiState.selectedWeekId = payload.selectedWeekId || uiState.selectedWeekId;
    saveActiveWorksheet(payload);
    renderApp();
}

function refreshActiveWorksheet() {
    if (!uiState.activeWorksheet) {
        return;
    }

    saveActiveWorksheet(uiState.activeWorksheet);
}

function getSelectedWeekId() {
    const selector = document.getElementById("week-selector");
    return selector?.value || uiState.selectedWeekId || getDefaultWeekId();
}

function clearFieldFeedback(target) {
    const answerId = target.dataset.answerId;
    const taskId = target.dataset.taskId;
    const textId = target.dataset.textId;

    if (answerId) {
        target.removeAttribute("aria-invalid");
        target.removeAttribute("aria-describedby");
        const row = document.querySelector(`[data-answer-row="${answerId}"]`);
        row?.classList.remove("problem-row--invalid", "problem-row--valid", "spelling-attempt--invalid", "spelling-attempt--valid");
        row?.closest(".spelling-row")?.classList.remove("spelling-row--invalid", "spelling-row--valid");
        row?.closest(".spelling-row")?.querySelector(".field-note")?.remove();
        document.getElementById(`${answerId}-note`)?.remove();
    }

    if (taskId) {
        const row = document.querySelector(`[data-task-row="${taskId}"]`);
        row?.classList.remove("task-row--invalid");
    }

    if (textId) {
        target.removeAttribute("aria-invalid");
        target.removeAttribute("aria-describedby");
        const row = document.querySelector(`[data-text-row="${textId}"]`);
        row?.classList.remove("text-entry--invalid", "text-entry--valid");
        document.getElementById(`${textId}-note`)?.remove();
    }
}

function getActiveGameWord() {
    if (!isSpellingTest()) {
        return null;
    }

    return uiState.activeWorksheet.game.words[uiState.activeWorksheet.game.currentIndex] || null;
}

function updateGameFeedback(tone, message) {
    if (!isSpellingTest()) {
        return;
    }

    uiState.activeWorksheet.game.feedback = {
        tone,
        message
    };
}

function advanceGameRevealPhase() {
    if (!isSpellingTest()) {
        return;
    }

    const game = uiState.activeWorksheet.game;

    if (game.phase === "preview-all") {
        game.phase = "preview-word";
        updateGameFeedback("neutral", "Look closely at this word before it disappears.");
        refreshActiveWorksheet();
        renderApp();
        return;
    }

    if (game.phase === "preview-word") {
        game.phase = "typing";
        game.currentInput = "";
        updateGameFeedback("neutral", "Type the word you just saw. If it is wrong, it will come back again.");
        refreshActiveWorksheet();
        uiState.pendingFocus = {
            type: "game-input",
            id: "spelling-test-input"
        };
        renderApp();
    }
}

function applyGamePhaseEffect() {
    if (!isSpellingTest() || uiState.view !== "game") {
        return;
    }

    const game = uiState.activeWorksheet.game;
    if (game.phase === "preview-all" || game.phase === "preview-word") {
        gameTimerId = window.setTimeout(() => {
            gameTimerId = null;
            advanceGameRevealPhase();
        }, game.revealDurationMs);
    }
}

function startSpellingTest() {
    if (!isSpellingTest()) {
        return;
    }

    const game = uiState.activeWorksheet.game;
    game.phase = "preview-all";
    game.currentIndex = 0;
    game.currentInput = "";
    game.words.forEach((word) => {
        word.status = "pending";
        word.attempts = 0;
        word.solvedOnAttempt = null;
        word.guesses = [];
    });
    updateGameFeedback("neutral", "These 10 words stay on screen for 3 seconds. Try to remember all of them.");
    refreshActiveWorksheet();
    renderApp();
}

function finishSpellingTest() {
    if (!isSpellingTest()) {
        return;
    }

    const game = uiState.activeWorksheet.game;
    const totalWords = game.words.length;
    const firstTryScore = game.words.filter((word) => word.solvedOnAttempt === 1).length;
    const totalAttempts = game.words.reduce((sum, word) => sum + word.attempts, 0);
    const bonusAwarded = firstTryScore === totalWords;

    uiState.activeWorksheet.completionLabel = bonusAwarded
        ? "Spelling Test - Perfect Round"
        : `Spelling Test - ${firstTryScore}/${totalWords} first try`;
    uiState.activeWorksheet.trophyPoints = bonusAwarded ? 2 : 1;
    uiState.activeWorksheet.completionDetails = {
        kind: "spelling-test",
        score: firstTryScore,
        totalWords,
        totalAttempts,
        bonusAwarded
    };

    uiState.completionData = recordCompletion(uiState.activeWorksheet);
    clearActiveWorksheet();
    uiState.activeWorksheet = null;
    uiState.validation = null;
    uiState.view = "completion";
    renderApp();
}

function submitSpellingGuess() {
    if (!isSpellingTest()) {
        return;
    }

    const game = uiState.activeWorksheet.game;
    if (game.phase !== "typing") {
        return;
    }

    const currentWord = getActiveGameWord();
    if (!currentWord) {
        return;
    }

    const guess = String(game.currentInput || "").trim();
    if (!guess) {
        updateGameFeedback("error", "Type the word before you submit.");
        refreshActiveWorksheet();
        renderApp();
        return;
    }

    currentWord.attempts += 1;
    currentWord.guesses.push(guess);

    if (answerMatches(guess, currentWord.word)) {
        currentWord.status = "correct";
        currentWord.solvedOnAttempt = currentWord.attempts;

        if (game.currentIndex === game.words.length - 1) {
            finishSpellingTest();
            return;
        }

        game.currentIndex += 1;
        game.currentInput = "";
        game.phase = "preview-word";
        updateGameFeedback("success", "Correct. Here comes the next word.");
        refreshActiveWorksheet();
        renderApp();
        return;
    }

    game.currentInput = "";
    game.phase = "preview-word";
    updateGameFeedback("error", "Not quite. Look at the same word again, then try once more.");
    refreshActiveWorksheet();
    renderApp();
}

function handleAction(action) {
    switch (action) {
        case "generate-math":
            openWorksheet(generateMathWorksheet());
            break;
        case "generate-full":
            openWorksheet(generateFullHomework(getSelectedWeekId()));
            break;
        case "generate-test":
            openWorksheet(generateSpellingTestGame());
            break;
        case "start-spelling-test":
            startSpellingTest();
            break;
        case "restart-spelling-test":
            openWorksheet(generateSpellingTestGame());
            break;
        case "resume-active":
            if (uiState.activeWorksheet) {
                uiState.view = uiState.activeWorksheet.type === "spelling-test" ? "game" : "worksheet";
                uiState.validation = null;
                renderApp();
            }
            break;
        case "go-home":
            uiState.view = "home";
            uiState.validation = null;
            uiState.completionData = null;
            renderApp();
            break;
        case "print-sheet":
            window.print();
            break;
        case "finish-worksheet":
            if (!uiState.activeWorksheet) {
                return;
            }

            uiState.validation = validateWorksheet(uiState.activeWorksheet);

            if (!uiState.validation.isValid) {
                uiState.pendingFocus = uiState.validation.focusTargetId
                    ? {
                        type: uiState.validation.focusTargetType,
                        id: uiState.validation.focusTargetId
                    }
                    : {
                        type: "validation-summary",
                        id: "validation-summary"
                    };
                renderApp();
                return;
            }

            uiState.completionData = recordCompletion(uiState.activeWorksheet);
            clearActiveWorksheet();
            uiState.activeWorksheet = null;
            uiState.validation = null;
            uiState.view = "completion";
            renderApp();
            break;
        case "generate-another":
            if (!uiState.completionData) {
                return;
            }

            if (uiState.completionData.entry.type === "full-homework") {
                openWorksheet(generateFullHomework(uiState.completionData.entry.weekId || getSelectedWeekId()));
            } else if (uiState.completionData.entry.type === "spelling-test") {
                openWorksheet(generateSpellingTestGame());
            } else {
                openWorksheet(generateMathWorksheet());
            }
            break;
        default:
            break;
    }
}

function handleClick(event) {
    const speakTarget = event.target.closest("[data-speak-text]");
    if (speakTarget) {
        speakText(speakTarget.dataset.speakText, { force: true });
    }

    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) {
        return;
    }

    handleAction(actionTarget.dataset.action);
}

function handleMouseOver(event) {
    const speakTarget = event.target.closest("[data-speak-text]");
    if (!speakTarget || speakTarget.contains(event.relatedTarget)) {
        return;
    }

    speakText(speakTarget.dataset.speakText);
}

function handleFocusIn(event) {
    const speakTarget = event.target.closest("[data-speak-text]");
    if (!speakTarget) {
        return;
    }

    speakText(speakTarget.dataset.speakText);
}

function handleInput(event) {
    if (!uiState.activeWorksheet) {
        return;
    }

    const target = event.target;
    const answerId = target.dataset.answerId;
    const textId = target.dataset.textId;
    const gameInput = target.dataset.gameInput;

    if (answerId) {
        setAnswerResponse(uiState.activeWorksheet, answerId, target.value);
        clearFieldFeedback(target);
        refreshActiveWorksheet();
        return;
    }

    if (textId) {
        setTextResponse(uiState.activeWorksheet, textId, target.value);
        clearFieldFeedback(target);
        refreshActiveWorksheet();
        return;
    }

    if (gameInput && isSpellingTest()) {
        uiState.activeWorksheet.game.currentInput = target.value;
        refreshActiveWorksheet();
    }
}

function handleChange(event) {
    const target = event.target;

    if (target.id === "week-selector") {
        uiState.selectedWeekId = target.value;
        return;
    }

    if (!uiState.activeWorksheet) {
        return;
    }

    const taskId = target.dataset.taskId;
    if (!taskId) {
        return;
    }

    setTaskResponse(uiState.activeWorksheet, taskId, target.checked);
    clearFieldFeedback(target);
    refreshActiveWorksheet();
}

function handleSubmit(event) {
    const form = event.target.closest("[data-game-form]");
    if (!form) {
        return;
    }

    event.preventDefault();
    submitSpellingGuess();
}

function boot() {
    uiState.selectedWeekId = weekOrder[weekOrder.length - 1];
    uiState.activeWorksheet = restoreActiveWorksheet();

    if (uiState.activeWorksheet) {
        uiState.selectedWeekId = uiState.activeWorksheet.selectedWeekId || uiState.selectedWeekId;
        uiState.view = uiState.activeWorksheet.type === "spelling-test" ? "game" : "worksheet";
    }

    app.addEventListener("click", handleClick);
    app.addEventListener("mouseover", handleMouseOver);
    app.addEventListener("focusin", handleFocusIn);
    app.addEventListener("input", handleInput);
    app.addEventListener("change", handleChange);
    app.addEventListener("submit", handleSubmit);

    if (canSpeakText()) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.addEventListener?.("voiceschanged", () => {
            preferredSpeechVoice = resolveSpeechVoice();
        });
    }

    renderApp();
}

boot();
