/**
 * The TimelineDate class.
 *
 * It is used in the context of the timeline (search)
 * to store the data for a timeline view.
 */
export class TimelineDate {
    /**
     * The day of the timeline date.
     */
    day: number;

    /**
     * The month of the timeline date.
     */
    month: number;

    /**
     * The start year of the timeline date search.
     */
    searchStart = 1883;

    /**
     * The end year of the timeline date search.
     */
    endStart = 1945;

    /**
     * The start year of the timeline date results.
     */
    findStart: string; // awgFactory.extractYear(response.searchResults[0]);

    /**
     * The end year of the timeline date results.
     */
    findEnd: string; // awgFactory.extractYear(response.searchResults[response.searchResults.length-1]);

    /**
     * Constructor of the TimelineDate class.
     *
     * It initializes the class with values from a given Date.
     *
     * @param {Date} now The given date.
     */
    constructor(now: Date) {
        this.day = now.getDate();
        this.month = now.getMonth() + 1;
    }

    /*
     * not used at the moment
     * obj = response.searchResults (SearchResponseJson)
     *
    extractYear(obj) {
        return obj.date.dateString.split(' ')[3];
    }
    */
}
