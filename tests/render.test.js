import test from "node:test";
import assert from "node:assert/strict";

import { homeContent } from "../data/home-content.js";
import { swanseaWeeks } from "../data/swansea-weeks.js";
import { generateFullHomework, generateSpellingTestGame } from "../js/generator.js";
import { renderGameView, renderHomeView, renderWorksheetView } from "../js/render.js";

test("home view renders the local nav, choose section, smart thinking, and proud board", () => {
    const html = renderHomeView({
        content: homeContent,
        weeks: swanseaWeeks,
        selectedWeekId: "10",
        progress: {
            trophies: 2,
            history: [],
            stats: {
                completedPages: 4,
                perfectSpellingRounds: 1
            }
        },
        activeWorksheet: null
    });

    assert(html.includes('class="home-local-nav no-print"'));
    assert(html.includes('href="#choose"'));
    assert(html.includes('href="#smart"'));
    assert(html.includes('href="#proud"'));
    assert(html.includes("Week 10 is ready."));
    assert(html.includes("Open Week 10"));
    assert(html.includes('class="hero-preview hero-preview--primary" type="button" data-action="generate-full"'));
    assert(html.includes('class="hero-preview hero-preview--secondary" type="button" data-action="generate-math"'));
    assert(html.includes('class="hero-preview hero-preview--tertiary" type="button" data-action="generate-test"'));
    assert(html.includes("This Week"));
    assert(html.includes(homeContent.modules.test.title));
    assert(html.includes(homeContent.modules.test.ctaLabel));
    assert(html.includes('id="smart"'));
    assert(html.includes(homeContent.smartThinking.items[0].title));
    assert(html.includes('id="proud"'));
    assert(html.includes(homeContent.proudBoard.title));
    assert(html.includes("Pages Finished"));
    assert(html.includes("Perfect Tests"));
    assert(html.includes('id="why"') === false);
});

test("worksheet view renders helper notes and section presentation metadata", () => {
    const payload = generateFullHomework("10");
    const checkedAnswerId = payload.sections[1].problems[0].id;
    const html = renderWorksheetView({
        payload,
        validation: null,
        liveAnswerFeedback: {
            [checkedAnswerId]: true
        }
    });

    assert(html.includes(payload.helperNote.title));
    assert(html.includes(payload.sections[0].stepLabel));
    assert(html.includes(`section-sheet--${payload.sections[0].surfaceVariant}`));
    assert(html.includes(payload.navLabel));
    assert(html.includes('class="spelling-practice"'));
    assert(html.includes('data-speak-text='));
    assert(html.includes('data-text-id='));
    assert(html.includes('class="problem-row"'));
    assert(html.includes('text-entry-input--lined'));
    assert(html.includes("answer-input--checked"));
    assert(html.includes("Your draft"));
    assert(html.includes('class="review-box"') === false);
});

test("game view renders the timed spelling test layout", () => {
    const payload = generateSpellingTestGame();
    const html = renderGameView({ payload });

    assert(html.includes(payload.helperNote.title));
    assert(html.includes("Start Test"));
    assert.equal((html.match(/Start Test/g) || []).length, 2);
    assert(html.includes('data-game-form') === false);
    assert(html.includes("Perfect round = +1 trophy"));
    assert(html.includes('class="game-card-actions no-print"'));
    assert(html.includes('class="game-rule-chip"'));
    assert(html.includes("Ten random spelling words are chosen from across all weeks.") === false);

    payload.game.phase = "preview-all";
    const previewHtml = renderGameView({ payload });
    assert(previewHtml.includes('class="game-word-chip"'));
    assert(previewHtml.includes('data-speak-text='));

    payload.game.phase = "typing";
    payload.game.currentInput = "sample";
    const typingHtml = renderGameView({ payload });
    assert(typingHtml.includes('data-game-form'));
    assert(typingHtml.includes('class="game-entry-stage"'));
    assert(typingHtml.includes('data-game-input="current"'));
    assert(typingHtml.includes("Submit word"));
});
