# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 21 web app for the online edition of the Anton Webern Gesamtausgabe (AWG), deployed to GitHub Pages at https://edition.anton-webern.ch. Package manager is Yarn 4 (via corepack); Node >= 22.22.

## Commands

- `yarn start`: dev server on http://localhost:4200
- `yarn test`: Vitest via the Angular `@angular/build:unit-test` builder (watch mode, jsdom)
- `yarn test --include=src/app/path/to/foo.component.spec.ts --no-watch`: run a single spec file
- `yarn test:local`: run tests in a real Chromium browser (Playwright)
- `yarn test:cov`: headless run with coverage (used in CI)
- `yarn lint` / `yarn lint:fix`: ESLint for the whole project
- `yarn format-files:check` / `yarn format-files:fix`: Prettier for `src/**`
- `yarn build:prod`: production build to `dist/awg-app`
- `yarn check:snippets`: checks that the `##Abbildung##` snippet PNGs referenced in the edition JSON data exist

Husky and lint-staged run ESLint and Prettier fixes on staged files at commit time.

## Commit conventions

Conventional Commits, enforced by commitlint (`@commitlint/config-angular`). **A scope is mandatory** and must be one of the following: `app, assets, contact, core, deps, deps-dev, edition, gh-actions, home, page-not-found, search, shared, side-info, statistics, structure, testing, views, CHANGELOG, CONTRIBUTING, LICENSE, README`. Example: `refactor(edition): migrate sourceList`. The CHANGELOG and version bumps are generated from commit messages.

Branching follows Gitflow: feature branches start from `develop` and PRs target `develop`. `main` holds releases only.

**Never commit, push, or create PRs without asking first.** Leave changes in the working tree, and propose a commit message instead.

## Architecture

- **Bootstrap**: still NgModule-based (`src/main.ts` → `AppModule`, `app-routing.module.ts`). Views are lazy-loaded feature modules (`views/*-view/*.module.ts`).
- **Path aliases** (tsconfig): `@awg-app/*`, `@awg-core/*`, `@awg-shared/*`, `@awg-side-info/*`, `@awg-views/*`, `@testing/*`.
- **Layout**: `core/` (navbar, footer, view-container, analytics), `shared/` (reusable components, directives, pipes, models; `SharedModule` bundles the legacy non-standalone ones), `views/` (one folder per top-level route).
- **Edition view** (`views/edition-view/`) is the bulk of the app. Routes go `edition/series/:seriesId/...` → `complex/:complexId/{intro,sheets,report,graph}`, plus `preface` and `rowtables`. The components that make up these pages live in `edition-outlets/`, and the matching models are in `edition-view/models/`.
- **Data**: no backend. All edition content is static JSON under `src/assets/data/edition/` (global files such as `edition-complexes.json` and `edition-outline.json`, plus per-complex folders under `series/`). `EditionDataService` fetches it with `HttpClient` and exposes it as signals (`toSignal`). It uses `EDITION_ASSETS_DATA` (`edition-view/data/`) to map asset keys to file names, and `EditionStateService` to decide which complex is current. Complex-specific data signals recompute when the selected complex changes.
- **Rendering**: HTML strings from the data are rendered through `CompileHtmlDirective`. Score sheets are SVGs with D3-driven overlays and zoom (`EditionSvgDrawingService`, `EditionSvgOverlayService`). The graph view uses an RDF store (`rdfstore`, `n3`) with a CodeMirror SPARQL editor.

## Ongoing migration (modern Angular)

Components are being migrated one at a time (one commit per component, e.g. `refactor(edition): migrate sourceDescriptionCorrections`). Each migrated component:

- is standalone (`standalone: false` removed) and lists its own `imports`; parent NgModules move it from `declarations` to `imports`
- uses `input()` / `input.required()` / `model()` / `output()` / `signal()` / `computed()` instead of `@Input`/`@Output` and plain fields; doc comments say "Readonly input signal: x. It holds ..."
- uses `@if` / `@for` control flow in templates
- gets its barrel `index.ts` deleted; importers use the full file path instead (e.g. `./foo/foo.component`, `@awg-views/edition-view/models/textcritics.model`)
- has repeated UI logic extracted into shared components where useful (e.g. `ButtonExpandAllComponent`, `ConditionalLinkComponent`)
- keeps `ChangeDetectionStrategy.OnPush`

## Testing conventions

- Vitest with `globals: false`, so import `describe`, `it`, `expect`, `beforeEach`, and so on from `vitest` explicitly.
- Use the helpers in `src/testing/` instead of raw expects: `expectToBe` and `expectToEqual` (`expect-helper.ts`), `getAndExpectDebugElementByCss` and `getAndExpectDebugElementByDirective`, `detectChangesOnPush`, `clickAndAwaitChanges`, the component and router stubs, and the mock data in `src/testing/mock-data/`.
- Specs are split into `BEFORE initial data binding` and `AFTER initial data binding` blocks. Inputs are provided with `fixture.componentRef.setInput(...)`.
- **Test wording for signals follows `src/testing/test-wording.md`**: describe state, not process ("should have input signal `x` to hold the provided x", "should have computed signal `y` to hold the expected config", "should throw due to missing required input signal `z`"). Never use "should return" or "should be updated to". Don't repeat BEFORE-block assertions in the AFTER block, and avoid redundant length checks next to deep-equal checks.
- To check what a child component receives, get the child instance through `debugElement.injector.get(ChildComponent)` and assert on its signal values.
