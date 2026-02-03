type Lang = "es" | "en";
const getLang = (): Lang => (localStorage.getItem("language") === "en" ? "en" : "es");

const loadDict = async (lang: Lang) => {
  const mod = await import(`../i18n/${lang}.json`);
  return mod.default as Record<string, string>;
};

const applyTextI18n = (dict: Record<string, string>) => {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = dict[key];
    if (value) el.textContent = value;
  });
};

// ✅ Nuevo: i18n para atributos
// Uso:
//   data-i18n-attr="alt"
//   data-i18n-alt="proj_1_alt"
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

applyI18n();
