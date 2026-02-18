# Error Tracking Setup (Sentry)

Track production errors automatically so you know about issues before users report them.

## Setup (Nuxt)

### 1. Create Sentry Account
- Go to [sentry.io](https://sentry.io) (free tier available for small apps)
- Create a new project and select "Nuxt"

### 2. Install Nuxt Integration
```bash
npm install @sentry/nuxt
```

Then register module in `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  modules: ["@sentry/nuxt"],
});
```

### 3. Add Environment Variables
Add to `.env.local` and deployment provider settings:
```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### 4. Verify Setup
Trigger a test error and confirm it appears in Sentry dashboard.

## What You Get
- Automatic error capture (client + server)
- Stack traces with source maps
- Error grouping and deduplication
- Alerts for new error classes

## Alternative
Use deployment platform monitoring if you prefer lower setup overhead.
