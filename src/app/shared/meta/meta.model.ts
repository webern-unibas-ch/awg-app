/**
 * The MetaSectionTypes enumeration.
 *
 * It defines the available categories for metadata sections.
 */
export enum MetaSectionTypes {
    page = 'page',
    structure = 'structure',
    contact = 'contact',
}

/**
 * The MetaIdentifiers interface.
 *
 * It defines the structure of the authority identifiers for a person.
 */
export interface MetaIdentifiers {
    /**
     * The GND (Gemeinsame Normdatei) identifier of a person.
     */
    gnd?: string;

    /**
     * The ORCID identifier of a person.
     */
    orcid?: string;

    /**
     * The VIAF (Virtual International Authority File) identifier of a person.
     */
    viaf?: string;
}

/**
 * The MetaPerson interface.
 *
 * It defines the structure used to store the metadata about a Person.
 */
export interface MetaPerson {
    /**
     * The (FOAF) name of the person.
     */
    name: string;

    /**
     * The (FOAF) homepage of a person.
     */
    homepage: string;

    /**
     * The authority identifiers of a person.
     */
    identifiers?: MetaIdentifiers;
}

/**
 * The MetaPage interface.
 *
 * It defines the structure used to store the metadata for the main framework.
 */
export interface MetaPage {
    /**
     * The start year for the copyright information.
     */
    yearStart: number;

    /**
     * The recent year for the copyright information.
     */
    yearCurrent: number;

    /**
     * The url to the AWG edition homepage (awg-app).
     */
    awgAppUrl: string;

    /**
     * The url to the dev version of the AWG edition homepage (awg-app-dev).
     */
    awgAppDevUrl: string;

    /**
     * The url to the GitHub repository of the AWG edition website (awg-app).
     */
    awgAppGithubUrl: string;

    /**
     * The latest version of the AWG edition website (awg-app).
     */
    awgAppVersion: string;

    /**
     * The release date of the latest version of the AWG edition website (awg-app).
     */
    awgAppVersionReleaseDate: string;

    /**
     * The url to the Zenodo repository of the AWG edition website (awg-app).
     */
    awgAppZenodoUrl: string;

    /**
     * The name of the AWG.
     */
    awgProjectName: string;

    /**
     * The url to the AWG project homepage.
     */
    awgProjectUrl: string;

    /**
     * The url to the compodoc documentation of the AWG edition website (awg-app).
     */
    compodocUrl: string;

    /**
     * The url to the DaSCH.
     */
    daschUrl: string;

    /**
     * The url to the DeepWiki.
     */
    deepWikiUrl: string;

    /**
     * The url to the DHLab Basel.
     */
    dhlabUrl: string;
}

/**
 * The MetaStructure interface.
 *
 * It defines the structure used to store the metadata the structure view.
 */
export interface MetaStructure {
    /**
     * The authors of the structure overview.
     */
    authors: MetaPerson[];

    /**
     * The last modification date of the structure overview.
     */
    lastModified: string;
}

/**
 * The MetaContact interface.
 *
 * It defines the structure used to store the metadata for the contact view.
 */
export interface MetaContact {
    /**
     * The developers of the app.
     */
    developers: MetaPerson[];

    /**
     * The address info of the contact info.
     */
    address: {
        /**
         * The institution name of the address info.
         */
        institution: string;

        /**
         * The street of the address info.
         */
        street: string;

        /**
         * The postal code of the address info.
         */
        postalCode: string;

        /**
         * The city of the address info.
         */
        city: string;

        /**
         * The country of the address info.
         */
        country: string;
    };

    /**
     * The phone info of the contact info.
     */
    phone: {
        /**
         * The label of the phone info.
         * @example Telefon:
         */
        label: string;

        /**
         * The number of the phone info.
         */
        number: string;
    };

    /**
     * The email info of the contact info.
     */
    email: {
        /**
         * The label of the email info.
         * @example Email:
         */
        label: string;

        /**
         * The mailto of the email info.
         * @example mailto:my_email@host.com
         */
        mailto: string;

        /**
         * The safe string of the email info.
         * @example my_email [at] host [dot] com
         */
        safeString: string;
    };
}

/**
 * The Meta interface.
 *
 * It defines the structure used to store the metadata for different parts of the app.
 */
export interface Meta {
    /**
     * The metadata for the main app framework.
     */
    page: MetaPage;

    /**
     * The metadata for the structure view.
     */
    structure: MetaStructure;

    /**
     * The metadata for the contact view.
     */
    contact: MetaContact;
}
