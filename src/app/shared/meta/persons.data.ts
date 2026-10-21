import { APP_CONSTANTS } from '@awg-app/app.constants';
import { MetaPerson } from './meta.model';

/**
 * Object constant with a set of persons.
 *
 * It provides metadata for the persons (authors, editors) used in the app.
 */
export const PERSONS_DATA: Record<string, MetaPerson> = {
    thomas_ahrend: {
        name: 'Thomas Ahrend',
        homepage: APP_CONSTANTS.AWG_PROJECT_URL + 'de/projekt/mitarbeitende.html',
        identifiers: {
            gnd: '129772429',
            viaf: '74941235',
        },
    },
    michael_matter: {
        name: 'Michael Matter',
        homepage: APP_CONSTANTS.AWG_PROJECT_URL + 'de/projekt/mitarbeitende.html',
        identifiers: {
            gnd: '1069569267',
            viaf: '256375308',
        },
    },
    stefan_muennich: {
        name: 'Stefan Münnich',
        homepage: APP_CONSTANTS.AWG_PROJECT_URL + 'de/projekt/mitarbeitende.html',
        identifiers: {
            gnd: '1068032472',
            orcid: '0000-0002-0744-5374',
            viaf: '314885087',
        },
    },
} as const;
