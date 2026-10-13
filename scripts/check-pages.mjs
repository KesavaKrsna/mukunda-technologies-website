/**
 * Puppeteer + axe-core across the 8 public pages at 6 widths.
 * Usage: node scripts/check-pages.mjs [baseUrl]
 * Expects a static server rooted at public/ (clean URLs are not required).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axeSource = require("axe-core").source;

const base = process.argv[2] || "http://127.0.0.1:8000";
const pages = ["/", "/about.html", "/solutions.html", "/products.html", "/contact.html", "/privacy.html", "/terms.html", "/404.html"];
const widths = [360, 375, 414, 768, 1024, 1280];
const chrome = process.env.CHROME_PATH || "/usr/bin/google-chrome-stable";
const shotDir = "/tmp/mukunda-qa";

const failures = [];
function fail(message) {
  failures.push(message);
  console.error("FAIL " + message);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
});

async function prepare(page) {
  const failed = [];
  const httpErrors = [];
  page.on("requestfailed", (request) => {
    failed.push(request.url() + " " + (request.failure() && request.failure().errorText));
  });
  page.on("response", (response) => {
    const status = response.status();
    const url = response.url();
    if (status >= 400 && url.startsWith(base)) httpErrors.push(status + " " + url);
  });
  return { failed, httpErrors };
}

async function open(page, path) {
  const response = await page.goto(base + path, { waitUntil: "networkidle0", timeout: 30000 });
  if (!response || response.status() >= 400) fail(path + " document status " + (response && response.status()));
  await page.evaluate(axeSource);
}

for (const width of widths) {
  const height = width < 700 ? 740 : 800;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const net = await prepare(page);
  for (const path of pages) {
    net.failed.length = 0;
    net.httpErrors.length = 0;
    await open(page, path);
    const layout = await page.evaluate(() => {
      const doc = document.documentElement;
      const imgs = Array.from(document.images).map((img) => ({
        alt: img.getAttribute("alt"),
        w: img.getAttribute("width"),
        h: img.getAttribute("height"),
        src: img.currentSrc || img.src,
        nw: img.naturalWidth,
        broken: img.complete && img.naturalWidth === 0
      }));
      const inlineStyle = document.querySelectorAll("[style]").length;
      const inlineScript = Array.from(document.scripts).filter((script) => {
        if (script.src) return false;
        const type = (script.getAttribute("type") || "").toLowerCase();
        return type !== "application/ld+json";
      }).length;
      return {
        overflow: doc.scrollWidth - doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        imgs,
        inlineStyle,
        inlineScript
      };
    });
    if (layout.overflow > 1) fail(path + " @" + width + " horizontal overflow " + layout.overflow + "px (" + layout.scrollWidth + "/" + layout.clientWidth + ")");
    if (layout.inlineStyle) fail(path + " has inline style attributes");
    if (layout.inlineScript) fail(path + " has inline scripts");
    for (const img of layout.imgs) {
      if (img.alt === null) fail(path + " @" + width + " image missing alt: " + img.src);
      if (!img.w || !img.h) fail(path + " @" + width + " image missing width/height: " + img.src);
      if (img.broken) fail(path + " @" + width + " image failed to decode: " + img.src);
    }
    const axe = await page.evaluate(async () => {
      const results = await window.axe.run(document, { resultTypes: ["violations"] });
      return results.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        nodes: item.nodes.length,
        target: item.nodes[0] && item.nodes[0].target
      }));
    });
    for (const item of axe) fail(path + " @" + width + " axe " + item.id + " (" + item.impact + ", " + item.nodes + ") " + JSON.stringify(item.target));
    if (net.failed.length) fail(path + " @" + width + " failed requests: " + net.failed.join(" | "));
    if (net.httpErrors.length) fail(path + " @" + width + " HTTP errors: " + net.httpErrors.join(" | "));
    console.log("ok " + path + " @" + width);
  }

  if (width <= 1024) {
    await open(page, "/");
    await page.focus(".menu-toggle");
    await page.keyboard.press("Enter");
    const opened = await page.$eval(".menu-toggle", (el) => el.getAttribute("aria-expanded"));
    const menuOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (opened !== "true") fail("menu did not open at " + width);
    if (menuOverflow > 1) fail("open menu horizontal overflow at " + width);
    await page.keyboard.press("Escape");
    const closed = await page.evaluate(() => ({
      expanded: document.querySelector(".menu-toggle").getAttribute("aria-expanded"),
      focused: document.activeElement.classList.contains("menu-toggle")
    }));
    if (closed.expanded !== "false") fail("Escape did not close the menu at " + width);
    if (!closed.focused) fail("Escape did not return focus to the menu button at " + width);
    console.log("ok menu @" + width);
  }
  await page.close();
}

const shotPage = await browser.newPage();
await mkdir(shotDir, { recursive: true });
const shots = [
  ["home-1280", "/", 1280, 800],
  ["home-375", "/", 375, 740],
  ["home-products-1280", "/#products", 1280, 800],
  ["products-1280", "/products.html", 1280, 900],
  ["products-375", "/products.html", 375, 740],
  ["about-1280", "/about.html", 1280, 900],
  ["about-375", "/about.html", 375, 740]
];
for (const [name, path, width, height] of shots) {
  await shotPage.setViewport({ width, height, deviceScaleFactor: 1 });
  await shotPage.goto(base + path, { waitUntil: "networkidle0", timeout: 30000 });
  if (path.includes("#products")) {
    await shotPage.evaluate(() => document.getElementById("products").scrollIntoView());
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (name.startsWith("about")) {
    await shotPage.evaluate(() => document.querySelector(".about-visual").scrollIntoView({ block: "center" }));
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  const file = shotDir + "/" + name + ".png";
  await shotPage.screenshot({ path: file, fullPage: name.endsWith("375") || name.startsWith("products") || name.startsWith("about") });
  console.log("shot " + file);
}
await shotPage.setViewport({ width: 375, height: 740, deviceScaleFactor: 1 });
await shotPage.goto(base + "/", { waitUntil: "networkidle0" });
await shotPage.click(".menu-toggle");
await shotPage.screenshot({ path: shotDir + "/menu-375.png" });
console.log("shot " + shotDir + "/menu-375.png");
await shotPage.close();

const plain = await browser.newPage();
await plain.setJavaScriptEnabled(false);
await plain.setViewport({ width: 1280, height: 800 });
for (const path of ["/", "/products.html"]) {
  await plain.goto(base + path, { waitUntil: "networkidle0", timeout: 30000 });
  const cards = await plain.$$eval(".product-card", (nodes) => nodes.map((node) => node.querySelector(".product-name").textContent.trim()));
  const photos = await plain.$$eval(".product-visual .slot-photo", (nodes) => nodes.map((node) => node.getAttribute("alt")));
  if (cards.length !== 4) fail(path + " JS off expected 4 product cards, got " + cards.join(", "));
  if (photos.length !== 4 || photos.some((alt) => !alt)) fail(path + " JS off product photos missing alt");
  console.log("ok JS off " + path + " " + cards.join(", "));
}
await plain.close();
await browser.close();

const summary = { failures: failures.length, items: failures };
await writeFile(shotDir + "/summary.json", JSON.stringify(summary, null, 2));
if (failures.length) {
  console.error(failures.length + " failure(s)");
  process.exit(1);
}
console.log("all checks passed");
