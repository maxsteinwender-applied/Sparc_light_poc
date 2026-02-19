import { defineConfig, devices } from "@playwright/test"

const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  timeout: 30_000,
  workers: isCI ? 1 : undefined,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !isCI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
