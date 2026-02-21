# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Provador Virtual IA** is a virtual clothing try-on application that uses Google's Gemini 2.0 Flash API to generate photorealistic images of users wearing different clothing items.

## Architecture & Key Components

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via CDN in HTML)
- **APIs**: Google Gemini 2.0 Flash (image generation), Imagen API
- **Runtime**: Node.js (ES modules)

### Directory Structure
```
provador-virtual/
├── App.tsx                 # Main app component with all UI logic
├── index.tsx               # React DOM entry point
├── index.html              # HTML template with Tailwind CSS
├── types.ts                # TypeScript types (AppStatus enum)
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── components/
│   └── ImageDropzone.tsx   # File upload component for images
├── services/
│   ├── geminiService.ts    # Gemini API integration for image generation
│   └── imagenService.ts    # Imagen API integration (legacy/supplementary)
├── .env                    # Environment variables
└── metadata.json           # App metadata (AI Studio configuration)
```

### Core Application Flow
1. **User uploads images**: Model photo + clothing item (via ImageDropzone)
2. **Style suggestions**: Gemini generates style recommendations for the clothing
3. **Image generation**: Creates photorealistic image of user wearing the clothing
4. **Upscaling**: Optional image quality enhancement
5. **Pose variation**: Can generate alternative poses/angles

### Key Components
- **App.tsx**: Monolithic component containing:
  - State management (file uploads, status, generated images)
  - UI helper components (Header, StepLabel, AspectRatioSelector, ProgressBar)
  - Layout and form controls
  - Integration with services

- **ImageDropzone.tsx**: Reusable file upload component with:
  - Drag-and-drop support
  - File type validation
  - Image preview

- **Services**: API integration modules
  - `geminiService.ts`: Main integration with Gemini 2.0 Flash API for:
    - Style suggestions generation
    - Image generation
    - Upscaling
    - Pose variation
  - `imagenService.ts`: Imagen API support (supplementary)

## Development Commands

### Setup & Installation
```bash
npm install              # Install dependencies
```

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
```

### Production
```bash
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### No Built-in Testing
Currently, there are no tests configured. If adding tests:
- Consider Jest with React Testing Library for component testing
- Add `test` script to package.json
- Create `__tests__` or `.test.ts/.test.tsx` files

## Configuration & Environment

### Environment Variables
- **GEMINI_API_KEY**: Required. Google Gemini API key.
  - Set in `.env` file or `.env.local`
  - Exposed to the app via Vite's `define` config
  - Accessible as `process.env.GEMINI_API_KEY` or `process.env.API_KEY`

### TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext
- **JSX**: react-jsx (React 19 new transform)
- **Path Alias**: `@/*` maps to project root
- **No emit**: TypeScript is compile-check only (Vite handles compilation)

### Vite Configuration
- **Dev server**: Port 3000, Host 0.0.0.0
- **Plugin**: @vitejs/plugin-react for JSX/TSX support
- **Environment**: Loads GEMINI_API_KEY into `process.env` for Vite defines
- **Alias**: `@` resolves to project root for cleaner imports

## Code Patterns & Conventions

### React Components
- **Functional components** with TypeScript interfaces for props
- **CSS**: Tailwind classes inline (no separate CSS files)
- **State**: `useState` hook, managed locally within components
- **Effects**: `useCallback` and `useEffect` used minimally
- **Icons**: Inline SVG components instead of icon libraries

### File Upload Handling
- Images converted to **Base64** before sending to APIs
- File readers used for browser-based conversions
- **Data URLs** handled with custom helper functions

### API Integration
- **Fetch API** used directly (no axios/node-fetch)
- **Async/await** pattern for API calls
- **Error handling**: Try-catch blocks with user-friendly error messages
- **API responses**: Parsed JSON, image data extracted and returned

### Styling
- **Tailwind CSS** classes only (no custom CSS)
- **Dark theme**: Slate gray (`slate-*`), indigo/cyan accents
- **Responsive**: `md:` breakpoint for tablet/desktop adjustments
- **Animations**: Gradient text, pulse effects, smooth transitions

## Important Notes

### Single-File Component
**App.tsx is large (~700+ lines)** and contains:
- UI layout and forms
- Component definitions (Header, ProgressBar, AspectRatioSelector, StepLabel)
- State management
- API integration logic

When making changes, keep this monolithic structure in mind. Breaking it apart would be over-engineering for the current scope.

### API Keys in Build Output
The `GEMINI_API_KEY` is embedded in the Vite build config's `define` section. This exposes the API key value to the browser. For production deployments, consider using a backend proxy instead to keep the key server-side only.

### Missing Tests
The project has no test infrastructure. While tests would be beneficial, adding them is not necessary for basic development. If needed, this would be a separate task.

### Image Formats & Size
The app handles JPEG and PNG uploads. Large images may slow down Base64 encoding. Consider adding client-side image compression before API calls for better performance.

## When Making Changes

1. **Understand the flow first**: Trace how user actions trigger state changes and API calls
2. **Keep styles consistent**: Use existing Tailwind color palette (slate, indigo, cyan)
3. **Update related functions together**: Changes to data structure often need updates in multiple places
4. **Test manually**: Use `npm run dev` and test file upload → generation → result flow
5. **Check API limits**: Gemini API has rate limits; test with small batches

## Useful References
- [Vite Documentation](https://vitejs.dev/)
- [React 19 with TypeScript](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/)
- [TypeScript Path Aliases](https://www.typescriptlang.org/tsconfig#paths)
