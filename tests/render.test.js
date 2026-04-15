import test from "node:test";
import assert from "node:assert/strict";

import { homeContent } from "../data/home-content.js";
import { swanseaWeeks } from "../data/swansea-weeks.js";
import { generateFullHomework, generateSpellingTestGame } from "../js/generator.js";
import { renderGameView, renderHomeView, renderWorksheetView } from "../js/render.js";

test("home view renders the local nav, choose section, and why section", () => {
    const html = renderHomeView({
        content: homeContent,
        weeks: swanseaWeeks,
        selectedWeekId: "10",
        progress: {
            trophies: 2,
            history: []
        },
        activeWorksheet: null
    });

    assert(html.includes('class="home-local-nav no-print"'));
    assert(html.includes('href="#choose"'));
    assert(html.includes('id="why"'));
    assert(html.includes("Open Week 10"));
    assert(html.includes(homeContent.modules.test.title));
    assert(html.includes(homeContent.modules.test.ctaLabel));
    assert(html.includes(homeContent.why.items[0].title));
});

test("worksheet view renders helper notes and section presentation metadata", () => {
    const payload = generateFullHomework("10");
    const html = renderWorksheetView({
        payload,
        validation: null
    });

    assert(html.includes(payload.helperNote.title));
    assert(html.includes(payload.sections[0].stepLabel));
    assert(html.includes(`section-sheet--${payload.sections[0].surfaceVariant}`));
    assert(html.includes(payload.navLabel));
    assert(html.includes('class="spelling-practice"'));
    assert(html.includes('data-text-id='));
    assert(html.includes("Your draft"));
});

test("game view renders the timed spelling test layout", () => {
    const payload = generateSpellingTestGame();
    const html = renderGameView({ payload });

    assert(html.includes(payload.helperNote.title));
    assert(html.includes("Start Test"));
    assert(html.includes('data-game-form') === false);
    assert(html.includes("Ten random spelling words are chosen from across all weeks."));

    payload.game.phase = "typing";
    payload.game.currentInput = "sample";
    const typingHtml = renderGameView({ payload });
    assert(typingHtml.includes('data-game-form'));
    assert(typingHtml.includes('class="game-entry-stage"'));
    assert(typingHtml.includes('data-game-input="current"'));
    assert(typingHtml.includes("Submit word"));
});
