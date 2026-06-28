/**
 * The MetaSectionTypes enumeration.
 *
 * It stores the possible metadata section types.
 */
export enum MetaSectionTypes {
    page = 'page',
    structure = 'structure',
    contact = 'contact',
}

/**
 * The MetaIdentifierBadge interface.
 *
 * It defines the structure of an authority identifier badge.
 */
export interface MetaIdentifierBadge {
    /**
     * The key of the badge, which corresponds to the authority identifier type (e.g., 'gnd', 'viaf', 'orcid').
     */
    key: keyof MetaIdentifiers;

    /**
     * The full URL for the badge.
     */
    fullUrl: string;

    /**
     * The source URL for the badge icon.
     */
    src: string;

    /**
     * The label for the badge.
     */
    label: string;

    /**
     * The title text for the badge.
     */
    titleText: string;
}

/**
 * The MetaIdentifiers class.
 *
 * It is used to store authority identifiers for a person.
 */
export class MetaIdentifiers {
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
 * The MetaPerson class.
 *
 * It is used to store the metadata about a Person.
 */
export class MetaPerson {
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
 * The MetaPage class.
 *
 * It is used in the context of the app framework
 * to store the metadata for the main framework.
 */
export class MetaPage {
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
 * The MetaStructure class.
 *
 * It is used in the context of the structure view
 * to store the metadata about the structure overview.
 */
export class MetaStructure {
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
 * The MetaContact class.
 *
 * It is used in the context of the contact view
 * to store the metadata about contact information.
 */
export class MetaContact {
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
 * The Meta class.
 *
 * It is used in the context of the app framework
 * to store the metadata for different parts of the app.
 */
export class Meta {
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
