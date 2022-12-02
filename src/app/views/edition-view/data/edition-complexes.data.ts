import { AppConfig } from '@awg-app/app.config';
import { EDITION_CATALOGUE_TYPES, EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

/**
 * The EditionComplexes class.
 *
 * It is used in the context of the edition view
 * to store information about the edition complexes.
 */
export class EDITION_COMPLEXES {
    /**
     * An EditionComplex object for M 34.
     */
    static readonly M34: EditionComplex = new EditionComplex(
        {
            title: 'Studienkomposition für Klavier',
            catalogueType: EDITION_ROUTE_CONSTANTS.MNR,
            catalogueNumber: '34',
        },
        {
            editors: [
                {
                    name: 'Michael Matter',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '07. Juli 2022',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_2,
        EDITION_ROUTE_CONSTANTS.SECTION_2A,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 3.
     */
    static readonly OP3: EditionComplex = new EditionComplex(
        {
            title: '<em>Fünf Lieder aus</em> Der siebente Ring <em>von Stefan George</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '3',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '---',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 4.
     */
    static readonly OP4: EditionComplex = new EditionComplex(
        {
            title: '<em>Fünf Lieder nach Gedichten von Stefan George</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '4',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '---',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 12.
     */
    static readonly OP12: EditionComplex = new EditionComplex(
        {
            title: '<em>Vier Lieder</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '12',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '01. Juni 2022',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 19.
     */
    static readonly OP19: EditionComplex = new EditionComplex(
        {
            title: '<em>Zwei Lieder für gemischten Chor und Ensemble</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '19',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '23. März 2022',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_3,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 23.
     */
    static readonly OP23: EditionComplex = new EditionComplex(
        {
            title: '<em>Drei Gesänge aus</em> Viae Inviae <em>von Hildegard Jone</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '23',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '23. März 2022',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 24.
     */
    static readonly OP24: EditionComplex = new EditionComplex(
        {
            title: '<em>Konzert für neun Instrumente</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '24',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '23. März 2022',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_1,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 25.
     */
    static readonly OP25: EditionComplex = new EditionComplex(
        {
            title: '<em>Drei Lieder nach Gedichten von Hildegard Jone</em>',
            catalogueType: EDITION_CATALOGUE_TYPES.OPUS,
            catalogueNumber: '25',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '23. Februar 2022',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_ROUTE_CONSTANTS.SKETCH_EDITION
    );
}
