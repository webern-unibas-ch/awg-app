/**
 * Utils method: getErrorMessage.
 *
 * It retrieves the message to display for a given error of unknown format.
 *
 * @param {unknown} err The given unknown error.
 * @returns {string} The error message.
 */
export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }

    if (err && typeof err === 'object') {
        const anyObjectErr = err as Record<string, unknown>;

        if (typeof anyObjectErr['message'] === 'string' && anyObjectErr['message']) {
            return anyObjectErr['message'];
        }
        if (typeof anyObjectErr['statusText'] === 'string' && anyObjectErr['statusText']) {
            return anyObjectErr['statusText'];
        }
        try {
            return JSON.stringify(anyObjectErr);
        } catch {
            const objectKeys = Object.keys(anyObjectErr).join(', ');
            return `[Complex Error Object with keys: ${objectKeys}]`;
        }
    }

    if (typeof err === 'string' || typeof err === 'number' || typeof err === 'boolean') {
        return `${err}`;
    }

    return 'Unknown error format';
}

/**
 * Utils constants: ERROR_UTILS.
 *
 * It keeps a namespace reference to the error utils methods.
 */
export const ERROR_UTILS = {
    getErrorMessage,
} as const;
