import test from "node:test";
import assert from "node:assert/strict";

import { generateFullHomework, generateMathWorksheet, generateSpellingTestGame } from "../js/generator.js";

function countProblems(payload) {
    return payload.sections
        .filter((section) => section.kind === "problems")
        .reduce((total, section) => total + section.problems.length, 0);
}

test("generateMathWorksheet builds four problem sections with tracked responses", () => {
    const payload = generateMathWorksheet();

    assert.equal(payload.type, "math-practice");
    assert.equal(payload.navLabel, "Practice");
    assert.equal(payload.displayLabel, "Math Practice");
    assert.equal(payload.helperNote.actionLabel, "Check My Page");
    assert.equal(payload.sections.length, 4);
    assert(payload.sections.every((section) => section.kind === "problems"));
    assert(payload.sections.every((section) => section.stepLabel && section.surfaceVariant));

    const problemCount = countProblems(payload);
    assert.equal(Object.keys(payload.responses.answers).length, problemCount);
    assert.equal(Object.keys(payload.responses.tasks).length, 0);
    assert.equal(Object.keys(payload.responses.text).length, 0);
    assert(problemCount > 0);

    payload.sections.forEach((section) => {
        section.problems.forEach((problem) => {
            assert.ok(problem.id);
            assert.ok(problem.prompt);
            assert.ok(problem.expectedAnswer);
        });
    });
});

test("generateSpellingTestGame builds a 10-word spelling round from across the Swansea pool", () => {
    const payload = generateSpellingTestGame();
    const selectedWords = payload.game.words.map((word) => word.word.toLowerCase());

    assert.equal(payload.type, "spelling-test");
    assert.equal(payload.navLabel, "Test");
    assert.equal(payload.displayLabel, "Test Yourself");
    assert.equal(payload.helperNote.actionLabel, "Start Test");
    assert.equal(payload.sections.length, 0);
    assert.equal(payload.game.phase, "ready");
    assert.equal(payload.game.words.length, 10);
    assert.equal(new Set(selectedWords).size, 10);
    assert.equal(Object.keys(payload.responses.answers).length, 0);
    assert.equal(Object.keys(payload.responses.tasks).length, 0);
    assert.equal(Object.keys(payload.responses.text).length, 0);
    assert(payload.game.words.every((word) => word.status === "pending"));
});

test("generateFullHomework stays week-specific and excludes generic extra practice sections", () => {
    const payload = generateFullHomework("10");
    const titles = payload.sections.map((section) => section.title);

    assert.equal(payload.type, "full-homework");
    assert.equal(payload.selectedWeekId, "10");
    assert.equal(payload.navLabel, "Homework");
    assert.equal(payload.helperNote.actionLabel, "Finish This Page");
    assert.deepEqual(
        titles,
        [
            "Part 1: Spelling and Foundations",
            "Part 2: Weekly Math - Minute Math Drills (Facts up to 12)",
            "Part 3: Review - Charter of Rights and Freedoms",
            "Part 4: Writing Prompt - Narrative Writing (Character Development)"
        ]
    );

    assert(!titles.some((title) => title.includes("Multiplication Practice")));
    assert(!titles.some((title) => title.includes("Long Division")));
    assert(!titles.some((title) => title.includes("Algebra")));

    const weeklyMathSection = payload.sections.find((section) => section.id === "weekly-math");
    const spellingSection = payload.sections.find((section) => section.id === "spelling");
    const reviewSection = payload.sections.find((section) => section.id === "review");
    const writingSection = payload.sections.find((section) => section.id === "writing");
    assert.equal(weeklyMathSection.layout, "grid");
    assert.equal(weeklyMathSection.problems.length, 12);
    assert.equal(weeklyMathSection.stepLabel, "Step 2");
    assert.equal(spellingSection.practiceRows.length, 15);
    assert(spellingSection.practiceRows.every((row) => row.entries.length === 3));
    assert.equal(Boolean(reviewSection.responseField), true);
    assert.equal(Boolean(writingSection.responseField), true);
    assert.equal(reviewSection.responseField.lined, true);
    assert.equal(reviewSection.responseField.rows, 7);
    assert.equal(Object.keys(payload.responses.tasks).length, 0);
    assert.equal(Object.keys(payload.responses.text).length, 2);
});

test("different weekly math sections adapt to the Swansea week topic", () => {
    const patternWeek = generateFullHomework("2");
    const conversionWeek = generateFullHomework("6");

    const patternPrompts = patternWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);
    const conversionPrompts = conversionWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);

    assert(patternPrompts.every((prompt) => prompt.includes("pattern")));
    assert(conversionPrompts.some((prompt) => prompt.includes("mL") || prompt.includes("kg") || prompt.includes("cm")));
});

test("new 2026 week topics generate matching weekly math practice", () => {
    const dataWeek = generateFullHomework("11");
    const angleWeek = generateFullHomework("18");
    const triangleWeek = generateFullHomework("19");
    const gridWeek = generateFullHomework("20");
    const moneyWeek = generateFullHomework("21");

    const dataPrompts = dataWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);
    const anglePrompts = angleWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);
    const trianglePrompts = triangleWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);
    const gridPrompts = gridWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);
    const moneyPrompts = moneyWeek.sections.find((section) => section.id === "weekly-math").problems.map((problem) => problem.prompt);

    assert(dataPrompts.some((prompt) => prompt.includes("mode") || prompt.includes("median")));
    assert(anglePrompts.some((prompt) => prompt.includes("acute") || prompt.includes("obtuse") || prompt.includes("right angle")));
    assert(trianglePrompts.some((prompt) => prompt.includes("triangle")));
    assert(gridPrompts.some((prompt) => prompt.includes("slide") || prompt.includes("turn") || prompt.includes("flip")));
    assert(moneyPrompts.some((prompt) => prompt.includes("$")));
});
