/**
 * The MetaPage class.
 *
 * It is used in the context of the app framework
 * to store the meta data for the main framework.
 */
class MetaPage {
    /**
     * The start year for the copyright information.
     */
    yearStart: number;

    /**
     * The recent year for the copyright information.
     */
    yearCurrent: number;

    /**
     * The url to the Webern edition app.
     */
    editionUrl: string;

    /**
     * The url to the Webern project homepage.
     */
    webernUrl: string;

    /**
     * The latest version of the Webern edition app.
     */
    version: string;

    /**
     * The release date of the latest version of the Webern edition app.
     */
    versionReleaseDate: string;
}

/**
 * The MetaEdition class.
 *
 * It is used in the context of the edition view
 * to store the meta data about the edition.
 */
class MetaEdition {
    /**
     * The editors of an edition.
     */
    editors: string;

    /**
     * The last modification date of an edition.
     */
    lastModified: string;
}

/**
 * The MetaStructure class.
 *
 * It is used in the context of the structure view
 * to store the meta data about the structure overview.
 */
class MetaStructure {
    /**
     * The author of the structure overview.
     */
    author: string;

    /**
     * The last modification date of the structure overview.
     */
    lastModified: string;
}

/**
 * The Meta class.
 *
 * It is used in the context of the app framework
 * to store the meta data for different parts of the app.
 */
export class Meta {
    /**
     * The meta data for the main app framework.
     */
    page: MetaPage;

    /**
     * The meta data for the edition view.
     */
    edition: MetaEdition;

    /**
     * The meta data for the structure view.
     */
    structure: MetaStructure;
}
