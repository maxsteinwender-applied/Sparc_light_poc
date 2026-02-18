# Security Headers Configuration

Protect against XSS, Clickjacking, MIME sniffing, and other common web attacks.

## Setup

Add security headers in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  routeRules: {
    "/**": {
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "origin-when-cross-origin",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    },
  },
});
```

## What Each Header Does

| Header | Protection |
|--------|-----------|
| X-Frame-Options: DENY | Prevents your site from being embedded in iframes (clickjacking) |
| X-Content-Type-Options: nosniff | Prevents browsers from guessing content types (MIME sniffing) |
| Referrer-Policy | Controls how much URL info is sent to other sites |
| Strict-Transport-Security | Forces HTTPS connections |

## Verify After Deployment
1. Open Chrome DevTools
2. Go to Network tab
3. Click on any request to your site
4. Check Response Headers section
5. Verify all 4 headers are present

## Advanced (Optional)
**Content-Security-Policy (CSP)** - Powerful but easy to misconfigure. Roll out in report-only mode first:
```
Content-Security-Policy-Report-Only: default-src 'self'
```
