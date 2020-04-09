/**
 * Test helper method: cleanStylesFromDOM.
 *
 * It removes all styles from DOM to avoid
 * CSS-based memory leaks in tests.
 * Cf. https://www.forbes.com/sites/forbesdigitalgroup/2019/05/14/improve-your-angular-jasmine-unit-test-speeds-by-500/#49d7b75f4163
 */
export function cleanStylesFromDOM(): void {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const styles: HTMLCollectionOf<HTMLStyleElement> | [] = head.getElementsByTagName('style');

    // @ts-ignore
    for (const style of styles) {
        head.removeChild(style);
    }
}
