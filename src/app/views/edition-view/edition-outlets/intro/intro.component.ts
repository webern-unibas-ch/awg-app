import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditionConstants, EditionPath } from '@awg-views/edition-view/models';

/**
 * The Intro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroComponent {
    /**
     * Readonly constant: editionPath.
     *
     * It keeps the path to the edition sections of the current composition.
     */
    readonly editionPath = new EditionPath(EditionConstants.op12);
}
