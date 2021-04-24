/**
 * The internal IMockConsole interface.
 *
 * It represents a mocked console.
 */
interface IMockConsole {
    /**
     * The log function of the mocked console.
     */
    log: (message: string) => void;

    /**
     * The get function of the mocked console.
     */
    get: (index: number) => string;

    /**
     * The clear function of the mocked console.
     */
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
    },
};
