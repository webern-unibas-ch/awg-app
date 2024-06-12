/**
 * The JdnDate interface.
 *
 * It is used in the context of the data view
 * to store the data for a JDN date reference
 * and to provide the html to display a
 * date.
 */
export interface JdnDate {
    /**
     * The first date value as a JDN string.
     */
    dateval1: string;

    /**
     * The second date value as a JDN string.
     */
    dateval2: string;

    /**
     * The calendar type.
     */
    calendar: 'GREGORIAN' | 'JULIAN';

    /**
     * The date precision for the first date.
     */
    dateprecision1: 'DAY' | 'MONTH' | 'YEAR';

    /**
     * The date precision for the second date.
     */
    dateprecision2: 'DAY' | 'MONTH' | 'YEAR';
}
