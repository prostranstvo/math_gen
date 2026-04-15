import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

test("index.html uses GitHub Pages-safe relative asset paths", async () => {
    const html = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");

    assert(html.includes('href="./styles.css"'));
    assert(html.includes('src="./js/app.js"'));
    assert(!html.includes('href="/styles.css"'));
    assert(!html.includes('src="/js/app.js"'));
});

test(".nojekyll is present at the project root", async () => {
    const stats = await fs.stat(path.join(projectRoot, ".nojekyll"));
    assert.equal(stats.isFile(), true);
});
