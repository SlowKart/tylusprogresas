# Tylus Progresas

A modern fitness app with PDF-based program management built with:

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) (with custom utility classes)
- [shadcn/ui](https://ui.shadcn.com) (for accessible, composable UI primitives)
- [Supabase](https://supabase.com) (for database and storage)
- [Lucide](https://lucide.dev) (for icons)
- [Geist font](https://vercel.com/font)

## 🎯 Features

- **Running Goal Planner**: Multi-step form for creating personalized running plans
- **PDF Program Parser**: Upload structured PDF fitness programs that auto-convert to JSON
- **Program Management**: Clean, mobile-friendly display of workout programs
- **User Progress Tracking**: Track completion of workouts and exercises
- **Dark/Light Mode**: Comprehensive theming system

## 📱 PDF Program System

### How It Works

1. **Upload PDF**: Admin uploads a structured PDF program
2. **Auto-Parse**: System extracts program data into clean JSON
3. **Display**: Users see structured workouts in mobile-friendly format
4. **Track Progress**: Users mark workouts complete and track their journey

### PDF Structure

Create PDFs with this exact format:

```
PROGRAM: Simple Strength Starter
DURATION: 3 weeks
DIFFICULTY: beginner
TYPE: strength
EQUIPMENT: dumbbells, yoga mat

WEEK 1:
DAY 1: Upper Body
- Push-ups: 2 sets x 5 reps
- Dumbbell Rows: 2 sets x 8 reps
- Shoulder Press: 2 sets x 6 reps

DAY 2: REST

DAY 3: Lower Body
- Squats: 2 sets x 8 reps
- Lunges: 2 sets x 6 reps each leg
```

### JSON Output

The parser converts PDFs to this clean structure:

```json
{
  "metadata": {
    "name": "Simple Strength Starter",
    "duration": 3,
    "difficulty": "beginner",
    "type": "strength",
    "equipment": ["dumbbells", "yoga mat"]
  },
  "weeks": [
    {
      "number": 1,
      "days": [
        {
          "day": 1,
          "name": "Upper Body",
          "exercises": [
            { "name": "Push-ups", "details": "2 sets x 5 reps" }
          ]
        }
      ]
    }
  ]
}
```

### Supported Program Types

- `running` - Running and cardio programs
- `strength` - Weight training and bodyweight
- `cardio` - General cardiovascular training
- `flexibility` - Stretching and mobility
- `mixed` - Combination programs

### Difficulty Levels

- `beginner` - New to fitness or the activity type
- `intermediate` - Some experience, ready for moderate challenge
- `advanced` - Experienced, ready for high intensity

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tylusprogresas
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for comprehensive testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test src/components/running/SummaryStep.test.tsx
```

### Test Coverage

The test suite covers:
- **UI Components**: All interactive components with user interactions
- **Utility Functions**: All utility functions with edge cases
- **React Hooks**: Custom hooks using `renderHook`
- **Accessibility**: ARIA attributes and keyboard navigation
- **Type Safety**: TypeScript types and union types

### Testing Best Practices

- Use `userEvent` for user interactions
- Test accessibility with ARIA attributes
- Test edge cases and error conditions  
- Use descriptive test names
- Group related tests using `describe` blocks

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/admin/upload-pdf/     # PDF upload endpoint
│   ├── sports/running/           # Running form page
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── running/                  # Running-specific components
│   ├── theme-provider.tsx        # Theme management
│   └── theme-toggle.tsx          # Dark/light mode toggle
├── lib/
│   ├── supabaseAdmin.ts          # Server-side Supabase client
│   ├── supabaseBrowser.ts        # Browser Supabase client
│   └── utils.ts                  # Utility functions
├── types/
│   └── simpleProgram.ts          # Program data types
├── utils/
│   ├── running.ts                # Running-specific utilities
│   └── simplePDFParser.ts        # PDF parsing logic
└── constants/
    └── running.ts                # Running constants

examples/
├── simple-running-program.json   # Example running program
├── simple-strength-program.json  # Example strength program
└── sample-pdf-content.txt        # PDF template content
```

## 🎨 Styling & Theming

- **Utility-first**: Tailwind CSS with custom utility classes
- **Custom classes**: Defined in `tailwind.config.js` (e.g., `max-w-card`, `gap-form`)
- **Theme system**: Comprehensive dark/light mode support
- **Components**: shadcn/ui for accessible, composable primitives

## 🔧 API Endpoints

### PDF Upload
```
POST /api/admin/upload-pdf
Content-Type: multipart/form-data

Uploads PDF to Supabase storage and extracts text
```

## 🗄️ Database

Using Supabase PostgreSQL with these main tables:

- `pdf_texts` - Raw PDF text storage
- `simple_programs` - Parsed program data (JSON)
- `user_program_progress` - User progress tracking

## 📱 Mobile-First Design

- Responsive design optimized for mobile devices
- Touch-friendly interactions
- Clean, minimal interface
- Accessible components with proper ARIA labels

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧩 Adding New Programs

1. Create PDF following the structure specification
2. Upload via `/api/admin/upload-pdf` endpoint
3. System automatically parses and stores the program
4. Users can immediately access the new program

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.