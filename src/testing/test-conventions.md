# Unit-Testing Conventions

## 1. Wording: Results over Process

Test descriptions declare a **result**, not a process:

- **States** (signals, fields, constants, configurations) **hold** a value: ``... should have computed signal `x` to hold the expected config``, `... should hold a timeout of 10 seconds`.
- **Functions and methods with a return value** (utils, service methods, private methods, accessors) **return** a value: `... should return the point of a mouse event relative to the canvas`.
- **Methods with a side effect** name the effect: `... should emit the clicked node`, `... should set the hovered node`, `... should call the zoom behaviour`.
- ❌ **Process:** `... should be updated to ...`, `... should change to ...`, `... should return early ...` (instead: `... should do nothing when ...`).

### Signal Patterns

Name the signal type (`input signal`, `signal`, `computed signal`, `linked signal`); inside a describe that already names the signal (only for several checks, see [`describe` Blocks](#describe-blocks)), the short form `... should hold ...` is enough.

| Case                | Pattern                                  | Example                                                                                   |
| ------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| Input               | `to hold the provided …`                 | ``... should have input signal `items` to hold the provided items``                       |
| Boolean             | `to hold true / false`                   | ``... should have signal `isFullscreen` to hold true``                                    |
| Computed            | `to hold the expected …`                 | ``... should have computed signal `displayedBadges` to hold the expected badges``         |
| Default / edge case | `to hold the default value / null if …`  | ``... should have computed signal `versionData` to hold null if pageMetaData is missing`` |
| Recomputation       | `should have recomputed signal … when …` | ``... should have recomputed signal `fullscreenToggleBtn` when input changes``            |
| Linked signal       | as computed                              | ``... should have linked signal `selectedTkkOverlays` to hold an empty array``            |

---

## 2. Spec Structure

### `BEFORE` vs. `AFTER` Initial Data Binding

Every component spec is split into a `BEFORE initial data binding` and an `AFTER initial data binding` block, **also for components without inputs**. The top-level `beforeEach` only creates the fixture; it never calls `fixture.detectChanges()`. Inputs are provided with `fixture.componentRef.setInput(...)`.

- **`BEFORE`** verifies existence, type and the initial state, plus the static view (everything that renders without data binding) in a `VIEW` block:
    - the first test of a signal includes its existence check, also when it throws:

        ```ts
        it('... should have signal `isFullscreen` to hold false', () => {
            expectToBe(isSignal(component.isFullscreen), true);

            expectToBe(component.isFullscreen(), false);
        });
        ```

    - optional inputs hold `undefined`: ``... should have input signal `headerLabel` to hold undefined initially``
    - required inputs, and computed signals depending on them, throw: ``... should throw due to missing required input signal `identifiers` ``
    - static inputs of children outside `@if`/`@for` are set on creation: ``... should pass down the static `infoMessage` to AlertInfoComponent (hollow)``
- **`AFTER`** tests the state after the data binding (signal values, rendered view, methods); values that did not change since `BEFORE` are not asserted again, unless `AFTER` would be empty (`... should still pass down …`).

### `describe` Blocks

- **Capitalized blocks only for `VIEW` and `METHODS`**, no `INPUTS`, `OUTPUTS`, `SIGNALS`, `HOST` or similar.
- **Signals** are usually asserted in a single `it` directly in `BEFORE`/`AFTER` (``... should have signal `x` to hold …``). A sub-describe that names them (``describe('... computed signal `selectedSvgSheet`')``) only pays off for several checks (e.g. multiple computations or recomputations). `describe('#x()')` is for methods only.
- **DOM interactions** (clicks, host bindings, outputs emitted on click) go into `VIEW`, e.g. ``describe('... output `browseRequest`')``.
- **Lowercase sub-describes** are fine anywhere (`describe('... with partials')`); a single case is flattened into one `it` instead.
- **`it.each` loops** replace repeated `it`s that differ only in their data (two cases may stay separate `it`s). They vary the data of one subject; tests of different subjects (signals, members, view elements) stay separate `it`s. They sit in a describe that holds the common description, while the `it` titles only name the differences:

    ```ts
    describe('... should hold false if', () => {
        it.each([
            { desc: 'complexId is missing', ... },
            { desc: 'sheetId is missing', ... },
        ])('... $desc', ({ ... }) => { ... });
    });
    ```

- **Every method block starts with an existence test**, also for private methods (not needed in integration specs):

    ```ts
    describe('#_selectSvgSheet()', () => {
        it('... should have a method `_selectSvgSheet`', () => {
            expect(component['_selectSvgSheet']).toBeDefined();
        });
        // ...
    });
    ```

---

## 3. Assertions

- **Expect helpers:** use `expectToBe` and `expectToEqual` (`expect-helper.ts`) instead of raw expects. Negations and expectations of `undefined` stay raw (the helpers also assert `toBeDefined()`).
- **No redundant length checks:** a deep-equal `expectToEqual(array, expectedArray)` already covers the length.
- **Spy calls:** use `expectSpyCall(spy, times, mostRecentArgs?)` instead of `toHaveBeenCalled…()`; it checks the exact number of calls and, optionally, the arguments of the most recent call (an array for several arguments): `expectSpyCall(navigateSpy, 1, [['/edition'], { fragment }])`, `expectSpyCall(clickSpy, 0)`. Raw matchers stay for checks of an earlier call (`toHaveBeenNthCalledWith`), for call counts that depend on the run (change detection, timers, simulation ticks), and for inline `vi.fn()` mocks of a casted object (e.g. the fixture mock in `click-helper.spec.ts`).
- **No calls inside expectations:** assign the result of a call with arguments to a named `const` first, then assert, separated by a blank line. Reads stay inline (signals, properties, `isSignal`, DOM accessors like `getAttribute`). Several inputs of the same function become an `it.each`:

    ```ts
    const zoomTransform = D3_ZOOM.zoomIdentity.translate(10, 20).scale(2);
    const zoomedPoint = service.toCanvasPoint({ x: 100, y: 0 }, { transform: zoomTransform, viewport });

    expectToEqual(zoomedPoint, { x: 610, y: 220 });
    ```

- **Separate debug elements from native elements:** assign the debug elements of `getAndExpectDebugElementBy…()` first, then the native element with a type annotation (no `as` cast); getters follow the same split:

    ```ts
    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

    const getInputDes = () => getAndExpectDebugElementByCss(compDe, 'input#search', 1, 1);
    const getInputEl = (): HTMLInputElement => getInputDes()[0].nativeElement;
    ```

- **Child inputs:** get the child instance via `debugElement.injector.get(ChildComponent)` and assert on its signal values.
- **No assertions on removed behaviour:** after removing something, do not assert its absence. Values the code deliberately sets to `null` may be tested.
- **No router state mixing:** do not navigate away and back within one `it`; use separate `it`s per routing state.

---

## 4. Hollow Children

**Never `overrideComponent()` the component under test:** the override recompiles its template in JIT, so the AOT template and its coverage are lost ([angular/angular-cli#30127](https://github.com/angular/angular-cli/issues/30127)); `vi.mock` is not supported by the unit-test builder either. Instead, **hollow out the direct children** (real class, empty template and imports) and provide only their direct injections:

```ts
.overrideComponent(EditionSheetsPanelComponent, { set: { template: '', imports: [] } })
```

- **Real API, no grandchildren:** the children keep their selectors, inputs and outputs, so a renamed input breaks the test; nothing below them renders (no extra services, D3 or SVG mocks). Their coverage comes from their own specs.
- **Wording:** `'... should contain one EditionSheetsPanelComponent (hollow)'`.
- **Content projection** (e.g. `ConditionalLinkComponent`): hollow with `template: '<ng-content />'`; assert the projected content on the child's host element and interactions via its API (`childCmp.clicked.emit()`), not its internal DOM.
- **Exception:** children with required view queries stay real (hollowed they throw `NG0951`); mock the direct injections of heavy ones (e.g. `EditionSheetViewerSvgComponent`). Comment why; no `(hollow)` mark.

---

## 5. Test Environment

- **jsdom** has no touch events, no canvas raster and a real `process.nextTick`. Check performance (rdfstore, canvas drawing) in Chromium (`yarn test:local` or the app; canvas raster headed with GPU, not headless), and the change detection of third-party libraries (ng-bootstrap, CodeMirror, ngx-json-viewer) in the browser.
- **Stale bundles:** if a single-spec run (`--include`) ignores source edits (e.g. a counter-check passes without the fix), rerun after a unique change to the spec (e.g. `// fresh <timestamp>`), then remove it.
