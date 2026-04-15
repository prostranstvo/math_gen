import test from "node:test";
import assert from "node:assert/strict";

import { generateFullHomework, generateMathWorksheet, generateSpellingTestGame } from "../js/generator.js";
import {
    answerMatches,
    clearActiveWorksheet,
    createMemoryStorage,
    getProgressShelf,
    recordCompletion,
    restoreActiveWorksheet,
    saveActiveWorksheet,
    setAnswerResponse,
    setTextResponse,
    setTaskResponse,
    validateWorksheet
} from "../js/state.js";

function fillAllCorrectAnswers(payload) {
    payload.sections.forEach((section) => {
        if (section.kind === "problems") {
            section.problems.forEach((problem) => {
                setAnswerResponse(payload, problem.id, problem.expectedAnswer);
            });
        }

        if (section.kind === "spelling") {
            section.practiceRows.forEach((row) => {
                row.entries.forEach((entry) => {
                    setAnswerResponse(payload, entry.id, entry.expectedAnswer);
                });
            });
        }

        if (section.responseField) {
            setTextResponse(
                payload,
                section.responseField.id,
                section.kind === "review"
                    ? "Three clear ideas go here."
                    : "This is a full draft with enough words to pass."
            );
        }

        if (section.manualTask) {
            setTaskResponse(payload, section.manualTask.id, true);
        }
    });

    return payload;
}

test("answerMatches supports trimmed numeric and text comparisons", () => {
    assert.equal(answerMatches(" 42 ", "42"), true);
    assert.equal(answerMatches("Hello", "hello"), true);
    assert.equal(answerMatches("", "42"), false);
    assert.equal(answerMatches("41", "42"), false);
});

test("active worksheet can be saved, restored, and cleared from session storage", () => {
    const storage = createMemoryStorage();
    const payload = generateMathWorksheet();

    saveActiveWorksheet(payload, storage);
    assert.deepEqual(restoreActiveWorksheet(storage), payload);

    clearActiveWorksheet(storage);
    assert.equal(restoreActiveWorksheet(storage), null);
});

test("spelling test state can be saved and restored with game progress intact", () => {
    const storage = createMemoryStorage();
    const payload = generateSpellingTestGame();

    payload.game.phase = "typing";
    payload.game.currentIndex = 3;
    payload.game.currentInput = "remember";
    payload.game.words[0].status = "correct";
    payload.game.words[0].attempts = 1;
    payload.game.words[0].solvedOnAttempt = 1;

    saveActiveWorksheet(payload, storage);
    const restored = restoreActiveWorksheet(storage);

    assert.equal(restored.type, "spelling-test");
    assert.equal(restored.game.phase, "typing");
    assert.equal(restored.game.currentIndex, 3);
    assert.equal(restored.game.currentInput, "remember");
    assert.equal(restored.game.words[0].status, "correct");
    assert.equal(restored.game.words[0].solvedOnAttempt, 1);
});

test("validateWorksheet reports missing spelling, math, and writing fields", () => {
    const payload = generateFullHomework("8");
    const result = validateWorksheet(payload);

    assert.equal(result.isValid, false);
    assert(result.invalidAnswerIds.length > 0);
    assert(result.invalidSpellingIds.length > 0);
    assert(result.invalidTextIds.length === 2);
    assert.equal(result.invalidTaskIds.length, 0);
    assert.equal(result.focusTargetType, "answer");
});

test("validateWorksheet passes when every answer and text response is complete", () => {
    const payload = fillAllCorrectAnswers(generateFullHomework("7"));
    const result = validateWorksheet(payload);

    assert.equal(result.isValid, true);
    assert.equal(result.invalidAnswerIds.length, 0);
    assert.equal(result.invalidSpellingIds.length, 0);
    assert.equal(result.invalidTextIds.length, 0);
    assert.equal(result.invalidTaskIds.length, 0);
});

test("recordCompletion increments the shelf and caps history", () => {
    const storage = createMemoryStorage();

    for (let index = 0; index < 14; index += 1) {
        const payload = fillAllCorrectAnswers(generateMathWorksheet());
        payload.completionLabel = `Math Practice ${index + 1}`;
        recordCompletion(payload, storage);
    }

    const shelf = getProgressShelf(storage);

    assert.equal(shelf.trophies, 14);
    assert.equal(shelf.history.length, 12);
    assert.equal(shelf.history[0].label, "Math Practice 14");
});

test("recordCompletion uses trophyPoints for perfect spelling rounds", () => {
    const storage = createMemoryStorage();
    const payload = generateSpellingTestGame();

    payload.completionLabel = "Spelling Test - Perfect Round";
    payload.trophyPoints = 2;
    payload.completionDetails = {
        score: 10,
        totalWords: 10,
        totalAttempts: 10,
        bonusAwarded: true
    };

    const result = recordCompletion(payload, storage);

    assert.equal(result.trophyPoints, 2);
    assert.equal(result.details.bonusAwarded, true);
    assert.equal(getProgressShelf(storage).trophies, 2);
});
