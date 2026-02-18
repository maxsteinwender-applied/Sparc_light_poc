# Performance Monitoring

## Lighthouse Check (after every deployment)

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select: Performance, Accessibility, Best Practices, SEO
4. Generate report for both Mobile and Desktop
5. Target score: > 90 in all categories

## Common Performance Issues

### Unoptimized Images
Use Nuxt image optimization (`@nuxt/image`) where needed and avoid oversized assets.

### Large JavaScript Bundle
Use lazy-loading for heavy components:
```vue
<script setup lang="ts">
const HeavyChart = defineAsyncComponent(() => import("~/components/HeavyChart.vue"));
</script>
```

### Missing Loading States
Always show feedback during async fetches.

### No Caching Strategy
Use Nitro caching and route rules for expensive endpoints.

## Quick Wins Checklist
- [ ] Images are optimized and sized correctly
- [ ] Heavy components are lazy-loaded
- [ ] Loading states are visible
- [ ] No unnecessary client-only plugins
- [ ] Route rules and caching are configured for expensive paths

## Automated Monitoring
- Deployment platform analytics (Core Web Vitals)
- Error tracking dashboard (Sentry or equivalent)
