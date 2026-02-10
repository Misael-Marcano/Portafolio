// i18n.ts
import es from "../i18n/es.json";
import en from "../i18n/en.json";

type Lang = "es" | "en";

const getLang = (): Lang =>
  localStorage.getItem("language") === "en" ? "en" : "es";

// ✅ En lugar de import.meta.glob, usa un objeto directo
const DICTS: Record<Lang, Record<string, string>> = {
  es,
  en,
};

const loadDict = async (lang: Lang) => {
  const dict = DICTS[lang];
  
  if (!dict) {
    console.warn(`[i18n] No se encontró diccionario: ${lang}`);
    return {};
  }

  return dict;
};

const applyTextI18n = (dict: Record<string, string>) => {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;

    const value = dict[key];
    if (value) el.textContent = value;
  });
};

const applyAttrI18n = (dict: Record<string, string>) => {
  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const attr = el.getAttribute("data-i18n-attr");
    if (!attr) return;

    const key = el.getAttribute(`data-i18n-${attr}`);
    if (!key) return;

    const value = dict[key];
    if (value) el.setAttribute(attr, value);
  });
};

const applyI18n = async (lang?: Lang) => {
  const l = lang ?? getLang();
  document.documentElement.lang = l;

  const dict = await loadDict(l);
  applyTextI18n(dict);
  applyAttrI18n(dict);
};

window.addEventListener("languageChange", (e: any) => {
  const l: Lang = e?.detail?.language === "en" ? "en" : "es";
  applyI18n(l);
});

const boot = () => applyI18n();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

document.addEventListener("astro:page-load", boot);
document.addEventListener("astro:after-swap", boot);