# Progressive Web App (PWA) Patterns

## When to Use
- Apps requiring offline support
- Installable mobile web apps
- Push notification scenarios

## Vite PWA Plugin

### Setup
```bash
npm install vite-plugin-pwa -D
```

### Configuration
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'My App',
        short_name: 'App',
        description: 'My Progressive Web App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
        ],
      },
    }),
  ],
});
```

## Caching Strategies

| Strategy | Use Case |
|----------|----------|
| `CacheFirst` | Static assets (images, fonts) |
| `NetworkFirst` | API data (latest data preferred) |
| `StaleWhileRevalidate` | Infrequently changing data |
| `NetworkOnly` | Real-time data |
| `CacheOnly` | App shell |

## Update Notification

```typescript
import { useRegisterSW } from 'virtual:pwa-register/react';

function App() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <>
      {needRefresh && (
        <div role="alert">
          <p>A new version is available.</p>
          <button onClick={() => updateServiceWorker(true)}>Update</button>
          <button onClick={() => setNeedRefresh(false)}>Dismiss</button>
        </div>
      )}
    </>
  );
}
```

## Offline Support

### Offline Page
```typescript
// vite.config.ts
VitePWA({
  workbox: {
    navigateFallback: '/offline.html',
    navigateFallbackDenylist: [/^\/api/],
  },
})
```

### Online/Offline Detection
```typescript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

## Best Practices

### DO:
- Use App Shell pattern (cache UI skeleton)
- Define clear caching strategy for API responses
- Provide service worker update notifications
- Pass Lighthouse PWA audit

### DON'T:
- Cache sensitive data (tokens, personal info)
- Over-cache (consider disk space)
- Use synchronous operations in service worker
- Use skipWaiting() indiscriminately

## Testing
```bash
# Lighthouse PWA audit
npx lighthouse http://localhost:3000 --only-categories=pwa

# Service Worker debugging
# Chrome DevTools > Application > Service Workers
```
