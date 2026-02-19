# Component Patterns: CVA + Tailwind CSS + Composition

## CVA (Class Variance Authority)

### Basic Pattern
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Component with CVA
```typescript
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = 'Button';
```

## cn() Utility

### Implementation
```typescript
// shared/lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage Rules
```typescript
// GOOD: merge classes with cn()
<div className={cn('flex gap-2', isActive && 'bg-blue-500', className)} />

// BAD: string concatenation
<div className={`flex gap-2 ${isActive ? 'bg-blue-500' : ''}`} />

// BAD: direct conditional class concatenation
<div className={'flex gap-2' + (isActive ? ' bg-blue-500' : '')} />
```

## Tailwind CSS Conventions

### Class Order (Recommended)
1. Layout (display, position, flex/grid)
2. Sizing (w, h, min/max)
3. Spacing (m, p, gap)
4. Typography (font, text, leading)
5. Backgrounds & Borders
6. Effects (shadow, opacity, transition)
7. Responsive & State modifiers

```typescript
// GOOD: logical order
<div className="flex items-center gap-4 w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors" />
```

### Design Tokens (CSS Variables)
```css
/* app/styles/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}
```

### Forbidden Patterns
```typescript
// NEVER: inline styles
<div style={{ color: 'red', padding: '10px' }} />

// NEVER: CSS-in-JS (styled-components, emotion)
const StyledDiv = styled.div`color: red;`;

// NEVER: dynamic class construction (Tailwind can't detect)
const color = 'red';
<div className={`text-${color}-500`} />  // BAD

// ALWAYS: use complete class names
<div className={color === 'red' ? 'text-red-500' : 'text-blue-500'} />
```

## Component Composition Patterns

### Compound Components
```typescript
// shared/ui/organisms/Card.tsx
const Card = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props} />
);

const CardHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
);

const CardContent = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardContent };
```

### Polymorphic Components (asChild)
```typescript
import { Slot } from '@radix-ui/react-slot';

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Render Props
```typescript
type DataListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
};

function DataList<T>({ items, renderItem, emptyState, className }: DataListProps<T>) {
  if (items.length === 0) return emptyState ?? null;
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, i) => (
        <li key={i}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}
```

## Component File Structure

```
shared/ui/atoms/Button/
├── Button.tsx         # Component implementation
├── Button.test.tsx    # Tests
├── Button.stories.tsx # Storybook (optional)
└── index.ts           # export
```

### Export Convention
```typescript
// index.ts
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';
```

## Responsive Design

```typescript
// Mobile-first approach
<div className="
  flex flex-col          /* Mobile: vertical stack */
  md:flex-row            /* Tablet: horizontal row */
  lg:grid lg:grid-cols-3 /* Desktop: 3-column grid */
" />

// Breakpoints
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
```
