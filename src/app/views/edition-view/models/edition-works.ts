import { AppConfig } from '@awg-app/app.config';
import { EditionConstants } from './edition-constants';
import { EditionWork } from './edition-work.model';

/**
 * The EditionWorksModel class.
 *
 * It is used in the context of the edition view
 * to store work information of the editions.
 */
export class EditionWorks {
    /**
     * An EditionWork object for Opus 12.
     */
    static readonly OP12: EditionWork = new EditionWork(
        {
            title: 'Vier Lieder',
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
            lastModified: '29. Januar 2020',
        },
        {
            route: '/op12',
            short: 'Op. 12',
            full: 'Opus 12',
        },
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionWork object for Opus 23.
     */
    static readonly OP19: EditionWork = new EditionWork(
        {
            title: 'Zwei Lieder für gemischten Chor und Ensemble',
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
        {
            route: '/op19',
            short: 'Op. 19',
            full: 'Opus 19',
        },
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_3,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionWork object for Opus 23.
     */
    static readonly OP23: EditionWork = new EditionWork(
        {
            title: 'Drei Gesänge aus Viae Inviae von Hildegard Jone',
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
        {
            route: '/op23',
            short: 'Op. 23',
            full: 'Opus 23',
        },
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionWork object for Opus 24.
     */
    static readonly OP24: EditionWork = new EditionWork(
        {
            title: 'Konzert für neun Instrumente',
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
        {
            route: '/op24',
            short: 'Op. 24',
            full: 'Opus 24',
        },
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_1,
        EditionConstants.SKETCH_EDITION
    );

    /**
     * An EditionWork object for Opus 25.
     */
    static readonly OP25: EditionWork = new EditionWork(
        {
            title: 'Drei Lieder nach Gedichten von Hildegard Jone',
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
        {
            route: '/op25',
            short: 'Op. 25',
            full: 'Opus 25',
        },
        EditionConstants.SERIES_1,
        EditionConstants.SECTION_5,
        EditionConstants.SKETCH_EDITION
    );
}
