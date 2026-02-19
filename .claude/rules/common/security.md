# Frontend Security Guidelines

## XSS Prevention

### Content Rendering
```typescript
// NEVER: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // BAD

// GOOD: Use DOMPurify for HTML content
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

// BEST: Avoid HTML rendering, use text content
<p>{userInput}</p>  // Framework auto-escapes
```

### URL Handling
```typescript
// NEVER: Unvalidated URLs
<a href={userProvidedUrl}>Link</a>  // BAD (javascript: protocol)

// GOOD: Validate URL protocol
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

## Content Security Policy (CSP)

### Meta Tag
```html
<meta http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.example.com;
    font-src 'self';
    object-src 'none';
    frame-ancestors 'none';
  "
/>
```

## Token Management

### Storage Rules
```typescript
// NEVER: localStorage for tokens
localStorage.setItem('token', accessToken);  // BAD (XSS accessible)

// GOOD: httpOnly cookie (server-set)
// Server sets token as httpOnly, secure, sameSite cookie

// OK: In-memory for short-lived access tokens
let accessToken: string | null = null;

export const tokenStore = {
  set: (token: string) => { accessToken = token; },
  get: () => accessToken,
  clear: () => { accessToken = null; },
};
```

### Auth Header
```typescript
// API client interceptor
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Input Validation

### Client-Side Validation
```typescript
// Always validate with Zod schema
const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

// Never trust client validation alone
// Server MUST validate independently
```

### File Upload
```typescript
// Validate file type and size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) return false;
  if (file.size > MAX_SIZE) return false;
  return true;
}
```

## Sensitive Data

### Environment Variables
```typescript
// .env files: NEVER commit to git
// .env.example: Template without values

// Vite: Only VITE_ prefixed vars are exposed
VITE_API_URL=https://api.example.com     // OK: public
DB_PASSWORD=secret                        // Safe: not exposed to client

// NEVER: Sensitive data in client-side env vars
VITE_API_SECRET=xxx  // BAD: visible in browser
```

### Logging
```typescript
// NEVER log sensitive data
console.log('User token:', token);     // BAD
console.log('Password:', password);    // BAD

// GOOD: Log safe identifiers only
console.log('User authenticated:', userId);
```

## Dependency Security

### Audit Commands
```bash
npm audit
pnpm audit
yarn audit

# Auto-fix
npm audit fix
```

### Rules
- Regularly update dependencies
- Review changelogs before major updates
- Avoid deprecated packages
- Check bundle for unintended inclusions

## Forbidden Patterns

```typescript
// NEVER: eval or Function constructor
eval(userInput);
new Function(userInput);

// NEVER: document.write
document.write(content);

// NEVER: Inline event handlers from user data
element.setAttribute('onclick', userInput);

// NEVER: postMessage without origin check
window.addEventListener('message', (e) => {
  // BAD: no origin verification
  processData(e.data);
});

// GOOD: Always verify origin
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://trusted.example.com') return;
  processData(e.data);
});
```
