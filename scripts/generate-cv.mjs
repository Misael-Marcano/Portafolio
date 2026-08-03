/**
 * Genera public/cv/Misael-Marcano-CV.pdf desde la plantilla HTML (Tokyo Night).
 * Uso: npm run cv:generate
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const root = process.cwd();
const htmlPath = path.join(root, "scripts", "cv-template.html");
const outPath = path.join(root, "public", "cv", "Misael-Marcano-CV.pdf");

if (!fs.existsSync(htmlPath)) {
  console.error("No existe scripts/cv-template.html");
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  // Esperar fuentes de Google
  await page.evaluateHandle("document.fonts.ready");

  await page.pdf({
    path: outPath,
    format: "Letter",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
  });

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`CV generado: ${outPath} (${kb} KB)`);
} finally {
  await browser.close();
}
