# Tylus Progresas

A modern running goal and workout planner built with:

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) (with custom utility classes)
- [shadcn/ui](https://ui.shadcn.com) (for accessible, composable UI primitives)
- [Lucide](https://lucide.dev) (for icons)
- [Geist font](https://vercel.com/font)

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for comprehensive testing.

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode (recommended during development):

```bash
npm test
```

Run tests for a specific file:

```bash
npm test src/components/running/SummaryStep.test.tsx
```

Run tests with coverage:

```bash
npm test -- --coverage
```

### Test Structure

- **Component Tests**: Located in `src/**/__tests__/` directories alongside components
- **Utility Tests**: Located in `src/utils/__tests__/` for utility function testing
- **Test Files**: Follow the naming convention `*.test.tsx` or `*.test.ts`

### Test Coverage

The test suite covers:

- **UI Components**: All interactive components with user interactions
- **Utility Functions**: All utility functions with edge cases and error conditions
- **React Hooks**: Custom hooks using `renderHook` from React Testing Library
- **Accessibility**: ARIA attributes and keyboard navigation
- **Type Safety**: TypeScript types and union types

### Writing Tests

When adding new features, follow these testing patterns:

```typescript
// Component test example
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("handles user interactions", async () => {
    const user = userEvent.setup();
    render(<ComponentName />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Updated Text")).toBeInTheDocument();
  });
});
```

```typescript
// Utility function test example
import * as utils from "../utils";

describe("utility function", () => {
  it("handles normal input", () => {
    expect(utils.functionName("input")).toBe("expected output");
  });

  it("handles edge cases", () => {
    expect(utils.functionName("")).toBe("empty output");
  });
});
```

### Testing Best Practices

- Use `userEvent` for user interactions (clicks, typing, etc.)
- Test accessibility with ARIA attributes and keyboard navigation
- Test edge cases and error conditions
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Mock external dependencies when necessary

## Project Structure & Conventions

- **Component Structure:**
  - UI primitives in `src/components/ui/` (from shadcn/ui)
  - Feature components in `src/components/` and `src/components/running/`
  - Layout and step logic in `src/components/StepLayout.tsx` and step components
- **Styling:**
  - Utility-first with Tailwind CSS
  - Custom utility classes (e.g., `max-w-card`, `gap-form`) defined in `tailwind.config.js`
  - No CSS modules; all styles are via Tailwind or config
- **Icons:**
  - Use [Lucide](https://lucide.dev) icons via `lucide-react`
- **Accessibility:**
  - All interactive elements use proper `aria-label`s and keyboard navigation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Lucide Documentation](https://lucide.dev/docs)

## Deploy

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
