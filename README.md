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
