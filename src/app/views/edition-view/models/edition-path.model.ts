import { EditionConstants } from './edition-constants';

/**
 * The EditionPath class.
 *
 * It is used in the context of the edition view
 * to store information about the url path of an edition.
 */
export class EditionPath {
    /**
     * The path to the intro section of an edition.
     */
    intro: string;

    /**
     * The path to the detail section of an edition.
     */
    detail: string;

    /**
     * The path to the report section of an edition.
     */
    report: string;

    /**
     * The root of the path of an edition.
     */
    root: string;

    /**
     * Constructor of the EditionPath class.
     *
     * It initializes the class with a composition id from the EditionConstants.
     *
     * @param {string} compositionId The given id of a composition.
     */
    constructor(compositionId: string) {
        const delimiter = '/';

        this.root = EditionConstants.editionPath + compositionId;
        this.intro = this.root + delimiter + EditionConstants.editionIntro;
        this.detail = this.root + delimiter + EditionConstants.editionDetail;
        this.report = this.root + delimiter + EditionConstants.editionReport;
    }
}
