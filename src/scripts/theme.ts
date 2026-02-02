type Theme = "light" | "dark";

const getTheme = (): Theme => {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme) => {
  // ✅ CLAVE: Tailwind darkMode:"class" se basa en <html>
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);

  // ✅ DEBUG (para ver si se está aplicando o si otra cosa lo quita)
  console.log("[theme] applyTheme:", theme, "html has dark:", document.documentElement.classList.contains("dark"));
};

const initTheme = () => {
  applyTheme(getTheme());
};

// Inicializa al cargar
initTheme();

// Expone un único toggle global (si alguien lo pisa, lo verás)
(window as any).toggleTheme = () => {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
  console.log("[theme] toggled ->", document.documentElement.className);
};

// Opcional: por si alguien te cambia theme desde otro lado
window.addEventListener("storage", (e) => {
  if (e.key === "theme") initTheme();
});
