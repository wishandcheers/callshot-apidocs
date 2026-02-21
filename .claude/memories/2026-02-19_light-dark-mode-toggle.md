# Add Light/Dark Mode Toggle with System Preference Support

**Date**: 2026-02-19
**Type**: feat
**Commit**: f8411a6

## Summary
Implemented light/dark theme toggle with OS system preference detection, localStorage persistence, and Redoc API Reference theme synchronization.

## Key Changes
- `src/shared/hooks/useTheme.tsx` - ThemeProvider + useTheme hook (context-based)
- `src/app/styles/index.css` - Split @theme into light (:root) / dark (.dark) + Redoc CSS overrides
- `src/widgets/header/ui/Header.tsx` - Sun/Moon toggle button
- `src/pages/reference/ui/ApiReferencePage.tsx` - Dynamic Redoc theme per light/dark
- `src/main.tsx` - ThemeProvider wrapping App
- `index.html` - FOUC prevention inline script

## Decisions Made
- **System preference default**: Uses `prefers-color-scheme` media query, user override saved to localStorage key `theme`
- **Tailwind v4 approach**: Light colors in `@theme` block, dark overrides in `.dark` CSS selector (Tailwind v4 generates CSS vars at `:root`)
- **Redoc dark mode**: Required CSS overrides with `!important` because styled-components inject inline styles that override theme options
- **Right panel stays dark in light mode**: `#263238` background for code readability (standard API docs pattern)
- **FOUC prevention**: Inline script in `<head>` reads localStorage before React hydration

## Files Affected
- `src/shared/hooks/useTheme.tsx` - new file (ThemeProvider, useTheme)
- `src/shared/hooks/index.ts` - export added
- `src/app/styles/index.css` - light/dark CSS vars + Redoc overrides
- `src/widgets/header/ui/Header.tsx` - toggle button
- `src/pages/reference/ui/ApiReferencePage.tsx` - dynamic Redoc options
- `src/main.tsx` - ThemeProvider wrapper
- `index.html` - FOUC script

## Notes for Future
- Redoc has limited dark mode support; CSS overrides in `index.css` may need updating if Redoc version changes
- Button/tab overrides in Redoc right panel require `!important` due to styled-components specificity
- Theme hook file is `.tsx` (not `.ts`) because it contains JSX for the Provider
