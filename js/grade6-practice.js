export const lessons = {
    "place-value": { rule: "A digit's value depends on its position. Each place is ten times the place to its right.", example: "In 426,315, the 2 is worth 20,000. Expanded form: 400,000 + 20,000 + 6,000 + 300 + 10 + 5." },
    factors: { rule: "A prime number has exactly two positive factors: 1 and itself. A composite number has more than two. A prime factorization writes a whole number as a product of primes.", example: "36 = 4 × 9. Split again: 4 = 2 × 2 and 9 = 3 × 3. So 36 = 2 × 2 × 3 × 3. Check: 2 × 2 × 3 × 3 = 36. The number 1 is neither prime nor composite." },
    powers: { rule: "A power uses repeated multiplication. The positive square root of a number gives the side length of a square with that area.", example: "5² = 5 × 5 = 25. The square root of 25 is 5. But 5 × 2 = 10." },
    fractions: { rule: "Equivalent fractions name the same amount. Multiply or divide the numerator and denominator by the same non-zero number.", example: "2/3 = 4/6. To compare 2/3 and 3/4, use twelfths: 8/12 < 9/12." },
    "fraction-operations": { rule: "To add or subtract fractions, use equal denominators. To multiply, multiply the numerators and denominators. To divide, multiply by the reciprocal of the second fraction.", example: "1/3 + 1/4 = 4/12 + 3/12 = 7/12. Also, 1/2 ÷ 1/4 = 1/2 × 4/1 = 2." },
    decimals: { rule: "Line up place values when adding or subtracting decimals. Estimate first to check the size of your answer.", example: "3.25 + 1.80 = 5.05. An estimate of 3 + 2 = 5 helps check it." },
    percents: { rule: "Percent means out of 100. Convert a percent to a fraction over 100 or divide it by 100 to get a decimal.", example: "25% = 25/100 = 1/4 = 0.25. So 25% of 80 is 80 ÷ 4 = 20." },
    integers: { rule: "Integers include negative whole numbers, zero, and positive whole numbers. On a number line, values increase to the right.", example: "−2 is greater than −5. Starting at −4 and moving 7 places right gives 3." },
    measurement: { rule: "Choose a unit that fits what you measure. A metre is 100 centimetres. A kilogram is 1,000 grams. A litre is 1,000 millilitres.", example: "2.5 L = 2,500 mL. To convert litres to millilitres, multiply by 1,000." },
    area: { rule: "Area measures the surface inside a shape. A rectangle's area is length × width. A triangle's area is base × perpendicular height ÷ 2.", example: "A rectangle 8 cm by 5 cm has an area of 40 cm². Its perimeter is 2 × (8 + 5) = 26 cm." },
    angles: { rule: "A right angle is 90°. An acute angle is less than 90°. An obtuse angle is between 90° and 180°. The angles inside a triangle total 180°.", example: "If a triangle has angles of 50° and 60°, its third angle is 180° − 50° − 60° = 70°. A pentagon has five sides." },
    solids: { rule: "Surface area is the total area of a solid's outside faces. A rectangular prism has three pairs of equal rectangular faces.", example: "For a box 3 cm × 4 cm × 5 cm: surface area = 2 × (3 × 4 + 3 × 5 + 4 × 5) = 94 cm²." },
    transformations: { rule: "A translation slides a shape. A reflection flips it across a line. A rotation turns it around a point. These moves keep its size and shape.", example: "Translate (2, 3) four units right: (6, 3). Reflect (2, 3) across the y-axis: (−2, 3)." },
    data: { rule: "The mean is the sum divided by the number of values. The median is the middle value after sorting. The range is the greatest value minus the least.", example: "For 2, 4, 6: mean = 12 ÷ 3 = 4; median = 4; range = 6 − 2 = 4." },
    algebra: { rule: "A variable stands for a value. Keep an equation balanced by applying the same operation to both sides.", example: "3x + 2 = 17. Subtract 2: 3x = 15. Divide by 3: x = 5. Check: 3 × 5 + 2 = 17." },
    probability: { rule: "For equally likely outcomes, probability is the number of favourable outcomes divided by the total number of possible outcomes.", example: "A bag has 3 red and 7 blue counters. The probability of drawing red is 3/10." },
    coding: { rule: "An algorithm is a sequence of instructions. A loop repeats instructions. Trace each step to check a result.", example: "Set total = 2. Repeat 3 times: add 4 to total. The values are 6, 10, and 14. The final total is 14." },
    economy: { rule: "A budget records income and expenses. Subtract total expenses from income to find the amount left.", example: "With $30 of classroom income and expenses of $8 and $7, the balance is $30 − $8 − $7 = $15." },
    review: { rule: "Read the whole question. Choose a method. Calculate. Then check the units and explain why your answer makes sense.", example: "For a $40 item discounted by 25%, the saving is $10 and the new price is $30. These are extra review questions, not official EQAO questions." }
};
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fraction = (a, b) => { const d = gcd(a, b); return b / d === 1 ? String(a / d) : `${a / d}/${b / d}`; };
const primeFactors = value => { const result = []; for (let i = 2; i <= value; i++) while (value % i === 0) { result.push(i); value /= i; } return result; };
const numeric = value => {
    const text = String(value).trim().replaceAll("−", "-");
    if (/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(text)) {
        const [a, b] = text.split("/").map(Number);
        return b ? a / b : NaN;
    }
    if (!/^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(text) || !/\d/.test(text)) return NaN;
    return Number(text.replaceAll(",", ""));
};
export function checkPracticeAnswer(value, question) {
    const answer = String(value).trim().toLowerCase();
    if (!answer) return false;
    if (question.kind === "factors") {
        if (!/^\d+(?:\s*[x×*]\s*\d+)*$/.test(answer)) return false;
        const factors = answer.split(/[x×*]/).map(Number).sort((a, b) => a - b);
        return factors.join(",") === question.answer.split(" × ").map(Number).sort((a, b) => a - b).join(",");
    }
    if (question.kind === "fraction-simplified") {
        if (!/^\d+\s*\/\s*\d+$/.test(answer)) return false;
        const [numerator, denominator] = answer.split("/").map(Number);
        if (!denominator || gcd(numerator, denominator) !== 1) return false;
    }
    if (question.kind === "text") return answer === question.answer.toLowerCase();
    const actual = numeric(answer), expected = numeric(question.answer);
    return Number.isFinite(actual) && Math.abs(actual - expected) < 1e-8;
}
export function generatePractice(topic, level = "core", rng = Math.random) {
    const int = (min, max) => min + Math.floor(rng() * (max - min + 1));
    const pick = values => values[int(0, values.length - 1)];
    const high = level === "stretch" ? 18 : 9;
    function make(key, i) {
        let a = int(2, high), b = int(2, high);
        const q = (prompt, answer, hint, explanation, unit = "", kind = "number") => ({ id: `q${i}`, prompt, answer: String(answer), hint, explanation, unit, kind });
        switch (key) {
            case "place-value": {
                if (i % 2) return q(`${a * 103} + ${b * 21} = ?`, a * 103 + b * 21, "Line up the place values. Add from right to left.", `${a * 103} + ${b * 21} = ${a * 103 + b * 21}.`);
                const digit = int(1, 9), number = a * 10000 + digit * 1000 + b * 10;
                return q(`What is the value of the thousands digit in ${number.toLocaleString("en-CA")}?`, digit * 1000, "Find the fourth digit from the right.", `The thousands digit is ${digit}. Its value is ${digit} × 1,000 = ${digit * 1000}.`);
            }
            case "factors": {
                const n = pick(level === "stretch" ? [48, 60, 72, 84, 90, 120] : [12, 18, 20, 24, 30, 36]);
                if (i % 2) { const p = pick([2, 3, 7, 11, 13, 17, 19, 4, 9, 15, 21, 25]); const prime = primeFactors(p).length === 1; return q(`Is ${p} prime or composite?`, prime ? "prime" : "composite", "Try divisors from 2 upward. Does any divide it exactly?", prime ? `${p} has exactly two positive factors: 1 and ${p}.` : `${p} = ${primeFactors(p).join(" × ")}. It has more than two factors.`, "Type prime or composite", "text"); }
                return q(`Write ${n} as a product of prime factors.`, primeFactors(n).join(" × "), "Split the number into two factors. Keep splitting until all factors are prime.", `${n} = ${primeFactors(n).join(" × ")}.`, "Use × or * between factors", "factors");
            }
            case "powers": return i % 2 ? q(`What is the square root of ${a * a}?`, a, "Which positive number multiplied by itself gives this value?", `${a} × ${a} = ${a * a}, so √${a * a} = ${a}.`) : q(`Calculate ${a}².`, a * a, "Multiply the base by itself.", `${a}² = ${a} × ${a} = ${a * a}.`);
            case "fractions": { const d = int(3, high + 2), n = int(1, d - 1), scale = int(2, 5); return i % 2 ? q(`Write ${n * scale}/${d * scale} as a fraction in lowest terms.`, fraction(n, d), "Divide the numerator and denominator by their greatest common factor.", `${n * scale}/${d * scale} = ${fraction(n, d)}.`, "Fraction in lowest terms", "fraction-simplified") : q(`Complete the equivalent fraction: ${n}/${d} = ?/${d * scale}.`, n * scale, "Multiply the numerator by the same factor as the denominator.", `The denominator was multiplied by ${scale}. ${n} × ${scale} = ${n * scale}.`); }
            case "fraction-operations": { const d = int(2, high), e = int(2, high); const mode = i % 4; const op = ["+", "−", "×", "÷"][mode]; const numerator = [d + e, Math.abs(e - d), 1, e][mode]; const denominator = [d * e, d * e, d * e, d][mode]; const first = mode === 1 ? Math.min(d, e) : d, second = mode === 1 ? Math.max(d, e) : e; const answer = fraction(numerator, denominator); return q(`1/${first} ${op} 1/${second} = ?`, answer, mode < 2 ? "Use a common denominator before combining the numerators." : mode === 2 ? "Multiply the numerators. Then multiply the denominators." : "Multiply the first fraction by the reciprocal of the second.", `1/${first} ${op} 1/${second} = ${answer}.`, "Fraction or exact decimal"); }
            case "decimals": { const x = a * 100 + int(1, 99), y = b * 10 + int(1, 9); return q(`${(x / 100).toFixed(2)} + ${(y / 100).toFixed(2)} = ?`, ((x + y) / 100).toFixed(2), "Line up the decimal points. Add hundredths, tenths, then whole numbers.", `${x} hundredths + ${y} hundredths = ${x + y} hundredths.`); }
            case "percents": { const percent = pick([10, 20, 25, 50, 75]), whole = a * 20; return q(`What is ${percent}% of ${whole}?`, percent * whole / 100, "Write the percent as a fraction over 100. Multiply by the whole.", `${percent}/100 × ${whole} = ${percent * whole / 100}.`); }
            case "integers": return q(`Start at −${a}. Move ${b} places to the right. Where do you stop?`, b - a, "Moving right adds to the starting value.", `−${a} + ${b} = ${b - a}.`);
            case "measurement": { const conversion = pick([["m", "cm", 100], ["kg", "g", 1000], ["L", "mL", 1000]]); const value = a / 2; return q(`Convert ${value} ${conversion[0]} to ${conversion[1]}.`, value * conversion[2], `Multiply by ${conversion[2]}.`, `${value} × ${conversion[2]} = ${value * conversion[2]} ${conversion[1]}.`, conversion[1]); }
            case "area": return i % 2 ? q(`A triangle has a base of ${a * 2} cm and a perpendicular height of ${b} cm. Find its area.`, a * b, "Multiply the base by the height. Divide by 2.", `${a * 2} × ${b} ÷ 2 = ${a * b} cm².`, "cm²") : q(`A rectangle is ${a} cm long and ${b} cm wide. Find its area.`, a * b, "Area = length × width.", `${a} × ${b} = ${a * b} cm².`, "cm²");
            case "angles": { if (i % 2) { const sides = pick([[3, "triangle"], [4, "quadrilateral"], [5, "pentagon"], [6, "hexagon"], [8, "octagon"]]); return q(`How many sides does a ${sides[1]} have?`, sides[0], "Sketch the named polygon and count its sides.", `A ${sides[1]} has ${sides[0]} sides.`); } const x = int(3, 7) * 10, y = int(3, 7) * 10; return q(`A triangle has angles of ${x}° and ${y}°. Find the third angle.`, 180 - x - y, "The three angles total 180°.", `180 − ${x} − ${y} = ${180 - x - y}°.`, "degrees"); }
            case "solids": { const c = int(2, high); return q(`Find the surface area of a box ${a} cm × ${b} cm × ${c} cm.`, 2 * (a * b + a * c + b * c), "Find the areas of three different faces. Add them and double the result.", `2 × (${a} × ${b} + ${a} × ${c} + ${b} × ${c}) = ${2 * (a * b + a * c + b * c)} cm².`, "cm²"); }
            case "transformations": return i % 2 ? q(`Reflect (${a}, ${b}) across the y-axis. What is the new x-coordinate?`, -a, "The x-coordinate changes sign across the y-axis.", `(${a}, ${b}) becomes (−${a}, ${b}).`) : q(`Translate (${a}, ${b}) ${b} units right. What is the new x-coordinate?`, a + b, "Add the horizontal movement to the x-coordinate.", `${a} + ${b} = ${a + b}. The y-coordinate stays ${b}.`);
            case "data": { const values = [a, a + 2, a + 4, a + 6, a + 8]; return i % 2 ? q(`Find the range: ${values.join(", ")}.`, 8, "Subtract the smallest value from the largest.", `${a + 8} − ${a} = 8.`) : q(`Find the mean: ${values.join(", ")}.`, a + 4, "Add the five values. Divide the sum by 5.", `${5 * (a + 4)} ÷ 5 = ${a + 4}.`); }
            case "algebra": return q(`Solve ${a}x + ${b} = ${a * (b + 1) + b}.`, b + 1, `Subtract ${b} from both sides. Then divide by ${a}.`, `${a}x = ${a * (b + 1)}. So x = ${b + 1}.`);
            case "probability": return q(`A bag has ${a} red and ${b} blue counters. What is the probability of drawing red?`, fraction(a, a + b), "Use red counters divided by all counters.", `${a} out of ${a + b} counters are red: ${fraction(a, a + b)}.`, "Fraction or exact decimal");
            case "coding": return q(`Set total = ${a}. Repeat ${b} times: add 3 to total. What is the final total?`, a + 3 * b, "Work through the loop or multiply the repeated increase.", `${a} + (${b} × 3) = ${a + 3 * b}.`);
            case "economy": return q(`You earn $${a * 10} in classroom money. You spend $${b} and $${a}. How much remains?`, a * 10 - b - a, "Add the expenses. Subtract that sum from the income.", `${a * 10} − (${b} + ${a}) = $${a * 10 - b - a}.`, "dollars");
            default: throw new Error(`Unknown practice topic: ${key}`);
        }
    }
    const reviewKeys = ["fractions", "percents", "area", "algebra", "data", "probability"];
    return { id: globalThis.crypto?.randomUUID?.() || `round-${Date.now()}-${Math.random()}`, topicId: topic.id, key: topic.practice, level, createdAt: new Date().toISOString(), questions: Array.from({ length: 6 }, (_, i) => make(topic.practice === "review" ? reviewKeys[i] : topic.practice, i)), answers: {}, results: {}, attempts: {}, hints: {}, completedAt: null };
}
export function checkRound(round) {
    for (const question of round.questions) {
        if (round.results[question.id]?.correct) continue;
        const value = round.answers[question.id] || "";
        if (String(value).trim()) round.attempts[question.id] = (round.attempts[question.id] || 0) + 1;
        round.results[question.id] = { correct: checkPracticeAnswer(value, question), answer: value };
    }
    const complete = round.questions.every(q => round.results[q.id]?.correct);
    if (complete && !round.completedAt) round.completedAt = new Date().toISOString();
    return complete;
}
