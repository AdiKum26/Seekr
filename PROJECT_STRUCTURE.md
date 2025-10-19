# Seekr Project Structure

## 📁 Complete File Organization

```
Seekr/
│
├── 📂 .vscode/                     # VSCode configuration
│   ├── settings.json               # Editor settings (format on save, etc.)
│   └── extensions.json             # Recommended extensions
│
├── 📂 src/                         # Source code
│   │
│   ├── 📂 components/              # React components
│   │   │
│   │   ├── 📂 ui/                  # Base UI components
│   │   │   ├── Badge.tsx           # Badge component for tags/labels
│   │   │   ├── Progress.tsx        # Progress bar component
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── 📂 chat/                # AI Chat components
│   │   │   ├── AIAvatar.tsx        # Animated AI avatar
│   │   │   ├── AIChatDock.tsx      # Floating chat interface
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── 📂 dashboard/           # Dashboard components
│   │   │   ├── DashboardCards.tsx  # Main dashboard cards
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   └── 📂 shared/              # Shared utilities
│   │       ├── ImageWithFallback.tsx # Image with error handling
│   │       └── index.ts            # Barrel export
│   │
│   ├── 📂 pages/                   # Page components
│   │   ├── ClassesPage.tsx         # Course explorer page
│   │   └── index.ts                # Barrel export
│   │
│   ├── 📂 types/                   # TypeScript definitions
│   │   └── index.ts                # All type definitions
│   │
│   ├── 📂 styles/                  # Styles
│   │   └── globals.css             # Global styles & theming
│   │
│   ├── 📂 hooks/                   # Custom React hooks (future)
│   ├── 📂 utils/                   # Utility functions (future)
│   ├── 📂 assets/                  # Static assets (future)
│   │
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # App entry point
│   └── vite-env.d.ts              # Vite type definitions
│
├── 📂 archive/                     # Old/backup files
│   ├── FrontEnd UI/               # Original component files
│   └── Seekr AI Mentor Platform.make
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── .eslintrc.cjs                  # ESLint config
├── .gitignore                     # Git ignore rules
├── README.md                       # Project documentation
└── PROJECT_STRUCTURE.md           # This file
```

## 🎯 Component Organization

### UI Components (`src/components/ui/`)
Reusable, generic components that can be used throughout the app.
- **Badge**: Display tags, labels, and status indicators
- **Progress**: Show completion percentages and loading states

### Chat Components (`src/components/chat/`)
AI assistant and chat interface components.
- **AIAvatar**: Animated avatar with glow effects
- **AIChatDock**: Expandable chat panel with messaging

### Dashboard Components (`src/components/dashboard/`)
Dashboard-specific widgets and cards.
- **DashboardCards**: Opportunities, progress, and scholarship cards

### Shared Components (`src/components/shared/`)
Utility components used across features.
- **ImageWithFallback**: Robust image loading with error handling

### Pages (`src/pages/`)
Full page components.
- **ClassesPage**: Course discovery and exploration interface

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, and project metadata |
| `tsconfig.json` | TypeScript compiler settings |
| `vite.config.ts` | Vite build tool configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `.eslintrc.cjs` | Code linting rules |
| `.gitignore` | Files to exclude from git |

## 📦 Import Patterns

### Barrel Exports
Each component folder has an `index.ts` for cleaner imports:

```typescript
// ❌ Old way
import { AIAvatar } from "./components/chat/AIAvatar";
import { AIChatDock } from "./components/chat/AIChatDock";

// ✅ New way
import { AIAvatar, AIChatDock } from "./components/chat";
```

### Centralized Types
All TypeScript types in one place:

```typescript
import { Course, Message, Opportunity } from "./types";
```

## 🎨 Theming

University branding controlled via CSS variables in `src/styles/globals.css`:

```css
:root {
  --university-primary: #4b2e83;
  --university-secondary: #85754d;
  --university-accent: #b7a57a;
  --glow-color: rgba(75, 46, 131, 0.3);
}
```

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Build for production**: `npm run build`

## 📝 Notes

- All components are TypeScript (`.tsx`)
- All imports use relative paths or path aliases
- Old files preserved in `archive/` folder
- VSCode settings include auto-format on save
- Project follows React + Vite best practices

