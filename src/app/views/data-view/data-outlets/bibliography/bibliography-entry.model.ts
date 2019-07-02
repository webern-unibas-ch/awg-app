/* tslint:disable variable-name */

/**
 * The BibEntry class.
 *
 * It is used in the context of the bibliography
 * to store the data of a bibliographic entry.
 */
export class BibEntry {
    /**
     * Constructor of the SearchInfo class.
     *
     * It initializes the class with values
     * from a given query and number of hits
     * of a search.
     *
     * @param {string} query The given query string.
     * @param {string} nhits The given number of hits.
     */
    constructor(
        Kurztitel: string,
        Typ: string,
        Author: string,
        Titel_selbst: string,
        Publikationsdatum: string,
        Titel_unselbst?: string,
        Herausgeber?: string,
        unpubliziert?: string,
        Verlagsort?: string,
        Verlag?: string,
        Seitenangabe?: string,
        Reihentitel?: string,
        Versionsdatum?: string,
        Status?: string,
        Quelle?: string,
        Standort?: string,
        Kommentar?: string
    ) {}
}
