import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app.vue",
    "./pages/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./utils/**/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
