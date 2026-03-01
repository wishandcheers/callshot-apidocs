# Frontend Security Guidelines

## XSS Prevention

- **NEVER** use `dangerouslySetInnerHTML` without DOMPurify: `DOMPurify.sanitize(content)`
- **BEST**: Use text content (`<p>{userInput}</p>`) -- framework auto-escapes
- **Validate URLs**: Only allow `http:` / `https:` protocols (block `javascript:`)

```typescript
function isSafeUrl(url: string): boolean {
  try { return ['http:', 'https:'].includes(new URL(url).protocol); }
  catch { return false; }
}
```

## Content Security Policy (CSP)

Set via meta tag: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com; object-src 'none'; frame-ancestors 'none'`

## Token Management

| Method | Use |
|--------|-----|
| `httpOnly` cookie (server-set) | PREFERRED for auth tokens |
| In-memory variable | OK for short-lived access tokens |
| `localStorage` | NEVER for tokens (XSS accessible) |

Attach via interceptor: `config.headers.Authorization = \`Bearer ${token}\``

## Input Validation

- **Always** validate with Zod schemas client-side
- **Never** trust client validation alone -- server MUST validate independently
- **File uploads**: Validate MIME type against allowlist + enforce max size

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
```

## Sensitive Data

- `.env` files: NEVER commit to git (use `.env.example` as template)
- Only `VITE_` prefixed vars are exposed to client -- NEVER put secrets in `VITE_` vars
- NEVER log tokens, passwords, or PII -- log safe identifiers only

## Dependency Security

```bash
pnpm audit          # Check vulnerabilities
pnpm audit --fix    # Auto-fix
```

Regularly update deps, review changelogs before major updates, check bundle for unintended inclusions.

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| `eval()` / `new Function()` | Code injection |
| `document.write()` | XSS vector |
| `element.setAttribute('onclick', userInput)` | Event handler injection |
| `postMessage` without origin check | Cross-origin attack |

Always verify `postMessage` origin:
```typescript
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://trusted.example.com') return;
  processData(e.data);
});
```
