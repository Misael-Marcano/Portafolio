type Lang = "es" | "en";

const getLang = (): Lang =>
  localStorage.getItem("language") === "en" ? "en" : "es";

/**
 * ✅ Production-safe en Astro/Vite:
 * Incluye los JSON en el build aunque cargues por idioma.
 */
const DICTS = import.meta.glob("../i18n/*.json", { import: "default" });

const loadDict = async (lang: Lang) => {
  const key = `../i18n/${lang}.json`;
  const loader = DICTS[key];

  if (!loader) {
    console.warn(`[i18n] No se encontró diccionario: ${key}`);
    return {};
  }

  return (await loader()) as Record<string, string>;
};

const applyTextI18n = (dict: Record<string, string>) => {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;

    const value = dict[key];
    if (value) el.textContent = value;
  });
};

// ✅ i18n para atributos: data-i18n-attr="alt" + data-i18n-alt="key"
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

// Evento: window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: "en" }}))
window.addEventListener("languageChange", (e: any) => {
  const l: Lang = e?.detail?.language === "en" ? "en" : "es";
  applyI18n(l);
});

const boot = () => applyI18n();

// Primera carga
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

// ✅ si Astro hace swaps / view transitions
document.addEventListener("astro:page-load", boot);
document.addEventListener("astro:after-swap", boot);
