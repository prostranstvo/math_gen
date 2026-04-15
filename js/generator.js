import { swanseaWeeks, weekOrder } from "../data/swansea-weeks.js";

/**
 * @typedef {import("../data/swansea-weeks.js").WeekConfig} WeekConfig
 */

/**
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} prompt
 * @property {string} expectedAnswer
 * @property {string} inputMode
 */

/**
 * @typedef {Object} ManualTask
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} TextField
 * @property {string} id
 * @property {string} label
 * @property {number} minWords
 * @property {string} placeholder
 * @property {number} rows
 * @property {boolean} [lined]
 */

/**
 * @typedef {Object} HelperNote
 * @property {string} title
 * @property {string} copy
 * @property {string} actionLabel
 */

/**
 * @typedef {Object} WorksheetPayload
 * @property {string} id
 * @property {"math-practice"|"full-homework"|"spelling-test"} type
 * @property {string} navLabel
 * @property {string} displayLabel
 * @property {string} title
 * @property {string} subtitle
 * @property {"math"|"homework"|"game"} accent
 * @property {HelperNote} helperNote
 * @property {string} completionLabel
 * @property {string|null} selectedWeekId
 * @property {string} createdAt
 * @property {Array<Object>} sections
 * @property {Object} [game]
 * @property {{answers: Record<string, string>, tasks: Record<string, boolean>, text: Record<string, string>}} responses
 * @property {number} [trophyPoints]
 * @property {Object} [completionDetails]
 */

export function getDefaultWeekId() {
    return weekOrder[weekOrder.length - 1];
}

function createWorksheetId(type) {
    return `${type}-${Date.now()}-${getRandomInt(100, 999)}`;
}

function createBuilder(worksheetId) {
    let problemCount = 0;
    let taskCount = 0;
    let textFieldCount = 0;

    return {
        problem(prompt, answer, options = {}) {
            problemCount += 1;
            return {
                id: `${worksheetId}-problem-${problemCount}`,
                prompt,
                expectedAnswer: String(answer),
                inputMode: options.inputMode || "numeric"
            };
        },
        task(label) {
            taskCount += 1;
            return {
                id: `${worksheetId}-task-${taskCount}`,
                label
            };
        },
        textField(label, options = {}) {
            textFieldCount += 1;
            return {
                id: `${worksheetId}-text-${textFieldCount}`,
                label,
                minWords: options.minWords || 1,
                placeholder: options.placeholder || "",
                rows: options.rows || 5,
                lined: Boolean(options.lined)
            };
        }
    };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
}

function roundToNearestTen(value) {
    return Math.round(value / 10) * 10;
}

function buildSpellingWordPool() {
    const seenWords = new Set();
    const pool = [];

    weekOrder.forEach((weekId) => {
        const week = swanseaWeeks[weekId];
        if (!week || !Array.isArray(week.spelling)) {
            return;
        }

        week.spelling.forEach((word) => {
            const cleanedWord = String(word || "").trim();
            const normalizedWord = cleanedWord.toLowerCase();

            if (!cleanedWord || seenWords.has(normalizedWord)) {
                return;
            }

            seenWords.add(normalizedWord);
            pool.push(cleanedWord);
        });
    });

    return pool;
}

function buildBasePayload(type, config) {
    return {
        id: createWorksheetId(type),
        type,
        navLabel: config.navLabel,
        displayLabel: config.displayLabel,
        title: config.title,
        subtitle: config.subtitle,
        accent: config.accent,
        helperNote: config.helperNote,
        completionLabel: config.completionLabel,
        selectedWeekId: config.selectedWeekId || null,
        createdAt: new Date().toISOString(),
        sections: [],
        responses: {
            answers: {},
            tasks: {},
            text: {}
        }
    };
}

function initializeResponses(payload) {
    payload.sections.forEach((section) => {
        if (section.kind === "problems") {
            section.problems.forEach((problem) => {
                payload.responses.answers[problem.id] = "";
            });
        }

        if (section.kind === "spelling") {
            section.practiceRows.forEach((row) => {
                row.entries.forEach((entry) => {
                    payload.responses.answers[entry.id] = "";
                });
            });
        }

        if (section.responseField) {
            payload.responses.text[section.responseField.id] = "";
        }

        if (section.manualTask) {
            payload.responses.tasks[section.manualTask.id] = false;
        }
    });

    return payload;
}

function buildMultiplicationProblems(builder, count) {
    return Array.from({ length: count }, () => {
        const left = getRandomInt(12, 99);
        const right = getRandomInt(12, 99);
        return builder.problem(`${left} x ${right} =`, left * right);
    });
}

function buildDivisionProblems(builder, count) {
    return Array.from({ length: count }, () => {
        const divisor = getRandomInt(4, 15);
        const quotient = getRandomInt(30, 125);
        return builder.problem(`${divisor * quotient} / ${divisor} =`, quotient);
    });
}

function buildAlgebraBalanceProblem(builder) {
    const answer = getRandomInt(2, 10);
    const c = getRandomInt(1, 5);
    const a = c + getRandomInt(1, 5);
    const offset = (a - c) * answer;
    const b = getRandomInt(1, 15);
    const d = offset + b;

    if (Math.random() > 0.5) {
        const subtractor = getRandomInt(1, 10);
        const adjustedRight = ((a - c) * answer) - subtractor;
        if (adjustedRight > 0) {
            return builder.problem(`${a}x - ${subtractor} = ${c}x + ${adjustedRight}`, answer);
        }
    }

    return builder.problem(`${a}x + ${b} = ${c}x + ${d}`, answer);
}

function buildAlgebraBalanceProblems(builder, count) {
    return Array.from({ length: count }, () => buildAlgebraBalanceProblem(builder));
}

function buildAlgebraWordProblems(builder) {
    const problems = [];

    const packs = getRandomInt(3, 8);
    const perPack = getRandomInt(8, 15);
    const loose = getRandomInt(4, 12);
    const totalCards = (packs * perPack) + loose;
    problems.push(builder.problem(`You have ${packs} unopened card packs and ${loose} loose cards. If there are ${totalCards} cards in all, how many cards are in each pack?`, perPack));

    const players = getRandomInt(9, 15);
    const gloveCost = getRandomInt(25, 45);
    const batCost = getRandomInt(15, 35);
    const totalCost = players * (gloveCost + batCost);
    problems.push(builder.problem(`A coach buys gear for ${players} players. Each player gets a glove for $${gloveCost} and a practice bat. If the total bill is $${totalCost}, how much does each bat cost?`, batCost));

    const multiplier = getRandomInt(2, 5);
    const friendCars = getRandomInt(15, 40);
    const totalCars = friendCars + (friendCars * multiplier);
    problems.push(builder.problem(`You have ${multiplier} times as many toy cars as your friend. If you have ${totalCars} cars altogether, how many cars does your friend have?`, friendCars));

    const games = getRandomInt(4, 7);
    const laterGames = getRandomInt(12, 28);
    const firstGame = getRandomInt(8, 20);
    const totalPoints = (games * laterGames) + firstGame;
    problems.push(builder.problem(`A player scored ${firstGame} points in the first game. They then scored the same number of points in each of the next ${games} games. If the total is ${totalPoints}, how many points did they score in each later game?`, laterGames));

    const weekdays = getRandomInt(3, 5);
    const dailyKm = getRandomInt(8, 20);
    const weekendKm = getRandomInt(25, 50);
    const totalKm = (weekdays * dailyKm) + weekendKm;
    problems.push(builder.problem(`A cyclist rides the same distance for ${weekdays} weekdays and ${weekendKm} km on the weekend. If the total is ${totalKm} km, how far did they ride on each weekday?`, dailyKm));

    return shuffle(problems);
}

function buildPatterningProblems(builder) {
    const patterns = [
        () => {
            const start = getRandomInt(2, 9);
            const step = getRandomInt(2, 7);
            return [start, start + step, start + (step * 2), start + (step * 3), start + (step * 4)];
        },
        () => {
            const start = getRandomInt(50, 90);
            const step = getRandomInt(3, 8);
            return [start, start - step, start - (step * 2), start - (step * 3), start - (step * 4)];
        }
    ];

    return Array.from({ length: 6 }, (_, index) => {
        const values = patterns[index % patterns.length]();
        const answer = values[4];
        return builder.problem(`Finish the pattern: ${values[0]}, ${values[1]}, ${values[2]}, ${values[3]}, __`, answer);
    });
}

function buildEstimationProblems(builder) {
    return Array.from({ length: 6 }, (_, index) => {
        if (index % 2 === 0) {
            const left = getRandomInt(120, 489);
            const right = getRandomInt(120, 489);
            const answer = roundToNearestTen(left) + roundToNearestTen(right);
            return builder.problem(`Estimate ${left} + ${right} by rounding each number to the nearest ten.`, answer);
        }

        const left = getRandomInt(260, 689);
        const right = getRandomInt(110, left - 40);
        const answer = roundToNearestTen(left) - roundToNearestTen(right);
        return builder.problem(`Estimate ${left} - ${right} by rounding each number to the nearest ten.`, answer);
    });
}

function buildSubtractionProblems(builder) {
    return Array.from({ length: 6 }, () => {
        const left = getRandomInt(320, 999);
        const right = getRandomInt(140, left - 40);
        return builder.problem(`${left} - ${right} =`, left - right);
    });
}

function buildMeasurementProblems(builder) {
    const prompts = [
        () => {
            const bottles = getRandomInt(3, 7);
            const millilitres = getRandomInt(150, 500);
            return builder.problem(`One bottle holds ${millilitres} mL. How many mL do ${bottles} bottles hold?`, bottles * millilitres);
        },
        () => {
            const bags = getRandomInt(2, 6);
            const grams = getRandomInt(250, 900);
            return builder.problem(`Each bag of rice weighs ${grams} g. What is the total mass of ${bags} bags in grams?`, bags * grams);
        },
        () => {
            const jugs = getRandomInt(2, 5);
            const litres = getRandomInt(2, 9);
            return builder.problem(`A jug holds ${litres} L. How many litres do ${jugs} jugs hold?`, jugs * litres);
        }
    ];

    return Array.from({ length: 6 }, (_, index) => prompts[index % prompts.length]());
}

function buildMetricConversionProblems(builder) {
    const templates = [
        () => {
            const litres = getRandomInt(2, 9);
            return builder.problem(`${litres} L = ___ mL`, litres * 1000);
        },
        () => {
            const kilograms = getRandomInt(2, 8);
            return builder.problem(`${kilograms} kg = ___ g`, kilograms * 1000);
        },
        () => {
            const metres = getRandomInt(3, 12);
            return builder.problem(`${metres} m = ___ cm`, metres * 100);
        },
        () => {
            const centimetres = getRandomInt(2, 9) * 100;
            return builder.problem(`${centimetres} cm = ___ m`, centimetres / 100);
        }
    ];

    return Array.from({ length: 6 }, (_, index) => templates[index % templates.length]());
}

function buildNineByNineProblems(builder) {
    return Array.from({ length: 12 }, () => {
        const left = getRandomInt(2, 9);
        const right = getRandomInt(2, 9);
        return builder.problem(`${left} x ${right} =`, left * right);
    });
}

function buildTwoDigitMultiplicationProblems(builder) {
    return Array.from({ length: 6 }, () => {
        const left = getRandomInt(12, 39);
        const right = getRandomInt(11, 29);
        return builder.problem(`${left} x ${right} =`, left * right);
    });
}

function buildThreeDigitDivisionProblems(builder) {
    return Array.from({ length: 5 }, () => {
        const divisor = getRandomInt(3, 9);
        const quotient = getRandomInt(24, 86);
        return builder.problem(`${divisor * quotient} / ${divisor} =`, quotient);
    });
}

function buildMinuteMathProblems(builder) {
    return Array.from({ length: 12 }, () => {
        if (Math.random() > 0.5) {
            const left = getRandomInt(2, 12);
            const right = getRandomInt(2, 12);
            return builder.problem(`${left} x ${right} =`, left * right);
        }

        const divisor = getRandomInt(2, 10);
        const quotient = getRandomInt(2, 10);
        return builder.problem(`${divisor * quotient} / ${divisor} =`, quotient);
    });
}

function buildDataManagementProblems(builder) {
    return shuffle([
        builder.problem("Find the mode: 4, 6, 6, 7, 9", 6),
        builder.problem("Find the median: 3, 5, 7, 8, 12", 7),
        builder.problem("A survey shows 8 students chose soccer, 5 chose basketball, and 3 chose swimming. How many more chose soccer than swimming?", 5),
        builder.problem("How many students in total: 6 read comics, 4 read mysteries, and 7 read adventure books?", 17),
        builder.problem("Find the mode: 12, 13, 13, 15, 18", 13),
        builder.problem("Find the median: 10, 11, 14, 20, 25", 14)
    ]);
}

function buildAlgebraEquationProblems(builder) {
    return shuffle([
        builder.problem("x + 68 = 95", 27),
        builder.problem("56 = x - 34", 90),
        builder.problem("1 + x + 4 = 32 + 45", 72),
        builder.problem("7n = 56", 8),
        builder.problem("3x + 12 = 30", 6),
        builder.problem("5 + y = 19", 14)
    ]);
}

function buildPerimeterAreaProblems(builder) {
    return shuffle([
        builder.problem("A rectangle is 9 cm long and 4 cm wide. What is the perimeter in cm?", 26),
        builder.problem("A rectangle is 8 cm long and 6 cm wide. What is the area in cm2?", 48),
        builder.problem("A square has a side length of 7 cm. What is the perimeter in cm?", 28),
        builder.problem("A square has a side length of 5 cm. What is the area in cm2?", 25),
        builder.problem("A rectangle has a perimeter of 30 cm and a length of 9 cm. What is the width in cm?", 6),
        builder.problem("A garden is 11 m long and 3 m wide. What is the area in m2?", 33)
    ]);
}

function buildFinancialLiteracyProblems(builder) {
    return shuffle([
        builder.problem("Add the prices: $12.75 + $4.50 =", "17.25"),
        builder.problem("Subtract the price: $20.00 - $7.35 =", "12.65"),
        builder.problem("Three notebooks cost $2.45 each. What is the total cost?", "7.35"),
        builder.problem("A game costs $14.99. Round it to the nearest dollar.", 15),
        builder.problem("Four pencils cost $1.25 each. What is the total cost?", "5.00"),
        builder.problem("You have $25.00 and spend $8.40. How much money is left?", "16.60")
    ]);
}

function buildAngleProblems(builder) {
    return shuffle([
        builder.problem("A right angle measures ___ degrees.", 90),
        builder.problem("Is a 45 degree angle acute, right, or obtuse?", "acute", { inputMode: "text" }),
        builder.problem("Is a 120 degree angle acute, right, or obtuse?", "obtuse", { inputMode: "text" }),
        builder.problem("How many degrees greater is 110 than 90?", 20),
        builder.problem("Which angle is larger: 35 or 85? Write the number only.", 85),
        builder.problem("An angle measures 90 degrees. Is it acute, right, or obtuse?", "right", { inputMode: "text" })
    ]);
}

function buildTriangleProblems(builder) {
    return shuffle([
        builder.problem("How many sides does every triangle have?", 3),
        builder.problem("How many angles does every triangle have?", 3),
        builder.problem("A triangle with three equal sides is called what?", "equilateral", { inputMode: "text" }),
        builder.problem("A triangle with two equal sides is called what?", "isosceles", { inputMode: "text" }),
        builder.problem("A triangle with all sides different is called what?", "scalene", { inputMode: "text" }),
        builder.problem("A triangle with one right angle is called what?", "right triangle", { inputMode: "text" })
    ]);
}

function buildGridTransformationProblems(builder) {
    return shuffle([
        builder.problem("A slide is called a ___.", "translation", { inputMode: "text" }),
        builder.problem("A turn is called a ___.", "rotation", { inputMode: "text" }),
        builder.problem("A flip is called a ___.", "reflection", { inputMode: "text" }),
        builder.problem("Point A is at (2, 3). Slide it right 4 units. What is the new x-coordinate?", 6),
        builder.problem("Point B is at (5, 1). Slide it up 3 units. What is the new y-coordinate?", 4),
        builder.problem("Point C is at (7, 6). Slide it left 2 units. What is the new x-coordinate?", 5)
    ]);
}

function buildWeeklyMathSectionByTopic(week, builder) {
    const topic = String(week.mathTopic || "").toLowerCase();
    const sharedTitle = `Part 2: Weekly Math - ${week.mathTopic}`;

    if (topic.includes("data")) {
        return {
            title: sharedTitle,
            hint: "Sort the data carefully and look for the value that appears most or lands in the middle.",
            layout: "list",
            problems: buildDataManagementProblems(builder)
        };
    }

    if (topic.includes("pattern")) {
        return {
            title: sharedTitle,
            hint: "Look for how the pattern changes each time before you write the next number.",
            layout: "list",
            problems: buildPatterningProblems(builder)
        };
    }

    if (topic.includes("estimation")) {
        return {
            title: sharedTitle,
            hint: "Round each number to the nearest ten before you estimate.",
            layout: "list",
            problems: buildEstimationProblems(builder)
        };
    }

    if (topic.includes("subtraction")) {
        return {
            title: sharedTitle,
            hint: "Use regrouping or another subtraction strategy that feels clear to you.",
            layout: "list",
            problems: buildSubtractionProblems(builder)
        };
    }

    if (topic.includes("metric")) {
        return {
            title: sharedTitle,
            hint: "Remember the metric conversion jumps: 100 for m and cm, 1000 for L and mL or kg and g.",
            layout: "list",
            problems: buildMetricConversionProblems(builder)
        };
    }

    if (topic.includes("9x9") || (topic.includes("multiplication") && topic.includes("fact"))) {
        return {
            title: sharedTitle,
            hint: "Stay inside the 9 x 9 facts and aim for quick recall.",
            layout: "grid",
            problems: buildNineByNineProblems(builder)
        };
    }

    if (topic.includes("2-digit multiplication") || topic.includes("area model")) {
        return {
            title: sharedTitle,
            hint: "Break each number into tens and ones if you want to sketch the area model on paper.",
            layout: "list",
            problems: buildTwoDigitMultiplicationProblems(builder)
        };
    }

    if (topic.includes("division")) {
        return {
            title: sharedTitle,
            hint: "These quotients are whole numbers so you can focus on the division structure.",
            layout: "list",
            problems: buildThreeDigitDivisionProblems(builder)
        };
    }

    if (topic.includes("algebra")) {
        return {
            title: sharedTitle,
            hint: "Use the equation to figure out the missing value, then check it by substitution.",
            layout: "list",
            problems: buildAlgebraEquationProblems(builder)
        };
    }

    if (topic.includes("triangle")) {
        return {
            title: sharedTitle,
            hint: "Think about side lengths and angle types to name each triangle clearly.",
            layout: "list",
            problems: buildTriangleProblems(builder)
        };
    }

    if (topic.includes("angle")) {
        return {
            title: sharedTitle,
            hint: "Use what you know about right, acute, and obtuse angles before you answer.",
            layout: "list",
            problems: buildAngleProblems(builder)
        };
    }

    if (topic.includes("grid") || topic.includes("transform")) {
        return {
            title: sharedTitle,
            hint: "Track each move one step at a time and match the math word to the motion.",
            layout: "list",
            problems: buildGridTransformationProblems(builder)
        };
    }

    if (topic.includes("financial literacy") || topic.includes("decimal")) {
        return {
            title: sharedTitle,
            hint: "Line up the decimal places carefully when you add or subtract money.",
            layout: "list",
            problems: buildFinancialLiteracyProblems(builder)
        };
    }

    if (topic.includes("perimeter") || topic.includes("area")) {
        return {
            title: sharedTitle,
            hint: "Keep perimeter and area separate: one measures around, the other measures inside.",
            layout: "list",
            problems: buildPerimeterAreaProblems(builder)
        };
    }

    if (topic.includes("measurement")) {
        return {
            title: sharedTitle,
            hint: "Read the unit in each question carefully before you answer.",
            layout: "list",
            problems: buildMeasurementProblems(builder)
        };
    }

    return {
        title: sharedTitle,
        hint: "Treat this like a clean facts round. Fast, neat answers are enough.",
        layout: "grid",
        problems: buildMinuteMathProblems(builder)
    };
}

function buildWeeklyMathSection(week, builder) {
    switch (week.weekId) {
        case "2":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Look for how the pattern changes each time before you write the next number.",
                layout: "list",
                problems: buildPatterningProblems(builder)
            };
        case "3":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Round each number to the nearest ten before you estimate.",
                layout: "list",
                problems: buildEstimationProblems(builder)
            };
        case "4":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Use regrouping or another subtraction strategy that feels clear to you.",
                layout: "list",
                problems: buildSubtractionProblems(builder)
            };
        case "5":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Read the unit in each question carefully before you answer.",
                layout: "list",
                problems: buildMeasurementProblems(builder)
            };
        case "6":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Remember the metric conversion jumps: 100 for m and cm, 1000 for L and mL or kg and g.",
                layout: "list",
                problems: buildMetricConversionProblems(builder)
            };
        case "7":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Stay inside the 9 x 9 facts and aim for quick recall.",
                layout: "grid",
                problems: buildNineByNineProblems(builder)
            };
        case "8":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Break each number into tens and ones if you want to sketch the area model on paper.",
                layout: "list",
                problems: buildTwoDigitMultiplicationProblems(builder)
            };
        case "9":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "These quotients are whole numbers so you can focus on the division structure.",
                layout: "list",
                problems: buildThreeDigitDivisionProblems(builder)
            };
        case "10":
            return {
                title: `Part 2: Weekly Math - ${week.mathTopic}`,
                hint: "Treat this like a clean facts round. Fast, neat answers are enough.",
                layout: "grid",
                problems: buildMinuteMathProblems(builder)
            };
        default:
            return buildWeeklyMathSectionByTopic(week, builder);
    }
}

export function generateMathWorksheet() {
    const payload = buildBasePayload("math-practice", {
        navLabel: "Practice",
        displayLabel: "Math Practice",
        title: "Math Practice",
        subtitle: "A focused extra page for multiplication, division, algebra balance, and story problems.",
        accent: "math",
        completionLabel: "Math Practice",
        helperNote: {
            title: "Work one section at a time.",
            copy: "When every answer looks ready, use Check My Page.",
            actionLabel: "Check My Page"
        },
        selectedWeekId: null
    });

    const builder = createBuilder(payload.id);
    payload.sections = [
        {
            id: "practice-multiplication",
            kind: "problems",
            stepLabel: "Step 1",
            surfaceVariant: "plain",
            title: "Multiplication Practice",
            hint: "Work carefully and check your basic facts before you finish.",
            layout: "list",
            problems: buildMultiplicationProblems(builder, 5)
        },
        {
            id: "practice-division",
            kind: "problems",
            stepLabel: "Step 2",
            surfaceVariant: "soft",
            title: "Division Practice",
            hint: "These problems divide evenly so you can focus on the steps.",
            layout: "list",
            problems: buildDivisionProblems(builder, 5)
        },
        {
            id: "practice-balance",
            kind: "problems",
            stepLabel: "Step 3",
            surfaceVariant: "mist",
            title: "Algebra Balance and Logic",
            hint: "Solve for x and show your steps on paper if you want extra practice.",
            layout: "list",
            problems: buildAlgebraBalanceProblems(builder, 5)
        },
        {
            id: "practice-word",
            kind: "problems",
            stepLabel: "Step 4",
            surfaceVariant: "warm",
            title: "Algebra Word Problems",
            hint: "Read the story, decide on the missing value, then solve.",
            layout: "list",
            problems: buildAlgebraWordProblems(builder)
        }
    ];

    return initializeResponses(payload);
}

export function generateSpellingTestGame() {
    const payload = buildBasePayload("spelling-test", {
        navLabel: "Test",
        displayLabel: "Test Yourself",
        title: "Test Yourself",
        subtitle: "Ten spelling words. Three seconds to look. Then type each one from memory.",
        accent: "game",
        completionLabel: "Spelling Test",
        helperNote: {
            title: "Look, remember, then type.",
            copy: "You will see all 10 words for 3 seconds, then one word at a time. Hover or tap a visible word to hear it. If a word is wrong, it comes back for 3 seconds before you try again.",
            actionLabel: "Start Test"
        },
        selectedWeekId: null
    });

    const words = shuffle(buildSpellingWordPool()).slice(0, 10);
    payload.game = {
        phase: "ready",
        revealDurationMs: 3000,
        currentIndex: 0,
        currentInput: "",
        feedback: {
            tone: "neutral",
            message: "See all 10 words, then type them one by one from memory."
        },
        words: words.map((word, index) => ({
            id: `${payload.id}-word-${index + 1}`,
            word,
            status: "pending",
            attempts: 0,
            solvedOnAttempt: null,
            guesses: []
        }))
    };

    return initializeResponses(payload);
}

export function generateFullHomework(weekId) {
    const selectedWeekId = String(weekId || getDefaultWeekId());
    const week = swanseaWeeks[selectedWeekId] || swanseaWeeks[getDefaultWeekId()];
    const payload = buildBasePayload("full-homework", {
        navLabel: "Homework",
        displayLabel: "Full Homework",
        title: "Full Homework",
        subtitle: `Week ${week.weekId} | ${week.date} | Finish it in order from top to bottom.`,
        accent: "homework",
        completionLabel: `Full Homework - Week ${week.weekId}`,
        helperNote: {
            title: "Finish the math, then complete the spelling, review, and writing boxes.",
            copy: "This page stays saved on this device until every step has real work in it.",
            actionLabel: "Finish This Page"
        },
        selectedWeekId: week.weekId
    });

    const builder = createBuilder(payload.id);
    const weeklyMathSection = buildWeeklyMathSection(week, builder);

    payload.sections = [
        {
            id: "spelling",
            kind: "spelling",
            stepLabel: "Step 1",
            surfaceVariant: "plain",
            title: "Part 1: Spelling and Foundations",
            hint: "Write each word three times. Hover or tap a word to hear it. Each spelling box checks automatically when it matches the word.",
            intro: week.grammar,
            practiceRows: week.spelling.map((word) => ({
                word,
                entries: [
                    builder.problem(word, word, { inputMode: "text" }),
                    builder.problem(word, word, { inputMode: "text" }),
                    builder.problem(word, word, { inputMode: "text" })
                ]
            }))
        },
        {
            id: "weekly-math",
            kind: "problems",
            stepLabel: "Step 2",
            surfaceVariant: "soft",
            title: weeklyMathSection.title,
            hint: weeklyMathSection.hint,
            layout: weeklyMathSection.layout,
            problems: weeklyMathSection.problems
        },
        {
            id: "review",
            kind: "review",
            pageBreakBefore: true,
            stepLabel: "Step 3",
            surfaceVariant: "mist",
            title: `Part 3: Review - ${week.scienceTopic}`,
            prompt: week.reviewPrompt,
            responseField: builder.textField("Your ideas", {
                minWords: 3,
                placeholder: "List a few facts, ideas, or reminders here.",
                rows: 7,
                lined: true
            })
        },
        {
            id: "writing",
            kind: "writing",
            stepLabel: "Step 4",
            surfaceVariant: "warm",
            title: `Part 4: Writing Prompt - ${week.writingTopic}`,
            intro: week.writingPrompt,
            lines: 8,
            responseField: builder.textField("Your draft", {
                minWords: 8,
                placeholder: "Write your first draft here.",
                rows: 8,
                lined: true
            })
        }
    ];

    return initializeResponses(payload);
}
