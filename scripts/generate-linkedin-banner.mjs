import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const root = process.cwd();
const htmlPath = path.join(root, "scripts", "linkedin-banner.html");
const outDir = path.join(root, "public", "linkedin");
const outPath = path.join(outDir, "linkedin-banner.png");

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await page.evaluateHandle("document.fonts.ready");
  await page.screenshot({
    path: outPath,
    type: "png",
    clip: { x: 0, y: 0, width: 1584, height: 396 },
  });
  console.log(`Banner LinkedIn: ${outPath} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
} finally {
  await browser.close();
}
