/**
 * The EditionWorksModel class.
 *
 * It is used in the context of the edition view
 * to store work information of the editions.
 */
import { EditionConstants, EditionPath } from '@awg-views/edition-view/models';

export class EditionWorks {
    /**
     * An EditionWork object for a composition: op. 12.
     */
    static readonly op12: EditionPath = new EditionPath(
        {
            path: '/op12',
            short: 'op. 12',
            full: 'Vier Lieder op. 12'
        },
        EditionConstants.series1,
        EditionConstants.section5
    );

    /**
     * An EditionWork object for a composition: op. 25.
     */
    static readonly op25: EditionPath = new EditionPath(
        {
            path: '/op25',
            short: 'op. 25',
            full: 'Drei Lieder op. 25'
        },
        EditionConstants.series1,
        EditionConstants.section5
    );
}
