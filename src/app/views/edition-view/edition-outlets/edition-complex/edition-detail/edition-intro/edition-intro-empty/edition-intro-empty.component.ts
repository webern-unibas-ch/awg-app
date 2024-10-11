import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EditionComplex } from '@awg-app/views/edition-view/models';

/**
 * The EditionIntroEmpty component.
 *
 * It contains the placeholder for an empty intro
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro-empty',
    templateUrl: './edition-intro-empty.component.html',
    styleUrls: ['./edition-intro-empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionIntroEmptyComponent {
    /**
     * Input variable: introBlockContent.
     *
     * It keeps the content blocks of the intro.
     */
    @Input()
    editionComplex: EditionComplex;

    /**
     * Input variable: editionLabel.
     *
     * It keeps the edition label of the intro.
     */
    @Input()
    editionLabel: string;
}
