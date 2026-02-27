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
    extend: {
      fontFamily: {
        sans: ['DekaFrutiger', 'Segoe UI', 'Arial', 'sans-serif'],
        heading: ['DekaFrutiger', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['DekaFrutiger', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
