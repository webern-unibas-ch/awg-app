# CLAUDE.md

Guidance for Claude Code in this repository.

## Project

Angular 22 app for the online edition of the Anton Webern Gesamtausgabe (AWG), deployed to GitHub Pages (https://edition.anton-webern.ch). Yarn 4 (corepack); Node ^22.22.3 or >= 24.15.0.

## Commands

- `yarn start`: dev server (http://localhost:4200)
- `yarn test`: Vitest via `@angular/build:unit-test` (watch, jsdom); single spec: `yarn test --include=<path> --no-watch`
- `yarn test:local`: tests in Chromium (Playwright)
- `yarn test:cov`: jsdom run with coverage (CI via `yarn test:ci`)
- `yarn lint` / `yarn lint:fix`: ESLint
- `yarn format-files:check` / `yarn format-files:fix`: Prettier for `src/**`
- `yarn build:prod`: production build to `dist/awg-app`
- `yarn check:cycles`: madge check for circular imports (incl. path aliases; runs in CI)
- `yarn check:snippets`: checks that the `##Abbildung##` snippet PNGs referenced in the edition data exist

Husky and lint-staged run ESLint and Prettier on staged files.

## Git

- Conventional Commits (commitlint, `@commitlint/config-angular`), header **at most 72 characters** (also PR titles, since PRs are squash-merged). **Scope is mandatory**: `app, assets, contact, core, deps, deps-dev, edition, gh-actions, home, page-not-found, search, shared, side-info, statistics, structure, testing, views, CHANGELOG, CONTRIBUTING, LICENSE, README`. CHANGELOG and versions are generated from commits.
- Gitflow: feature branches from `develop`, PRs to `develop`; `main` holds releases.
- **Never commit, push or create PRs unless explicitly asked, and don't offer to.** Leave changes in the working tree and propose a commit message. Don't stage or unstage (delete in the working tree, no `git rm`; `git mv` is fine). For multi-step work, stop at each buildable step with its files and message.

## Working style

- Answer design questions (e.g. "utils or service?") with a recommendation and ask before implementing, even alongside a general go-ahead. Mention extra design changes up front.
- Docs and comments stay general: describe what something does and why, not every branch or use case; only the current code, no references to previous behaviour.

## Architecture

- **Bootstrap:** standalone, zoneless (`provideZonelessChangeDetection()`). Template state must be signals (or change via template/host listeners or `async`). Providers in `app.config.ts`, routes in `app.routes.ts`, constants in `app.constants.ts`; views lazy-loaded via `views/*-view/*-view.routes.ts`.
- **Layout:** `core/` (navbar, footer, view-container, analytics), `shared/` (reusable components, directives, models, utils), `views/` (one folder per route).
- **Edition view** (`views/edition-view/`), the bulk of the app: `edition/series/:seriesId/...` → `complex/:complexId/{intro,sheets,report,graph}`, plus `preface` and `rowtables`. Page components in `edition-outlets/`, models in `edition-view/models/`.
- **Data:** no backend; static JSON under `src/assets/data/edition/`. `EditionDataService` loads it as signals, using `EDITION_ASSETS_DATA` (file names) and `EditionStateService` (current complex).
- **Rendering:** HTML strings via `CompileHtmlDirective`; score sheets as SVGs with D3 overlays and zoom; graph view with RDF store (`rdfstore`, `n3`), CodeMirror SPARQL editor and a canvas force graph simulated in a web worker. D3 only draws (stateless drawing services); interaction runs through template listeners, state lives in signals.

## Code conventions

- Standalone components with own `imports`, `OnPush`, `@if`/`@for`; `input()`/`model()`/`output()`/`signal()`/`computed()` (doc comments: "Readonly input signal: x. It holds ...").
- **Member order:** static fields → `inject()` fields (separate, alphabetical) → input/model → output → queries → state (related members together, mutable last) → constructor → get/set → static, public, protected, private methods (arrow-function fields count as methods). No lifecycle hooks: set-up in the constructor (`effect`, `afterNextRender`/`afterRenderEffect`), clean-up via `DestroyRef`.
- **Naming:** UPPER_CASE only for module-level consts and static members (`static readonly`, `static get`), otherwise camelCase. `private` with `_` (no `#`), `protected` with `_` only for subclasses. Signal and output fields are `readonly`; only reassigned plain fields stay mutable.
- Every component has ts, html, scss (also when empty, with `styleUrl`) and spec.
- Reuse shared UI components where useful (e.g. `ButtonExpandAllComponent`, `ConditionalLinkComponent`).
- **Imports:** full file paths, no barrels (exception for now: `@testing/mock-data`, `@testing/mock-helper`). Relative only `./` or one `../`, otherwise aliases: `@awg-app`, `@awg-core`, `@awg-shared`, `@awg-views`, `@testing`, and outlet aliases `@awg-graph` (edition-graph), `@awg-report` (edition-report). New outlet aliases only for deep imports, in all four tsconfigs (base, `.app`, `.spec`, `.doc`); once an outlet has one, imports into it use it.
- **Import blocks** (blank line between, sorted by path): `@angular` → third party → `@testing` → `@awg-app`/`@awg-core` → `@awg-shared` → `@awg-views` → outlet aliases → relative. Move lines when a path changes its block; re-sort `imports: [...]` after renames.
- Empty checks: `if (array.length)` / `if (!array.length)`. A helper that only gets non-empty lists is guarded at the call site ("(not empty)" in its JSDoc).
- Destructure all used entries of a config/style constant at the top of a function, consistently across the file.

## Testing

- Vitest with `globals: false`: import `describe`, `it`, `expect` etc. from `vitest`.
- Use the helpers, stubs and mock data in `src/testing/`.
- **Read `src/testing/test-conventions.md` before writing or changing specs:** titles describe results, specs split into `BEFORE`/`AFTER initial data binding`, children hollowed out (never the component under test), jsdom limits.
