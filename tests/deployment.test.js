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

test("index.html includes share-preview metadata and icon assets", async () => {
    const html = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");

    assert(html.includes('rel="icon" type="image/svg+xml" href="./assets/favicon.svg"'));
    assert(html.includes('rel="icon" type="image/png" sizes="256x256" href="./assets/favicon.png"'));
    assert(html.includes('rel="apple-touch-icon" href="./assets/favicon.png"'));
    assert(html.includes('property="og:image" content="https://prostranstvo.github.io/math_gen/assets/share-preview.png"'));
    assert(html.includes('name="twitter:card" content="summary_large_image"'));
    assert(html.includes('property="og:title" content="Math Gen | Pick today\'s sheet"'));
});

test(".nojekyll is present at the project root", async () => {
    const stats = await fs.stat(path.join(projectRoot, ".nojekyll"));
    assert.equal(stats.isFile(), true);
});

test("share-preview asset files are present", async () => {
    const faviconStats = await fs.stat(path.join(projectRoot, "assets", "favicon.svg"));
    const faviconPngStats = await fs.stat(path.join(projectRoot, "assets", "favicon.png"));
    const sharePreviewStats = await fs.stat(path.join(projectRoot, "assets", "share-preview.png"));

    assert.equal(faviconStats.isFile(), true);
    assert.equal(faviconPngStats.isFile(), true);
    assert.equal(sharePreviewStats.isFile(), true);
});

test("styles.css keeps compatibility fallbacks for older mobile browsers", async () => {
    const css = await fs.readFile(path.join(projectRoot, "styles.css"), "utf8");

    assert(css.includes("--bg: #f7f8fb;"));
    assert(css.includes("@supports (color: oklch(0.5 0 0))"));
    assert(css.includes("@supports not (background: color-mix(in srgb, black 50%, white))"));
});
