#!/bin/bash
# tool-call-result hook: Detect frontend build/test/type errors

result=$(cat)

# Vitest test failure
if echo "$result" | grep -qE "(FAIL |Test Files.*failed|Tests.*failed|AssertionError)"; then
  cat << 'EOF'
[DEBUG GUIDE - Vitest Failure]
1. Identify failing test from output above
2. Use frontend-debugger agent for analysis
3. Check test assertion vs actual behavior
4. Read related source files before fixing
5. Run specific test: npx vitest run path/to/test.test.ts
EOF
fi

# TypeScript compile error
if echo "$result" | grep -qE "(TS[0-9]+:|error TS|Type .* is not assignable|Cannot find module|Property .* does not exist)"; then
  cat << 'EOF'
[DEBUG GUIDE - TypeScript Error]
1. Check the file:line from error message
2. Verify import paths and type definitions
3. Check tsconfig.json path aliases
4. Fix type errors before proceeding
EOF
fi

# Vite/build error
if echo "$result" | grep -qE "(Build failed|ERROR.*vite|Failed to resolve|Module not found|ENOENT)"; then
  cat << 'EOF'
[DEBUG GUIDE - Build Error]
1. Check missing dependencies: npm ls or pnpm ls
2. Verify import paths match actual file locations
3. Check vite.config.ts for alias configuration
4. Run: npm install / pnpm install to sync deps
EOF
fi

# ESLint/Prettier error
if echo "$result" | grep -qE "(eslint|Parsing error|prettier)"; then
  cat << 'EOF'
[DEBUG GUIDE - Lint Error]
1. Run: npx eslint --fix <file>
2. Check .eslintrc for rule configuration
3. Verify parser settings for TypeScript
EOF
fi

# Tailwind CSS error
if echo "$result" | grep -qE "(Unknown utility class|tailwind.*error)"; then
  cat << 'EOF'
[DEBUG GUIDE - Tailwind Error]
1. Check tailwind.config.ts content paths
2. Verify class name spelling
3. Ensure @tailwind directives in global CSS
EOF
fi
