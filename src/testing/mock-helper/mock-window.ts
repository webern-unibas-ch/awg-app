/**
 * Type for mocked postmessage events.
 */
type postMessageType = [{ gnd: string }, string];

/**
 * The internal IMockWindow interface.
 *
 * It represents a mocked window object.
 */
interface IMockWindow {
    /**
     * The postMessage function of the mocked window.
     */
    postMessage: (value: { gnd: string }, messageTarget: string) => void;

    /**
     * The get function of the mocked window.
     */
    get: (index: number) => postMessageType;

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
let windowStore: Array<postMessageType> = [];

/**
 * Test helper: mockWindow.
 *
 * It mocks the window object to catch postMessage events.
 */
export const mockWindow: IMockWindow = {
    postMessage: (value: { gnd: string }, messageTarget: string) => {
        windowStore.push([value, messageTarget]);
    },
    get: (index: number): postMessageType => {
        return windowStore[index];
    },
    clear: () => {
        windowStore = [];
    }
};
