type Lang = "es" | "en";
const getLang = (): Lang => (localStorage.getItem("language") === "en" ? "en" : "es");

const loadDict = async (lang: Lang) => {
  const mod = await import(`../i18n/${lang}.json`);
  return mod.default as Record<string, string>;
};

const applyI18n = async (lang?: Lang) => {
  const l = lang ?? getLang();
  document.documentElement.lang = l;

  const dict = await loadDict(l);

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = dict[key];
    if (value) el.textContent = value;
  });
};

window.addEventListener("languageChange", (e: any) => {
  const l: Lang = e?.detail?.language === "en" ? "en" : "es";
  applyI18n(l);
});

applyI18n();
