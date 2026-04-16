export const homeContent = Object.freeze({
    brand: "Math Gen",
    navLinks: Object.freeze([
        { id: "choose", label: "Choose" },
        { id: "smart", label: "Smart" },
        { id: "proud", label: "Proud" }
    ]),
    hero: Object.freeze({
        eyebrow: "Homework, simplified",
        title: "Pick today's sheet.",
        readyLabel: "is ready.",
        secondaryActionLabel: "See choices"
    }),
    choose: Object.freeze({
        eyebrow: "Choose",
        title: "Three simple ways to begin."
    }),
    modules: Object.freeze({
        homework: Object.freeze({
            kicker: "This week",
            title: "This Week",
            copy: "Spelling, math, and writing.",
            preview: "Spelling, math, and writing.",
            selectorLabel: "Choose the week",
            ctaLabelPrefix: "Open Week"
        }),
        practice: Object.freeze({
            kicker: "Math practice",
            title: "Math Practice",
            copy: "One extra round of math.",
            preview: "A quick extra math page.",
            ctaLabel: "Start Math Practice"
        }),
        test: Object.freeze({
            kicker: "Test yourself",
            title: "Test Yourself",
            copy: "Ten words from memory.",
            preview: "Look. Remember. Type.",
            ctaLabel: "Start Spelling Test"
        })
    }),
    smartThinking: Object.freeze({
        eyebrow: "Smart",
        title: "Smart Thinking",
        items: Object.freeze([
            Object.freeze({
                title: "Practice builds strong brains.",
                copy: "Each small round helps your brain get faster."
            }),
            Object.freeze({
                title: "Math grows careful thinking.",
                copy: "Looking for patterns helps you solve new problems."
            }),
            Object.freeze({
                title: "Writing helps ideas stick.",
                copy: "Putting thoughts into words helps you remember more."
            })
        ])
    }),
    proudBoard: Object.freeze({
        eyebrow: "Proud",
        title: "Proud Board",
        copy: "See your trophies and newest wins.",
        stats: Object.freeze([
            Object.freeze({ label: "Trophies" }),
            Object.freeze({ label: "Pages Finished" }),
            Object.freeze({ label: "Perfect Tests" })
        ]),
        resumeTitle: "Still working?",
        resumeLabel: "Resume this page",
        historyTitle: "Recent achievements",
        emptyMessage: "Finish your first page or test to start your proud board."
    })
});
