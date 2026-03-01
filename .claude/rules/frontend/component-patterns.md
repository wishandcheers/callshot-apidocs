# Component Patterns: CVA + Tailwind CSS + Composition

## CVA (Class Variance Authority)

### Pattern: Define variants, then compose with component
```typescript
const buttonVariants = cva('inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: { default: '...', destructive: '...', outline: '...', ghost: '...', link: '...' },
    size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3', lg: 'h-11 px-8', icon: 'h-10 w-10' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
type ButtonProps = ComponentPropsWithoutRef<'button'> & VariantProps<typeof buttonVariants>;
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
```

## cn() Utility

```typescript
// shared/lib/cn.ts -- clsx + tailwind-merge
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

**Rules**: Always use `cn()` for class merging. NEVER use string concatenation or template literals for conditional classes.

## Tailwind CSS Conventions

### Class Order
1. Layout (display, position, flex/grid) 2. Sizing (w, h) 3. Spacing (m, p, gap) 4. Typography 5. Backgrounds/Borders 6. Effects (shadow, transition) 7. Responsive/State modifiers

### Design Tokens
Use CSS variables (`--background`, `--foreground`, `--primary`, etc.) in `globals.css` `@layer base`. Support light/dark with `:root` and `.dark` selectors.

### Forbidden
- **No inline styles** (`style={{}}`)
- **No CSS-in-JS** (styled-components, emotion)
- **No dynamic class construction** (`text-${color}-500` -- Tailwind can't detect)
- Always use complete class names with conditionals

## Composition Patterns

### Compound Components
```typescript
const Card = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('rounded-lg border bg-card shadow-sm', className)} {...props} />
);
const CardHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);
// CardTitle, CardContent follow same pattern
export { Card, CardHeader, CardTitle, CardContent };
```

### Polymorphic Components (asChild)
```typescript
type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

// Use Slot from @radix-ui/react-slot
const Comp = asChild ? Slot : 'button';
```

### Render Props (Generic Lists)
```typescript
type DataListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
};
```

## Component File Structure

```
shared/ui/atoms/Button/
  Button.tsx | Button.test.tsx | Button.stories.tsx | index.ts
```

Export convention: `export { Button, buttonVariants } from './Button'`

## Responsive Design

Mobile-first: `flex flex-col md:flex-row lg:grid lg:grid-cols-3`
Breakpoints: sm=640 md=768 lg=1024 xl=1280 2xl=1536
