/* eslint-disable capitalized-comments, spaced-comment */
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes recent versions of Safari, Chrome (including
 * Opera), Edge on the desktop, and iOS and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * APPLICATION IMPORTS
 */
const w = window as any;

// Add global to window, assigning the value of window itself.
w.global = w;

// Workaround for Uncaught ReferenceError: setImmediate is not defined
// cf. https://stackoverflow.com/a/58088954
w.setImmediate = w.setTimeout;

// Workaround for ReferenceError: process is not defined in browser environments.
// n3's readable-stream accesses process.env at module level (no typeof guard);
// rdfstore checks process.browser to detect the environment.
if (w.process === undefined) {
    w.process = {
        browser: true,
        env: {},
        nextTick: (fn: (...args: unknown[]) => void, ...args: unknown[]) => setTimeout(() => fn(...args), 0),
    };
}
