# AGENTS.md — todo-ui

`todo-ui` is the React single-page application for the todo project. It is
built as a **library** (UMD/ES bundles in `dist/`) that the `todo` backend
serves at `/ui/index.html`, and it talks to that backend's REST API through a
Vite dev-server proxy.

## Architecture

### Directory layout

```
todo-ui/
├── AGENTS.md
├── index.html            # Entry page (loads /src/main.tsx in dev mode, vite converts to compiled js)
├── package.json
├── tsconfig.json         # App TS config (ESNext, bundler, jsx: react-jsx)
├── tsconfig.node.json    # Vite config TS config (ES2020, bundler)
├── vite.config.ts        # Dev server + library build config
├── vitest.config.ts      # Test runner config
├── .gitignore            # node_modules, dist, build, .env*, *.local, etc.
└── src/
    ├── main.tsx          # App entry: HashRouter + routes + API bootstrap
    ├── components/
    │   └── TodoList.tsx  # Main UI component (list, add, toggle, delete)
    └── __tests__/
        └── dummy.test.ts # Sample Vitest test
```

### Build modes

`vite.config.ts` configures Vite in **library mode** (`build.lib`):

- **Entry:** `src/main.tsx`
- **Global name:** `TodoLists`
- **Output:** `dist/todo-lists.js` (UMD, global `TodoLists`) and
  `dist/todo-lists.es.js` (ES module); CSS is extracted to `dist/todo-lists.css`
- `define` pins `process.env.NODE_ENV` to `production`
- `react` and `react-dom` are **not** externalized, so they are bundled into
  the output (which is why the UMD bundle is ~416 kB)

In dev mode (`npm run dev`), `index.html` is served and `src/main.tsx` is
loaded directly as an ES module — the library wrapper is not used.

### Frontend application (`src/`)

- **`main.tsx`** — entry point: sets up a `HashRouter` (react-router) with a
  `Route` for `/` and fetches todo data from `/api/todo-lists` (via `axios`)
  on mount.
- **`components/TodoList.tsx`** — the primary component; renders the todo
  list, handles adding new todos, toggling completion, and deleting items.

### Backend interaction

The UI is a thin client for the `todo` backend:

- API base: `/api` (relative)
- Dev server proxies `/api` -> `http://localhost:8080` (see
  `vite.config.ts` `server.proxy`)
- In production the same proxying is handled by nginx in the `todo` service
  (see `../docker-compose.yaml`)

## Build tools

- **Vite 8** — dev server and bundler
- **@vitejs/plugin-react 6** — React JSX/Fast Refresh support
- **TypeScript 5** — type definitions and JSX (`jsx: react-jsx`)
- **Vitest 5** — unit test runner (jsdom environment)
- **jsdom 30** — DOM simulation for tests

## How to build

```bash
# Install dependencies (from the todo-ui/ directory)
npm install

# Type-check only (runs `tsc --noEmit`; also run automatically by the build)
npm run type-check

# Production build -> dist/ (UMD + ES bundles + CSS)
# `build` is `npm run type-check && vite build` — type errors fail the build
# before bundling.
npm run build
```

The build outputs:

- `dist/todo-lists.js` — UMD bundle (global name `TodoLists`)
- `dist/todo-lists.es.js` — ES module bundle
- `dist/todo-lists.css` — extracted styles

The `todo` backend serves these from `/ui/` in production (see
`../docker-compose.yaml` and the nginx config under `../todo/`).

## How to run the dev server

```bash
npm run dev        # or: npm start
```

- Listens on **http://localhost:3000**
- Serves `index.html` and loads `src/main.tsx` as an ES module
- Proxies `/api/*` requests to `http://localhost:8080` (the `todo` backend)

## How to run unit tests

Tests are run with **Vitest** (config in `vitest.config.ts`):

- Environment: `jsdom`
- `globals: true` (describe/it/expect are available without imports)
- Test files: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,tsx}`

```bash
# Single run (CI style) -> reports and exits
npm test

# Watch mode during development
npm run watchTests

# Run a single test file
npx vitest run src/__tests__/dummy.test.ts

# Run tests matching a name
npx vitest run -t "test name"

# Interactive test UI (from @vitest/ui)
npx vitest --ui
```

The test suite currently contains a single placeholder test in
`src/__tests__/dummy.test.ts`; add new test files under `src/` matching the
`*.test.ts(x)` pattern.

## Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.3.1 | UI library |
| `react-dom` | ^19.3.1 | React DOM renderer |
| `react-router` | ^8.5.0 | Routing primitives (HashRouter, Routes) |
| `axios` | ^1.20.0 | HTTP client for the `/api` backend |

### Development

| Package | Version | Purpose |
|---|---|---|
| `@types/react` | ^19.3.0 | React type definitions |
| `@types/react-dom` | ^19.3.0 | ReactDOM type definitions |
| `@types/node` | ^24.19.2 | Node type definitions (Vite config) |
| `@vitejs/plugin-react` | ^6.1.2 | React support (Fast Refresh) in Vite |
| `@vitest/ui` | ^5.0.3 | Interactive test UI |
| `vite` | ^8.3.4 | Dev server + library bundler |
| `vitest` | ^5.0.3 | Unit test runner |
| `typescript` | ^5.4.0 | Type checking / JSX |
| `jsdom` | ^30.1.2 | DOM environment for tests |

## Keeping this file up to date

AGENTS.md is a living document: keep it in sync with the codebase and update
it in the same change as the code it describes. In particular, any of the
following must trigger an update to this file:

- **Components** — adding, removing, or renaming a component or other file
  under `src/` (e.g., `components/TodoList.tsx`, `__tests__/`): update the
  directory layout tree, the "Frontend application (`src/`)" section, and
  any other place that references it (build entry, agent tips, ...).
- **Dependencies** — adding, removing, or changing the version of a package
  (runtime or dev, especially major-version bumps): update the tables under
  "Dependencies" and the "Build tools" list when the tooling itself changes.
- **Architecture** — changes to the build setup (library mode, entry,
  outputs, externals, `package.json` scripts), routing, the API base path or
  dev-proxy target, or the test tooling: update the affected "Architecture",
  "Build tools", and "How to ..." sections.

When in doubt, the codebase is the source of truth — fix this file to match
it rather than the other way around.

## Useful agent tips

- **`dist/` is gitignored** — it is a build artifact that must exist for the
  `todo` backend to serve the UI in production; rebuild it after changes to
  `src/` if you want to update the served UI.
- **Dev server requires the backend**: start the `todo` API first
  (see `../docker-compose.yaml` or `../todo/README.md`) so `/api` calls work
  at `http://localhost:8080`.
- **Routing uses HashRouter** — routes are of the form
  `http://localhost:3000/#/` to avoid server-side route configuration.
- **API base path is `/api`** — do not hard-code hostnames; the dev proxy and
  production nginx handle the target.
- **`npm run build` runs `tsc` first** — the `build` script is
  `npm run type-check && vite build`, so type errors fail the build; run
  `npm run type-check` on its own for fast feedback while editing.
- **CSS is extracted** to `dist/todo-lists.css` in the library build; in dev
  mode styles are injected by Vite.
- The project is part of a monorepo; sibling services live in `../todo/`
  (Go backend) and the top-level `../AGENTS.md` has the big picture.
