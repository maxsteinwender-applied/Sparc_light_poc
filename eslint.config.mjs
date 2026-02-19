export default [
  {
    ignores: [
      ".nuxt/**",
      ".output/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
    ],
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    rules: {
      semi: ["error", "never"],
    },
  },
]
