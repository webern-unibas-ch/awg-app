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
     * The url to the DHLab Basel.
     */
    dhlabUrl: string;

    /**
     * The url to the GitHub repository of the AWG edition website (awg-app).
     */
    githubUrl: string;

    /**
     * The url to salsah.
     */
    salsahUrl: string;

    /**
     * The latest version of the AWG edition website (awg-app).
     */
    version: string;

    /**
     * The release date of the latest version of the AWG edition website (awg-app).
     */
    versionReleaseDate: string;
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
