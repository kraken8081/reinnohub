# Repository Guidelines

## Project Overview
Magazine-style information sharing platform (codename "Curated") for sharing project introductions. Currently a visual prototype (frontend only), with planned Youbase backend integration.

## Project Structure & Module Organization
This is a Vite + React + TypeScript frontend. Key paths:
- `index.html`: Vite entry HTML.
- `src/main.tsx`: React root bootstrap.
- `src/APP.tsx`: Main page composition (note the file casing).
- `src/components/`: UI components (e.g., `ProjectCard.tsx`).
- `src/data/`: Local data modules (e.g., `mockProjects.ts`).
- `src/assets/`: Static images.
- `src/index.css`: Tailwind directives and global styles.
Key layout uses `react-masonry-css` for a waterfall grid (3 columns desktop → 1 column mobile).

## Build, Test, and Development Commands
Install dependencies once:
- `npm install`

Common workflows:
- `npm run dev`: Start the Vite dev server with HMR.
- `npm run build`: Create a production build in `dist/`.
- `npm run preview`: Serve the production build locally for verification.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; keep JSX formatting consistent with the surrounding file.
- Quotes: match the existing file (both single and double quotes appear today).
- Semicolons: use them consistently in TS/TSX.
- Components: `PascalCase.tsx` in `src/components/`.
- Data/util modules: `camelCase.ts` in `src/data/` or alongside usage.
- Styling: prefer Tailwind utility classes in JSX; only add global CSS in `src/index.css`.
- File casing matters on some systems; keep imports aligned with actual filenames.

## Testing Guidelines
There is no test runner configured yet. If you add tests, document the framework (for example, Vitest + React Testing Library), add a script to `package.json`, and state naming conventions (e.g., `*.test.tsx`). Until then, use `npm run build` and `npm run preview` as basic validation.

## Commit & Pull Request Guidelines
No Git history is present in this workspace, so no established commit convention can be summarized. If you are introducing version control, use concise, imperative subjects (e.g., "Add masonry grid layout") and keep commits scoped.

PRs should include:
- A short summary of UI or behavior changes.
- Screenshots or screen recordings for visual updates.
- Links to related issues or design references when applicable.

## Configuration Notes
- Tailwind settings live in `tailwind.config.js`.
- Project metadata is in `yw_manifest.json`.
