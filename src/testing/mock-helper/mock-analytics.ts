/**
 * Type for mocked analytics events.
 */
type analyticsType = [string, string, { page_path?: string; anonymize_ip?: boolean; send_page_view?: boolean }];

/**
 * The internal IMockAnalytics interface.
 *
 * It represents a mocked analytics object.
 */
interface IMockAnalytics {
    /**
     * The gtag function of the mocked analytics object.
     */
    gtag: (event: string, eventName: string, eventOptions: { [key: string]: string | boolean }) => void;

    /**
     * The getGtag function of the mocked analytics object.
     */
    getGtag: (index: number) => analyticsType;

    /**
     * The clear function of the mocked analytics object.
     */
    clear: () => void;
}

/**
 * Internal variable: analyticsStore.
 *
 * It keeps the analytics events.
 */
let analyticsStore: Array<analyticsType> = [];

/**
 * Test helper: mockAnalytics.
 *
 * It mocks the analytics object to catch analytics events.
 */
export const mockAnalytics: IMockAnalytics = {
    gtag: (
        event: string,
        eventName: string,
        eventOptions: { page_path: string; anonymize_ip: boolean; send_page_view: boolean }
    ): void => {
        analyticsStore.push([event, eventName, eventOptions]);
    },
    getGtag: (index: number): analyticsType => {
        return analyticsStore[index] || null;
    },
    clear: () => {
        analyticsStore = [];
    }
};
