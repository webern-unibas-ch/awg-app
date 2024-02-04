import { AppConfig } from '@awg-app/app.config';
import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
    EDITION_TYPE_CONSTANTS,
} from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

/**
 * The EditionComplexes class.
 *
 * It is used in the context of the edition view
 * to store information about the edition complexes.
 */
export class EDITION_COMPLEXES {
    /**
     * An EditionComplex object for M 30.
     */
    static readonly M30: EditionComplex = new EditionComplex(
        {
            title: 'Studienkomposition für Klavier',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '30',
        },
        {
            editors: [
                {
                    name: 'Michael Matter',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '19. Januar 2024',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_2,
        EDITION_ROUTE_CONSTANTS.SECTION_2A,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 31.
     */
    static readonly M31: EditionComplex = new EditionComplex(
        {
            title: 'Studienkomposition für Klavier',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '31',
        },
        {
            editors: [
                {
                    name: 'Michael Matter',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '19. Januar 2024',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_2,
        EDITION_ROUTE_CONSTANTS.SECTION_2A,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 34.
     */
    static readonly M34: EditionComplex = new EditionComplex(
        {
            title: 'Studienkomposition für Klavier',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '34',
        },
        {
            editors: [
                {
                    name: 'Michael Matter',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2024',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_2,
        EDITION_ROUTE_CONSTANTS.SECTION_2A,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 37.
     */
    static readonly M37: EditionComplex = new EditionComplex(
        {
            title: 'Studienkomposition für Klavier',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '37',
        },
        {
            editors: [
                {
                    name: 'Michael Matter',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '19. Januar 2024',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_2,
        EDITION_ROUTE_CONSTANTS.SECTION_2A,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 212.
     */
    static readonly M212: EditionComplex = new EditionComplex(
        {
            title: '„Der Tag ist vergangen“',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '212',
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
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 213.
     */
    static readonly M213: EditionComplex = new EditionComplex(
        {
            title: '„Schien mir’s, als ich sah die Sonne“',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '213',
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
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 216.
     */
    static readonly M216: EditionComplex = new EditionComplex(
        {
            title: 'Gleich und Gleich („Ein Blumenglöckchen“)',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '216',
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
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for M 217.
     */
    static readonly M217: EditionComplex = new EditionComplex(
        {
            title: 'Die geheimnisvolle Flöte („An einem Abend“)',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
            catalogueNumber: '217',
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
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 3.
     */
    static readonly OP3: EditionComplex = new EditionComplex(
        {
            title: '<em>Fünf Lieder aus</em> Der siebente Ring <em>von Stefan George</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
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
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 4.
     */
    static readonly OP4: EditionComplex = new EditionComplex(
        {
            title: '<em>Fünf Lieder nach Gedichten von Stefan George</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
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
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 12.
     */
    static readonly OP12: EditionComplex = new EditionComplex(
        {
            title: '<em>Vier Lieder</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '12',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2023',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 19.
     */
    static readonly OP19: EditionComplex = new EditionComplex(
        {
            title: '<em>Zwei Lieder für gemischten Chor und Ensemble</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '19',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2023',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_3,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 22.
     */
    static readonly OP22: EditionComplex = new EditionComplex(
        {
            title: 'Quartett für Geige, Klarinette, Tenorsaxophon und Klavier',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '22',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2023',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_2,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 23.
     */
    static readonly OP23: EditionComplex = new EditionComplex(
        {
            title: '<em>Drei Gesänge aus</em> Viae Inviae <em>von Hildegard Jone</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '23',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2023',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 24.
     */
    static readonly OP24: EditionComplex = new EditionComplex(
        {
            title: '<em>Konzert für neun Instrumente</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '24',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2023',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_1,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 25.
     */
    static readonly OP25: EditionComplex = new EditionComplex(
        {
            title: '<em>Drei Lieder nach Gedichten von Hildegard Jone</em>',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '25',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '19. Januar 2024',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_5,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 27.
     */
    static readonly OP27: EditionComplex = new EditionComplex(
        {
            title: 'Variationen für Klavier',
            catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
            catalogueNumber: '27',
        },
        {
            editors: [
                {
                    name: 'Thomas Ahrend',
                    homepage: AppConfig.AWG_PROJECT_URL + 'index.php?id=3',
                },
            ],
            lastModified: '6. Mai 2023',
        },
        EDITION_ROUTE_CONSTANTS.SERIES_1,
        EDITION_ROUTE_CONSTANTS.SECTION_2,
        EDITION_TYPE_CONSTANTS.SKETCH_EDITION
    );
}
