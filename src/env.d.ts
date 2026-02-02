export {};

declare global {
  interface Window {
    toggleTheme: () => void;
    changeLanguage: (lang: "es" | "en") => void;
  }
}
