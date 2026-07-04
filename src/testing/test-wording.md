### Angular Signals: Unit-Testing Wording Standard

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

---

### 3. The Hierarchy: `BEFORE` vs. `AFTER` Data Binding

### Within the `BEFORE initial data binding` Block (Prior to `fixture.detectChanges()`)

Here, we exclusively verify existence, type safety (`isSignal`), and the **initial default state** before Angular processes the template.

- **Optional Inputs** resolve to `undefined`:  
  ``it('... should have input signal `headerLabel` to hold undefined initially')``
- **Required Inputs** must not be accessed yet and are expected to crash (`toThrow`):  
  ``it('... should throw when accessing input signal `identifiers` due to missing input')``

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
