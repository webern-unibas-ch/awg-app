/* eslint-disable  prefer-arrow/prefer-arrow-functions */

import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomEqualityTester = jasmine.CustomEqualityTester;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

/**
 * Test helper custom matcher factory: customJasmineMatchers.
 *
 * It exposes custom jasmine matchers to be used in unit tests.
 *
 * For more details on custom matchers see {@link https://stackoverflow.com/a/44996479}.
 */
export const customJasmineMatchers: CustomMatcherFactories = {
    /**
     * Test helper custom matcher: toHaveCssClass.
     *
     * It checks if a given element has an expected CSS class.
     *
     * @param {MatchersUtil} util
     * @param {CustomEqualityTester[]} customEqualityTester
     * @returns {CustomMatcher} The custom matcher instance.
     */
    toHaveCssClass(util: MatchersUtil, customEqualityTester: CustomEqualityTester[]): CustomMatcher {
        return { compare: buildError(false), negativeCompare: buildError(true) };

        function buildError(isNot: boolean) {
            return (actual: HTMLElement, className: string): CustomMatcherResult => {
                return {
                    pass: actual.classList.contains(className) === !isNot,
                    message: `Expected ${actual.outerHTML} ${
                        isNot ? 'not ' : ''
                    }to contain the CSS class "${className}"`
                };
            };
        }
    }
};
