export const homeContent = Object.freeze({
    brand: "Math Gen",
    navLinks: Object.freeze([
        { id: "choose", label: "Choose" },
        { id: "why", label: "Why" },
        { id: "saved", label: "Saved" }
    ]),
    hero: Object.freeze({
        eyebrow: "Homework, simplified",
        title: "Pick today's sheet.",
        copy: "Open this week's homework, a little extra math practice, or a quick spelling test. It stays calm on screen, easy to print, and easy to return to later.",
        secondaryActionLabel: "See choices"
    }),
    choose: Object.freeze({
        eyebrow: "Choose",
        title: "Three simple ways to begin.",
        copy: "Full Homework stays the main page. Extra Math Practice is there for one more round of questions, and Test Yourself gives spelling a quick memory game."
    }),
    modules: Object.freeze({
        homework: Object.freeze({
            kicker: "Main homework page",
            title: "Full Homework",
            copy: "Spelling, weekly math, science review, and writing in one clear order.",
            preview: "Spelling, weekly math, review, and writing in one page.",
            selectorLabel: "Choose the homework week",
            dynamicFootnotePrefix: "This week's writing focus:",
            ctaLabelPrefix: "Open Week"
        }),
        practice: Object.freeze({
            kicker: "Extra practice",
            title: "Math Practice",
            copy: "A focused page for multiplication, division, algebra balance, and story problems.",
            preview: "A smaller extra page for focused math time.",
            footnote: "Best for a quick extra round after the main page is done.",
            ctaLabel: "Start Math Practice"
        }),
        test: Object.freeze({
            kicker: "Quick game",
            title: "Test Yourself",
            copy: "See ten spelling words, hide them, then type each one from memory one at a time.",
            preview: "Ten spelling words. Three seconds to look. Then type from memory.",
            footnote: "A perfect first-try round earns one bonus trophy.",
            ctaLabel: "Start Spelling Test"
        })
    }),
    why: Object.freeze({
        eyebrow: "Why",
        title: "Made to feel calm at homework time.",
        copy: "The layout stays clear, the steps stay visible, and the finished pages stay out of the way.",
        items: Object.freeze([
            Object.freeze({
                title: "One page at a time.",
                copy: "Homework stays separate from extra practice, so the page never feels too full."
            }),
            Object.freeze({
                title: "Easy to return to.",
                copy: "If you pause or refresh, the page you were working on can still be waiting here."
            }),
            Object.freeze({
                title: "Ready for paper.",
                copy: "When writing by hand helps more, the print view turns back into a clean worksheet."
            })
        ])
    }),
    saved: Object.freeze({
        eyebrow: "Saved",
        title: "Recent work stays out of the way.",
        copy: "Finished pages and spelling-test trophies stay on this device so you can quickly see what is already done, without turning the screen into a dashboard.",
        resumeTitle: "Still working on something?",
        resumeLabel: "Resume this page",
        emptyMessage: "No finished work yet. The first completed page or test will show up here."
    })
});
