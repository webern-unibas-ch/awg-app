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
    constructor(compositionId: string, series?: string, section?: string, type?: string) {
        const delimiter = '/';

        let rootPath = EditionConstants.editionPath;
        rootPath += series ? series : ''; // EditionConstants.series1.path;
        rootPath += section ? section : ''; // EditionConstants.section1.path;
        rootPath += type ? type : ''; // EditionConstants.textEdition.path;

        this.root = rootPath + compositionId + delimiter;
        this.intro = EditionConstants.editionIntro.path;
        this.detail = EditionConstants.editionDetail.path;
        this.report = EditionConstants.editionReport.path;
    }
}
