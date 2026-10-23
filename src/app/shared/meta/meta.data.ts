import { APP_CONSTANTS } from '@awg-app/app.constants';

import { Meta, MetaContact, MetaPage, MetaStructure } from './meta.model';
import { PERSONS_DATA } from './persons.data';

/**
 * Object constant for page metadata.
 *
 * It provides metadata used for the page framework.
 */
const META_PAGE: MetaPage = {
    yearStart: 2015,
    yearCurrent: new Date().getFullYear(),
    awgAppUrl: APP_CONSTANTS.AWG_APP_URL,
    awgAppDevUrl: APP_CONSTANTS.AWG_APP_URL + '/dev/',
    awgAppGithubUrl: APP_CONSTANTS.AWG_APP_GITHUB_URL,
    awgAppVersion: APP_CONSTANTS.AWG_APP_VERSION,
    awgAppVersionReleaseDate: APP_CONSTANTS.AWG_APP_VERSION_RELEASE_DATE,
    awgAppZenodoUrl: APP_CONSTANTS.AWG_APP_ZENODO_URL,
    awgProjectUrl: APP_CONSTANTS.AWG_PROJECT_URL,
    awgProjectName: APP_CONSTANTS.AWG_PROJECT_NAME,
    compodocUrl: APP_CONSTANTS.AWG_APP_COMPODOC_URL,
    daschUrl: APP_CONSTANTS.DASCH_URL,
    deepWikiUrl: APP_CONSTANTS.DEEP_WIKI_URL,
    dhlabUrl: APP_CONSTANTS.DHLAB_URL,
} as const;

/**
 * Object constant for edition metadata.
 *
 * It provides metadata used for the structure view.
 */
const META_STRUCTURE: MetaStructure = {
    authors: [PERSONS_DATA['stefan_muennich']],
    lastModified: '2016-01-29',
} as const;

/**
 * Object constant for contact metadata.
 *
 * It provides metadata used for the contact view.
 */
const META_CONTACT: MetaContact = {
    developers: [PERSONS_DATA['stefan_muennich']],
    address: {
        institution: 'Musikwissenschaftliches Seminar der Universität Basel',
        street: 'Petersgraben 27/29',
        postalCode: 'CH-4051',
        city: 'Basel',
        country: 'Schweiz',
    },
    email: {
        label: 'E-Mail:',
        mailto: 'mailto:info-awg@unibas.ch',
        safeString: 'info-awg [at] unibas [dot] ch',
    },
    phone: {
        label: 'Telefon:',
        number: '+41 (0)61 207 28 21',
    },
} as const;

/**
 * Object constant for metadata.
 *
 * It provides metadata used throughout different parts of the app.
 *
 * Available main sections: `page`, `edition`, `structure`, `contact`.
 */
export const META_DATA: Meta = {
    page: META_PAGE,
    structure: META_STRUCTURE,
    contact: META_CONTACT,
} as const;
