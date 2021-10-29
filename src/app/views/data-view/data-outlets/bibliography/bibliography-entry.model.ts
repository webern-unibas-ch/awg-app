/* eslint-disable  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */

/**
 * The BibEntry class.
 *
 * It is used in the context of the bibliography
 * to store the data of a bibliographic entry.
 */
export class BibEntry {
    /**
     * Constructor of the BibEntry class.
     *
     * It initializes the class with values
     * from a given bibliographic item.
     *
     * @param {string} Kurztitel The given short title.
     * @param {string} Typ The given type.
     * @param {string} Author The given author.
     * @param {string} Titel_selbst The given dependent title.
     * @param {string} Publikationsdatum The given type.
     * @param {string} [Titel_unselbst] The given optional independent title.
     * @param {string} [Herausgeber] The given optional editor.
     * @param {string} [unpubliziert] The given optional unpublished flag.
     * @param {string} [Verlagsort] The given optional publication place.
     * @param {string} [Verlag] The given optional publisher.
     * @param {string} [Seitenangabe] The given optional page number.
     * @param {string} [Reihentitel] The given optional series title.
     * @param {string} [Versionsdatum] The given optional version date.
     * @param {string} [Status] The given optional status.
     * @param {string} [Quelle] The given optional source.
     * @param {string} [Standort] The given optional location.
     * @param {string} [Kommentar] The given optional comment.
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
    ) {
        // This is intentionally empty
    }
}
