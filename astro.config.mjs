// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  site: "https://github.com/Misael-Marcano/Portafolio",
  base: "/Portafolio",
});
