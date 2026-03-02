---
paths:
  - "**/*.stories.*"
  - "**/.storybook/**"
---

# Storybook 8+ Integration (CSF3)

## When to Use
- Developing shared/ui components
- Building/documenting design systems
- Visual regression testing

## Configuration

### Setup
```bash
npx storybook@latest init
```

### Vite Integration
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
```

## CSF3 Story Format

### Basic Story
```typescript
// shared/ui/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

### Interaction Test
```typescript
import { within, userEvent, expect } from '@storybook/test';

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};
```

## Story File Location

```
shared/ui/atoms/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx    # Located here
└── index.ts
```

## Best Practices

### DO:
- Write stories for all shared/ui components
- Use `tags: ['autodocs']` for auto-generated docs
- Use `@storybook/addon-a11y` for accessibility checks
- Use CSF3 format (export const, satisfies Meta)

### DON'T:
- Write stories for features/entities layer (contains business logic)
- Make real API calls in stories
- Use CSF2 format (export default + Template.bind)

## Commands
```bash
pnpm storybook            # Dev server
pnpm build-storybook      # Static build
npx storybook test           # Interaction tests
```
