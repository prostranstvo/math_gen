import { getTopic, getSubject, projectTemplates } from "../data/grade6-plan.js";
import { loadGrade6State, saveGrade6State, getTopicNote, getProjectNote, saveCompletedRound, topicStatuses } from "./grade6-state.js";
import { generatePractice, checkRound } from "./grade6-practice.js";
import { renderGrade6 } from "./grade6-render.js";

export function createGrade6Portal({ onRender, onArchive }) {
    let storage;
    try { storage = window.localStorage; } catch { storage = null; }
    const loaded = loadGrade6State(storage);
    const data = loaded.data;
    const ui = { page: "week", subjectId: null, topicId: null, projectId: null, taskId: null, recordId: null, level: "core", pendingPractice: null, showCompleted: false, saveError: loaded.error || (!storage ? "Storage is unavailable. Download your work before leaving this page." : ""), notice: "" };
    const now = () => new Date().toISOString();
    function persist() {
        if (loaded.blocked || !saveGrade6State(data, storage)) ui.saveError = loaded.error || "Your work could not be saved in this browser. Download a copy from Progress before leaving.";
        else ui.saveError = "";
        const message = document.getElementById("g6-save-status");
        if (message) { const label = ui.saveError || "Saved in this browser"; if (message.textContent !== label) message.textContent = label; message.classList.toggle("is-error", Boolean(ui.saveError)); }
    }
    function refresh(focus = "#g6-heading") {
        onRender();
        if (focus) document.querySelector(focus)?.focus({ preventScroll: true });
    }
    function navigate(page, properties = {}) {
        Object.assign(ui, { page, subjectId: null, projectId: null, recordId: null, taskId: null, pendingPractice: null, notice: "" }, properties);
        refresh();
        window.scrollTo({ top: 0, behavior: "instant" });
    }
    function beginPractice(id, replace = false) {
        const topic = getTopic(id);
        if (!topic?.practice) return;
        if (data.activePractice && !data.activePractice.completedAt && !replace) {
            ui.pendingPractice = id;
            refresh('.g6-replace-prompt button');
            document.querySelector(".g6-replace-prompt")?.scrollIntoView({ block: "center" });
            return;
        }
        data.activePractice = generatePractice(topic, ui.level);
        const note = getTopicNote(data, id);
        if (note.status === "new") note.status = "learning";
        note.updatedAt = now();
        persist();
        navigate("round");
    }
    function download() {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `math-gen-grade6-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    return {
        render: () => renderGrade6(data, ui),
        click(event) {
            const target = event.target.closest("[data-g6-action]");
            if (!target) return;
            const id = target.dataset.id;
            switch (target.dataset.g6Action) {
                case "nav": navigate(target.dataset.page); break;
                case "archive": onArchive(); break;
                case "subject": if (getSubject(id)) navigate("subjects", { subjectId: id }); break;
                case "topic": if (getTopic(id)) navigate("topic", { topicId: id }); break;
                case "project": if (projectTemplates.some(p => p.id === id)) navigate("projects", { projectId: id }); break;
                case "pin":
                    if (!getTopic(id)) break;
                    data.pinned = data.pinned.includes(id) ? data.pinned.filter(value => value !== id) : [...data.pinned, id];
                    persist(); refresh('[data-g6-action="pin"]'); break;
                case "add-task": navigate("task"); document.querySelector('[name="title"]')?.focus(); break;
                case "edit-task": if (data.assignments.some(t => t.id === id)) navigate("task", { taskId: id }); break;
                case "start-practice": beginPractice(id); break;
                case "replace-practice": if (ui.pendingPractice) beginPractice(ui.pendingPractice, true); break;
                case "resume-practice": navigate("round"); break;
                case "record": if (data.history.some(r => r.id === id)) navigate("round", { recordId: id }); break;
                case "hint":
                    if (data.activePractice?.questions.some(q => q.id === id) && !ui.recordId) {
                        data.activePractice.hints[id] = true;
                        persist(); refresh(`#answer-${id}`);
                    }
                    break;
                case "print": window.print(); break;
                case "export": download(); break;
                default: break;
            }
        },
        input(event) {
            const target = event.target, index = Number(target.dataset.index);
            if (target.dataset.g6Note && getTopic(target.dataset.g6Note) && Number.isInteger(index) && index >= 0 && index < 3) {
                const note = getTopicNote(data, target.dataset.g6Note);
                note.responses[index] = target.value.slice(0, 20000);
                if (note.status === "new" && target.value.trim()) note.status = "learning";
                note.updatedAt = now();
                const selector = document.querySelector('[data-g6-status]');
                if (selector) selector.value = note.status;
            } else if (target.dataset.g6ProjectNote) {
                const note = getProjectNote(data, target.dataset.g6ProjectNote);
                if (!note || !Number.isInteger(index) || index < 0 || index >= note.notes.length) return;
                note.notes[index] = target.value.slice(0, 20000);
                note.updatedAt = now();
            } else if (target.dataset.g6Answer && data.activePractice && !data.activePractice.completedAt && !ui.recordId) {
                const id = target.dataset.g6Answer;
                if (!data.activePractice.questions.some(q => q.id === id) || data.activePractice.results[id]?.correct) return;
                data.activePractice.answers[id] = target.value.slice(0, 100);
                delete data.activePractice.results[id];
                target.removeAttribute("aria-invalid");
                const help = document.getElementById(`help-${id}`);
                if (help) help.textContent = "";
            } else return;
            if (target.nextElementSibling?.classList.contains("g6-print-text")) target.nextElementSibling.textContent = target.value;
            persist();
        },
        change(event) {
            const target = event.target;
            if (target.dataset.g6Status && getTopic(target.dataset.g6Status) && Object.hasOwn(topicStatuses, target.value)) {
                const note = getTopicNote(data, target.dataset.g6Status);
                note.status = target.value; note.updatedAt = now();
            } else if (target.dataset.g6Task) {
                const task = data.assignments.find(t => t.id === target.dataset.g6Task);
                if (!task) return;
                task.done = target.checked;
                ui.showCompleted = true;
                ui.notice = task.done ? "Task marked complete. You can reopen it below." : "Task moved back to your next steps.";
                persist(); refresh(`[data-g6-task="${CSS.escape(task.id)}"]`); return;
            } else if (target.dataset.g6ProjectDone) {
                const note = getProjectNote(data, target.dataset.g6ProjectDone), index = Number(target.dataset.index);
                if (!note || !Number.isInteger(index) || index < 0 || index >= note.done.length) return;
                note.done[index] = target.checked; note.updatedAt = now();
            } else if (target.id === "g6-level") { ui.level = target.value === "stretch" ? "stretch" : "core"; return; }
            else return;
            persist();
        },
        submit(event) {
            const form = event.target.closest("[data-g6-form]");
            if (!form) return;
            event.preventDefault();
            if (form.dataset.g6Form === "task") {
                const values = new FormData(form), title = String(values.get("title") || "").trim();
                const titleInput = form.elements.namedItem("title");
                titleInput.setCustomValidity(title ? "" : "Enter a task title.");
                if (!form.reportValidity()) { titleInput.addEventListener("input", () => titleInput.setCustomValidity(""), { once: true }); return; }
                const subjectId = String(values.get("subjectId"));
                if (!getSubject(subjectId)) return;
                const previous = data.assignments.find(t => t.id === ui.taskId);
                const task = { id: previous?.id || crypto.randomUUID(), title: title.slice(0, 160), subjectId, source: values.get("source") === "practice" ? "practice" : "teacher", due: String(values.get("due") || ""), notes: String(values.get("notes") || "").slice(0, 3000), done: previous?.done || false, createdAt: previous?.createdAt || now() };
                if (previous) Object.assign(previous, task); else data.assignments.push(task);
                persist(); navigate("week");
            } else if (form.dataset.g6Form === "practice" && data.activePractice && !ui.recordId && !data.activePractice.completedAt) {
                checkRound(data.activePractice);
                saveCompletedRound(data);
                persist();
                const first = data.activePractice.questions.find(q => !data.activePractice.results[q.id]?.correct);
                refresh(first ? `#answer-${first.id}` : "#g6-heading");
            }
        }
    };
}
