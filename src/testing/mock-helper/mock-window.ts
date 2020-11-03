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
    postMessage: (value: { gnd: string }, messageTarget: string) => void;
    get: (index: number) => postMessageType;
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
