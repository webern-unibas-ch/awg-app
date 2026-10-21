/* eslint-disable capitalized-comments, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- patches untyped globals for third-party libraries */
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

/**
 * Helper function: scheduleTask.
 *
 * It runs the given callback in a later task (like Node's setImmediate), via a message channel:
 * nested timeouts are clamped to >= 4 ms, which slows down rdfstore (it yields every 100 steps).
 *
 * @param {(...args: unknown[]) => void} fn The given callback.
 * @param {...unknown} args The given arguments of the callback.
 * @returns {void} Schedules the callback.
 */
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

/**
 * Constant: w.
 *
 * It keeps the window as untyped global object to patch.
 */
const w = window as any;

// n3's readable-stream reads `global.process` at module level (in the browser test runner)
w.global = w;

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
