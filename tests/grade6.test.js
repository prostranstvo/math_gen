import test from "node:test";
import assert from "node:assert/strict";
import { grade6Subjects, grade6Topics, getTopic, projectTemplates } from "../data/grade6-plan.js";
import { lessons, generatePractice, checkPracticeAnswer, checkRound } from "../js/grade6-practice.js";
import { GRADE6_KEY, newGrade6State, loadGrade6State, saveGrade6State, normalizeGrade6State, getTopicNote, getProjectNote, saveCompletedRound, localDateKey, sortAssignments } from "../js/grade6-state.js";
import { createMemoryStorage } from "../js/state.js";
import { renderGrade6 } from "../js/grade6-render.js";

test("the teacher plan covers all six subjects and named year-end work", () => {
    assert.deepEqual(grade6Subjects.map(s => s.id), ["math", "language", "science", "social", "arts", "health"]);
    assert.equal(new Set(grade6Topics.map(t => t.id)).size, grade6Topics.length);
    for (const id of ["factors", "powers", "fraction-operations", "solids", "transformations", "coding", "economy", "eqao-math", "year-review", "current-events", "nonfiction", "summaries", "book-talks", "novel", "poetry", "persuasive", "eqao-language", "biodiversity", "electricity", "flight", "space", "science-fair", "global", "communities", "perspective", "world-art", "pop-art", "drama-stories", "performance", "relationships", "mental-health", "substances", "development"]) assert(getTopic(id), id);
    for (const item of grade6Topics) {
        assert.equal(item.prompts.length, 3);
        if (item.practice) assert(lessons[item.practice]);
    }
    assert(projectTemplates.some(p => p.id === "science-fair"));
    assert(projectTemplates.some(p => p.id === "novel-project"));
});

test("answer checking accepts equivalent fractions and rejects malformed numbers", () => {
    const q = { kind: "number", answer: "1/2" };
    for (const value of ["2/4", "0.5", " 1 / 2 "]) assert(checkPracticeAnswer(value, q), value);
    for (const value of ["", " ", "1/0", "Infinity", "0.5xyz", "0,5", "1/2/3", "<script>"]) assert.equal(checkPracticeAnswer(value, q), false, value);
    assert(checkPracticeAnswer("1,000", { kind: "number", answer: "1000" }));
    assert(checkPracticeAnswer("−3", { kind: "number", answer: "-3" }));
    assert.equal(checkPracticeAnswer("1,00", { kind: "number", answer: "100" }), false);
    assert(checkPracticeAnswer("3 * 2 * 3 * 2", { kind: "factors", answer: "2 × 2 × 3 × 3" }));
    assert.equal(checkPracticeAnswer("4 × 9", { kind: "factors", answer: "2 × 2 × 3 × 3" }), false);
    assert(checkPracticeAnswer(" PRIME ", { kind: "text", answer: "prime" }));
});

test("every math generator supports core and larger-number rounds with finite answers", () => {
    for (const topic of grade6Topics.filter(t => t.practice)) {
        for (const level of ["core", "stretch"]) {
            for (const random of [0, 0.24, 0.5, 0.99999]) {
                const round = generatePractice(topic, level, () => random);
                assert.equal(round.questions.length, 6);
                assert.equal(new Set(round.questions.map(q => q.id)).size, 6);
                for (const q of round.questions) {
                    assert(q.hint && q.explanation, topic.id);
                    assert(checkPracticeAnswer(q.answer, q), `${topic.id}: ${q.prompt} -> ${q.answer}`);
                    assert(!q.prompt.includes("undefined"));
                }
                round.questions.forEach(q => { round.answers[q.id] = q.answer; });
                assert(checkRound(round));
            }
        }
    }
});

test("fraction operations use correct common denominators and reciprocals", () => {
    let calls = 0;
    const round = generatePractice(getTopic("fraction-operations"), "core", () => (++calls % 2 ? 0 : 0.3));
    for (const q of round.questions) {
        const [, d, op, e] = q.prompt.match(/^1\/(\d+) ([+−×÷]) 1\/(\d+)/);
        const left = 1 / Number(d), right = 1 / Number(e);
        const expected = op === "+" ? left + right : op === "−" ? left - right : op === "×" ? left * right : left / right;
        assert(checkPracticeAnswer(String(expected), q), q.prompt);
    }
});

test("a factor round checks prime factors, not just an equal product", () => {
    const round = generatePractice(getTopic("factors"), "core", () => 0);
    const q = round.questions[0];
    assert.equal(q.answer, "2 × 2 × 3");
    assert(checkPracticeAnswer("3*2*2", q));
    assert.equal(checkPracticeAnswer("2*6", q), false);
    assert.equal(checkPracticeAnswer("12", q), false);
});

test("practice preserves retries and hints without granting mastery or duplicate completion", () => {
    const data = newGrade6State();
    const round = data.activePractice = generatePractice(getTopic("factors"), "core", () => 0);
    round.answers.q0 = "4 * 3";
    assert.equal(checkRound(round), false);
    assert.equal(round.attempts.q0, 1);
    assert.equal(round.attempts.q1, undefined, "blank checks do not count as attempts");
    round.hints.q0 = true;
    round.questions.forEach(q => { round.answers[q.id] = q.answer; });
    assert(checkRound(round));
    assert.equal(round.attempts.q0, 2);
    assert(saveCompletedRound(data));
    assert.equal(saveCompletedRound(data), false);
    assert.equal(data.history.length, 1);
    assert.equal(data.topics.factors.status, "learning");
    assert(data.history[0].hints.q0);
    checkRound(round);
    assert.equal(round.attempts.q0, 2);
    round.answers.q0 = "changed";
    assert.notEqual(data.history[0].answers.q0, "changed", "history stores an independent answer record");
});

test("Grade 6 work survives reload and does not change Grade 5 storage", () => {
    const storage = createMemoryStorage();
    storage.setItem("mathGenTrophyCount", "12");
    storage.setItem("mathGenActiveWorksheet", '{"grade5":"unfinished"}');
    const data = newGrade6State();
    const note = getTopicNote(data, "novel");
    note.responses[0] = "A saved chapter response.";
    note.status = "review";
    getProjectNote(data, "science-fair").notes[0] = "Which glider flies further?";
    getProjectNote(data, "science-fair").done[0] = true;
    data.activePractice = generatePractice(getTopic("fractions"));
    data.activePractice.answers.q0 = "3/4";
    data.pinned = ["novel"];
    data.assignments.push({ id: "task-1", title: "Read chapter 3", subjectId: "language", source: "teacher", due: "2026-10-05", notes: "Bring notes.", done: false, createdAt: new Date().toISOString() });
    assert(saveGrade6State(data, storage));
    const reloaded = loadGrade6State(storage);
    assert.equal(reloaded.blocked, false);
    assert.equal(reloaded.data.topics.novel.responses[0], note.responses[0]);
    assert.equal(reloaded.data.projects["science-fair"].done[0], true);
    assert.equal(reloaded.data.activePractice.answers.q0, "3/4");
    assert.deepEqual(reloaded.data.assignments, data.assignments);
    assert.equal(storage.getItem("mathGenTrophyCount"), "12");
    assert.equal(storage.getItem("mathGenActiveWorksheet"), '{"grade5":"unfinished"}');
});

test("damaged or unsupported saves are reported without erasing the original", () => {
    const storage = createMemoryStorage();
    for (const invalid of ["{bad", "null", '{"version":8}']) {
        storage.setItem(GRADE6_KEY, invalid);
        const loaded = loadGrade6State(storage);
        assert(loaded.blocked);
        assert(loaded.error);
        assert.equal(storage.getItem(GRADE6_KEY), invalid);
    }
    assert.equal(saveGrade6State(newGrade6State(), { setItem() { throw Error("quota"); } }), false);
});

test("malformed nested saved data cannot break the subject and practice views", () => {
    const data = normalizeGrade6State({ version: 1, topics: { factors: { responses: null, status: "toString" } }, projects: { "science-fair": { notes: null, done: "bad" } }, assignments: [null, { subjectId: "bad" }], history: [null, {}], activePractice: { topicId: "factors", questions: [] }, pinned: ["bad", "factors", "factors"] });
    assert.equal(data.activePractice, null);
    assert.deepEqual(data.pinned, ["factors"]);
    assert.equal(data.topics.factors.status, "new");
    assert.equal(data.assignments.length, 0);
    assert(renderGrade6(data, { page: "topic", topicId: "factors" }).includes("Build a factor tree"));
});

test("saved text is escaped in tasks, notes, project planners, and answer reviews", () => {
    const data = newGrade6State(), attack = '<img src=x onerror="alert(1)">';
    data.assignments.push({ id: '" onclick="alert(1)', title: attack, subjectId: "math", source: "teacher", notes: attack, due: "", createdAt: "", done: false });
    getTopicNote(data, "novel").responses[0] = `</textarea>${attack}`;
    getProjectNote(data, "science-fair").notes[0] = attack;
    for (const ui of [{ page: "week" }, { page: "topic", topicId: "novel" }, { page: "projects", projectId: "science-fair" }]) {
        const html = renderGrade6(data, ui);
        assert(!html.includes(attack));
        assert(html.includes("&lt;img"));
        assert(!html.includes('id="" onclick'));
    }
});

test("weekly tasks sort incomplete work by due date before completed work", () => {
    const items = [
        { id: "done", done: true, due: "2026-09-01", createdAt: "1" },
        { id: "undated", done: false, due: "", createdAt: "2" },
        { id: "later", done: false, due: "2026-10-10", createdAt: "3" },
        { id: "first", done: false, due: "2026-10-02", createdAt: "4" }
    ];
    assert.deepEqual(sortAssignments(items).map(i => i.id), ["first", "later", "undated", "done"]);
    assert.equal(localDateKey(new Date(2026, 0, 2, 23, 30)), "2026-01-02");
});

test("all subjects, topics, projects, and practice rounds can render", () => {
    const data = newGrade6State();
    for (const page of ["week", "subjects", "practice", "projects", "progress", "task"]) assert(renderGrade6(data, { page }).includes("Grade 6"));
    for (const subject of grade6Subjects) assert(renderGrade6(data, { page: "subjects", subjectId: subject.id }).includes(subject.title));
    for (const topic of grade6Topics) assert(renderGrade6(data, { page: "topic", topicId: topic.id }).includes("My understanding"));
    for (const p of projectTemplates) assert(renderGrade6(data, { page: "projects", projectId: p.id }).includes("Step complete"));
    for (const topic of grade6Topics.filter(t => t.practice)) {
        data.activePractice = generatePractice(topic);
        assert(renderGrade6(data, { page: "round" }).includes("Check my answers"));
    }
});

test("a request for lowest terms rejects an equivalent unreduced fraction", () => {
    const round = generatePractice(getTopic("fractions"), "core", () => 0);
    const q = round.questions[1];
    assert.equal(q.kind, "fraction-simplified");
    assert(checkPracticeAnswer("1/3", q));
    assert.equal(checkPracticeAnswer("2/6", q), false);
    assert.equal(checkPracticeAnswer("0.333333333", q), false);
});
