/**
 * The internal IMockConsole interface.
 *
 * It represents a mocked console.
 */
interface IMockConsole {
    log: (message: string) => void;
    get: (index: number) => string;
    clear: () => void;
}

/**
 * Internal variable: consoleMessages.
 *
 * It stores the messages of the console output.
 */
let consoleMessages: string[] = [];

/**
 * Test helper: mockConsole.
 *
 * It mocks the console to catch console output.
 */
export const mockConsole: IMockConsole = {
    log(message: string): void {
        consoleMessages.push(message);
    },

    get(index: number): string {
        return consoleMessages[index];
    },

    clear(): void {
        consoleMessages = [];
    }
};
