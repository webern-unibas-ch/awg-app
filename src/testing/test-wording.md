### Angular Signals: Unit-Testing Wording and Structure Standard

Since signals represent **reactive states** rather than imperative variables or classic methods, test descriptions must always declare **what the signal holds in memory**, instead of what a method returns or that a value was updated.

---

### 1. The Golden Rule: State over Process

- ❌ **Incorrect (imperative):** `... should return ...`, `... should be updated to ...`, `... should change to ...`
- **Correct (declarative):** `... should hold ...`, `... should hold the provided ...`, `... should hold the expected ...`

---

### 2. Standard Assertions for Signals

### A. Signal Inputs (Properties / Objects / Primitives)

Use the pattern: **`... to hold the provided [name/data]`**

- **Object / Dataset:**  
  ``it('... should have input signal `id` to hold the provided id')``
- **Arrays / Lists:**  
  ``it('... should have input signal `items` to hold the provided items')``
- **General Data Structure:**  
  ``it('... should have input signal `pageMetaData` to hold the provided data')``

### B. Booleans / Flags (States)

Use the pattern: **`... to hold true / false / the provided value`**

- **Standard Boolean:**  
  ``it('... should have signal `isFullscreen` to hold true')``
- **Dynamic Boolean Input:**  
  ``it('... should have input signal `isDropdown` to hold the provided value')``

### C. Computed Signals (Calculated States)

Use the pattern: **`... to hold the expected [name] / [value]`**

- **Configurations:**  
  ``it('... should have computed signal `fullscreenToggleBtn` to hold the expected config')``
- **Calculated Data:**  
  ``it('... should have computed signal `displayedBadges` to hold the expected badges')``
- **Fallback / Default Values:**  
  ``it('... should have computed signal `infoMessage` to hold the default value')``
- **Edge Cases (Null / Empty):**  
  ``it('... should have computed signal `versionData` to hold null if pageMetaData is missing')``

- **Recomputation:**
  ``it('... should have recomputed signal `fullscreenToggleBtn` when input changes')``

### D. Linked Signals (Derived, but Writable States)

Use the same patterns as for computed signals, but name the signal type **`linked signal`**:

- ``it('... should have linked signal `selectedTkkOverlays` to hold an empty array')``
- `it('... should hold an empty array again when the selected svg sheet changes')` (inside a `describe('... linked signal `selectedTkkOverlays`')`)

---

### 3. The Hierarchy: `BEFORE` vs. `AFTER` Data Binding

Every component spec is split into a `BEFORE initial data binding` and an `AFTER initial data binding` block, **also for components without inputs**. The top-level `beforeEach` only creates the fixture; it never calls `fixture.detectChanges()`.

### Within the `BEFORE initial data binding` Block (Prior to `fixture.detectChanges()`)

Here, we exclusively verify existence, type safety (`isSignal`), and the **initial default state** before Angular processes the template.

- **Optional Inputs** resolve to `undefined`:  
  ``it('... should have input signal `headerLabel` to hold undefined initially')``
- **Required Inputs** must not be accessed yet and are expected to crash (`toThrow`):  
  ``it('... should throw due to missing required input signal `identifiers`')``
- **Computed signals depending on required inputs** crash as well:  
  ``it('... should throw when accessing computed signal `versionData` due to missing input')``
- **Static view** (everything that renders without data binding, e.g. `@for` content not rendered yet) is tested here in a `VIEW` block.

### Within the `AFTER initial data binding` Block (After `fixture.detectChanges()`)

Here, we verify the state after test data has been supplied via `setInput`.

- **No Redundant Sanity Checks:** If a signal was already verified as `false` in the `BEFORE` block, and the initial data binding does not actively mutate it, this assertion is **not** repeated in the `AFTER` block.
- **Focus on the Delta:** Only properties that actively changed due to the provided inputs or initial execution are tested in the `AFTER` block.

---

### 4. Best Practices for Lean Test Files

- **Avoid Deeply Nested `describe` Blocks for single Edge Cases:** Instead of nesting `describe('should return null if') { it('url is missing') }`, flatten the test cases into clean, readable sentences:  
  `it('... should have computed signal `versionData` to hold null if awgAppGithubUrl is missing')`
- **Avoid Redundant Array Assertions:** A single `expectToEqual(array, expectedArray)` (Deep Equal) validates content, structure, and length simultaneously. A separate `expectToBe(array.length, X)` is redundant and should be removed.
- **Avoid Router State Mixing:** If a `beforeEach` initializes a specific route, do not navigate away and back within a single `it` block. Create separate, isolated `it` statements for different routing states instead (e.g., `... to hold false when route is not /edition`).

---

### 5. Spec Structure: `describe` Blocks

- **Capitalized blocks only for `VIEW` and `METHODS`** (inside `BEFORE`/`AFTER initial data binding`). Do not add `INPUTS`, `OUTPUTS`, `SIGNALS`, `HOST` or similar capitalized blocks.
- **Signal and input assertions** go directly into the `BEFORE`/`AFTER` blocks (or into lowercase sub-describes like `describe('... computed signal `selectedSvgSheet`')`).
- **DOM interactions** (clicks, host bindings, outputs emitted on click) go into `VIEW`, e.g. `describe('... output `browseRequest`')` inside `VIEW`.
- **Lowercase descriptive sub-describes** are fine anywhere: `describe('... with partials')`, `describe('... should do nothing if')`.
- **Every method block starts with an existence test**, also for private methods:

    ```ts
    describe('#onSheetBrowse()', () => {
        it('... should have a method `onSheetBrowse`', () => {
            expect(component.onSheetBrowse).toBeDefined();
        });
        // ...
    });

    describe('#_selectSvgSheet()', () => {
        it('... should have a method `_selectSvgSheet`', () => {
            expect(component['_selectSvgSheet']).toBeDefined();
        });
        // ...
    });
    ```

---

### 6. Isolating Child Components: Hollow Children

**Never call `TestBed.overrideComponent()` on the component under test.** Any override recompiles its template in JIT, so the AOT template (and its coverage) is no longer executed: the `.html` coverage drops to 0% (see [angular/angular-cli#30127](https://github.com/angular/angular-cli/issues/30127)). `vi.mock` is not an alternative either; the Angular unit-test builder does not support it.

Instead, **hollow out the direct children**: keep their real classes, but empty their template and imports:

```ts
await TestBed.configureTestingModule({
    imports: [EditionSheetsComponent],
    providers: [
        // only the direct injections of the hollow children
        { provide: FullscreenService, useValue: { isFullscreen: signal(false).asReadonly() } },
    ],
})
    .overrideComponent(EditionSheetsPanelComponent, { set: { template: '', imports: [] } })
    .overrideComponent(EditionFoliosPanelComponent, { set: { template: '', imports: [] } })
    .compileComponents();
```

- **The component under test stays untouched**, so its AOT template is covered.
- **The children keep their real selectors, inputs and outputs.** Pass-down and output tests run against the real API (`debugElement.injector.get(EditionSheetsPanelComponent)`), so a renamed input breaks the test instead of silently drifting from a stub.
- **No grandchildren are rendered**, so no extra services, D3 or SVG mocks are needed; only the direct injections of the hollow children have to be provided.
- **Wording:** mark them as `(hollow)` instead of `(stubbed)` in test descriptions, e.g. `'... should contain one EditionSheetsPanelComponent (hollow)'`.
- The hollow children's own coverage does not count in this spec; it comes from their own specs.
- **Content projection:** children that project content of the component under test (e.g. `ConditionalLinkComponent`, `FormSwitchComponent`) are hollowed with `template: '<ng-content />'`. Assert the projected content on the child's host element and interactions via its API (`childCmp.clicked.emit()`, `childCmp.isClickable()`), not via its internal DOM.
- **Exception:** children with required view queries that need heavy dependencies (e.g. `EditionSheetViewerSvgComponent` with `viewChild.required(SvgZoomDirective)`) stay real; mock their direct injections and comment why.
