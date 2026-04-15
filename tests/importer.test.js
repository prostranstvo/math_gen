import test from "node:test";
import assert from "node:assert/strict";

import { parseWeeklyUpdateText } from "../scripts/import-weekly-updates.js";

test("parseWeeklyUpdateText extracts the week fields from a weekly update PDF dump", () => {
    const sampleText = `
        Weekly Update - January 30, 2026

        LANGUAGE:
        Composition: Next week, students will be completing their final Informational Report Writing assessment. We will also be beginning our new Poetry unit, where students will explore different poetic forms and techniques.
        Reading: Next week, we will continue with our Read-Aloud presentations.
        Foundations: Week 14 Suffix -ful and consonant blends spr- and str-. Next week, students will be practicing how to use commas correctly in sentences with different types of clauses.
        WEEK 14
        wonderful thankful delightful respectful thoughtful
        stream struggle strict stranded stranger
        sprain sprawl sprinkle sprout spread

        MATH:
        ALGEBRA: Next week, students will learn how to use variables to represent unknown numbers.
        SCIENCE
        Properties of and Changes in Matter. Next week, students will be creating a poster.
        SOCIAL STUDIES
        Responsible Government & Citizenship: Continuing with presentations.
    `;

    const parsed = parseWeeklyUpdateText(sampleText, "/tmp/Copy of Weekly Update - January 30, 2026.pdf");

    assert.equal(parsed.weekId, "14");
    assert.equal(parsed.date, "January 30, 2026");
    assert.equal(parsed.writingTopic, "Informational Report");
    assert.equal(parsed.mathTopic, "Algebra");
    assert.equal(parsed.scienceTopic, "Properties of and Changes in Matter");
    assert.equal(parsed.spelling.length, 15);
    assert.match(parsed.grammar, /Suffix -ful/i);
    assert.match(parsed.reviewPrompt, /properties of and changes in matter/i);
});
