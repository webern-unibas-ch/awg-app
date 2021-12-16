/**
 * Type for stored postmessage mock events.
 */
type storedPostMessageType = [{ gnd: string }, string | WindowPostMessageOptions | undefined];

/**
 * The internal IMockWindow interface.
 *
 * It represents a mocked window object.
 */
interface IMockWindow {
    /**
     * The postMessage function of the mocked window.
     */
    postMessage: {
        (message: any, targetOrigin: string, transfer?: Transferable[]): void;
        (message: any, options?: WindowPostMessageOptions): void;
    };

    /**
     * The get function of the mocked window.
     */
    get: (index: number) => storedPostMessageType;

    /**
     * The clear function of the mocked window.
     */
    clear: () => void;
}

/**
 * Internal variable: windowStore.
 *
 * It keeps the postMessage events.
 */
let windowStore: Array<storedPostMessageType> = [];

/**
 * Test helper: mockWindow.
 *
 * It mocks the window object to catch postMessage events.
 */
export const mockWindow: IMockWindow = {
    postMessage: (message: { gnd: string }, targetOrigin: string | WindowPostMessageOptions) => {
        windowStore.push([message, targetOrigin]);
    },
    get: (index: number): storedPostMessageType => windowStore[index],
    clear: () => {
        windowStore = [];
    },
};
