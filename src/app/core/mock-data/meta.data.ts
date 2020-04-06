import { AppConfig } from '@awg-app/app.config';
import { Meta, MetaContact, MetaPage, MetaStructure } from '@awg-core/core-models';

/**
 * Object constant for page metadata.
 *
 * It provides metadata used for the page framework.
 */
const METAPAGE: MetaPage = {
    yearStart: 2015,
    yearCurrent: new Date().getFullYear(),
    awgAppUrl: AppConfig.AWG_APP_URL,
    compodocUrl: AppConfig.AWG_APP_COMPODOC_URL,
    githubUrl: AppConfig.AWG_APP_GITHUB_URL,
    version: AppConfig.AWG_APP_VERSION,
    versionReleaseDate: AppConfig.AWG_APP_VERSION_RELEASE_DATE,
    awgProjectUrl: AppConfig.AWG_PROJECT_URL,
    awgProjectName: AppConfig.AWG_PROJECT_NAME
};

/**
 * Object constant for edition metadata.
 *
 * It provides metadata used for the structure view.
 */
const METASTRUCTURE: MetaStructure = {
    authors: [
        {
            name: 'Stefan Münnich',
            contactUrl: AppConfig.AWG_PROJECT_URL + 'index.php?id=3'
        }
    ],
    lastModified: '29. Januar 2016'
};

/**
 * Object constant for contact metadata.
 *
 * It provides metadata used for the contact view.
 */
const METACONTACT: MetaContact = {
    address: {
        institution: 'Musikwissenschaftliches Seminar der Universität Basel',
        street: 'Petersgraben 27/29',
        postalCode: 'CH-4051',
        city: 'Basel',
        country: 'Schweiz'
    },
    phone: {
        label: 'Telefon:',
        number: '+41 (0)61 207 28 21'
    },
    email: {
        label: 'E-Mail:',
        mailto: 'mailto:info-awg@unibas.ch',
        safeString: 'info-awg [at] unibas [dot] ch'
    }
};

/**
 * Object constant for metadata.
 *
 * It provides metadata used throughout different parts of the app.
 *
 * Available main sections: `page`, `edition`, `structure`, `contact`.
 */
export const METADATA: Meta = {
    page: METAPAGE,
    structure: METASTRUCTURE,
    contact: METACONTACT
};
