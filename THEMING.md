# 🎨 Theming Guide for shadcn/ui

Your project now has a complete theming system powered by shadcn/ui and CSS variables!

## 🚀 What's Included

- **Theme Provider**: Automatic light/dark mode detection
- **Theme Toggle**: Switch between light and dark modes
- **CSS Variables**: Easy color customization
- **Preset Themes**: Blue, Green, Purple color schemes

## 🎯 How to Change Colors

### Method 1: Using Preset Themes

Replace the color variables in `src/app/globals.css` with one of the preset themes:

```bash
# Copy a preset theme
cp src/styles/themes/blue.css src/app/globals.css

# Available presets:
# - blue.css (Professional blue theme)
# - green.css (Nature-inspired green theme)  
# - purple.css (Creative purple theme)
```

### Method 2: Custom Colors

Edit `src/app/globals.css` and modify the CSS variables:

```css
@layer base {
  :root {
    /* Background colors */
    --background: 0 0% 100%;           /* Page background */
    --foreground: 0 0% 3.9%;           /* Main text color */
    
    /* Primary colors (buttons, links, etc.) */
    --primary: 221.2 83.2% 53.3%;      /* Primary blue */
    --primary-foreground: 210 40% 98%; /* Text on primary */
    
    /* Secondary colors */
    --secondary: 210 40% 96%;          /* Secondary background */
    --secondary-foreground: 222.2 84% 4.9%; /* Text on secondary */
    
    /* Accent colors (hover states, etc.) */
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    
    /* UI elements */
    --border: 214.3 31.8% 91.4%;      /* Border color */
    --input: 214.3 31.8% 91.4%;       /* Input borders */
    --ring: 221.2 83.2% 53.3%;        /* Focus ring */
  }
  
  .dark {
    /* Dark mode variants */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... more dark colors */
  }
}
```

## 🎨 Color Format

Colors use **HSL format**: `hue saturation lightness`

- **Hue**: 0-360 (color wheel position)
- **Saturation**: 0-100% (color intensity)  
- **Lightness**: 0-100% (how light/dark)

### Examples:
- `0 0% 100%` = White
- `0 0% 0%` = Black  
- `221.2 83.2% 53.3%` = Blue
- `142.1 76.2% 36.3%` = Green
- `262.1 83.3% 57.8%` = Purple

## 🛠️ Available Color Variables

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Main text color |
| `--primary` | Primary buttons, links |
| `--primary-foreground` | Text on primary elements |
| `--secondary` | Secondary buttons |
| `--secondary-foreground` | Text on secondary elements |
| `--accent` | Hover states, highlights |
| `--accent-foreground` | Text on accent elements |
| `--muted` | Disabled/muted elements |
| `--muted-foreground` | Disabled text |
| `--border` | Element borders |
| `--input` | Input field borders |
| `--ring` | Focus ring color |
| `--destructive` | Error/danger states |
| `--destructive-foreground` | Text on destructive elements |

## 🌓 Theme Toggle Usage

The theme toggle is automatically added to your home page. You can add it anywhere:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function MyPage() {
  return (
    <div>
      <ThemeToggle />
      {/* Your content */}
    </div>
  );
}
```

## 🎯 Quick Color Changes

### Make it more colorful:
Increase saturation values (middle number):
```css
--primary: 221.2 90% 53.3%; /* Was 83.2%, now 90% */
```

### Make it more muted:
Decrease saturation values:
```css
--primary: 221.2 40% 53.3%; /* Was 83.2%, now 40% */
```

### Make it lighter:
Increase lightness values (last number):
```css
--primary: 221.2 83.2% 70%; /* Was 53.3%, now 70% */
```

### Make it darker:
Decrease lightness values:
```css
--primary: 221.2 83.2% 35%; /* Was 53.3%, now 35% */
```

## 🚀 Advanced Customization

### Adding New Colors

1. Add to `globals.css`:
```css
:root {
  --warning: 38 92% 50%;
  --warning-foreground: 48 96% 89%;
}
```

2. Add to `tailwind.config.js`:
```js
colors: {
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
  },
}
```

3. Use in components:
```tsx
<div className="bg-warning text-warning-foreground">
  Warning message
</div>
```

## 📖 Resources

- [shadcn/ui Theming Docs](https://ui.shadcn.com/docs/theming)
- [HSL Color Picker](https://hslpicker.com/)
- [Coolors.co](https://coolors.co/) - Color palette generator

Happy theming! 🎨