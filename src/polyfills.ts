/* eslint-disable capitalized-comments, spaced-comment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- patches untyped globals for third-party libraries */
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
// n3's readable-stream loads the `process` package, which reads `global.process` at module level
// (needed in the browser test runner; the production bundle does not reference `global`).
w.global = w;

// Runs the callback asynchronously in a later task (like Node's setImmediate).
// rdfstore yields via process.nextTick every 100 steps: with setTimeout, nested timers are clamped to
// >= 4 ms in browsers (1,000 triples take ~12 s, 100,000 do not finish), a message channel does not.
// The fallback to setTimeout is for runtimes without MessageChannel.
const scheduleTask = (() => {
    if (typeof MessageChannel === 'undefined') {
        return (fn: (...args: unknown[]) => void, ...args: unknown[]) => setTimeout(() => fn(...args), 0);
    }

    const channel = new MessageChannel();
    const queue: (() => void)[] = [];
    channel.port1.onmessage = () => queue.shift()?.();

    return (fn: (...args: unknown[]) => void, ...args: unknown[]) => {
        queue.push(() => fn(...args));
        channel.port2.postMessage(null);
    };
})();

// Workaround for Uncaught ReferenceError: setImmediate is not defined
// cf. https://stackoverflow.com/a/58088954
w.setImmediate = scheduleTask;

// Workaround for ReferenceError: process is not defined in browser environments.
// n3's readable-stream accesses process.env at module level (no typeof guard);
// rdfstore checks process.browser to detect the environment.
if (w.process === undefined) {
    w.process = {
        browser: true,
        env: {},
        nextTick: scheduleTask,
    };
}
