# Project: Curated - Information Sharing Website

A magazine-style information sharing platform for colleagues to share useful project introductions.

## Project Status

- **Current Phase**: Visual Prototype (Frontend Only)
- **Next Phase**: Backend Integration (Youbase) for dynamic data and screenshots
- **Build System**: Vite 7.0.0
- **Styling**: Tailwind CSS 3.4.17

## Key Features Implemented

### Visual Design
- **Magazine/Card Style**: High-quality image focus, elegant typography (Serif headings).
- **Masonry Layout**: Dynamic waterfall grid using `react-masonry-css` for optimal space usage.
- **Responsive**: Adapts from 3 columns (desktop) to 1 column (mobile).

### Components
- `ProjectCard`: Displays project image, title, description, tags, and external link.
- `MasonryGrid`: Layout wrapper handling the waterfall effect.
- `Mock Data`: Curated set of high-quality sample projects for visual verification.

## Tech Stack Additions
- `lucide-react`: Icon system.
- `react-masonry-css`: Masonry layout implementation.

## Architecture

```
src/
  components/
    ProjectCard.tsx    # Main visual component
  data/
    mockProjects.ts    # Sample data with high-quality images
  App.tsx              # Main page assembly
```

## Next Steps (Backend)
1. Enable Youbase.
2. Create `projects` table (title, url, description, image_url, tags).
3. Implement API for fetching metadata/screenshots from URLs.
4. Connect Submission Form to API.
