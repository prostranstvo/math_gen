import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const DEFAULT_INPUT_DIR = path.resolve(process.cwd(), "../homework files PDF");
const DEFAULT_OUTPUT_FILE = path.resolve(process.cwd(), "data/swansea-weeks.import.json");

function clonePattern(pattern) {
    return new RegExp(pattern.source, pattern.flags.replaceAll("g", ""));
}

function normalizeWhitespace(text) {
    return text
        .replace(/\r/g, "")
        .replace(/\u200b/g, "")
        .replace(/\u00a0/g, " ")
        .replace(/[‐‑‒–—]/g, "-")
        .replace(/\u2022/g, " ")
        .replace(/\f/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function cleanInlineText(text) {
    return normalizeWhitespace(text || "")
        .replace(/\s+/g, " ")
        .replace(/\s([,.;:!?])/g, "$1")
        .trim();
}

function findSection(text, startPattern, endPatterns = []) {
    const startMatch = clonePattern(startPattern).exec(text);

    if (!startMatch) {
        return "";
    }

    const startIndex = startMatch.index + startMatch[0].length;
    const remainder = text.slice(startIndex);
    let endIndex = remainder.length;

    endPatterns.forEach((pattern) => {
        const endMatch = clonePattern(pattern).exec(remainder);
        if (endMatch && endMatch.index < endIndex) {
            endIndex = endMatch.index;
        }
    });

    return remainder.slice(0, endIndex).trim();
}

function extractField(block, label, stopLabels = []) {
    if (!block) {
        return "";
    }

    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const stopPattern = stopLabels.length > 0
        ? `(?=\\n\\s*(?:${stopLabels.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):|\\n\\s*WEEK\\s+\\d+|$)`
        : "(?=\\n\\s*WEEK\\s+\\d+|$)";
    const matcher = new RegExp(`${escapedLabel}:\\s*([\\s\\S]*?)${stopPattern}`, "i");
    const match = matcher.exec(block);

    return match ? cleanInlineText(match[1]) : "";
}

function extractWeekId(text) {
    const match = /WEEK\s+(\d+)/i.exec(text);
    return match ? match[1] : "";
}

function extractWords(text, weekId) {
    if (!weekId) {
        return [];
    }

    const block = findSection(text, new RegExp(`(?:^|\\n)\\s*WEEK\\s+${weekId}\\b\\s*`, "i"), [
        /\n\s*MATH\s*:?\s*/i
    ]);

    return (block.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’.-]*/g) || []).map((word) => word.trim());
}

function extractDate(text, filePath) {
    const textMatch = /Weekly Update\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i.exec(text);
    if (textMatch) {
        return cleanInlineText(textMatch[1]);
    }

    const fileMatch = /Weekly Update\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i.exec(path.basename(filePath));
    return fileMatch ? cleanInlineText(fileMatch[1]) : "";
}

function inferWritingTopic(composition) {
    const candidates = [
        [/informational report/i, "Informational Report"],
        [/poetry/i, "Poetry"],
        [/comic strip/i, "Comic Strip"],
        [/black canadian of significance/i, "Black History Presentation"],
        [/letter writing/i, "Letter Writing"],
        [/persuasive/i, "Persuasive Writing"],
        [/narrative/i, "Narrative Writing"],
        [/presentation/i, "Weekly Presentation"]
    ];

    const matched = candidates.find(([pattern]) => pattern.test(composition));
    return matched ? matched[1] : "Weekly Composition";
}

function extractTopicFromText(text, fallbackLabel) {
    if (!text) {
        return fallbackLabel;
    }

    const colonMatch = /^([A-Za-z&/,' -]{3,60}?):/i.exec(text);
    if (colonMatch) {
        return cleanInlineText(colonMatch[1]);
    }

    const sentenceMatch = /^([A-Za-z&/,' -]{3,60}?)[.:]/i.exec(text);
    if (sentenceMatch) {
        return cleanInlineText(sentenceMatch[1]);
    }

    return fallbackLabel;
}

function inferMathTopic(mathText) {
    const candidates = [
        [/financial literacy/i, "Financial Literacy"],
        [/perimeter|area/i, "Perimeter and Area"],
        [/algebra/i, "Algebra"],
        [/decimal/i, "Decimal Operations"],
        [/measurement/i, "Measurement"],
        [/pattern/i, "Patterning"],
        [/estimation/i, "Estimation"],
        [/subtraction/i, "Subtraction Strategies"],
        [/metric/i, "Metric Conversions"],
        [/division/i, "Division"],
        [/multiplication/i, "Multiplication"],
        [/minute math|fact/i, "Minute Math"]
    ];

    const matched = candidates.find(([pattern]) => pattern.test(mathText));
    return matched ? matched[1] : extractTopicFromText(mathText, "Weekly Math");
}

function inferScienceTopic(scienceText, socialStudiesText) {
    if (scienceText) {
        return extractTopicFromText(scienceText, "Weekly Science");
    }

    if (socialStudiesText) {
        return extractTopicFromText(socialStudiesText, "Weekly Review");
    }

    return "Weekly Review";
}

function buildReviewPrompt(topic) {
    if (!topic || /^weekly /i.test(topic)) {
        return "Write or draw 3 things you learned this week.";
    }

    return `Write or draw 3 things you learned about ${topic.toLowerCase()} this week.`;
}

export function parseWeeklyUpdateText(text, filePath = "") {
    const normalizedText = normalizeWhitespace(text);
    const languageBlock = findSection(normalizedText, /\n\s*LANGUAGE:\s*/i, [
        /\n\s*MATH\s*:?\s*/i
    ]);
    const mathBlock = findSection(normalizedText, /\n\s*MATH\s*:?\s*/i, [
        /\n\s*SCIENCE\s*:?\s*/i
    ]);
    const scienceBlock = findSection(normalizedText, /\n\s*SCIENCE\s*:?\s*/i, [
        /\n\s*SOCIAL STUDIES\s*:?\s*/i,
        /\n\s*FRENCH\s*:?\s*/i
    ]);
    const socialStudiesBlock = findSection(normalizedText, /\n\s*SOCIAL STUDIES\s*:?\s*/i, [
        /\n\s*FRENCH\s*:?\s*/i
    ]);

    const composition = extractField(languageBlock, "Composition", ["Reading", "Foundations"]);
    const foundations = extractField(languageBlock, "Foundations", ["Composition", "Reading"]);
    const reading = extractField(languageBlock, "Reading", ["Composition", "Foundations"]);
    const weekId = extractWeekId(normalizedText);
    const date = extractDate(normalizedText, filePath);
    const spelling = extractWords(normalizedText, weekId);
    const mathText = cleanInlineText(mathBlock.replace(/^[^A-Za-z]+/, ""));
    const scienceText = cleanInlineText(scienceBlock.replace(/^[^A-Za-z]+/, ""));
    const socialStudiesText = cleanInlineText(socialStudiesBlock.replace(/^[^A-Za-z]+/, ""));
    const scienceTopic = inferScienceTopic(scienceText, socialStudiesText);

    return {
        weekId,
        date,
        spelling,
        grammar: foundations,
        writingTopic: inferWritingTopic(composition),
        writingPrompt: composition,
        mathTopic: inferMathTopic(mathText),
        scienceTopic,
        reviewPrompt: buildReviewPrompt(scienceTopic),
        sourceFile: path.basename(filePath),
        source: {
            reading,
            math: mathText,
            science: scienceText,
            socialStudies: socialStudiesText
        }
    };
}

export function extractPdfText(filePath) {
    const output = execFileSync("pdftotext", ["-layout", filePath, "-"], { encoding: "utf8" });
    return normalizeWhitespace(output);
}

export function importWeeklyUpdates(inputDirectory) {
    const files = fs.readdirSync(inputDirectory)
        .filter((fileName) => fileName.toLowerCase().endsWith(".pdf"))
        .sort((left, right) => left.localeCompare(right));

    const parsedWeeks = [];
    const skippedFiles = [];
    const weeks = {};

    files.forEach((fileName) => {
        const filePath = path.join(inputDirectory, fileName);
        const text = extractPdfText(filePath);
        const parsed = parseWeeklyUpdateText(text, filePath);

        if (!parsed.weekId) {
            skippedFiles.push({
                sourceFile: fileName,
                date: parsed.date || "",
                reason: "No WEEK number was found in the PDF text."
            });
            return;
        }

        parsedWeeks.push(parsed);
    });

    parsedWeeks
        .sort((left, right) => Number(left.weekId) - Number(right.weekId))
        .forEach((parsed) => {
            weeks[parsed.weekId] = parsed;
        });

    const weekOrder = Object.keys(weeks).sort((left, right) => Number(left) - Number(right));

    return {
        generatedAt: new Date().toISOString(),
        sourceDirectory: inputDirectory,
        weekOrder,
        weeks,
        skippedFiles
    };
}

export function writeImportedWeeks(outputFile, data) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`);
}

function runCli() {
    const inputDirectory = path.resolve(process.cwd(), process.argv[2] || DEFAULT_INPUT_DIR);
    const outputFile = path.resolve(process.cwd(), process.argv[3] || DEFAULT_OUTPUT_FILE);
    const imported = importWeeklyUpdates(inputDirectory);
    writeImportedWeeks(outputFile, imported);
    console.log(`Imported ${imported.weekOrder.length} weekly PDFs into ${path.relative(process.cwd(), outputFile)}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    runCli();
}
