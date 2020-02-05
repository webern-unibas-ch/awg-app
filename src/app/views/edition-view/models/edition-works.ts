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
     * An EditionWork object for a composition: op. 12.
     */
    static readonly op12: EditionWork = new EditionWork(
        {
            route: '/op12',
            short: 'op. 12',
            full: 'Vier Lieder op. 12'
        },
        EditionConstants.series1,
        EditionConstants.section5
    );

    /**
     * An EditionWork object for a composition: op. 25.
     */
    static readonly op25: EditionWork = new EditionWork(
        {
            route: '/op25',
            short: 'op. 25',
            full: 'Drei Lieder nach Gedichten von Hildegard Jone op. 25'
        },
        EditionConstants.series1,
        EditionConstants.section5
    );
}
