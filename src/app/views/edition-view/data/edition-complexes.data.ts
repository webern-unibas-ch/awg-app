import { AppConfig } from '@awg-app/app.config';
import { EditionComplex, EditionConstants } from '@awg-views/edition-view/models';

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
            catalogueType: EditionConstants.MNR,
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
        EditionConstants.SERIES_2,
        EditionConstants.SECTION_2A,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 3.
     */
    static readonly OP3: EditionComplex = new EditionComplex(
        {
            title: '<em>Fünf Lieder aus</em> Der siebente Ring <em>von Stefan George</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 4.
     */
    static readonly OP4: EditionComplex = new EditionComplex(
        {
            title: '<em>Fünf Lieder nach Gedichten von Stefan George</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 12.
     */
    static readonly OP12: EditionComplex = new EditionComplex(
        {
            title: '<em>Vier Lieder</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 19.
     */
    static readonly OP19: EditionComplex = new EditionComplex(
        {
            title: '<em>Zwei Lieder für gemischten Chor und Ensemble</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_3,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 23.
     */
    static readonly OP23: EditionComplex = new EditionComplex(
        {
            title: '<em>Drei Gesänge aus</em> Viae Inviae <em>von Hildegard Jone</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 24.
     */
    static readonly OP24: EditionComplex = new EditionComplex(
        {
            title: '<em>Konzert für neun Instrumente</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_1,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionComplex object for Opus 25.
     */
    static readonly OP25: EditionComplex = new EditionComplex(
        {
            title: '<em>Drei Lieder nach Gedichten von Hildegard Jone</em>',
            catalogueType: EditionConstants.OPUS,
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
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );
}
