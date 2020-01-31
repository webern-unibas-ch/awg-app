import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditionWorks } from '@awg-views/edition-view/models';

/**
 * The Intro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-intro',
    templateUrl: './edition-intro.component.html',
    styleUrls: ['./edition-intro.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionIntroComponent {
    /**
     * Readonly constant: editionWork.
     *
     * It keeps the current composition.
     */
    readonly editionWork = EditionWorks.op12;
}
