# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A magazine-style information sharing platform (codename "Curated") for sharing project introductions. Currently in visual prototype phase (frontend only), with planned Youbase backend integration.

## Development Commands

```bash
npm install          # Install dependencies (run once)
npm run dev          # Start Vite dev server with HMR
npm run build        # Create production build in dist/
npm run preview      # Serve production build locally
```

No test runner is configured. Use `npm run build` as basic validation.

## Architecture

```
src/
  main.tsx           # React root bootstrap
  APP.tsx            # Main page composition (note uppercase casing)
  index.css          # Tailwind directives and global styles
  components/        # UI components (PascalCase.tsx)
    ProjectCard.tsx  # Main card component with image, title, tags, link
  data/              # Local data modules (camelCase.ts)
    mockProjects.ts  # Sample data with high-quality images
  assets/            # Static images
```

**Key layout**: Uses `react-masonry-css` for waterfall grid layout (3 columns desktop → 1 column mobile).

## Code Style

- 2-space indentation
- Use semicolons in TS/TSX
- Styling: Tailwind utility classes in JSX; global CSS only in `src/index.css`
- File casing matters: keep imports aligned with actual filenames

## Configuration Files

- `tailwind.config.js` - Tailwind settings
- `yw_manifest.json` - Project metadata
