import { getTopic, getSubject, grade6Topics, projectTemplates } from "../data/grade6-plan.js";

export const GRADE6_KEY = "mathGenGrade6:v1";
export const topicStatuses = { new: "Not started", learning: "Learning", review: "Ready to review", independent: "I can explain this" };
const record = value => value && typeof value === "object" && !Array.isArray(value);
const text = (value, max = 20000) => typeof value === "string" ? value.slice(0, max) : "";
const date = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
export function newGrade6State() {
    return { version: 1, topics: {}, projects: {}, assignments: [], pinned: [], activePractice: null, history: [] };
}
function cleanRound(value) {
    if (!record(value) || !getTopic(value.topicId)?.practice || !Array.isArray(value.questions) || value.questions.length !== 6) return null;
    if (!value.questions.every(q => record(q) && /^q[0-5]$/.test(q.id) && typeof q.prompt === "string" && typeof q.answer === "string" && ["number", "text", "factors", "fraction-simplified"].includes(q.kind))) return null;
    if (new Set(value.questions.map(q => q.id)).size !== 6) return null;
    const result = {
        id: text(value.id, 100), topicId: value.topicId, key: getTopic(value.topicId).practice,
        level: value.level === "stretch" ? "stretch" : "core", createdAt: text(value.createdAt, 50),
        questions: value.questions.map(q => ({ id: q.id, prompt: text(q.prompt, 1000), answer: text(q.answer, 100), hint: text(q.hint, 1000), explanation: text(q.explanation, 1000), unit: text(q.unit, 100), kind: q.kind })),
        answers: {}, results: {}, hints: {}, attempts: {}, completedAt: value.completedAt ? text(value.completedAt, 50) : null
    };
    for (const q of result.questions) {
        result.answers[q.id] = text(value.answers?.[q.id], 100);
        if (record(value.results?.[q.id])) result.results[q.id] = { correct: value.results[q.id].correct === true, answer: text(value.results[q.id].answer, 100) };
        result.hints[q.id] = value.hints?.[q.id] === true;
        result.attempts[q.id] = Math.min(10000, Math.max(0, Number(value.attempts?.[q.id]) || 0));
    }
    return result;
}
export function normalizeGrade6State(value) {
    if (!record(value) || value.version !== 1) throw new Error("Unsupported Grade 6 data");
    const state = newGrade6State();
    for (const topic of grade6Topics) {
        const note = value.topics?.[topic.id];
        if (!record(note)) continue;
        state.topics[topic.id] = { responses: topic.prompts.map((_, i) => text(note.responses?.[i])), status: Object.hasOwn(topicStatuses, note.status) ? note.status : "new", updatedAt: text(note.updatedAt, 50) };
    }
    for (const template of projectTemplates) {
        const project = value.projects?.[template.id];
        if (!record(project)) continue;
        state.projects[template.id] = { notes: template.steps.map((_, i) => text(project.notes?.[i])), done: template.steps.map((_, i) => project.done?.[i] === true), updatedAt: text(project.updatedAt, 50) };
    }
    state.assignments = (Array.isArray(value.assignments) ? value.assignments : []).filter(item => record(item) && typeof item.id === "string" && getSubject(item.subjectId) && text(item.title, 160).trim()).slice(0, 500).map(item => ({ id: text(item.id, 100), title: text(item.title, 160), subjectId: item.subjectId, source: item.source === "practice" ? "practice" : "teacher", due: date(item.due), notes: text(item.notes, 3000), done: item.done === true, createdAt: text(item.createdAt, 50) }));
    state.pinned = [...new Set((Array.isArray(value.pinned) ? value.pinned : []).filter(id => getTopic(id)))];
    state.activePractice = cleanRound(value.activePractice);
    state.history = (Array.isArray(value.history) ? value.history : []).slice(0, 200).map(cleanRound).filter(item => item && item.completedAt);
    return state;
}
export function loadGrade6State(storage) {
    try {
        const raw = storage?.getItem(GRADE6_KEY);
        return { data: raw ? normalizeGrade6State(JSON.parse(raw)) : newGrade6State(), error: "", blocked: false };
    } catch {
        return { data: newGrade6State(), error: "Saved Grade 6 work could not be opened. Existing saved data has not been changed. New work will stay in this session. Download a copy before leaving.", blocked: true };
    }
}
export function saveGrade6State(data, storage) {
    try {
        if (!storage) return false;
        storage.setItem(GRADE6_KEY, JSON.stringify(data));
        return true;
    } catch { return false; }
}
export function getTopicNote(data, id) {
    if (!data.topics[id]) data.topics[id] = { responses: ["", "", ""], status: "new", updatedAt: "" };
    return data.topics[id];
}
export function getProjectNote(data, id) {
    const template = projectTemplates.find(p => p.id === id);
    if (!template) return null;
    if (!data.projects[id]) data.projects[id] = { notes: template.steps.map(() => ""), done: template.steps.map(() => false), updatedAt: "" };
    return data.projects[id];
}
export function saveCompletedRound(data) {
    const round = data.activePractice;
    if (!round?.completedAt || data.history.some(item => item.id === round.id)) return false;
    data.history.unshift(JSON.parse(JSON.stringify(round)));
    data.history = data.history.slice(0, 200);
    const note = getTopicNote(data, round.topicId);
    if (note.status === "new") note.status = "learning";
    note.updatedAt = round.completedAt;
    return true;
}
export function localDateKey(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function sortAssignments(items) {
    return [...items].sort((a, b) => Number(a.done) - Number(b.done) || (a.due || "9999").localeCompare(b.due || "9999") || a.createdAt.localeCompare(b.createdAt));
}
